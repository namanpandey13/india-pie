import { StyleSheet, Text, View } from 'react-native';
import { typographyRoles, useThemeColors } from '../styles/theme';

export function EventEditionMark({
  previousOccurrences,
  inverted = false,
}: {
  previousOccurrences: number;
  inverted?: boolean;
}) {
  const colors = useThemeColors();
  const isNew = previousOccurrences === 0;
  const backgroundColor = inverted ? colors.overlayStrong : colors.surfaceAlt;
  const textColor = inverted ? colors.white : colors.ink;

  return (
    <View
      accessibilityLabel={
        isNew
          ? 'New event'
          : `${previousOccurrences} previous edition${previousOccurrences === 1 ? '' : 's'}`
      }
      style={[styles.mark, { backgroundColor }]}>
      <Text style={[isNew ? styles.newText : styles.number, { color: textColor }]}>
        {isNew ? 'NEW' : previousOccurrences}
      </Text>
      {!isNew ? <Text style={[styles.times, { color: textColor }]}>x</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  mark: {
    alignItems: 'baseline',
    borderRadius: 999,
    flexDirection: 'row',
    justifyContent: 'center',
    minHeight: 34,
    minWidth: 44,
    paddingHorizontal: 11,
    paddingVertical: 7,
  },
  newText: {
    ...typographyRoles.micro,
    letterSpacing: 0.8,
  },
  number: {
    ...typographyRoles.h3,
    lineHeight: 20,
  },
  times: {
    ...typographyRoles.micro,
    marginLeft: 2,
  },
});
