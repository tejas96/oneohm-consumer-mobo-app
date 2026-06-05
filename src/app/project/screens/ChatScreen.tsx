import React, { useState, useMemo, useEffect } from 'react';
import {
  StyleSheet,
  View,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Text, IconButton } from 'react-native-paper';
import {
  useRoute,
  useNavigation,
  type RouteProp,
} from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  ScreenWrapper,
  CTPremiumHeader,
  CTTextInput,
  CTAvatar,
} from '@/shared/components';
import {
  spacing,
  fontSize,
  fontWeight,
  useAppTheme,
  hexToRgba,
  fontFamily,
} from '@/shared/theme';
import { useTranslation, type TranslationKey } from '@/core/i18n';
import { Route, type MainStackParamList } from '@/core/navigation';
import { useChatMessages, useSendChatMessage } from '@/data';
import { useAuthStore } from '@/core/auth';
import type { ChatMessage } from '@/data/types/chat.types';
import { useCustomerFlow } from '@/shared/hooks';
import {
  getLatestQuoteVersion,
  mapActivePropertyToProject,
} from '@/shared/utils';

export function ChatScreen() {
  const theme = useAppTheme();
  const { t } = useTranslation();
  const navigation =
    useNavigation<NativeStackNavigationProp<MainStackParamList>>();
  const route = useRoute<RouteProp<MainStackParamList, Route.PROJECT_CHAT>>();
  const { projectId } = route.params;

  const keyboardOffset = useMemo(() => {
    if (Platform.OS === 'ios') {
      return 30;
    }
    // On Android, translucent status bar + adjustResize leaves the input covered by the system navigation bar.
    // We add insets.bottom (system nav bar height) and insets.top (status bar height) to compensate.
    return 30;
  }, []);

  const user = useAuthStore(state => state.user);
  const currentUserId = user?.id;

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

  const [messageText, setMessageText] = useState('');

  // Fetch chat messages (polls every 5s)
  const {
    data: messages = [],
    isLoading,
    isError,
    refetch,
  } = useChatMessages(projectId);

  const sendMessageMutation = useSendChatMessage(projectId);

  // Mark chat messages as read whenever they update
  useEffect(() => {
    if (projectId && messages.length > 0) {
      const latestMsg = messages[messages.length - 1];
      AsyncStorage.setItem(
        `chat_last_read_${projectId}`,
        new Date(latestMsg.createdAt).getTime().toString(),
      ).catch(err => console.error('Failed to save last read time:', err));
    }
  }, [messages, projectId]);

  const handleBack = () => {
    navigation.goBack();
  };

  const handleSend = () => {
    const trimmed = messageText.trim();
    if (!trimmed || sendMessageMutation.isPending) return;

    setMessageText('');
    sendMessageMutation.mutate(trimmed, {
      onError: () => {
        // Restore input text if send failed
        setMessageText(trimmed);
      },
    });
  };

  const formatMessageTime = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return '';
    }
  };

  const getDayHeading = (dateStr: string) => {
    try {
      const msgDate = new Date(dateStr);
      const today = new Date();
      const yesterday = new Date();
      yesterday.setDate(today.getDate() - 1);

      if (msgDate.toDateString() === today.toDateString()) {
        return t('common.stateConfig.today' as TranslationKey) || 'Today';
      }
      if (msgDate.toDateString() === yesterday.toDateString()) {
        return (
          t('common.stateConfig.yesterday' as TranslationKey) || 'Yesterday'
        );
      }

      return msgDate.toLocaleDateString([], {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return '';
    }
  };

  const isDifferentDay = (
    currentMsg: ChatMessage,
    prevMsg: ChatMessage | undefined,
  ) => {
    if (!prevMsg) return true;
    const currentDate = new Date(currentMsg.createdAt);
    const prevDate = new Date(prevMsg.createdAt);
    return (
      currentDate.getDate() !== prevDate.getDate() ||
      currentDate.getMonth() !== prevDate.getMonth() ||
      currentDate.getFullYear() !== prevDate.getFullYear()
    );
  };

  // Invert list for standard chat layout (bottom starts at index 0)
  const invertedMessages = useMemo(() => {
    return [...messages].reverse();
  }, [messages]);

  const renderMessageItem = ({
    item,
    index,
  }: {
    item: ChatMessage;
    index: number;
  }) => {
    const isOwn = item.senderId === currentUserId;
    const senderName = isOwn
      ? t('team.you' as TranslationKey) || 'You'
      : `${item.sender?.firstName || ''} ${
          item.sender?.lastName || ''
        }`.trim() || 'User';

    // index + 1 is the chronologically older item
    const nextItem = invertedMessages[index + 1];
    const showDateHeader = isDifferentDay(item, nextItem);

    // Group consecutive messages sent within 2 minutes by same sender
    const prevItem = index > 0 ? invertedMessages[index - 1] : undefined;
    const isConsecutive =
      prevItem &&
      prevItem.senderId === item.senderId &&
      new Date(prevItem.createdAt).getTime() -
        new Date(item.createdAt).getTime() <
        120000;

    return (
      <View style={styles.messageContainer}>
        {showDateHeader && (
          <View style={styles.dateHeaderContainer}>
            <View
              style={[
                styles.dateHeaderLine,
                { backgroundColor: theme.colors.outlineVariant },
              ]}
            />
            <Text
              style={[
                styles.dateHeaderText,
                {
                  color: theme.colors.onSurfaceVariant,
                  backgroundColor: theme.colors.background,
                },
              ]}
            >
              {getDayHeading(item.createdAt)}
            </Text>
          </View>
        )}

        <View
          style={[
            styles.messageRow,
            isOwn ? styles.messageRowOwn : styles.messageRowOther,
          ]}
        >
          {/* Avatar Column (Team Members only, aligned left) */}
          {!isOwn && (
            <View style={styles.avatarColumn}>
              {!isConsecutive ? (
                <CTAvatar
                  type="text"
                  size={32}
                  initials={
                    (
                      (item.sender?.firstName?.[0] || '') +
                      (item.sender?.lastName?.[0] || '')
                    ).toUpperCase() || 'TM'
                  }
                  useGradient={true}
                />
              ) : (
                <View style={styles.avatarPlaceholder} />
              )}
            </View>
          )}

          {/* Bubble and Metadata Column */}
          <View
            style={isOwn ? styles.bubbleColumnOwn : styles.bubbleColumnOther}
          >
            {!isOwn && !isConsecutive && (
              <View style={styles.senderHeader}>
                <Text
                  style={[styles.senderName, { color: theme.colors.onSurface }]}
                >
                  {senderName}
                </Text>
                {item.sender?.roleType === 'team' && (
                  <Text
                    style={[
                      styles.roleBadge,
                      {
                        color: theme.colors.onPrimaryContainer,
                        backgroundColor: theme.colors.primaryContainer,
                      },
                    ]}
                  >
                    {t('team.role_executive' as TranslationKey) || 'Team'}
                  </Text>
                )}
              </View>
            )}

            <View
              style={[
                styles.bubble,
                isOwn
                  ? [
                      styles.bubbleOwn,
                      {
                        backgroundColor: theme.colors.primary,
                        borderColor: theme.colors.primary,
                      },
                    ]
                  : [
                      styles.bubbleOther,
                      {
                        backgroundColor: theme.colors.surfaceVariant,
                        borderColor: theme.colors.outlineVariant,
                      },
                    ],
              ]}
            >
              <Text
                style={[
                  styles.messageText,
                  {
                    color: isOwn
                      ? theme.colors.onPrimary
                      : theme.colors.onSurface,
                  },
                ]}
              >
                {item.messageText}
              </Text>
            </View>
            <Text
              style={[
                styles.timeText,
                { color: theme.colors.onSurfaceVariant },
                isOwn ? styles.timeOwn : styles.timeOther,
              ]}
            >
              {formatMessageTime(item.createdAt)}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <ScreenWrapper
      padded={false}
      showThemeToggle={false}
      stateConfig={{
        state:
          isLoading && messages.length === 0
            ? 'loading'
            : isError
            ? 'error'
            : 'success',
        loadingConfig: {
          message:
            t('common.stateConfig.loadingChat' as TranslationKey) ||
            'Loading chat...',
        },
        errorConfig: {
          title:
            t('common.stateConfig.errorTitleChat' as TranslationKey) ||
            'Unable to load chat.',
          message:
            t('common.stateConfig.errorMessage' as TranslationKey) ||
            'Please try again later.',
          retryText: t('common.retry' as TranslationKey) || 'Retry',
          onRetry: refetch,
        },
      }}
    >
      <CTPremiumHeader
        title={t('team.chatTitle' as TranslationKey) || 'Project Chat'}
        activeProject={activeProject}
        onBack={handleBack}
      />
      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={keyboardOffset}
      >
        <View style={styles.chatContainer}>
          {invertedMessages.length === 0 ? (
            <View style={styles.emptyContainer}>
              <IconButton
                icon="message-draw"
                iconColor={hexToRgba(theme.colors.primary, 0.4)}
                size={64}
                style={styles.emptyIcon}
              />
              <Text
                style={[styles.emptyTitle, { color: theme.colors.onSurface }]}
              >
                {t('team.chatTitle' as TranslationKey) || 'Project Chat'}
              </Text>
              <Text
                style={[
                  styles.emptySubtitle,
                  { color: theme.colors.onSurfaceVariant },
                ]}
              >
                Start the conversation with your solar installation team.
              </Text>
            </View>
          ) : (
            <FlatList
              data={invertedMessages}
              keyExtractor={item => item.id}
              renderItem={renderMessageItem}
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
              inverted
            />
          )}

          <View
            style={[
              styles.inputBar,
              {
                borderTopColor: theme.colors.outlineVariant,
                backgroundColor: theme.colors.surface,
              },
            ]}
          >
            <CTTextInput
              value={messageText}
              onChangeText={setMessageText}
              placeholder={
                t('team.chatPlaceholder' as TranslationKey) ||
                'Type your message...'
              }
              containerStyle={styles.textInputContainer}
              style={styles.inputField}
              multiline
              dense
            />
            <IconButton
              icon="send"
              iconColor={theme.colors.primary}
              size={24}
              disabled={!messageText.trim() || sendMessageMutation.isPending}
              onPress={handleSend}
              style={styles.sendButton}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  keyboardContainer: {
    flex: 1,
  },
  chatContainer: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
  },
  messageContainer: {
    marginVertical: spacing.micro,
  },
  messageRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    maxWidth: '85%',
  },
  messageRowOwn: {
    alignSelf: 'flex-end',
  },
  messageRowOther: {
    alignSelf: 'flex-start',
  },
  avatarColumn: {
    width: 32,
    marginRight: spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarPlaceholder: {
    width: 32,
    height: 32,
  },
  bubbleColumnOwn: {
    alignItems: 'flex-end',
  },
  bubbleColumnOther: {
    alignItems: 'flex-start',
    flex: 1,
  },
  senderHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.micro,
    gap: spacing.xs,
  },
  senderName: {
    fontSize: fontSize.caption,
    fontWeight: fontWeight.bold,
    fontFamily: fontFamily.bold,
  },
  roleBadge: {
    fontSize: fontSize.micro,
    fontWeight: fontWeight.bold,
    fontFamily: fontFamily.bold,
    paddingHorizontal: spacing.xs,
    paddingVertical: 1,
    borderRadius: 4,
    overflow: 'hidden',
  },
  bubble: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 18,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 1,
    elevation: 1,
  },
  bubbleOwn: {
    borderTopRightRadius: 2,
  },
  bubbleOther: {
    borderTopLeftRadius: 2,
  },
  messageText: {
    fontSize: fontSize.body,
    lineHeight: 20,
    fontFamily: fontFamily.regular,
  },
  timeText: {
    fontSize: fontSize.micro,
    marginTop: spacing.micro,
    opacity: 0.6,
    fontFamily: fontFamily.regular,
  },
  timeOwn: {
    alignSelf: 'flex-end',
    marginRight: spacing.xs,
  },
  timeOther: {
    alignSelf: 'flex-start',
    marginLeft: spacing.xs,
  },
  dateHeaderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: spacing.md,
    position: 'relative',
  },
  dateHeaderLine: {
    height: 1,
    position: 'absolute',
    left: 0,
    right: 0,
  },
  dateHeaderText: {
    fontSize: fontSize.micro,
    fontWeight: fontWeight.bold,
    fontFamily: fontFamily.semibold,
    paddingHorizontal: spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderTopWidth: 1,
  },
  textInputContainer: {
    flex: 1,
    marginVertical: 0,
  },
  inputField: {
    maxHeight: 100,
  },
  sendButton: {
    marginLeft: spacing.xs,
    marginVertical: 0,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing['3xl'],
  },
  emptyIcon: {
    marginBottom: spacing.xs,
  },
  emptyTitle: {
    fontSize: fontSize.headline,
    fontWeight: fontWeight.bold,
    fontFamily: fontFamily.bold,
    marginBottom: spacing['2xs'],
  },
  emptySubtitle: {
    fontSize: fontSize.caption,
    fontFamily: fontFamily.regular,
    textAlign: 'center',
    lineHeight: 18,
    opacity: 0.7,
  },
});
