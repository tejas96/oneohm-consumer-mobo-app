/**
 * useTeamLogic — Fat hook for managing Project Team screen state and logic
 *
 * Layer: app/project/hooks
 */

import { useState } from 'react';
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
import { useActiveProject } from '@/shared/hooks';

export function useTeamLogic() {
  const navigation =
    useNavigation<NativeStackNavigationProp<MainStackParamList>>();
  const route = useRoute<RouteProp<MainStackParamList, Route.PROJECT_TEAM>>();
  const { projectId } = route.params;
  const { t } = useTranslation();

  // Active Project Details for consistent header styling
  const { activeProject } = useActiveProject();

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
            'Simulator Mode',
            `Direct calling simulated to: ${phone}\n\n(On a real device, this opens your phone's native dialer app.)`,
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
          'Simulator Mode',
          `Direct calling simulated to: ${phone}\n\n(On a real device, this opens your phone's native dialer app.)`,
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

  const handleWhatsApp = async (phone: string, name: string) => {
    if (!validatePhoneNumber(phone)) {
      Alert.alert(t('common.error'), t('team.smsErr'));
      return;
    }

    // Clean phone number (strip + or non-numeric characters for WhatsApp API)
    const numericPhone = phone.replace(/[^0-9]/g, '');
    const messageText = `Hi ${name}, reaching out regarding my solar installation.`;
    const whatsappUrl = `whatsapp://send?phone=${numericPhone}&text=${encodeURIComponent(
      messageText,
    )}`;
    const smsUrl = `sms:${phone}?body=${encodeURIComponent(messageText)}`;

    try {
      const canOpenWhatsapp = await Linking.canOpenURL(whatsappUrl);
      if (canOpenWhatsapp) {
        await Linking.openURL(whatsappUrl);
      } else {
        // Graceful SMS Fallback
        const canOpenSms = await Linking.canOpenURL(smsUrl);
        if (canOpenSms) {
          Toast.show({
            type: 'info',
            text1: 'WhatsApp Not Installed',
            text2: t('team.whatsappErr'),
          });
          await Linking.openURL(smsUrl);
        } else {
          if (__DEV__) {
            Alert.alert(
              'Simulator Mode',
              `WhatsApp / SMS simulated to: ${phone}\nMessage: "${messageText}"\n\n(On a real device, this will open WhatsApp or fall back to standard SMS.)`,
            );
          } else {
            Toast.show({
              type: 'error',
              text1: t('common.error'),
              text2: t('team.smsErr'),
            });
          }
        }
      }
    } catch {
      // Direct SMS fallback in case of exceptions
      try {
        await Linking.openURL(smsUrl);
      } catch {
        if (__DEV__) {
          Alert.alert(
            'Simulator Mode',
            `WhatsApp / SMS simulated to: ${phone}\nMessage: "${messageText}"\n\n(On a real device, this will open WhatsApp or fall back to standard SMS.)`,
          );
        } else {
          Toast.show({
            type: 'error',
            text1: t('common.error'),
            text2: t('team.smsErr'),
          });
        }
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
        onError: (err: any) => {
          Toast.show({
            type: 'error',
            text1: t('common.error'),
            text2: err.message || 'Failed to submit review.',
          });
        },
      },
    );
  };

  const handleBack = () => {
    navigation.goBack();
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
    handleWhatsApp,
    handleBack,
    isSubmitting: submitFeedbackMutation.isPending,
  };
}
