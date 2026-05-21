/**
 * CTTabBar — Carbon Titanium Glassmorphism Bottom Tab Bar
 *
 * A fully custom bottom tab bar built for @react-navigation/bottom-tabs.
 * Matches the UX reference design (05-home-v2.html / 08-payments-v2.html):
 *   - Translucent glassmorphism background (navBarBg token)
 *   - 1px top border using outlineVariant token
 *   - Active tab: primary color icon + label + indicator dot
 *   - Inactive tab: icon + label at 30% opacity
 *   - Material Community Icons (no custom SVG needed)
 *
 * Layer: shared/components (Presentational)
 */

import React from 'react';
import { View, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Text } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { useAppTheme } from '@/shared/theme';
import { fontSize, fontWeight, spacing } from '@/shared/theme';

/** Icon names per route key — focused and unfocused */
const TAB_ICONS: Record<string, { focused: string; unfocused: string }> = {
  HomeTab: { focused: 'home', unfocused: 'home-outline' },
  ProjectsTab: {
    focused: 'view-dashboard',
    unfocused: 'view-dashboard-outline',
  },
  DocumentsTab: {
    focused: 'file-document',
    unfocused: 'file-document-outline',
  },
  PaymentsTab: { focused: 'credit-card', unfocused: 'credit-card-outline' },
  ProfileTab: { focused: 'account', unfocused: 'account-outline' },
};

export function CTTabBar({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) {
  const theme = useAppTheme();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.navBarBg,
          borderTopColor: theme.colors.outlineVariant,
          paddingBottom: insets.bottom > 0 ? insets.bottom : spacing.md,
        },
      ]}
    >
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;

        const label =
          typeof options.tabBarLabel === 'string'
            ? options.tabBarLabel
            : options.title ?? route.name.replace('Tab', '');

        const icons = TAB_ICONS[route.name] ?? {
          focused: 'circle',
          unfocused: 'circle-outline',
        };

        const iconName = isFocused ? icons.focused : icons.unfocused;
        const color = isFocused
          ? theme.colors.primary
          : theme.colors.onSurfaceVariant;
        const opacity = isFocused ? 1 : 0.3;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });
          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        const onLongPress = () => {
          navigation.emit({ type: 'tabLongPress', target: route.key });
        };

        return (
          <TouchableOpacity
            key={route.key}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarButtonTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            activeOpacity={0.7}
            style={styles.tab}
          >
            <MaterialCommunityIcons
              name={iconName}
              size={22}
              color={color}
              style={{ opacity }}
            />
            <Text
              style={[
                styles.label,
                {
                  color,
                  opacity,
                  fontWeight: isFocused
                    ? fontWeight.semibold
                    : fontWeight.regular,
                },
              ]}
            >
              {label}
            </Text>
            {/* Active indicator dot */}
            {/* {isFocused && (
              <View
                style={[styles.dot, { backgroundColor: theme.colors.primary }]}
              />
            )} */}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderTopWidth: 1,
    paddingTop: spacing.sm,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.12,
        shadowRadius: 16,
      },
      android: {
        elevation: 12,
      },
    }),
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    gap: 3,
  },
  label: {
    fontSize: fontSize.micro,
    letterSpacing: 0.2,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    marginTop: 1,
  },
});
