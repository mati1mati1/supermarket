import React from 'react';
import { Tabs } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import LogoutButton from '../../src/components/LogoutButton';

const iconMap = {
  purchaseHistory: 'history',
  shoppingList: 'list',
  shopping: 'shopping-bag',
};

export default function CustomerLayout() {
  return (
    <>
      <Tabs
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            const iconName = iconMap[route.name] as keyof typeof FontAwesome.glyphMap;
            return <FontAwesome name={iconName} size={size} color={color} />;
          },
        })}
      >
        <Tabs.Screen name="purchaseHistory"options={{ headerShown: false}}/>
        <Tabs.Screen name="shoppingList"options={{ headerShown: false}}/>
        <Tabs.Screen name="shopping" options={{ headerShown: false}}/>
      </Tabs>
      <LogoutButton />
    </>
  );
}

