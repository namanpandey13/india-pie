import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, Pressable, StyleSheet, Switch, Text, TextInput, View } from 'react-native';

import {
  Avatar,
  Card,
  GhostButton,
  Header,
  Metric,
  Screen,
  SectionTitle,
  typographyRoles,
  useThemeColors,
} from '@hausy/ui';
import { useProfile } from '@/features/profile/use-profile';
import { useAppStore } from '@/state/app-store';
import { signOut } from '@/lib/auth';

export default function ProfileScreen() {
  const loginProfile = useProfile();
  const profile = loginProfile.data?.data;
  const [draft, setDraft] = useState({
    city: '',
    instagram: '',
    intent: '',
    linkedin: '',
    name: '',
  });
  const colors = useThemeColors();
  const comfortSettings = useAppStore((state) => state.comfortSettings);
  const colorScheme = useAppStore((state) => state.colorScheme);
  const setColorScheme = useAppStore((state) => state.setColorScheme);
  const setComfortSetting = useAppStore((state) => state.setComfortSetting);

  async function handleSignOut() {
    const result = await signOut();

    if (result.error) {
      Alert.alert('Sign out failed', result.error.message);
      return;
    }

    router.replace('/login');
  }

  useEffect(() => {
    if (profile) {
      setDraft({
        city: profile.city,
        instagram: profile.instagram,
        intent: profile.intent,
        linkedin: profile.linkedin,
        name: profile.name,
      });
    }
  }, [profile]);

  return (
    <Screen>
      <Header
        eyebrow="profile"
        title="Social proof before offline plans."
        subtitle="Profiles behave like lightweight social portfolios, so guests and hosts can judge fit before showing up."
      />

      <Card style={styles.profileCard}>
        <View style={styles.profileTop}>
          <Avatar label={profile?.initials ?? 'HS'} color="violet" size={68} />
          <View style={styles.profileCopy}>
            <Text style={[styles.name, { color: colors.ink }]}>{profile?.name ?? 'Complete your Hausy profile'}</Text>
            <Text style={[styles.city, { color: colors.muted }]}>{profile?.city ?? 'Google identity connected after sign-in'}</Text>
          </View>
        </View>
        <Text style={[styles.intent, { color: colors.ink }]}>
          Add social proof, creator interests, and comfort settings before requesting offline plans.
        </Text>
      </Card>

      <SectionTitle title="Edit profile" action={loginProfile.saving ? 'Saving' : 'Live'} />
      <Card style={styles.editCard}>
        <ProfileInput label="Name" value={draft.name} onChangeText={(name) => setDraft((state) => ({ ...state, name }))} />
        <ProfileInput label="City" value={draft.city} onChangeText={(city) => setDraft((state) => ({ ...state, city }))} />
        <ProfileInput label="Instagram" value={draft.instagram} onChangeText={(instagram) => setDraft((state) => ({ ...state, instagram }))} />
        <ProfileInput label="LinkedIn" value={draft.linkedin} onChangeText={(linkedin) => setDraft((state) => ({ ...state, linkedin }))} />
        <TextInput
          value={draft.intent}
          onChangeText={(intent) => setDraft((state) => ({ ...state, intent }))}
          multiline
          placeholder="What should hosts and guests know about you?"
          placeholderTextColor={colors.faint}
          style={[styles.textArea, { backgroundColor: colors.surfaceAlt, borderColor: colors.line, color: colors.ink }]}
        />
        {loginProfile.saveResult?.error ? (
          <Text style={[styles.errorText, { color: colors.brand }]}>{loginProfile.saveResult.error.message}</Text>
        ) : null}
        <GhostButton label="Save profile" icon="checkmark-circle-outline" onPress={() => loginProfile.saveProfile(draft)} />
      </Card>

      <View style={styles.metricsRow}>
        <Metric value="0" label="Plans attended" />
        <Metric value="0" label="Saved plans" />
        <Metric value="0" label="RSVPs" />
      </View>

      <SectionTitle title="Comfort settings" />
      <Card style={styles.settingsCard}>
        <SettingSwitch
          active={colorScheme === 'light'}
          icon="contrast-outline"
          label="Light appearance"
          onValueChange={(active) => setColorScheme(active ? 'light' : 'dark')}
        />
        <Setting
          active={comfortSettings.curatedGuestLists}
          icon="people-outline"
          label="Prefer curated guest lists"
          onPress={() => setComfortSetting('curatedGuestLists', !comfortSettings.curatedGuestLists)}
        />
        <Setting
          active={comfortSettings.confirmedAttendees}
          icon="shield-checkmark-outline"
          label="Show confirmed attendees before RSVP"
          onPress={() => setComfortSetting('confirmedAttendees', !comfortSettings.confirmedAttendees)}
        />
        <Setting
          active={comfortSettings.inAppComms}
          icon="chatbubble-ellipses-outline"
          label="Keep event comms inside Hausy"
          onPress={() => setComfortSetting('inAppComms', !comfortSettings.inAppComms)}
        />
      </Card>

      <SectionTitle title="Creator Studio" action="Submit for review" />
      <Card style={styles.settingsCard}>
        <Text style={[styles.hostCopy, { color: colors.muted }]}>
          Apply as a Hausy Creator and submit offline plans for review before they go live.
        </Text>
        <GhostButton
          label="Open Creator Studio"
          icon="create-outline"
          onPress={() => router.push('/host')}
        />
      </Card>

      <GhostButton label="Sign out" icon="log-out-outline" onPress={handleSignOut} />
    </Screen>
  );
}

function ProfileInput({ label, value, onChangeText }: { label: string; value: string; onChangeText: (value: string) => void }) {
  const colors = useThemeColors();

  return (
    <View style={styles.inputGroup}>
      <Text style={[styles.inputLabel, { color: colors.faint }]}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={label}
        placeholderTextColor={colors.faint}
        style={[styles.input, { backgroundColor: colors.surfaceAlt, borderColor: colors.line, color: colors.ink }]}
      />
    </View>
  );
}

function Setting({
  active,
  icon,
  label,
  onPress,
}: {
  active: boolean;
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
}) {
  const colors = useThemeColors();

  return (
    <Pressable style={styles.setting} onPress={onPress}>
      <Ionicons name={icon} size={19} color={colors.brand} />
      <Text style={[styles.settingText, { color: colors.ink }]}>{label}</Text>
      <Ionicons name={active ? 'checkmark-circle' : 'ellipse-outline'} size={18} color={active ? colors.brand : colors.faint} />
    </Pressable>
  );
}

function SettingSwitch({
  active,
  icon,
  label,
  onValueChange,
}: {
  active: boolean;
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onValueChange: (active: boolean) => void;
}) {
  const colors = useThemeColors();

  return (
    <View style={styles.setting}>
      <Ionicons name={icon} size={19} color={colors.brand} />
      <Text style={[styles.settingText, { color: colors.ink }]}>{label}</Text>
      <Switch
        value={active}
        onValueChange={onValueChange}
        trackColor={{ false: colors.surfaceLift, true: colors.brandMuted }}
        thumbColor={active ? colors.brand : colors.faint}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  profileCard: {
    gap: 14,
  },
  profileTop: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 14,
  },
  profileCopy: {
    flex: 1,
    gap: 4,
  },
  name: {
    ...typographyRoles.h2,
  },
  city: {
    ...typographyRoles.caption,
  },
  intent: {
    ...typographyRoles.bodyStrong,
  },
  metricsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  settingsCard: {
    gap: 12,
  },
  editCard: {
    gap: 12,
  },
  inputGroup: {
    gap: 6,
  },
  inputLabel: {
    ...typographyRoles.caption,
  },
  input: {
    borderRadius: 14,
    borderWidth: 1,
    ...typographyRoles.bodyStrong,
    minHeight: 46,
    paddingHorizontal: 12,
  },
  textArea: {
    borderRadius: 14,
    borderWidth: 1,
    ...typographyRoles.bodyStrong,
    minHeight: 96,
    padding: 12,
    textAlignVertical: 'top',
  },
  errorText: {
    ...typographyRoles.caption,
  },
  setting: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
  },
  settingText: {
    flex: 1,
    ...typographyRoles.label,
  },
  hostCopy: {
    ...typographyRoles.body,
  },
});
