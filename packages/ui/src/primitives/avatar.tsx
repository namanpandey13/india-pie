import { Image } from 'expo-image';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {
  componentTokens,
  typographyRoles,
  useThemeColors,
  type AccentTone,
} from '../styles/theme';

export function Avatar({
  accessibilityLabel,
  label,
  imageUrl,
  size = 42,
}: {
  accessibilityLabel?: string;
  label: string;
  imageUrl?: string | null;
  color?: AccentTone | string;
  size?: number;
}) {
  const colors = useThemeColors();
  const backgroundColor = colors.white;
  const [imageFailed, setImageFailed] = useState(false);

  useEffect(() => {
    setImageFailed(false);
  }, [imageUrl]);

  const showImage = Boolean(imageUrl) && !imageFailed;

  return (
    <View
      style={[
        styles.avatar,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor,
        },
      ]}>
      {showImage ? (
        <Image
          accessibilityLabel={accessibilityLabel ?? label}
          cachePolicy="memory-disk"
          contentFit="cover"
          onError={() => setImageFailed(true)}
          source={imageUrl}
          style={styles.avatarImage}
          transition={160}
        />
      ) : (
        <Text
          style={[
            styles.avatarText,
            { color: colors.black },
            size < 36 && { fontSize: componentTokens.avatar.smallFontSize },
          ]}>
          {label}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  avatar: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  avatarText: {
    ...typographyRoles.caption,
  },
  avatarImage: {
    height: '100%',
    width: '100%',
  },
});
