import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { View } from 'react-native';
import 'react-native-reanimated';

import { AppAlertProvider } from '@/components/app-alert';
import VNTezSplashScreen from '@/components/VNTezSplashScreen';
import { useColorScheme } from '@/hooks/use-color-scheme';

SplashScreen.preventAutoHideAsync().catch(() => {});

const LAUNCH_SPLASH_DURATION = __DEV__ ? 6000 : 1900;

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [showLaunchSplash, setShowLaunchSplash] = useState(true);

  useEffect(() => {
    let mounted = true;

    const nativeSplashTimer = setTimeout(() => {
      SplashScreen.hideAsync().catch(() => {});
    }, 120);

    const launchSplashTimer = setTimeout(() => {
      if (mounted) {
        setShowLaunchSplash(false);
      }
    }, LAUNCH_SPLASH_DURATION);

    return () => {
      mounted = false;
      clearTimeout(nativeSplashTimer);
      clearTimeout(launchSplashTimer);
    };
  }, []);

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <AppAlertProvider>
        <View style={{ flex: 1 }}>
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
          </Stack>

          {showLaunchSplash ? <VNTezSplashScreen overlay /> : null}
        </View>

        <StatusBar style={showLaunchSplash ? 'light' : 'auto'} />
      </AppAlertProvider>
    </ThemeProvider>
  );
}
