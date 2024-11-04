import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { useTheme } from '@shopify/restyle';
import type { Theme } from '@/lib/theme';

interface SelectOption {
  label: string;
  value: string;
}

interface SelectProps {
  label?: string;
  error?: string;
  placeholder?: string;
  value: string | null;
  options: SelectOption[];
  onChange: (value: string) => void;
}

export function Select({
  label,
  error,
  placeholder,
  value,
  options,
  onChange,
}: SelectProps) {
  const theme = useTheme<Theme>();

  return (
    <View style={styles.container}>
      {label && (
        <Text style={[styles.label, { color: theme.colors.primaryText }]}>
          {label}
        </Text>
      )}
      <Dropdown
        style={[
          styles.dropdown,
          {
            backgroundColor: theme.colors.gray50,
            borderColor: error ? theme.colors.error : theme.colors.gray200,
          },
        ]}
        placeholderStyle={[styles.placeholderText, { color: theme.colors.secondaryText }]}
        selectedTextStyle={[styles.selectedText, { color: theme.colors.primaryText }]}
        data={options}
        maxHeight={300}
        labelField="label"
        valueField="value"
        placeholder={placeholder}
        value={value}
        onChange={item => onChange(item.value)}
      />
      {error && (
        <Text style={[styles.error, { color: theme.colors.error }]}>
          {error}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 4,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
  },
  dropdown: {
    height: 44,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  placeholderText: {
    fontSize: 16,
  },
  selectedText: {
    fontSize: 16,
  },
  error: {
    fontSize: 12,
  },
}); 