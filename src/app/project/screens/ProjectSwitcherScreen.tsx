import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { Text, List, Divider } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

import { ScreenWrapper, CTAppBar } from '@/shared/components';
import { useProjectSelectionStore } from '@/app/home/hooks/useHomeDashboard';
import { spacing, fontSize, fontWeight, useAppTheme } from '@/shared/theme';

export function ProjectSwitcherScreen() {
  const navigation = useNavigation();
  const theme = useAppTheme();

  const { selectedProjectId, setSelectedProjectId } =
    useProjectSelectionStore();

  const options = [
    {
      id: 'proj-pune',
      label: 'Pune Res. (In Progress)',
      description: 'Progress: 60% • 5.4 kW',
      status: 'IN_PROGRESS',
      color: theme.colors.warningText,
    },
    {
      id: 'proj-mumbai',
      label: 'Mumbai Apts (Completed)',
      description: 'Progress: 100% • 10.2 kW',
      status: 'COMPLETED',
      color: theme.colors.primary,
    },
    {
      id: 'none',
      label: 'No Active Project (Onboarding State)',
      description: 'Simulates onboarding & verification stage',
      status: 'ONBOARDING',
      color: theme.colors.outline,
    },
  ];

  const handleSelect = (id: string) => {
    setSelectedProjectId(id);
    navigation.goBack();
  };

  return (
    <ScreenWrapper>
      <CTAppBar title="Switch Project" onBack={() => navigation.goBack()} />
      <View style={styles.container}>
        <Text
          style={[styles.infoText, { color: theme.colors.onSurfaceVariant }]}
        >
          Select a project configuration below to test different dashboard
          states:
        </Text>

        <View
          style={[
            styles.listCard,
            {
              backgroundColor: theme.colors.surfaceVariant,
              borderColor: theme.colors.outlineVariant,
            },
          ]}
        >
          {options.map((item, idx) => {
            const isSelected = selectedProjectId === item.id;
            return (
              <View key={item.id}>
                {idx > 0 && (
                  <Divider
                    style={{ backgroundColor: theme.colors.outlineVariant }}
                  />
                )}
                <TouchableOpacity
                  style={styles.listItem}
                  onPress={() => handleSelect(item.id)}
                  activeOpacity={0.8}
                >
                  <List.Item
                    title={item.label}
                    description={item.description}
                    titleStyle={[
                      styles.itemTitle,
                      { color: theme.colors.onSurface },
                    ]}
                    descriptionStyle={[
                      styles.itemDesc,
                      { color: theme.colors.onSurfaceVariant },
                    ]}
                    /* eslint-disable-next-line react/no-unstable-nested-components */
                    left={() => (
                      <View
                        style={[
                          styles.statusIndicator,
                          { backgroundColor: item.color },
                        ]}
                      />
                    )}
                    /* eslint-disable-next-line react/no-unstable-nested-components */
                    right={() =>
                      isSelected ? (
                        <List.Icon icon="check" color={theme.colors.primary} />
                      ) : null
                    }
                  />
                </TouchableOpacity>
              </View>
            );
          })}
        </View>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.xl,
  },
  infoText: {
    fontSize: fontSize.sm,
    lineHeight: 20,
    marginBottom: spacing.lg,
  },
  listCard: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
  },
  listItem: {
    paddingVertical: spacing.xs,
  },
  statusIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    alignSelf: 'center',
    marginLeft: spacing.sm,
  },
  itemTitle: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.bold,
  },
  itemDesc: {
    fontSize: fontSize.xs,
  },
});
