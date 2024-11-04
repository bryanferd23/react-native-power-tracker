import { Stack } from 'expo-router';
import { ThemeProvider } from '@shopify/restyle';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import theme from '@/lib/theme';
import { Platform } from 'react-native';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <ThemeProvider theme={theme}>
        <Stack
          screenOptions={{
            headerStyle: {
              backgroundColor: theme.colors.cardBackground,
            },
            headerTitleStyle: {
              color: theme.colors.primaryText,
              fontSize: 18,
              fontWeight: 'bold',
            },
            headerShadowVisible: false,
            animation: Platform.OS === 'ios' ? 'default' : 'slide_from_right',
            presentation: 'card',
            animationDuration: 200,
          }}
        >
          <Stack.Screen
            name="index"
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="(tabs)"
            options={{
              headerShown: false,
            }}
          />
        </Stack>
      </ThemeProvider>
    </SafeAreaProvider>
  );
} 