import { AuthRouteGuard } from '@/components/auth-route-guard';
import { AuthSessionProvider } from '@/lib/auth-session';
import { AppQueryProvider } from '@/lib/query-client';
import { supabase } from '@/lib/supabase';
import { useAppStore } from '@/state/app-store';
import {
    Inter_400Regular,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_900Black,
    useFonts,
} from '@expo-google-fonts/inter';
import { configureApiClient } from '@hausy/api';
import { HausyThemeProvider } from '@hausy/ui';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';

export const unstable_settings = {
  initialRouteName: 'login',
};

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useAppStore((state) => state.colorScheme);
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_900Black,
  });

  useEffect(() => {
    configureApiClient(supabase);
  }, []);

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <AppQueryProvider>
      <AuthSessionProvider>
        <HausyThemeProvider mode={colorScheme}>
          <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
            <AuthRouteGuard />
            <Stack>
              <Stack.Screen name="login" options={{ headerShown: false }} />
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen
                name="event/[id]"
                options={{ headerShown: false, presentation: 'modal' }}
              />
              <Stack.Screen name="profile/[id]" options={{ headerShown: false }} />
              <Stack.Screen name="modal" options={{ headerShown: false, presentation: 'modal' }} />
            </Stack>
            <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
          </ThemeProvider>
        </HausyThemeProvider>
      </AuthSessionProvider>
    </AppQueryProvider>
  );
}
