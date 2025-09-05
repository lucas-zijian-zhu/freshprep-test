import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { QueryClientProvider } from '@tanstack/react-query';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Platform } from 'react-native';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';
import { queryClient } from '@/lib/queryClient';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({});

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  // Create Android-specific theme
  const androidTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: colorScheme === 'dark' ? '#fff' : '#0a7ea4',
    },
  };

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : (Platform.OS === 'android' ? androidTheme : DefaultTheme)}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen 
            name="repository/[id]" 
            options={{ 
              title: 'Repository Details',
              headerShown: true,
              headerBackTitle: Platform.OS === 'ios' ? 'Back' : undefined,
              headerBackTitleVisible: Platform.OS === 'ios',
            }} 
          />
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </QueryClientProvider>
  );
}
