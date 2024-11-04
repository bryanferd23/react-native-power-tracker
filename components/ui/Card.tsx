import React from 'react';
import { View, ViewStyle } from 'react-native';
import { useTheme } from '@shopify/restyle';
import type { Theme } from '@/lib/theme';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export function Card({ children, style }: CardProps) {
  const theme = useTheme<Theme>();
  
  return (
    <View
      style={[{
        backgroundColor: theme.colors.cardBackground,
        borderRadius: theme.borderRadii.l,
        padding: theme.spacing.m,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 2,
      }, style]}
    >
      {children}
    </View>
  );
} 