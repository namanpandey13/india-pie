import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Redirect, router, useLocalSearchParams } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { listEvents } from '@hausy/api';
import { Avatar, Card, typographyRoles, useThemeColors } from '@hausy/ui';
import { useAuthSession } from '@/lib/auth-session';

export default function PublicProfileScreen() {
  const { isLoading, isSignedIn } = useAuthSession();

  if (isLoading) {
    return null;
  }

  if (!isSignedIn) {
    return <Redirect href="/login" />;
  }

  return <ProtectedPublicProfileScreen />;
}

function ProtectedPublicProfileScreen() {
  const colors = useThemeColors();
  const { id } = useLocalSearchParams<{ id: string }>();
  const eventsQuery = useQuery({
    queryKey: ['profile-events', id],
    queryFn: () => listEvents(),
  });
  const events = eventsQuery.data?.data ?? [];
  const hostEvent = events.find((event) => event.organizer.id === id);
  const attendeeEvent = events.find((event) => event.attendees.some((attendee) => attendee.id === id));
  const attendee = attendeeEvent?.attendees.find((person) => person.id === id);
  const profileEvents = events.filter(
    (event) => event.organizer.id === id || event.attendees.some((person) => person.id === id),
  );
  const profile = hostEvent
    ? {
        bio: hostEvent.organizer.bio,
        avatarUrl: hostEvent.organizer.avatarUrl,
        context: hostEvent.organizer.title,
        initials: hostEvent.organizer.initials,
        isHost: true,
        name: hostEvent.organizer.name,
      }
    : attendee
      ? {
          bio: attendee.signal,
          avatarUrl: attendee.avatarUrl,
          context: attendee.role,
          initials: attendee.initials,
          isHost: false,
          name: attendee.name,
        }
      : null;

  if (!profile) {
    return (
      <SafeAreaView style={[styles.safe, { backgroundColor: colors.bg }]}>
        <View style={styles.emptyState}>
          <Pressable accessibilityRole="button" onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="chevron-back" size={24} color={colors.ink} />
          </Pressable>
          <Text style={[styles.emptyTitle, { color: colors.ink }]}>Profile unavailable</Text>
          <Text style={[styles.emptyBody, { color: colors.muted }]}>
            This profile may be private, or it has not appeared in a public plan yet.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.bg }]}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.topRow}>
          <Pressable accessibilityRole="button" onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="chevron-back" size={24} color={colors.ink} />
          </Pressable>
          <Text style={[styles.handle, { color: colors.ink }]}>@{profile.name.toLowerCase().replace(/\s+/g, '')}</Text>
          <View style={styles.backButton} />
        </View>

        <View style={styles.profileHeader}>
          <Avatar
            accessibilityLabel={profile.name}
            imageUrl={profile.avatarUrl}
            label={profile.initials}
            size={82}
          />
          <View style={styles.statColumn}>
            <Text style={[styles.statValue, { color: colors.ink }]}>{profileEvents.length}</Text>
            <Text style={[styles.statLabel, { color: colors.muted }]}>plans</Text>
          </View>
          <View style={styles.statColumn}>
            <Text style={[styles.statValue, { color: colors.ink }]}>{profile.isHost ? 'Host' : 'Guest'}</Text>
            <Text style={[styles.statLabel, { color: colors.muted }]}>role</Text>
          </View>
        </View>

        <View style={styles.copyBlock}>
          <Text style={[styles.name, { color: colors.ink }]}>{profile.name}</Text>
          <Text style={[styles.context, { color: colors.muted }]}>{profile.context}</Text>
          <Text style={[styles.bio, { color: colors.ink }]}>{profile.bio}</Text>
        </View>

        <Card style={styles.visibilityCard}>
          <Ionicons name={profile.isHost ? 'shield-checkmark-outline' : 'people-outline'} size={20} color={colors.ink} />
          <Text style={[styles.visibilityText, { color: colors.muted }]}>
            {profile.isHost
              ? 'Public host profile. Trust details are visible before guests request to join.'
              : 'Public guest preview. Private details stay hidden unless shared by the member.'}
          </Text>
        </Card>

        <View style={styles.grid}>
          {profileEvents.map((event, index) => (
            <Pressable
              key={`${event.id}-${index}`}
              accessibilityRole="button"
              onPress={() => router.push({ pathname: '/event/[id]', params: { id: event.id } })}
              style={styles.gridItem}
            >
              <Image source={{ uri: event.image }} style={styles.gridImage} contentFit="cover" />
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  backButton: {
    alignItems: 'center',
    height: 42,
    justifyContent: 'center',
    width: 42,
  },
  bio: {
    ...typographyRoles.body,
  },
  content: {
    gap: 18,
    padding: 18,
    paddingBottom: 34,
  },
  context: {
    ...typographyRoles.caption,
  },
  copyBlock: {
    gap: 4,
  },
  emptyBody: {
    ...typographyRoles.body,
    textAlign: 'center',
  },
  emptyState: {
    alignItems: 'center',
    flex: 1,
    gap: 10,
    justifyContent: 'center',
    padding: 22,
  },
  emptyTitle: {
    ...typographyRoles.h2,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 3,
  },
  gridImage: {
    ...StyleSheet.absoluteFillObject,
  },
  gridItem: {
    aspectRatio: 1,
    flexBasis: '32.8%',
    overflow: 'hidden',
  },
  handle: {
    ...typographyRoles.bodyStrong,
  },
  name: {
    ...typographyRoles.h3,
  },
  profileHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 22,
  },
  safe: {
    flex: 1,
  },
  statColumn: {
    alignItems: 'center',
    flex: 1,
    gap: 2,
  },
  statLabel: {
    ...typographyRoles.caption,
  },
  statValue: {
    ...typographyRoles.h3,
  },
  topRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  visibilityCard: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: 10,
  },
  visibilityText: {
    ...typographyRoles.body,
    flex: 1,
  },
});
