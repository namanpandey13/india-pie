import { signInWithPassword, signUpWithPassword } from '@/lib/auth';
import { GhostButton, Input, PrimaryButton, typographyRoles, useThemeColors } from '@hausy/ui';
import { router } from 'expo-router';
import { useState } from 'react';
import {
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function LoginScreen() {
  const colors = useThemeColors();
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [password, setPassword] = useState('');

  async function handleSubmit() {
    if (isLoading) {
      return;
    }

    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail.includes('@')) {
      setError('Enter a valid email address.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      const result =
        mode === 'login'
          ? await signInWithPassword(normalizedEmail, password)
          : await signUpWithPassword(normalizedEmail, password);

      if (result.error) {
        setError(result.error.message);
        return;
      }

      router.replace('/explore');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <ImageBackground
      resizeMode="cover"
      source={{
        uri: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80',
      }}
      style={[styles.background, { backgroundColor: colors.bg }]}>
      <View style={[styles.overlay, { backgroundColor: colors.overlayStrong }]} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboard}>
        <SafeAreaView style={styles.safe}>
          <View style={styles.brand}>
            <Text style={[styles.logo, { color: colors.white }]}>hausy</Text>
            <Text style={[styles.title, { color: colors.white }]}>
              Offline plans, without stranger anxiety.
            </Text>
          </View>

          <View
            style={[
              styles.panel,
              { backgroundColor: colors.overlayPanel, borderColor: colors.line },
            ]}>
            <Text style={[styles.formTitle, { color: colors.white }]}>
              {mode === 'login' ? 'Welcome back' : 'Create account'}
            </Text>
            <Input
              autoCapitalize="none"
              autoComplete="email"
              keyboardType="email-address"
              onChangeText={setEmail}
              placeholder="Email address"
              value={email}
            />
            <Input
              autoCapitalize="none"
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              onChangeText={setPassword}
              onSubmitEditing={handleSubmit}
              placeholder="Password"
              secureTextEntry
              value={password}
            />
            <PrimaryButton
              icon="arrow-forward-outline"
              label={
                isLoading
                  ? mode === 'login'
                    ? 'Signing in...'
                    : 'Creating account...'
                  : mode === 'login'
                    ? 'Login'
                    : 'Register'
              }
              loading={isLoading}
              onPress={handleSubmit}
            />
            <GhostButton
              disabled={isLoading}
              label={mode === 'login' ? 'New here? Register' : 'Already registered? Login'}
              onPress={() => {
                setMode((current) => (current === 'login' ? 'register' : 'login'));
                setError(null);
              }}
            />
            {error ? <Text style={[styles.error, { color: colors.brand }]}>{error}</Text> : null}
          </View>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  brand: {
    gap: 16,
    marginTop: 'auto',
  },
  error: {
    ...typographyRoles.caption,
    textAlign: 'center',
  },
  formTitle: {
    ...typographyRoles.h3,
    marginBottom: 2,
  },
  keyboard: {
    flex: 1,
  },
  logo: {
    ...typographyRoles.h1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
  panel: {
    borderRadius: 8,
    borderWidth: 1,
    gap: 14,
    marginTop: 24,
    padding: 16,
  },
  safe: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 18,
  },
  title: {
    ...typographyRoles.hero,
  },
});
