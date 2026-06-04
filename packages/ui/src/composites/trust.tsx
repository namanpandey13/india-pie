import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';
import type { HostProfile, Review } from '@hausy/types';
import { Avatar } from '../primitives/avatar';
import { Card } from '../primitives/card';
import { Typography } from '../primitives/typography';
import { radius, spacing, typographyRoles, useThemeColors } from '../styles/theme';

export function TrustSignal({ label }: { label: string }) {
  const colors = useThemeColors();

  return (
    <View style={styles.trustRow}>
      <Ionicons name="checkmark-circle" size={19} color={colors.brand} />
      <Typography variant="body" style={styles.trustText}>
        {label}
      </Typography>
    </View>
  );
}

export function HostSummary({ host }: { host: HostProfile }) {
  const colors = useThemeColors();

  return (
    <Card style={styles.hostCard}>
      <View style={styles.hostTop}>
        <Avatar label={host.initials} color={host.color} size={58} />
        <View style={styles.hostCopy}>
          <Typography variant="h3">{host.name}</Typography>
          <Typography variant="caption" muted>
            {host.title}
          </Typography>
        </View>
      </View>
      <Typography muted>{host.philosophy}</Typography>
      <View style={styles.statRow}>
        <View style={[styles.statBox, { backgroundColor: colors.surfaceAlt }]}>
          <Typography variant="h2">{host.rating}</Typography>
          <Typography variant="caption" muted>
            host rating
          </Typography>
        </View>
        <View style={[styles.statBox, { backgroundColor: colors.surfaceAlt }]}>
          <Typography variant="h2">{host.repeatRate}</Typography>
          <Typography variant="caption" muted>
            repeat guests
          </Typography>
        </View>
      </View>
      {host.credentials.map((credential) => (
        <TrustSignal key={credential} label={credential} />
      ))}
    </Card>
  );
}

export function ReviewCard({ review }: { review: Review }) {
  return (
    <Card style={styles.reviewCard}>
      <View style={styles.reviewTop}>
        <Avatar label={review.reviewerInitials} color={review.tone} size={38} />
        <View style={styles.reviewCopy}>
          <Typography variant="caption">{review.reviewerName}</Typography>
          <Typography variant="caption" muted>
            {review.context}
          </Typography>
        </View>
      </View>
      <Typography>{review.body}</Typography>
    </Card>
  );
}

const styles = StyleSheet.create({
  trustRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
  },
  trustText: {
    flex: 1,
    ...typographyRoles.bodyStrong,
  },
  hostCard: {
    gap: spacing.lg,
  },
  hostTop: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.md,
  },
  hostCopy: {
    flex: 1,
    gap: 3,
  },
  statRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  statBox: {
    borderRadius: radius.md,
    flex: 1,
    padding: spacing.md,
  },
  reviewCard: {
    gap: spacing.md,
  },
  reviewTop: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.md,
  },
  reviewCopy: {
    flex: 1,
    gap: 2,
  },
});
