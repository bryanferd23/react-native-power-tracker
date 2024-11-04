import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@shopify/restyle';
import type { Theme } from '@/lib/theme';

interface LayoutProps {
  children: React.ReactNode;
  style?: any;
}

export function Layout({ children, style }: LayoutProps) {
  const theme = useTheme<Theme>();
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.mainBackground }]}>
      <View style={[styles.content, style]}>
        {children}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? 20 : 0,
    paddingBottom: 80,
  },
}); 