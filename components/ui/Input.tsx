import React from 'react';
import { TextInput, View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@shopify/restyle';
import type { Theme } from '@/lib/theme';

interface InputProps {
  label?: string;
  error?: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  disabled?: boolean;
  keyboardType?: 'default' | 'numeric' | 'email-address';
}

export function Input({
  label,
  error,
  placeholder,
  value,
  onChangeText,
  disabled,
  keyboardType = 'default',
}: InputProps) {
  const theme = useTheme<Theme>();

  return (
    <View style={styles.container}>
      {label && (
        <Text style={[styles.label, { color: theme.colors.primaryText }]}>
          {label}
        </Text>
      )}
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: disabled ? theme.colors.gray100 : theme.colors.gray50,
            borderColor: error ? theme.colors.error : theme.colors.gray200,
          },
        ]}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        editable={!disabled}
        keyboardType={keyboardType}
        placeholderTextColor={theme.colors.secondaryText}
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
  input: {
    height: 44,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
  },
  error: {
    fontSize: 12,
  },
}); 