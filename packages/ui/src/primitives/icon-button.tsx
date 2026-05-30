import { Ionicons } from '@expo/vector-icons';
import type { StyleProp, ViewStyle } from 'react-native';
import { Pressable, StyleSheet, View } from 'react-native';
import { componentTokens, radius, useThemeColors, type IconName } from '../styles/theme';

export function IconButton({
  icon,
  onPress,
  indicator,
  style,
}: {
  icon: IconName;
  onPress?: () => void;
  indicator?: boolean;
  style?: StyleProp<ViewStyle>;
}) {
  const colors = useThemeColors();

  return (
    <Pressable onPress={onPress} style={[styles.iconButton, { backgroundColor: colors.surface, borderColor: colors.line }, style]}>
      <Ionicons name={icon} size={18} color={colors.ink} />
      {indicator ? <View style={[styles.dot, { backgroundColor: colors.brand }]} /> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  iconButton: {
    alignItems: 'center',
    borderRadius: radius.pill,
    borderWidth: 1,
    height: componentTokens.controls.iconButtonSize,
    justifyContent: 'center',
    width: componentTokens.controls.iconButtonSize,
  },
  dot: {
    borderRadius: 5,
    height: 10,
    position: 'absolute',
    right: 6,
    top: 6,
    width: 10,
  },
});
