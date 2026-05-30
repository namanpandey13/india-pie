import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { ImageBackground, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';

import { GhostButton, PrimaryButton, typographyRoles, useThemeColors } from '@hausy/ui';
import { signInWithGoogle } from '@/lib/auth';

export default function LoginScreen() {
  const colors = useThemeColors();
  const [error, setError] = useState<string | null>(null);

  async function handleGoogleSignIn() {
    const result = await signInWithGoogle();

    if (result.error) {
      setError(result.error.message);
      return;
    }

    router.replace('/home');
  }

  return (
    <ImageBackground
      source={{
        uri: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80',
      }}
      resizeMode="cover"
      style={[styles.bg, { backgroundColor: colors.bg }]}>
      <View style={[styles.overlay, { backgroundColor: colors.overlayStrong }]} />
      <SafeAreaView style={styles.safe}>
        <View style={styles.top}>
          <Text style={[styles.logo, { color: colors.ink }]}>Hausy</Text>
          <Text style={[styles.kicker, { color: colors.brand }]}>Delhi NCR</Text>
        </View>

        <View style={styles.hero}>
          <Text style={[styles.title, { color: colors.ink }]}>Offline plans, without stranger anxiety.</Text>
          <Text style={[styles.subtitle, { color: colors.muted }]}>
            Activity-first events, host reputation, guest context, and pre-event chat inside the app.
          </Text>
        </View>

        <View style={[styles.panel, { backgroundColor: colors.overlayPanel, borderColor: colors.line }]}>
          <View style={[styles.intentBox, { backgroundColor: colors.surfaceAlt, borderColor: colors.line }]}>
            <Ionicons name="shield-checkmark-outline" size={20} color={colors.brand} />
            <Text style={[styles.intentText, { color: colors.ink }]}>
              Sign in to request creator-led plans, save events, and keep plan updates inside Hausy.
            </Text>
          </View>

          <PrimaryButton
            label="Continue with Google"
            icon="arrow-forward-outline"
            onPress={handleGoogleSignIn}
          />
          {error ? <Text style={[styles.errorText, { color: colors.brand }]}>{error}</Text> : null}
          <GhostButton label="Explore first" icon="sparkles-outline" onPress={() => router.replace('/home')} />
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
  safe: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 18,
  },
  top: {
    gap: 4,
  },
  logo: {
    ...typographyRoles.h1,
  },
  kicker: {
    ...typographyRoles.caption,
  },
  hero: {
    gap: 12,
    marginTop: 'auto',
    paddingBottom: 18,
  },
  title: {
    ...typographyRoles.hero,
  },
  subtitle: {
    ...typographyRoles.body,
  },
  panel: {
    borderRadius: 24,
    borderWidth: 1,
    gap: 14,
    padding: 16,
  },
  intentBox: {
    alignItems: 'flex-start',
    borderRadius: 14,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 4,
    padding: 12,
  },
  intentText: {
    flex: 1,
    ...typographyRoles.bodyStrong,
  },
  errorText: {
    ...typographyRoles.caption,
    textAlign: 'center',
  },
});
