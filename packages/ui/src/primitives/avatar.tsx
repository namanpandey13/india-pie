import { StyleSheet, Text, View } from 'react-native';
import {
  componentTokens,
  typographyRoles,
  useSemanticAccents,
  useThemeColors,
  type AccentTone,
} from '../styles/theme';

export function Avatar({
  label,
  color = 'lime',
  size = 42,
}: {
  label: string;
  color?: AccentTone | string;
  size?: number;
}) {
  const colors = useThemeColors();
  const semanticAccents = useSemanticAccents();
  const backgroundColor = color in semanticAccents ? semanticAccents[color as AccentTone] : color;

  return (
    <View
      style={[
        styles.avatar,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor,
          borderColor: colors.bg,
        },
      ]}>
      <Text
        style={[
          styles.avatarText,
          { color: colors.black },
          size < 36 && { fontSize: componentTokens.avatar.smallFontSize },
        ]}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  avatar: {
    alignItems: 'center',
    borderWidth: 2,
    justifyContent: 'center',
  },
  avatarText: {
    ...typographyRoles.caption,
  },
});
