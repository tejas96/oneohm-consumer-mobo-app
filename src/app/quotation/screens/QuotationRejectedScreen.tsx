/**
 * QuotationRejectedScreen — all_rejected resolver leaf
 *
 * Layer: app/quotation/screens
 */

import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';

import { useTranslation } from '@/core/i18n';
import {
  CTButton,
  CTOnboardingPlaceholder,
  ScreenWrapper,
} from '@/shared/components';
import { fontSize, fontWeight, spacing, useAppTheme } from '@/shared/theme';

import { QuotationListItemCard } from '../components/QuotationListItemCard';
import { useQuotationRejectedLogic } from '../hooks/useQuotationRejectedLogic';

const REJECTED_LOTTIE = require('@/assets/animations/lottie/404 error not found.json');

export function QuotationRejectedScreen() {
  const { t } = useTranslation();
  const theme = useAppTheme();
  const {
    rejectedQuotes,
    propertyName,
    handleCallOneOhm,
    handleRefresh,
    isCalling,
    isRefreshing,
  } = useQuotationRejectedLogic();

  return (
    <ScreenWrapper showThemeToggle={false}>
      <View style={styles.container}>
        <FlatList
          data={rejectedQuotes}
          keyExtractor={item => item.id}
          style={styles.list}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <View>
              <CTOnboardingPlaceholder
                title={t('quotation.rejected.title')}
                description={t('quotation.rejected.description')}
                lottieSource={REJECTED_LOTTIE}
                status="error"
                style={styles.placeholder}
              />
              {propertyName ? (
                <Text
                  style={[
                    styles.propertyName,
                    { color: theme.colors.onSurface },
                  ]}
                  numberOfLines={2}
                >
                  {propertyName}
                </Text>
              ) : null}
            </View>
          }
          renderItem={({ item }) => (
            <QuotationListItemCard quote={item} onPress={() => {}} />
          )}
        />

        <View style={styles.actions}>
          <CTButton
            variant="secondary"
            size="lg"
            fullWidth
            icon="refresh"
            loading={isRefreshing}
            disabled={isCalling}
            onPress={handleRefresh}
          >
            {t('quotation.rejected.refreshButton')}
          </CTButton>
          <CTButton
            variant="primary"
            size="lg"
            fullWidth
            icon="phone"
            loading={isCalling}
            disabled={isRefreshing}
            onPress={handleCallOneOhm}
          >
            {t('quotation.rejected.callButton')}
          </CTButton>
        </View>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: spacing.xl,
  },
  propertyName: {
    fontSize: fontSize.subhead,
    fontWeight: fontWeight.semibold,
    marginTop: spacing.lg,
    marginBottom: spacing.md,
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingBottom: spacing.md,
  },
  placeholder: {
    flex: 0,
    paddingVertical: spacing.md,
  },
  actions: {
    marginTop: spacing.xl,
    gap: spacing.md,
    width: '100%',
  },
});
