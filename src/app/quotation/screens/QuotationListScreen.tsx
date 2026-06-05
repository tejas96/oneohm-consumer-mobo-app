/**
 * QuotationListScreen — all quotations for a property (stack leaf)
 *
 * Layer: app/quotation/screens
 */

import React, { useCallback } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { useTranslation } from '@/core/i18n';
import type {
  QuotationStackParamList,
  ScreenProps,
} from '@/core/navigation/navigation.types';
import { Route } from '@/core/navigation/routes';
import { ScreenWrapper, CTButton } from '@/shared/components';
import { fontSize, fontWeight, spacing, useAppTheme } from '@/shared/theme';

import { QuotationListItemCard } from '../components/QuotationListItemCard';
import { useQuotationListLogic } from '../hooks/useQuotationListLogic';

type Props = ScreenProps<QuotationStackParamList, Route.QUOTATION_LIST>;
type Navigation = NativeStackNavigationProp<any>;

export function QuotationListScreen({ route }: Props) {
  const { t } = useTranslation();
  const theme = useAppTheme();
  const navigation = useNavigation<Navigation>();
  const { propertyId } = route.params;

  const { quotes, propertyName, isLoading, isError, refetch } =
    useQuotationListLogic(propertyId);

  const listState = isLoading
    ? 'loading'
    : isError
    ? 'error'
    : quotes.length === 0
    ? 'empty'
    : 'success';

  const countLabel = (
    quotes.length === 1
      ? t('quotation.list.countOne')
      : t('quotation.list.countOther')
  ).replace('{count}', String(quotes.length));

  const handleSelectQuote = useCallback(
    (quotationId: string) => {
      navigation.navigate(Route.QUOTATION_DETAIL, {
        propertyId,
        quotationId,
      });
    },
    [navigation, propertyId],
  );

  return (
    <ScreenWrapper
      showThemeToggle={false}
      stateConfig={{
        state: listState,
        loadingConfig: {
          message: t('quotation.list.loading'),
        },
        errorConfig: {
          title: t('quotation.list.errorTitle'),
          message: t('common.stateConfig.errorMessage'),
          retryText: t('common.retry'),
          onRetry: refetch,
        },
        emptyConfig: {
          title: t('quotation.list.emptyTitle'),
          message: t('quotation.list.empty'),
        },
      }}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.titleRow}>
            <Text
              style={[styles.title, { color: theme.colors.onSurface }]}
              variant="headlineSmall"
            >
              {t('quotation.list.title')}
            </Text>
            {quotes.length > 0 ? (
              <View
                style={[
                  styles.countPill,
                  { backgroundColor: theme.colors.primaryContainer },
                ]}
              >
                <Text
                  style={[styles.countText, { color: theme.colors.primary }]}
                >
                  {countLabel}
                </Text>
              </View>
            ) : null}
          </View>
          {propertyName ? (
            <Text
              style={[
                styles.subtitle,
                { color: theme.colors.onSurfaceVariant },
              ]}
              numberOfLines={2}
            >
              {propertyName}
            </Text>
          ) : null}
          <Text
            style={[
              styles.description,
              { color: theme.colors.onSurfaceVariant },
            ]}
          >
            {t('quotation.list.description')}
          </Text>
        </View>

        <FlatList
          data={quotes}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          renderItem={({ item, index }) => (
            <QuotationListItemCard
              quote={item}
              isLatest={index === 0}
              onPress={() => handleSelectQuote(item.id)}
            />
          )}
        />

        <View style={[styles.footer]}>
          <CTButton
            variant="primary"
            size="md"
            icon="home"
            onPress={() =>
              navigation.navigate(Route.MAIN_TABS, { screen: Route.HOME_TAB })
            }
          >
            {t('quotation.detail.backToDashboard')}
          </CTButton>
        </View>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: spacing.lg,
  },
  header: {
    marginBottom: spacing.lg,
    gap: spacing.sm,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  title: {
    fontWeight: fontWeight.bold,
    fontSize: fontSize.title,
  },
  countPill: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing['2xs'],
    borderRadius: spacing.sm,
  },
  countText: {
    fontSize: fontSize.caption,
    fontWeight: fontWeight.bold,
  },
  subtitle: {
    fontSize: fontSize.subhead,
    fontWeight: fontWeight.semibold,
  },
  description: {
    fontSize: fontSize.body,
    lineHeight: fontSize.body * 1.45,
  },
  listContent: {
    paddingBottom: spacing.xl,
  },
  footer: {
    paddingVertical: spacing.md,
    marginTop: spacing.sm,
  },
});
