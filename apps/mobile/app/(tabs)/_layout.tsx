import { Tabs } from 'expo-router';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';

import { componentTokens, typographyRoles, useThemeColors } from '@hausy/ui';

export default function TabLayout() {
  const colors = useThemeColors();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.brand,
        tabBarInactiveTintColor: colors.muted,
        tabBarLabelStyle: {
          ...typographyRoles.caption,
        },
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.line,
          height: componentTokens.controls.tabBarHeight,
          paddingBottom: 8,
          paddingTop: 6,
        },
        tabBarItemStyle: {
          minHeight: 56,
          paddingVertical: 4,
        },
        tabBarHideOnKeyboard: true,
        headerShown: false,
      }}>
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <Ionicons size={componentTokens.controls.tabIconSize} name="home-outline" color={color} />,
        }}
      />
      <Tabs.Screen
        name="discover"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color }) => <Ionicons size={componentTokens.controls.tabIconSize} name="sparkles-outline" color={color} />,
        }}
      />
      <Tabs.Screen
        name="host"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="saved"
        options={{
          title: 'Saved',
          tabBarIcon: ({ color }) => <Ionicons size={componentTokens.controls.tabIconSize} name="bookmark-outline" color={color} />,
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: 'Plan Inbox',
          tabBarIcon: ({ color }) => <Ionicons size={componentTokens.controls.tabIconSize} name="chatbubbles-outline" color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <Ionicons size={componentTokens.controls.tabIconSize} name="person-circle-outline" color={color} />,
        }}
      />
    </Tabs>
  );
}
