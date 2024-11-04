import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useTheme } from '@shopify/restyle';
import type { Theme } from '@/lib/theme';

interface ChipProps {
  label: string;
  selected?: boolean;
  onPress: () => void;
}

export function Chip({ label, selected, onPress }: ChipProps) {
  const theme = useTheme<Theme>();

  return (
    <TouchableOpacity
      style={[
        styles.container,
        {
          backgroundColor: selected ? theme.colors.primary : theme.colors.gray100,
        },
      ]}
      onPress={onPress}
    >
      <Text
        style={[
          styles.label,
          {
            color: selected ? theme.colors.white : theme.colors.primaryText,
          },
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 9999,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
  },
}); 