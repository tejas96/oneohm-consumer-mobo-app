/**
 * useDocumentsLogic — Custom hook for Documents screen state and logic
 *
 * Encapsulates document data, category filtering, search, and download actions.
 * Follows "Fat Hooks, Skinny Components" (§4).
 *
 * Layer: app/documents/hooks
 */

import { useCallback, useMemo, useState } from 'react';
import { Alert, PermissionsAndroid, Platform } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Toast from 'react-native-toast-message';
import ReactNativeBlobUtil from 'react-native-blob-util';

import { Route, type MainStackParamList } from '@/core/navigation';
import { useTranslation } from '@/core/i18n';
import { useCustomerProjectDocuments } from '@/data';
import { useCustomerFlow } from '@/shared/hooks';
import { mapActivePropertyToMinimalProject } from '@/shared/utils';

import { mapConsumerDocumentsToItems } from '../utils/map-consumer-documents';

export interface DocumentItem {
  id: string;
  title: string;
  category: string;
  entityType?: string;
  date: string;
  size: string;
  fileUrl: string;
}

function getExtension(fileName: string, url: string): string {
  // 1. Try to get extension from the fileName parameter
  const nameParts = fileName.split('.');
  if (nameParts.length > 1) {
    const ext = nameParts.pop()?.toLowerCase();
    if (
      ext &&
      ['pdf', 'png', 'jpg', 'jpeg', 'doc', 'docx', 'xls', 'xlsx'].includes(ext)
    ) {
      return ext;
    }
  }

  // 2. Try to extract extension from the clean URL (without query params)
  const cleanUrl = url.split('?')[0];
  const urlParts = cleanUrl.split('.');
  if (urlParts.length > 1) {
    const ext = urlParts.pop()?.toLowerCase();
    if (
      ext &&
      ['pdf', 'png', 'jpg', 'jpeg', 'doc', 'docx', 'xls', 'xlsx'].includes(ext)
    ) {
      return ext;
    }
  }

  return 'pdf'; // fallback default
}

function getMimeType(ext: string): string {
  switch (ext) {
    case 'pdf':
      return 'application/pdf';
    case 'jpg':
    case 'jpeg':
      return 'image/jpeg';
    case 'png':
      return 'image/png';
    case 'doc':
    case 'docx':
      return 'application/msword';
    case 'xls':
    case 'xlsx':
      return 'application/vnd.ms-excel';
    default:
      return 'application/octet-stream';
  }
}

export function useDocumentsLogic() {
  const navigation =
    useNavigation<NativeStackNavigationProp<MainStackParamList>>();
  const { t } = useTranslation();

  const {
    activeProperty,
    properties,
    isLoading: isPropertiesLoading,
    isError: isPropertiesError,
    isFetching: isPropertiesFetching,
    refetch: refetchProperties,
  } = useCustomerFlow();

  const projectId = activeProperty?.project?.id ?? '';

  const {
    data: documentsResponse,
    isLoading: isDocumentsLoading,
    isError: isDocumentsError,
    isFetching: isDocumentsFetching,
    refetch: refetchDocuments,
  } = useCustomerProjectDocuments(projectId, { enabled: !!projectId });

  const activeProject = useMemo(
    () =>
      mapActivePropertyToMinimalProject(
        activeProperty,
        t('projectSwitcher.defaultPropertyName'),
      ),
    [activeProperty, t],
  );

  const allDocuments = useMemo(() => {
    console.log('📄 DOCUMENTS RESPONSE:', JSON.stringify(documentsResponse));
    return mapConsumerDocumentsToItems(documentsResponse?.documents ?? []);
  }, [documentsResponse]);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEntityType, setSelectedEntityType] = useState('all');

  const entityTypes = useMemo(() => {
    const order = [
      'customer',
      'property',
      'site_activity',
      'loan',
      'quote',
      'project',
      'payment',
      'project_expense',
    ];
    const unique = Array.from(
      new Set(allDocuments.map(doc => doc.entityType).filter(Boolean)),
    );
    const sortedUnique = order.filter(type => unique.includes(type));
    return ['all', ...sortedUnique];
  }, [allDocuments]);

  const filteredDocs = useMemo(() => {
    return allDocuments.filter(doc => {
      const matchesType =
        selectedEntityType === 'all' || doc.entityType === selectedEntityType;
      const matchesSearch = (doc.title || '')
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      return matchesType && matchesSearch;
    });
  }, [allDocuments, searchQuery, selectedEntityType]);

  const isLoading = isPropertiesLoading || (!!projectId && isDocumentsLoading);
  const isError = isPropertiesError || (!!projectId && isDocumentsError);
  const isRefreshing = isPropertiesFetching || isDocumentsFetching;

  const refetch = useCallback(async () => {
    await refetchProperties();
    if (projectId) {
      await refetchDocuments();
    }
  }, [projectId, refetchProperties, refetchDocuments]);

  useFocusEffect(
    useCallback(() => {
      if (!projectId) {
        return;
      }
      void refetchDocuments();
    }, [projectId, refetchDocuments]),
  );

  const handleDownload = useCallback(
    async (doc: DocumentItem) => {
      const url = doc.fileUrl?.trim();
      if (!url) {
        Alert.alert(t('common.error'), t('documents.downloadUnavailable'));
        return;
      }

      try {
        const ext = getExtension(doc.title, url);
        const cleanFileName = doc.title.trim().replace(/\s+/g, '_');
        const finalFileName = cleanFileName.endsWith(`.${ext}`)
          ? cleanFileName
          : `${cleanFileName}.${ext}`;

        const { dirs } = ReactNativeBlobUtil.fs;

        if (Platform.OS === 'android') {
          // 1. Android Permission check for API < 29 (Android 10)
          if (Platform.Version < 29) {
            const granted = await PermissionsAndroid.request(
              PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
              {
                title: t('documents.permissionTitle'),
                message: t('documents.permissionMessage'),
                buttonNeutral: t('common.askLater') || 'Ask Later',
                buttonNegative: t('common.cancel') || 'Cancel',
                buttonPositive: t('common.ok') || 'OK',
              },
            );
            if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
              return;
            }
          }

          // Show Toast that download started
          Toast.show({
            type: 'info',
            text1: t('documents.downloadStartedTitle'),
            text2: t('documents.downloadStartedDesc').replace(
              '{title}',
              doc.title,
            ),
          });

          const mimeType = getMimeType(ext);

          await ReactNativeBlobUtil.config({
            fileCache: true,
            addAndroidDownloads: {
              useDownloadManager: true,
              notification: true,
              title: finalFileName,
              description: t('documents.downloadStartedDesc').replace(
                '{title}',
                doc.title,
              ),
              mime: mimeType,
              mediaScannable: true,
              storeInDownloads: true,
            },
          }).fetch('GET', url);

          Toast.show({
            type: 'success',
            text1: t('common.success') || 'Success',
            text2: t('documents.downloadCompleted'),
          });
        } else {
          // iOS
          Toast.show({
            type: 'info',
            text1: t('documents.downloadStartedTitle'),
            text2: t('documents.downloadStartedDesc').replace(
              '{title}',
              doc.title,
            ),
          });

          const downloadPath = `${dirs.DocumentDir}/${finalFileName}`;

          const res = await ReactNativeBlobUtil.config({
            fileCache: true,
            path: downloadPath,
          }).fetch('GET', url);

          // Once fetched, show preview
          ReactNativeBlobUtil.ios.previewDocument(res.path());

          Toast.show({
            type: 'success',
            text1: t('common.success') || 'Success',
            text2: t('documents.downloadCompleted'),
          });
        }
      } catch (err) {
        console.error('Download error:', err);
        Toast.show({
          type: 'error',
          text1: t('common.error'),
          text2: t('documents.downloadFailed').replace('{title}', doc.title),
        });
      }
    },
    [t],
  );

  const handleBack = () =>
    navigation.navigate(Route.MAIN_TABS, { screen: Route.HOME_TAB });

  return {
    activeProject,
    isLoading,
    isError,
    isRefreshing,
    refetch,
    entityTypes,
    searchQuery,
    setSearchQuery,
    selectedEntityType,
    setSelectedEntityType,
    filteredDocs,
    handleDownload,
    handleBack,
    hasMultipleProjects: properties.length > 1,
  };
}
