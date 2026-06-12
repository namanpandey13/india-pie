import { Ionicons } from '@expo/vector-icons';
import { Redirect, Tabs } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAuthSession } from '@/lib/auth-session';
import { componentTokens, typographyRoles, useThemeColors } from '@hausy/ui';

export default function TabLayout() {
  const colors = useThemeColors();
  const insets = useSafeAreaInsets();
  const { isLoading, isSignedIn } = useAuthSession();

  if (isLoading) {
    return null;
  }

  if (!isSignedIn) {
    return <Redirect href="/login" />;
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.ink,
        tabBarInactiveTintColor: colors.muted,
        tabBarLabelStyle: {
          ...typographyRoles.micro,
          marginTop: 1,
        },
        tabBarStyle: {
          borderColor: colors.line,
          borderRadius: 18,
          borderWidth: StyleSheet.hairlineWidth,
          backgroundColor: colors.surface,
          bottom: Math.max(insets.bottom, 10),
          elevation: 0,
          height: 62,
          left: 12,
          overflow: 'visible',
          paddingBottom: 7,
          paddingHorizontal: 8,
          paddingTop: 7,
          position: 'absolute',
          right: 12,
          shadowColor: colors.black,
          shadowOffset: { height: 8, width: 0 },
          shadowOpacity: 0.12,
          shadowRadius: 18,
        },
        tabBarItemStyle: {
          borderRadius: 14,
          height: 48,
          paddingVertical: 2,
        },
        tabBarHideOnKeyboard: true,
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              size={componentTokens.controls.tabIconSize}
              name={focused ? 'compass' : 'compass-outline'}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="vizz"
        options={{
          title: 'Vizz',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              size={componentTokens.controls.tabIconSize}
              name={focused ? 'sparkles' : 'sparkles-outline'}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="host"
        options={{
          title: 'Create',
          tabBarButton: ({ accessibilityState, onLongPress, onPress }) => (
            <Pressable
              accessibilityLabel="Create an event"
              accessibilityRole="button"
              accessibilityState={accessibilityState}
              onLongPress={onLongPress}
              onPress={onPress}
              style={styles.createTab}>
              <View style={[styles.createButton, { backgroundColor: colors.brand, shadowColor: colors.black }]}>
                <Ionicons name="add" size={26} color={colors.black} />
              </View>
            </Pressable>
          ),
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: 'Rooms',
          tabBarBadge: '',
          tabBarBadgeStyle: {
            backgroundColor: colors.brand,
            borderRadius: 3,
            height: 6,
            minWidth: 6,
            right: 20,
            top: 4,
            width: 6,
          },
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              size={componentTokens.controls.tabIconSize}
              name={focused ? 'chatbubble' : 'chatbubble-outline'}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen name="saved" options={{ href: null }} />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              size={componentTokens.controls.tabIconSize}
              name={focused ? 'person' : 'person-outline'}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  createButton: {
    alignItems: 'center',
    borderRadius: 999,
    elevation: 4,
    height: 48,
    justifyContent: 'center',
    shadowOffset: { height: 4, width: 0 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    width: 48,
  },
  createTab: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    transform: [{ translateY: -18 }],
  },
});
