import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { ImageBackground, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Avatar, colors, GhostButton, PrimaryButton } from '@/components/mvp-kit';
import { loginProfile } from '@/data/mvp';

export default function LoginScreen() {
  return (
    <ImageBackground
      source={{
        uri: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80',
      }}
      resizeMode="cover"
      style={styles.bg}>
      <View style={styles.overlay} />
      <SafeAreaView style={styles.safe}>
        <View style={styles.top}>
          <Text style={styles.logo}>hausy</Text>
          <Text style={styles.kicker}>Delhi NCR private alpha</Text>
        </View>

        <View style={styles.hero}>
          <Text style={styles.title}>offline plans, without stranger anxiety.</Text>
          <Text style={styles.subtitle}>
            Activity-first events, host reputation, guest context, and pre-event chat inside the app.
          </Text>
        </View>

        <View style={styles.panel}>
          <View style={styles.profileRow}>
            <Avatar label="NP" color={colors.lime} size={48} />
            <View style={styles.profileCopy}>
              <Text style={styles.profileName}>{loginProfile.name}</Text>
              <Text style={styles.profileMeta}>{loginProfile.city} - prefilled demo login</Text>
            </View>
            <Ionicons name="checkmark-circle" size={24} color={colors.lime} />
          </View>

          <View style={styles.inputBlock}>
            <Text style={styles.label}>Phone</Text>
            <TextInput value={loginProfile.phone} editable={false} style={styles.input} />
          </View>

          <View style={styles.inputBlock}>
            <Text style={styles.label}>Social proof</Text>
            <View style={styles.linkRow}>
              <Ionicons name="logo-instagram" size={17} color={colors.ink} />
              <Text style={styles.linkText}>{loginProfile.instagram}</Text>
            </View>
            <View style={styles.linkRow}>
              <Ionicons name="logo-linkedin" size={17} color={colors.ink} />
              <Text style={styles.linkText}>{loginProfile.linkedin}</Text>
            </View>
          </View>

          <View style={styles.intentBox}>
            <Text style={styles.intentLabel}>Intent</Text>
            <Text style={styles.intentText}>{loginProfile.intent}</Text>
          </View>

          <PrimaryButton
            label="Enter Discover"
            icon="arrow-forward-outline"
            onPress={() => router.replace('/discover')}
          />
          <GhostButton label="Edit alpha profile" icon="create-outline" />
        </View>

        <Pressable onPress={() => router.replace('/discover')} style={styles.skip}>
          <Text style={styles.skipText}>skip fake login</Text>
        </Pressable>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.72)',
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
    color: colors.ink,
    fontSize: 30,
    fontWeight: '900',
    letterSpacing: 0,
  },
  kicker: {
    color: colors.lime,
    fontSize: 13,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  hero: {
    gap: 12,
    marginTop: 'auto',
    paddingBottom: 18,
  },
  title: {
    color: colors.ink,
    fontSize: 41,
    fontWeight: '900',
    letterSpacing: 0,
    lineHeight: 44,
  },
  subtitle: {
    color: colors.muted,
    fontSize: 16,
    lineHeight: 23,
  },
  panel: {
    backgroundColor: 'rgba(18,18,18,0.94)',
    borderColor: colors.line,
    borderRadius: 24,
    borderWidth: 1,
    gap: 14,
    padding: 16,
  },
  profileRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
  },
  profileCopy: {
    flex: 1,
    gap: 3,
  },
  profileName: {
    color: colors.ink,
    fontSize: 17,
    fontWeight: '900',
  },
  profileMeta: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: '800',
  },
  inputBlock: {
    gap: 8,
  },
  label: {
    color: colors.faint,
    fontSize: 12,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  input: {
    backgroundColor: colors.surfaceAlt,
    borderColor: colors.line,
    borderRadius: 14,
    borderWidth: 1,
    color: colors.ink,
    fontSize: 16,
    fontWeight: '800',
    minHeight: 48,
    paddingHorizontal: 12,
  },
  linkRow: {
    alignItems: 'center',
    backgroundColor: colors.surfaceAlt,
    borderRadius: 14,
    flexDirection: 'row',
    gap: 9,
    minHeight: 42,
    paddingHorizontal: 12,
  },
  linkText: {
    color: colors.ink,
    fontSize: 14,
    fontWeight: '800',
  },
  intentBox: {
    backgroundColor: colors.surfaceAlt,
    borderColor: colors.line,
    borderRadius: 14,
    borderWidth: 1,
    gap: 4,
    padding: 12,
  },
  intentLabel: {
    color: colors.lime,
    fontSize: 12,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  intentText: {
    color: colors.ink,
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 20,
  },
  skip: {
    alignItems: 'center',
    paddingTop: 12,
  },
  skipText: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: '900',
  },
});
