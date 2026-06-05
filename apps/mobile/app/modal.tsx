import { Ionicons } from '@expo/vector-icons';
import { Redirect, router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card, typographyRoles, useThemeColors } from '@hausy/ui';
import { useAuthSession } from '@/lib/auth-session';

const NOTIFICATION_ITEMS = [
  {
    icon: 'checkmark-circle-outline' as const,
    title: 'RSVP updates',
    body: 'Approvals, waitlist movement, and host decisions will appear here.',
  },
  {
    icon: 'chatbubble-ellipses-outline' as const,
    title: 'Plan inbox',
    body: 'Messages that affect attendance or logistics stay grouped by plan.',
  },
  {
    icon: 'shield-checkmark-outline' as const,
    title: 'Trust checks',
    body: 'Host proof, route notes, and safety-critical changes are prioritized.',
  },
];

export default function NotificationsScreen() {
  const { isLoading, isSignedIn } = useAuthSession();

  if (isLoading) {
    return null;
  }

  if (!isSignedIn) {
    return <Redirect href="/login" />;
  }

  return <ProtectedNotificationsScreen />;
}

function ProtectedNotificationsScreen() {
  const colors = useThemeColors();

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.bg }]}>
      <View style={styles.topRow}>
        <View>
          <Text style={[styles.eyebrow, { color: colors.brand }]}>updates</Text>
          <Text style={[styles.title, { color: colors.ink }]}>Notifications</Text>
        </View>
        <Pressable
          accessibilityLabel="Close notifications"
          accessibilityRole="button"
          onPress={() => router.back()}
          style={[styles.closeButton, { backgroundColor: colors.surfaceAlt, borderColor: colors.line }]}
        >
          <Ionicons name="close" size={24} color={colors.ink} />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Card style={styles.summaryCard}>
          <View style={[styles.summaryIcon, { backgroundColor: colors.surfaceAlt }]}>
            <Ionicons name="notifications-outline" size={24} color={colors.brand} />
          </View>
          <View style={styles.summaryCopy}>
            <Text style={[styles.summaryTitle, { color: colors.ink }]}>No urgent updates</Text>
            <Text style={[styles.summaryBody, { color: colors.muted }]}>
              Hausy keeps this space focused on plan-critical changes, not engagement noise.
            </Text>
          </View>
        </Card>

        <Text style={[styles.sectionLabel, { color: colors.ink }]}>What will show here</Text>

        <View style={styles.list}>
          {NOTIFICATION_ITEMS.map((item) => (
            <View key={item.title} style={[styles.itemRow, { borderColor: colors.line }]}>
              <View style={[styles.itemIcon, { backgroundColor: colors.surfaceAlt }]}>
                <Ionicons name={item.icon} size={20} color={colors.ink} />
              </View>
              <View style={styles.itemCopy}>
                <Text style={[styles.itemTitle, { color: colors.ink }]}>{item.title}</Text>
                <Text style={[styles.itemBody, { color: colors.muted }]}>{item.body}</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  closeButton: {
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  content: {
    gap: 18,
    paddingBottom: 28,
    paddingHorizontal: 18,
  },
  eyebrow: {
    ...typographyRoles.eyebrow,
  },
  itemBody: {
    ...typographyRoles.body,
  },
  itemCopy: {
    flex: 1,
    gap: 4,
    minWidth: 0,
  },
  itemIcon: {
    alignItems: 'center',
    borderRadius: 8,
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
  itemRow: {
    alignItems: 'flex-start',
    borderBottomWidth: 1,
    flexDirection: 'row',
    gap: 12,
    paddingBottom: 16,
  },
  itemTitle: {
    ...typographyRoles.bodyStrong,
  },
  list: {
    gap: 16,
  },
  safe: {
    flex: 1,
  },
  sectionLabel: {
    ...typographyRoles.h3,
  },
  summaryBody: {
    ...typographyRoles.body,
  },
  summaryCard: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: 12,
  },
  summaryCopy: {
    flex: 1,
    gap: 6,
    minWidth: 0,
  },
  summaryIcon: {
    alignItems: 'center',
    borderRadius: 8,
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  summaryTitle: {
    ...typographyRoles.h3,
  },
  title: {
    ...typographyRoles.h1,
  },
  topRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 18,
  },
});
