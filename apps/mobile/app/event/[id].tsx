import { Redirect, router, useLocalSearchParams } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PhotoHero, typographyRoles, useThemeColors } from '@hausy/ui';

import {
  AttendeePreview,
  EventIntro,
  HostTrustPanel,
  LogisticsPanel,
  ReviewsPreview,
  RsvpActionPanel,
  SocialTrustPanel,
  WhatYouDoPanel,
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
    checkpoints,
    event,
    followHost,
    host,
    hostFollowed,
    reviews,
    saved,
    toggleSaved,
  } = useEventDetail(id);
  const { cancelRsvp, draft, error, requestToJoin, requested, updateDraft } = useRsvpRequest(event?.id ?? '');

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
        <PhotoHero
          image={event.image}
          title={event.posterText}
          onBack={() => router.back()}
          actions={[
            { icon: saved ? 'bookmark' : 'bookmark-outline', onPress: toggleSaved },
          ]}
        />

        <View style={styles.body}>
          <EventIntro event={event} />
          {host ? (
            <HostTrustPanel
              host={host}
              followed={hostFollowed}
              onFollow={followHost}
              onOpenProfile={() => router.push({ pathname: '/profile/[id]', params: { id: host.id } })}
            />
          ) : null}
          <SocialTrustPanel event={event} checkpoints={checkpoints} />
          <WhatYouDoPanel event={event} />
          <AttendeePreview
            event={event}
            onOpenProfile={(profileId) => router.push({ pathname: '/profile/[id]', params: { id: profileId } })}
          />
          <ReviewsPreview reviews={reviews} />
          <LogisticsPanel event={event} />
          <RsvpActionPanel
            draft={draft}
            error={error}
            event={event}
            requested={requested}
            onCancel={cancelRsvp}
            onRequest={requestToJoin}
            onUpdateDraft={updateDraft}
          />
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
  body: {
    gap: 20,
    paddingHorizontal: 18,
    paddingTop: 18,
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
