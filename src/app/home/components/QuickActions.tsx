import React from 'react';
import {
  StyleSheet,
  View,
  useWindowDimensions,
  TouchableOpacity,
} from 'react-native';
import { IconButton, Text } from 'react-native-paper';

import { useTranslation } from '@/core/i18n';
import { spacing, fontWeight, useAppTheme } from '@/shared/theme';

interface QuickActionsProps {
  onDocumentsPress: () => void;
  onSupportPress: () => void;
  onWarrantyPress: () => void;
}

export function QuickActions({
  onDocumentsPress,
  onSupportPress,
  onWarrantyPress,
}: QuickActionsProps) {
  const { t } = useTranslation();
  const theme = useAppTheme();
  const { width } = useWindowDimensions();

  // Calculate card width for 2-column grid layout with exact gap spacing
  const gap = spacing.sm; // 12px
  const horizontalPadding = spacing.xl * 2; // 48px
  const cardWidth = (width - horizontalPadding - gap) / 2;

  const actions = [
    {
      label: t('dashboard.actions.team'),
      sublabel: 'Get service',
      icon: 'cog-outline',
      onPress: onSupportPress,
      color: theme.colors.primary, // Accessible green in light mode
    },
    {
      label: t('dashboard.actions.documents'),
      sublabel: 'View NOC & certs',
      icon: 'file-document-outline',
      onPress: onDocumentsPress,
      color: theme.colors.brandBlue, // Accessible blue in light mode
    },
    {
      label: 'Your Team',
      sublabel: 'Contact crew',
      icon: 'account-group-outline',
      onPress: onSupportPress,
      color: theme.colors.brandPurple, // Accessible purple in light mode
    },
    {
      label: 'Properties',
      sublabel: 'All accounts',
      icon: 'home-outline',
      onPress: onWarrantyPress,
      color: theme.colors.brandGray, // Dynamic gray
    },
  ];

  return (
    <View style={styles.container}>
      <Text
        style={[
          styles.sectionTitle,
          { color: theme.colors.onSurfaceVariant, opacity: 0.7 },
        ]}
      >
        Quick Actions
      </Text>
      <View style={styles.grid}>
        {actions.map((item, idx) => (
          <TouchableOpacity
            key={idx}
            style={[
              styles.card,
              {
                width: cardWidth,
                backgroundColor: theme.colors.glassBgSubtle,
                borderColor: theme.colors.outlineVariant,
              },
            ]}
            onPress={item.onPress}
            activeOpacity={0.8}
          >
            <View
              style={[
                styles.iconWrapper,
                { backgroundColor: `${item.color}15` },
              ]}
            >
              <IconButton
                icon={item.icon}
                iconColor={item.color}
                size={18}
                style={styles.icon}
              />
            </View>
            <View style={styles.textStack}>
              <Text
                style={[styles.label, { color: theme.colors.onSurface }]}
                numberOfLines={1}
              >
                {item.label}
              </Text>
              <Text
                style={[
                  styles.sublabel,
                  { color: theme.colors.onSurfaceVariant, opacity: 0.7 },
                ]}
                numberOfLines={1}
              >
                {item.sublabel}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.xl,
    marginVertical: spacing.md,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: fontWeight.bold,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginBottom: spacing.sm,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 1,
    padding: spacing.md,
    height: 68,
  },
  iconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.sm,
  },
  icon: {
    margin: 0,
    padding: 0,
  },
  textStack: {
    flex: 1,
  },
  label: {
    fontSize: 11,
    fontWeight: fontWeight.bold,
  },
  sublabel: {
    fontSize: 9,
    marginTop: 2,
  },
});
