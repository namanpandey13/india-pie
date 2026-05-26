import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { Avatar, Card, colors, Header, Metric, Pill, Screen, SectionTitle, TopBar } from '@/components/mvp-kit';
import { loginProfile } from '@/data/mvp';

export default function ProfileScreen() {
  return (
    <Screen>
      <TopBar />
      <Header
        eyebrow="profile"
        title="social proof before offline plans."
        subtitle="Profiles behave like lightweight social portfolios, so guests and hosts can judge fit before showing up."
      />

      <Card style={styles.profileCard}>
        <View style={styles.profileTop}>
          <Avatar label="NP" color={colors.lime} size={68} />
          <View style={styles.profileCopy}>
            <Text style={styles.name}>{loginProfile.name}</Text>
            <Text style={styles.city}>{loginProfile.city}</Text>
          </View>
        </View>
        <Text style={styles.intent}>{loginProfile.intent}</Text>
        <View style={styles.socialRow}>
          <Pill label={loginProfile.instagram} active tone="coral" />
          <Pill label="LinkedIn linked" active tone="blue" />
        </View>
      </Card>

      <View style={styles.metricsRow}>
        <Metric value="7" label="plans attended" />
        <Metric value="4.8" label="guest rating" />
        <Metric value="11" label="new links" />
      </View>

      <SectionTitle title="trust graph" action="mock" />
      <Card style={styles.graphCard}>
        <View style={styles.graphRow}>
          <Avatar label="NP" color={colors.lime} size={48} />
          <View style={styles.graphLine} />
          <Avatar label="RM" color={colors.coral} size={44} />
          <View style={styles.graphLine} />
          <Avatar label="TS" color={colors.yellow} size={44} />
        </View>
        <Text style={styles.graphText}>
          Based on plans attended, mutuals, host reviews, and recurring small-group chats.
        </Text>
      </Card>

      <SectionTitle title="comfort settings" />
      <Card style={styles.settingsCard}>
        <Setting icon="people-outline" label="Prefer curated guest lists" />
        <Setting icon="shield-checkmark-outline" label="Show confirmed attendees before RSVP" />
        <Setting icon="chatbubble-ellipses-outline" label="Keep event comms inside Aangan" />
      </Card>
    </Screen>
  );
}

function Setting({ icon, label }: { icon: keyof typeof Ionicons.glyphMap; label: string }) {
  return (
    <View style={styles.setting}>
      <Ionicons name={icon} size={19} color={colors.lime} />
      <Text style={styles.settingText}>{label}</Text>
      <Ionicons name="checkmark" size={18} color={colors.lime} />
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
    color: colors.ink,
    fontSize: 22,
    fontWeight: '900',
  },
  city: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: '800',
  },
  intent: {
    color: colors.ink,
    fontSize: 15,
    fontWeight: '800',
    lineHeight: 22,
  },
  socialRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  metricsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  graphCard: {
    gap: 16,
  },
  graphRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  graphLine: {
    backgroundColor: colors.line,
    height: 2,
    width: 42,
  },
  graphText: {
    color: colors.muted,
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 20,
    textAlign: 'center',
  },
  settingsCard: {
    gap: 12,
  },
  setting: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
  },
  settingText: {
    color: colors.ink,
    flex: 1,
    fontSize: 14,
    fontWeight: '800',
  },
});
