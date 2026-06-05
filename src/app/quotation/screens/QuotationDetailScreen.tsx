/**
 * QuotationDetailScreen — quotation_active stack initial leaf
 *
 * Layer: app/quotation/screens
 */

import React from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { useTranslation } from '@/core/i18n';
import type {
  QuotationStackParamList,
  ScreenProps,
} from '@/core/navigation/navigation.types';
import { Route } from '@/core/navigation/routes';
import { ProjectSpecs } from '@/app/project/components/ProjectSpecs';
import {
  CTButton,
  CTDialog,
  CTTextInput,
  ScreenWrapper,
} from '@/shared/components';
import { fontSize, fontWeight, spacing, useAppTheme } from '@/shared/theme';

import { QuotationPricingCard } from '../components/QuotationPricingCard';
import { QuotationReadOnlyBanner } from '../components/QuotationReadOnlyBanner';
import { QuotationStatusChip } from '../components/QuotationStatusChip';
import { QuotationSummaryCard } from '../components/QuotationSummaryCard';
import { useQuotationDetailLogic } from '../hooks/useQuotationDetailLogic';

type Props = ScreenProps<QuotationStackParamList, Route.QUOTATION_DETAIL>;
type Navigation = NativeStackNavigationProp<QuotationStackParamList>;

export function QuotationDetailScreen({ route }: Props) {
  const { t } = useTranslation();
  const theme = useAppTheme();
  const navigation = useNavigation<Navigation>();
  const { propertyId, quotationId } = route.params;

  const {
    quote,
    propertyName,
    isReadOnly,
    isPricingExpanded,
    togglePricingExpanded,
    isLoading,
    isError,
    handleRefresh,
    canShowAccept,
    canShowReject,
    isSubmitting,
    acceptDialogVisible,
    rejectDialogVisible,
    signature,
    handleSignatureChange,
    rejectionReason,
    handleRejectionReasonChange,
    signatureError,
    reasonError,
    openAcceptDialog,
    openRejectDialog,
    dismissAcceptDialog,
    dismissRejectDialog,
    confirmAccept,
    confirmReject,
    specsData,
    hasSpecs,
  } = useQuotationDetailLogic(propertyId, quotationId);

  const handleViewAll = () => {
    navigation.navigate(Route.QUOTATION_LIST, { propertyId });
  };

  const showActionButtons = canShowAccept || canShowReject;

  return (
    <ScreenWrapper
      showThemeToggle={false}
      padded={false}
      stateConfig={{
        state: isLoading ? 'loading' : isError ? 'error' : 'success',
        loadingConfig: {
          message: t('quotation.detail.loading'),
        },
        errorConfig: {
          title: t('quotation.detail.errorTitle'),
          message: t('common.stateConfig.errorMessage'),
          retryText: t('common.retry'),
          onRetry: handleRefresh,
        },
      }}
    >
      {quote ? (
        <View style={styles.flex}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            <View style={styles.header}>
              <View style={styles.headerTop}>
                <Text
                  style={[styles.heading, { color: theme.colors.onSurface }]}
                  numberOfLines={1}
                >
                  {t('quotation.detail.heading')}
                </Text>
                <QuotationStatusChip status={String(quote.status)} />
              </View>
              {propertyName ? (
                <View style={styles.propertyRow}>
                  <MaterialCommunityIcons
                    name="map-marker-outline"
                    size={14}
                    color={theme.colors.onSurfaceVariant}
                  />
                  <Text
                    style={[
                      styles.propertyName,
                      { color: theme.colors.onSurfaceVariant },
                    ]}
                    numberOfLines={1}
                  >
                    {propertyName}
                  </Text>
                </View>
              ) : null}
            </View>

            {isReadOnly ? <QuotationReadOnlyBanner /> : null}

            <QuotationSummaryCard quote={quote} />
            <QuotationPricingCard
              quote={quote}
              expanded={isPricingExpanded}
              onToggle={togglePricingExpanded}
            />

            {hasSpecs && (
              <View style={styles.specsWrapper}>
                <Text
                  style={[
                    styles.sectionTitle,
                    { color: theme.colors.onBackground },
                  ]}
                >
                  {t('project.specsTitle')}
                </Text>
                <ProjectSpecs specs={specsData} />
              </View>
            )}

            <Pressable
              onPress={handleViewAll}
              disabled={isSubmitting}
              accessibilityRole="button"
              style={({ pressed }) => [
                styles.viewAll,
                pressed ? styles.viewAllPressed : null,
              ]}
            >
              <MaterialCommunityIcons
                name="format-list-bulleted"
                size={18}
                color={theme.colors.primary}
              />
              <Text
                style={[styles.viewAllText, { color: theme.colors.primary }]}
              >
                {t('quotation.detail.viewAll')}
              </Text>
            </Pressable>
          </ScrollView>

          {showActionButtons ? (
            <View
              style={[
                styles.actionBar,
                {
                  backgroundColor: theme.colors.surface,
                  borderTopColor: theme.colors.outlineVariant,
                },
              ]}
            >
              {canShowReject ? (
                <CTButton
                  variant="secondary"
                  size="md"
                  style={styles.actionBtn}
                  icon="close"
                  loading={isSubmitting}
                  disabled={isSubmitting}
                  onPress={openRejectDialog}
                >
                  {t('quotation.reject.button')}
                </CTButton>
              ) : null}
              {canShowAccept ? (
                <CTButton
                  variant="primary"
                  size="md"
                  style={styles.actionBtn}
                  icon="check"
                  loading={isSubmitting}
                  disabled={isSubmitting}
                  onPress={openAcceptDialog}
                >
                  {t('quotation.accept.button')}
                </CTButton>
              ) : null}
            </View>
          ) : null}
        </View>
      ) : null}

      <CTDialog
        visible={acceptDialogVisible}
        onDismiss={dismissAcceptDialog}
        title={t('quotation.accept.title')}
        message={t('quotation.accept.message')}
        dismissable={!isSubmitting}
        keyboardAvoiding
        actions={[
          {
            label: t('quotation.accept.cancel'),
            onPress: dismissAcceptDialog,
            variant: 'ghost',
            buttonProps: { disabled: isSubmitting },
          },
          {
            label: t('quotation.accept.confirm'),
            onPress: confirmAccept,
            variant: 'primary',
            buttonProps: { loading: isSubmitting, disabled: isSubmitting },
          },
        ]}
      >
        <CTTextInput
          label={t('quotation.accept.signatureLabel')}
          placeholder={t('quotation.accept.signaturePlaceholder')}
          value={signature}
          onChangeText={handleSignatureChange}
          status={signatureError ? 'error' : 'default'}
          helperText={signatureError}
          multiline
          numberOfLines={3}
          backgroundColor={theme.colors.surface}
        />
      </CTDialog>

      <CTDialog
        visible={rejectDialogVisible}
        onDismiss={dismissRejectDialog}
        title={t('quotation.reject.title')}
        message={t('quotation.reject.message')}
        dismissable={!isSubmitting}
        keyboardAvoiding
        actions={[
          {
            label: t('quotation.reject.cancel'),
            onPress: dismissRejectDialog,
            variant: 'ghost',
            buttonProps: { disabled: isSubmitting },
          },
          {
            label: t('quotation.reject.confirm'),
            onPress: confirmReject,
            variant: 'primary',
            buttonProps: {
              loading: isSubmitting,
              disabled: isSubmitting || !rejectionReason?.trim(),
            },
          },
        ]}
      >
        <CTTextInput
          label={t('quotation.reject.reasonLabel')}
          placeholder={t('quotation.reject.reasonPlaceholder')}
          value={rejectionReason}
          onChangeText={handleRejectionReasonChange}
          status={reasonError ? 'error' : 'default'}
          helperText={reasonError}
          multiline
          numberOfLines={4}
          backgroundColor={theme.colors.surface}
        />
      </CTDialog>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
  },
  header: {
    marginBottom: spacing.lg,
    gap: spacing.xs,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  heading: {
    flex: 1,
    fontSize: fontSize.title,
    fontWeight: fontWeight.bold,
    letterSpacing: -0.3,
  },
  propertyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing['2xs'],
  },
  propertyName: {
    flex: 1,
    fontSize: fontSize.body,
  },
  viewAll: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.md,
    marginTop: spacing.xs,
  },
  viewAllPressed: {
    opacity: 0.6,
  },
  viewAllText: {
    fontSize: fontSize.body,
    fontWeight: fontWeight.semibold,
  },
  actionBar: {
    flexDirection: 'row',
    gap: spacing.sm,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  actionBtn: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: fontSize.subhead,
    fontWeight: fontWeight.bold,
    marginTop: spacing.md,
    marginBottom: spacing.xs,
  },
  specsWrapper: {
    marginBottom: spacing.lg,
  },
});
