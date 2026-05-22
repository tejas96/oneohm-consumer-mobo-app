/**
 * TeamScreen — Presentation component for displaying and interacting with Project Team
 *
 * Layer: app/project/screens
 */

import React from 'react';
import { StyleSheet, View, FlatList } from 'react-native';
import { Text, IconButton, ActivityIndicator } from 'react-native-paper';

import {
  ScreenWrapper,
  CTCard,
  CTButton,
  CTPremiumHeader,
  CTAvatar,
  CTDialog,
  CTTextInput,
} from '@/shared/components';
import { spacing, fontSize, fontWeight, useAppTheme } from '@/shared/theme';
import { useTranslation } from '@/core/i18n';
import { useTeamLogic } from '../hooks/useTeamLogic';
import type { TeamMember } from '@/data/types/team.types';

export function TeamScreen() {
  const theme = useAppTheme();
  const { t } = useTranslation();
  const {
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
    isSubmitting,
  } = useTeamLogic();

  const renderRatingStars = (score: number) => {
    const fullStars = Math.floor(score);
    const hasHalf = score % 1 >= 0.5;
    const stars = [];

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(
          <IconButton
            key={`star-${i}`}
            icon="star"
            iconColor={theme.colors.warningText}
            size={16}
            style={styles.inlineStarIcon}
          />,
        );
      } else if (i === fullStars + 1 && hasHalf) {
        stars.push(
          <IconButton
            key={`star-${i}`}
            icon="star-half"
            iconColor={theme.colors.warningText}
            size={16}
            style={styles.inlineStarIcon}
          />,
        );
      } else {
        stars.push(
          <IconButton
            key={`star-${i}`}
            icon="star-outline"
            iconColor={theme.colors.outline}
            size={16}
            style={styles.inlineStarIcon}
          />,
        );
      }
    }

    return <View style={styles.inlineStarsRow}>{stars}</View>;
  };

  const renderTeamMember = ({ item }: { item: TeamMember }) => {
    return (
      <CTCard
        variant="glass"
        style={styles.memberCard}
        innerStyle={styles.memberCardInner}
      >
        <View style={styles.memberHeaderRow}>
          <CTAvatar
            type="text"
            size="lg"
            initials={item.avatarInitials}
            useGradient={true}
            style={styles.avatarSpacing}
          />
          <View style={styles.memberInfoContainer}>
            <Text
              style={[styles.memberName, { color: theme.colors.onSurface }]}
            >
              {item.name}
            </Text>
            <Text
              style={[
                styles.memberRole,
                { color: theme.colors.onSurfaceVariant },
              ]}
            >
              {t(item.roleKey as any)}
            </Text>

            <View style={styles.ratingAndReviewsRow}>
              {renderRatingStars(item.rating)}
              <Text
                style={[
                  styles.ratingValueText,
                  { color: theme.colors.onSurfaceVariant },
                ]}
              >
                {item.rating.toFixed(1)}{' '}
                {item.reviewCount > 0
                  ? t('team.reviews').replace(
                      '{count}',
                      String(item.reviewCount),
                    )
                  : t('team.noReviews')}
              </Text>
            </View>
          </View>
        </View>

        <View
          style={[
            styles.cardDivider,
            { backgroundColor: theme.colors.outlineVariant },
          ]}
        />

        <View style={styles.actionButtonsContainer}>
          <CTButton
            variant="ghost"
            size="sm"
            icon="phone"
            compact
            style={styles.actionButton}
            textColor={theme.colors.secondary}
            onPress={() => handleCall(item.phone)}
          >
            {t('team.callBtn')}
          </CTButton>
          <CTButton
            variant="ghost"
            size="sm"
            icon="whatsapp"
            compact
            style={styles.actionButton}
            textColor={theme.colors.secondary}
            onPress={() => handleWhatsApp(item.phone, item.name)}
          >
            {t('team.whatsappBtn')}
          </CTButton>
          <CTButton
            variant="ghost"
            size="sm"
            compact
            style={styles.actionButton}
            textColor={theme.colors.primary}
            onPress={() => openFeedbackModal(item)}
          >
            {t('team.feedbackBtn')}
          </CTButton>
        </View>
      </CTCard>
    );
  };

  return (
    <ScreenWrapper
      padded={false}
      edges={['top', 'left', 'right', 'bottom']}
      showThemeToggle={false}
      stateConfig={{
        state: isLoading ? 'loading' : isError ? 'error' : 'success',
        loadingConfig: {
          message: 'Loading Team Details...',
        },
        errorConfig: {
          title: 'Unable to load project team.',
          message: 'Please check your connection and try again.',
          retryText: 'Retry',
          onRetry: refetch,
        },
      }}
    >
      <CTPremiumHeader
        title={t('team.title')}
        activeProject={activeProject}
        onBack={handleBack}
      />

      <FlatList
        data={teamMembers}
        keyExtractor={item => item.id}
        renderItem={renderTeamMember}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      {/* Review Dialog */}
      <CTDialog
        visible={modalVisible}
        onDismiss={closeFeedbackModal}
        title={t('team.modalTitle')}
        dismissable={!isSubmitting}
        actions={[
          {
            label: t('team.cancelBtn'),
            onPress: closeFeedbackModal,
            variant: 'ghost',
            buttonProps: {
              compact: true,
            },
          },
          {
            label: t('team.submitBtn'),
            onPress: handleSubmitFeedback,
            variant: 'primary',
            buttonProps: {
              compact: true,
            },
          },
        ]}
      >
        <View style={styles.dialogContent}>
          {selectedMember ? (
            <View style={styles.dialogMemberHeader}>
              <CTAvatar
                type="text"
                size="md"
                initials={selectedMember.avatarInitials}
                useGradient={true}
                style={styles.dialogAvatar}
              />
              <View>
                <Text
                  style={[
                    styles.dialogMemberName,
                    { color: theme.colors.onSurface },
                  ]}
                >
                  {selectedMember.name}
                </Text>
                <Text
                  style={[
                    styles.dialogMemberRole,
                    { color: theme.colors.onSurfaceVariant },
                  ]}
                >
                  {t(selectedMember.roleKey as any)}
                </Text>
              </View>
            </View>
          ) : null}

          <Text
            style={[
              styles.dialogSectionTitle,
              { color: theme.colors.onSurface },
            ]}
          >
            {t('team.ratingLabel')}
          </Text>

          <View style={styles.ratingSelectRow}>
            {[1, 2, 3, 4, 5].map(star => (
              <IconButton
                key={`select-star-${star}`}
                icon={star <= rating ? 'star' : 'star-outline'}
                iconColor={
                  rating >= star
                    ? theme.colors.warningText
                    : theme.colors.outline
                }
                size={36}
                style={styles.interactiveStar}
                onPress={() => setRating(star)}
              />
            ))}
          </View>

          <Text
            style={[
              styles.dialogSectionTitle,
              { color: theme.colors.onSurface },
            ]}
          >
            {t('team.commentLabel')}
          </Text>

          <CTTextInput
            value={comment}
            onChangeText={setComment}
            placeholder={t('team.placeholderComment')}
            multiline
            numberOfLines={4}
            disabled={isSubmitting}
            containerStyle={styles.textInputContainer}
            style={styles.commentInput}
          />

          {isSubmitting ? (
            <ActivityIndicator
              animating={true}
              color={theme.colors.primary}
              style={styles.dialogLoading}
            />
          ) : null}
        </View>
      </CTDialog>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  listContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing['3xl'],
  },
  memberCard: {
    marginBottom: spacing.md,
  },
  memberCardInner: {
    padding: spacing.md,
  },
  memberHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarSpacing: {
    marginRight: spacing.md,
  },
  memberInfoContainer: {
    flex: 1,
  },
  memberName: {
    fontSize: fontSize.body,
    fontWeight: fontWeight.bold,
  },
  memberRole: {
    fontSize: fontSize.caption,
    marginTop: spacing.micro,
  },
  ratingAndReviewsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  inlineStarsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: spacing.xs,
  },
  inlineStarIcon: {
    margin: 0,
    padding: 0,
    width: 16,
    height: 16,
  },
  ratingValueText: {
    fontSize: fontSize.caption,
    fontWeight: fontWeight.medium,
  },
  cardDivider: {
    height: 1,
    marginVertical: spacing.md,
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.xs,
  },
  actionButton: {
    flex: 1,
  },
  dialogContent: {
    paddingTop: spacing.xs,
    alignItems: 'stretch',
  },
  dialogMemberHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  dialogAvatar: {
    marginRight: spacing.sm,
  },
  dialogMemberName: {
    fontSize: fontSize.subhead,
    fontWeight: fontWeight.bold,
  },
  dialogMemberRole: {
    fontSize: fontSize.caption,
  },
  dialogSectionTitle: {
    fontSize: fontSize.caption,
    fontWeight: fontWeight.bold,
    marginTop: spacing.sm,
    marginBottom: spacing.xs,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  ratingSelectRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: spacing.xs,
  },
  interactiveStar: {
    margin: 0,
  },
  textInputContainer: {
    marginTop: spacing.xs,
  },
  commentInput: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  dialogLoading: {
    marginTop: spacing.md,
  },
});
