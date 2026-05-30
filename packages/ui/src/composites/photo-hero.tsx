import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Pressable, StyleSheet, View } from 'react-native';
import { componentTokens, radius, spacing, typographyRoles, useThemeColors, type IconName } from '../styles/theme';
import { Typography } from '../primitives/typography';

export function PhotoHero({
  image,
  title,
  onBack,
  actions = [],
}: {
  image: string;
  title: string;
  onBack?: () => void;
  actions?: { icon: IconName; onPress?: () => void }[];
}) {
  const colors = useThemeColors();

  return (
    <View style={styles.hero}>
      <Image source={{ uri: image }} style={styles.heroImage} contentFit="cover" />
      <View style={[styles.heroShade, { backgroundColor: colors.overlayHero }]} />
      {onBack ? (
        <Pressable
          onPress={onBack}
          style={[styles.floatingIcon, styles.backIcon, { backgroundColor: colors.overlayMedium, borderColor: colors.overlayBorder }]}>
          <Ionicons name="chevron-back" size={20} color={colors.ink} />
        </Pressable>
      ) : null}
      <View style={styles.heroActions}>
        {actions.map((action) => (
          <Pressable
            key={action.icon}
            onPress={action.onPress}
            style={[styles.floatingIcon, { backgroundColor: colors.overlayMedium, borderColor: colors.overlayBorder }]}>
            <Ionicons name={action.icon} size={19} color={colors.ink} />
          </Pressable>
        ))}
      </View>
      <View style={[styles.poster, { backgroundColor: colors.overlayMedium, borderColor: colors.overlayLight }]}>
        <Typography variant="h1" style={styles.posterText}>
          {title}
        </Typography>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  hero: {
    height: componentTokens.hero.height,
  },
  heroImage: {
    ...StyleSheet.absoluteFillObject,
  },
  heroShade: {
    ...StyleSheet.absoluteFillObject,
  },
  floatingIcon: {
    alignItems: 'center',
    borderRadius: radius.pill,
    borderWidth: 1,
    height: componentTokens.controls.iconButtonSize,
    justifyContent: 'center',
    width: componentTokens.controls.iconButtonSize,
  },
  backIcon: {
    left: spacing.xl,
    position: 'absolute',
    top: 14,
  },
  heroActions: {
    gap: spacing.md,
    position: 'absolute',
    right: spacing.xl,
    top: 14,
  },
  poster: {
    alignItems: 'center',
    borderRadius: radius.xl,
    borderWidth: 1,
    bottom: 40,
    justifyContent: 'center',
    left: 28,
    minHeight: componentTokens.hero.posterMinHeight,
    padding: spacing.xl,
    position: 'absolute',
    right: 28,
  },
  posterText: {
    ...typographyRoles.h1,
    textAlign: 'center',
  },
});
