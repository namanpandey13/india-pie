import { Redirect, router, useLocalSearchParams } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { IconButton, typographyRoles, useThemeColors } from '@hausy/ui';
import { Image } from 'expo-image';

import {
  AttendeePreview,
  EventStory,
  EventIntro,
  HostTrustPanel,
  RsvpActionPanel,
} from '@/features/events/components/event-trust-sections';
import { useEventDetail } from '@/features/events/use-event-detail';
import { useRsvpRequest } from '@/features/rsvp/use-rsvp-request';
import { useAuthSession } from '@/lib/auth-session';

export function generateStaticParams() {
  return [];
}

export default function EventDetailScreen() {
  const { isLoading, isSignedIn } = useAuthSession();

  if (isLoading) {
    return null;
  }

  if (!isSignedIn) {
    return <Redirect href="/login" />;
  }

  return <ProtectedEventDetailScreen />;
}

function ProtectedEventDetailScreen() {
  const colors = useThemeColors();
  const { id } = useLocalSearchParams<{ id: string }>();
  const {
    event,
    followHost,
    host,
    hostFollowed,
    saved,
    toggleSaved,
  } = useEventDetail(id);
  const { cancelRsvp, draft, error, requestToJoin, requested, status, updateDraft } = useRsvpRequest(event?.id ?? '');

  if (!event) {
    return (
      <SafeAreaView style={[styles.safe, { backgroundColor: colors.bg }]}>
        <View style={styles.emptyState}>
          <Text style={[styles.emptyTitle, { color: colors.ink }]}>This plan is not available yet.</Text>
          <Text style={[styles.emptyBody, { color: colors.muted }]}>New creator-led plans will appear here after they pass review.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.bg }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <View style={styles.hero}>
          <Image
            accessibilityLabel={`${event.title} event`}
            cachePolicy="memory-disk"
            contentFit="cover"
            source={event.image}
            style={styles.heroImage}
            transition={220}
          />
          <View style={styles.heroActions}>
            <IconButton
              color={colors.white}
              icon="chevron-back"
              onPress={() => router.back()}
              style={{ backgroundColor: colors.overlayMedium, borderColor: colors.overlayBorder }}
            />
            <IconButton
              color={colors.white}
              icon={saved ? 'bookmark' : 'bookmark-outline'}
              onPress={toggleSaved}
              style={{ backgroundColor: colors.overlayMedium, borderColor: colors.overlayBorder }}
            />
          </View>
        </View>

        <View style={styles.body}>
          <EventIntro event={event} />
          <RsvpActionPanel
            draft={draft}
            error={error}
            event={event}
            requested={requested}
            status={status}
            onCancel={cancelRsvp}
            onRequest={requestToJoin}
            onUpdateDraft={updateDraft}
          />
          {host ? (
            <HostTrustPanel
              host={host}
              followed={hostFollowed}
              onFollow={followHost}
              onOpenProfile={() => router.push({ pathname: '/profile/[id]', params: { id: host.id } })}
            />
          ) : null}
          <AttendeePreview
            event={event}
            onOpenProfile={(profileId) => router.push({ pathname: '/profile/[id]', params: { id: profileId } })}
          />
          <EventStory event={event} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  content: {
    paddingBottom: 34,
  },
  hero: {
    height: 390,
    position: 'relative',
  },
  heroActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    left: 16,
    position: 'absolute',
    right: 16,
    top: 12,
  },
  heroImage: {
    height: '100%',
    width: '100%',
  },
  body: {
    gap: 36,
    paddingHorizontal: 18,
    paddingTop: 24,
  },
  inlineStatus: {
    ...typographyRoles.caption,
  },
  emptyState: {
    flex: 1,
    gap: 10,
    justifyContent: 'center',
    padding: 22,
  },
  emptyTitle: {
    ...typographyRoles.h2,
  },
  emptyBody: {
    ...typographyRoles.body,
  },
});
