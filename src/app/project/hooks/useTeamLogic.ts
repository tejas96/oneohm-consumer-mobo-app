/**
 * useTeamLogic — Fat hook for managing Project Team screen state and logic
 *
 * Layer: app/project/hooks
 */

import { useMemo, useState } from 'react';
import { Alert, Linking } from 'react-native';
import {
  useNavigation,
  useRoute,
  type RouteProp,
} from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Toast from 'react-native-toast-message';

import { Route, type MainStackParamList } from '@/core/navigation';
import { useTranslation } from '@/core/i18n';
import { useTeamMembers, useSubmitFeedback } from '@/data';
import type { TeamMember } from '@/data/types/team.types';
import { useCustomerFlow } from '@/shared/hooks';
import {
  getLatestQuoteVersion,
  mapActivePropertyToProject,
} from '@/shared/utils';

export function useTeamLogic() {
  const navigation =
    useNavigation<NativeStackNavigationProp<MainStackParamList>>();
  const route = useRoute<RouteProp<MainStackParamList, Route.PROJECT_TEAM>>();
  const { projectId } = route.params;
  const { t } = useTranslation();

  const { activeProperty, quotationView } = useCustomerFlow();
  const latestQuoteVersion = useMemo(
    () => getLatestQuoteVersion(quotationView.activeQuote),
    [quotationView.activeQuote],
  );
  const activeProject = useMemo(
    () =>
      mapActivePropertyToProject(activeProperty, {
        defaultPropertyName: t('projectSwitcher.defaultPropertyName'),
        latestQuoteVersion,
      }),
    [activeProperty, latestQuoteVersion, t],
  );

  // FDAL Hooks
  const {
    data: teamMembers = [],
    isLoading,
    isError,
    refetch,
  } = useTeamMembers(projectId);
  const submitFeedbackMutation = useSubmitFeedback();

  // Feedback Dialog State
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState<string>('');
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  // Phone Validation Utility
  const validatePhoneNumber = (phone: string): boolean => {
    if (!phone || phone.trim() === '') return false;

    // Basic standard phone verification (at least 10 digits, allowing optional +, spaces, dashes)
    const digitsOnly = phone.replace(/[^0-9]/g, '');
    if (digitsOnly.length < 10 || digitsOnly.length > 15) return false;
    return true;
  };

  const handleCall = async (phone: string) => {
    if (!validatePhoneNumber(phone)) {
      Alert.alert(t('common.error'), t('team.dialerErr'));
      return;
    }

    const telUrl = `tel:${phone}`;
    try {
      const supported = await Linking.canOpenURL(telUrl);
      if (supported) {
        await Linking.openURL(telUrl);
      } else {
        if (__DEV__) {
          Alert.alert(
            t('dev.simulatorTitle'),
            t('dev.simulatorCallMessage').replace('{phone}', phone),
          );
        } else {
          Toast.show({
            type: 'error',
            text1: t('common.error'),
            text2: t('team.dialerErr'),
          });
        }
      }
    } catch {
      if (__DEV__) {
        Alert.alert(
          t('dev.simulatorTitle'),
          t('dev.simulatorCallMessage').replace('{phone}', phone),
        );
      } else {
        Toast.show({
          type: 'error',
          text1: t('common.error'),
          text2: t('team.dialerErr'),
        });
      }
    }
  };

  const openFeedbackModal = (member: TeamMember) => {
    setSelectedMember(member);
    setRating(0);
    setComment('');
    setModalVisible(true);
  };

  const closeFeedbackModal = () => {
    setSelectedMember(null);
    setRating(0);
    setComment('');
    setModalVisible(false);
  };

  const handleSubmitFeedback = () => {
    if (!selectedMember) return;

    if (rating === 0) {
      Toast.show({
        type: 'error',
        text1: t('common.error'),
        text2: t('team.errNoRating'),
      });
      return;
    }

    if (comment.trim() === '') {
      Toast.show({
        type: 'error',
        text1: t('common.error'),
        text2: t('team.errEmptyComment'),
      });
      return;
    }

    submitFeedbackMutation.mutate(
      {
        projectId,
        memberId: selectedMember.id,
        rating,
        comment: comment.trim(),
      },
      {
        onSuccess: () => {
          Toast.show({
            type: 'success',
            text1: t('team.toastSuccess'),
          });
          closeFeedbackModal();
        },
        onError: (err: Error) => {
          Toast.show({
            type: 'error',
            text1: t('common.error'),
            text2: err.message || t('team.submitError'),
          });
        },
      },
    );
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const handleChat = () => {
    navigation.navigate(Route.PROJECT_CHAT, { projectId });
  };

  return {
    activeProject,
    teamMembers,
    isLoading,
    isError,
    refetch,
    selectedMember,
    rating,
    setRating,
    comment,
    setComment,
    modalVisible,
    openFeedbackModal,
    closeFeedbackModal,
    handleSubmitFeedback,
    handleCall,
    handleBack,
    handleChat,
    isSubmitting: submitFeedbackMutation.isPending,
  };
}
