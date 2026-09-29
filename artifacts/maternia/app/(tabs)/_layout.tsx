import React from 'react';
import { Platform, StyleSheet, useColorScheme, View } from 'react-native';
import { useColors } from '@/hooks/useColors';
import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
function TabIcon({ name, color }: { name: keyof typeof Ionicons.glyphMap; color: string | import('react-native').ColorValue }) {
  return <Ionicons name={name} size={22} color={color as string} />;
}

export default function TabLayout() {
  const colors = useColors();
  return (
    <Tabs screenOptions={{
      headerShown: false,
      tabBarActiveTintColor: colors.mintDark,
      tabBarInactiveTintColor: colors.mutedForeground,
      tabBarStyle: { height: 76, paddingTop: 8, paddingBottom: 13, backgroundColor: colors.white, borderTopColor: colors.border },
      tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
    }}>
      <Tabs.Screen name="index" options={{ title: 'Inicio', tabBarIcon: ({ color }) => <TabIcon name="home-outline" color={color} /> }} />
      <Tabs.Screen name="wellbeing" options={{ title: 'Bienestar', tabBarIcon: ({ color }) => <TabIcon name="sparkles-outline" color={color} /> }} />
      <Tabs.Screen name="selfcare" options={{ title: 'Autocuidado', tabBarIcon: ({ color }) => <TabIcon name="leaf-outline" color={color} /> }} />
      <Tabs.Screen name="community" options={{ title: 'Comunidad', tabBarIcon: ({ color }) => <TabIcon name="people-outline" color={color} /> }} />
      <Tabs.Screen name="profile" options={{ title: 'Perfil', tabBarIcon: ({ color }) => <TabIcon name="person-outline" color={color} /> }} />
    </Tabs>
  );
}
