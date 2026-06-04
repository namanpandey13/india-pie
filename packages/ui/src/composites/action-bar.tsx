import type { PropsWithChildren } from 'react';
import { StyleSheet, View } from 'react-native';
import { spacing } from '../styles/theme';

export function ActionBar({ children }: PropsWithChildren) {
  return <View style={styles.actionBar}>{children}</View>;
}

const styles = StyleSheet.create({
  actionBar: {
    gap: spacing.md,
  },
});
