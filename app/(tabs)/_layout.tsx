import Ionicons from '@expo/vector-icons/Ionicons';
import { Tabs } from 'expo-router';
import React from 'react';

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{
      headerStyle:{ backgroundColor: "#f5f5f5"},
      headerShadowVisible: false,
      tabBarActiveTintColor: 'green',
      tabBarStyle: {
        backgroundColor: "f5f5f5",
        borderTopWidth: 0,
      }
      }}>
        <Tabs.Screen name='index' options={{title: 'Today\'s Habits', tabBarIcon: ({color,focused, size}) => (
            focused ?
            <Ionicons name="calendar" size={size} color={color} />
             : 
            <Ionicons name="calendar-outline" size={size} color={color} />
        )}} />
        <Tabs.Screen name='streaks' options={{title: 'Streaks', tabBarIcon: ({color,focused, size}) => (
            focused ?
            <Ionicons name="stats-chart" size={size} color={color} />
             : 
            <Ionicons name="stats-chart-outline" size={size} color={color} />
        )}} />
        <Tabs.Screen name='add-habits' options={{title: 'Add Habits', tabBarIcon: ({color,focused, size}) => (
            focused ?
            <Ionicons name="add-circle" size={size} color={color} />
             : 
            <Ionicons name="add-circle-outline" size={size} color={color} />
        )}} />
    </Tabs>
  )
}