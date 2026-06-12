import { Ionicons } from '@expo/vector-icons';
import { Redirect, Tabs } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { useAuthSession } from '@/lib/auth-session';
import { componentTokens, typographyRoles, useThemeColors } from '@hausy/ui';

export default function TabLayout() {
  const colors = useThemeColors();
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
        },
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.line,
          height: 78,
          paddingBottom: 8,
          paddingTop: 6,
        },
        tabBarItemStyle: {
          minHeight: 56,
          paddingVertical: 4,
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
              <View style={[styles.createButton, { backgroundColor: colors.brand }]}>
                <Ionicons name="add" size={28} color={colors.black} />
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
            borderRadius: 4,
            height: 8,
            minWidth: 8,
            right: 23,
            top: 8,
            width: 8,
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
    height: 52,
    justifyContent: 'center',
    width: 52,
  },
  createTab: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    transform: [{ translateY: -12 }],
  },
});
