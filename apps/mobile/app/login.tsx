import {
  authRedirectTo,
  enterWithDevBypass,
  signInWithGoogle,
  signInWithPassword,
  signUpWithPassword,
} from '@/lib/auth';
import { isAuthBypassEnabled } from '@/lib/auth-session';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type AuthMode = 'signIn' | 'signUp';

const backgroundImage = {
  uri: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80',
};

export default function LoginScreen() {
  const [mode, setMode] = useState<AuthMode>('signIn');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordSubmitting, setIsPasswordSubmitting] = useState(false);
  const [isGoogleSubmitting, setIsGoogleSubmitting] = useState(false);
  const [isBypassSubmitting, setIsBypassSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showImage, setShowImage] = useState(true);

  const isBusy = isPasswordSubmitting || isGoogleSubmitting || isBypassSubmitting;
  const canSubmitPassword = email.trim().length > 0 && password.length > 0 && !isBusy;

  async function handlePasswordSubmit() {
    if (!canSubmitPassword) {
      return;
    }

    setIsPasswordSubmitting(true);
    setError(null);

    const result =
      mode === 'signIn'
        ? await signInWithPassword(email, password)
        : await signUpWithPassword(email, password);

    setIsPasswordSubmitting(false);

    if (result.error) {
      setError(result.error.message);
      if (Platform.OS !== 'web') {
        Alert.alert(mode === 'signIn' ? 'Login failed' : 'Account creation failed', result.error.message);
      }
      return;
    }

    router.replace('/home');
  }

  async function handleGoogleSignIn() {
    if (isBusy) {
      return;
    }

    setIsGoogleSubmitting(true);
    setError(null);

    const result = await signInWithGoogle();

    setIsGoogleSubmitting(false);

    if (result.error) {
      setError(result.error.message);
      if (Platform.OS !== 'web') {
        Alert.alert('Google sign in failed', result.error.message);
      }
      return;
    }

    if (result.data) {
      router.replace('/home');
    }
  }

  function toggleMode() {
    setMode((currentMode) => (currentMode === 'signIn' ? 'signUp' : 'signIn'));
    setError(null);
  }

  async function handleDevBypass() {
    if (isBusy) {
      return;
    }

    setIsBypassSubmitting(true);
    setError(null);
    const result = await enterWithDevBypass();
    setIsBypassSubmitting(false);

    if (result.error) {
      setError(result.error.message);
      return;
    }

    if (result.data || isAuthBypassEnabled) {
      router.replace('/home');
      return;
    }

    setError('Local auth bypass is not enabled for this build.');
  }

  const content = (
    <>
      <View style={styles.overlay} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardView}
      >
        <SafeAreaView style={styles.safe}>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.brand}>
              <Text style={styles.logo}>hausy</Text>
            </View>

            <View style={styles.panel}>
              <Text style={styles.title}>{mode === 'signIn' ? 'Log in' : 'Create account'}</Text>

              <View style={styles.field}>
                <Text style={styles.label}>Email</Text>
                <TextInput
                  autoCapitalize="none"
                  autoComplete="email"
                  autoCorrect={false}
                  inputMode="email"
                  keyboardType="email-address"
                  onChangeText={setEmail}
                  placeholder="you@example.com"
                  placeholderTextColor="#818898"
                  returnKeyType="next"
                  style={styles.input}
                  textContentType="emailAddress"
                  value={email}
                />
              </View>

              <View style={styles.field}>
                <Text style={styles.label}>Password</Text>
                <TextInput
                  autoCapitalize="none"
                  autoComplete={mode === 'signIn' ? 'password' : 'new-password'}
                  onChangeText={setPassword}
                  onSubmitEditing={handlePasswordSubmit}
                  placeholder={mode === 'signIn' ? 'Your password' : 'Create a password'}
                  placeholderTextColor="#818898"
                  returnKeyType="done"
                  secureTextEntry
                  style={styles.input}
                  textContentType={mode === 'signIn' ? 'password' : 'newPassword'}
                  value={password}
                />
              </View>

              {error ? <Text style={styles.errorText}>{error}</Text> : null}

              <Pressable
                accessibilityRole="button"
                disabled={!canSubmitPassword}
                onPress={handlePasswordSubmit}
                style={[styles.primaryButton, !canSubmitPassword ? styles.disabledButton : null]}
              >
                {isPasswordSubmitting ? (
                  <ActivityIndicator color="#ffffff" />
                ) : (
                  <Text style={styles.primaryButtonText}>
                    {mode === 'signIn' ? 'Log in' : 'Create account'}
                  </Text>
                )}
              </Pressable>

              <Pressable
                accessibilityRole="button"
                disabled={isBusy}
                onPress={handleGoogleSignIn}
                style={[styles.googleButton, isBusy ? styles.disabledButton : null]}
              >
                {isGoogleSubmitting ? (
                  <ActivityIndicator color="#111827" />
                ) : (
                  <>
                    <Ionicons color="#111827" name="logo-google" size={20} />
                    <Text style={styles.googleButtonText}>Continue with Google</Text>
                  </>
                )}
              </Pressable>

              <Pressable accessibilityRole="button" onPress={toggleMode} style={styles.switchButton}>
                <Text style={styles.switchText}>
                  {mode === 'signIn' ? 'New to Hausy? Create account' : 'Already have an account? Log in'}
                </Text>
              </Pressable>

              {isAuthBypassEnabled ? (
                <Pressable
                  accessibilityRole="button"
                  disabled={isBusy}
                  onPress={handleDevBypass}
                  style={[styles.devButton, isBusy ? styles.disabledButton : null]}
                >
                  {isBypassSubmitting ? (
                    <ActivityIndicator color="#111827" />
                  ) : (
                    <Text style={styles.devButtonText}>Enter app for now</Text>
                  )}
                </Pressable>
              ) : null}

              {__DEV__ ? <Text style={styles.debugText}>Redirect: {authRedirectTo}</Text> : null}
            </View>
          </ScrollView>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </>
  );

  if (!showImage) {
    return <View style={styles.background}>{content}</View>;
  }

  return (
    <ImageBackground
      onError={() => setShowImage(false)}
      resizeMode="cover"
      source={backgroundImage}
      style={styles.background}
    >
      {content}
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  brand: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 260,
  },
  debugText: {
    color: '#667085',
    fontSize: 11,
    lineHeight: 16,
    marginTop: 6,
    textAlign: 'center',
  },
  disabledButton: {
    opacity: 0.55,
  },
  devButton: {
    alignItems: 'center',
    backgroundColor: '#eef2f7',
    borderRadius: 8,
    justifyContent: 'center',
    marginTop: 8,
    minHeight: 46,
    paddingHorizontal: 16,
  },
  devButtonText: {
    color: '#111827',
    fontSize: 15,
    fontWeight: '700',
    textAlign: 'center',
  },
  errorText: {
    color: '#b42318',
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 20,
    marginTop: 12,
    textAlign: 'center',
  },
  field: {
    gap: 8,
    marginTop: 16,
  },
  googleButton: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderColor: '#d0d5dd',
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'center',
    marginTop: 12,
    minHeight: 50,
    paddingHorizontal: 16,
  },
  googleButtonText: {
    color: '#111827',
    fontSize: 16,
    fontWeight: '700',
  },
  input: {
    backgroundColor: '#ffffff',
    borderColor: '#c8cfda',
    borderRadius: 8,
    borderWidth: 1,
    color: '#111827',
    fontSize: 16,
    minHeight: 50,
    paddingHorizontal: 14,
  },
  keyboardView: {
    flex: 1,
  },
  label: {
    color: '#344054',
    fontSize: 14,
    fontWeight: '600',
  },
  logo: {
    color: '#ffffff',
    fontSize: 58,
    fontWeight: '700',
    lineHeight: 64,
    textAlign: 'center',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(17, 24, 39, 0.42)',
  },
  panel: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderColor: 'rgba(255, 255, 255, 0.55)',
    borderRadius: 8,
    borderWidth: 1,
    padding: 16,
  },
  primaryButton: {
    alignItems: 'center',
    backgroundColor: '#111827',
    borderRadius: 8,
    justifyContent: 'center',
    marginTop: 18,
    minHeight: 50,
    paddingHorizontal: 16,
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  safe: {
    flex: 1,
    padding: 18,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'space-between',
  },
  switchButton: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 42,
    marginTop: 8,
  },
  switchText: {
    color: '#111827',
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
  },
  title: {
    color: '#111827',
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
  },
});
