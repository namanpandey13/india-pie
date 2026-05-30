import {
  Inter_400Regular,
  Inter_600SemiBold,
  Inter_700Bold,
  Inter_900Black,
  useFonts,
} from '@expo-google-fonts/inter';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { HausyThemeProvider } from '@hausy/ui';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { AppQueryProvider } from '@/lib/query-client';
import { createSessionFromUrl, useAuthCallbackUrl } from '@/lib/auth';
import { useAppStore } from '@/state/app-store';

export const unstable_settings = {
  initialRouteName: 'login',
};

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const callbackUrl = useAuthCallbackUrl();
  const colorScheme = useAppStore((state) => state.colorScheme);
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_900Black,
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  useEffect(() => {
    if (callbackUrl) {
      createSessionFromUrl(callbackUrl);
    }
  }, [callbackUrl]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <AppQueryProvider>
      <HausyThemeProvider mode={colorScheme}>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <Stack>
            <Stack.Screen name="login" options={{ headerShown: false }} />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="event/[id]" options={{ headerShown: false, presentation: 'modal' }} />
            <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
          </Stack>
          <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
        </ThemeProvider>
      </HausyThemeProvider>
    </AppQueryProvider>
  );
}
