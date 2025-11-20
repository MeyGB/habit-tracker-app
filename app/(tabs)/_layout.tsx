import Ionicons from '@expo/vector-icons/Ionicons';
import { Tabs } from 'expo-router';
import React from 'react';

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{headerShown:true, tabBarActiveTintColor: 'crimson'}}>
        <Tabs.Screen name='index' options={{title: 'Home', tabBarIcon: ({color,focused}) => (
            focused ?
            <Ionicons name="home" size={24} color={color} />
             : 
            <Ionicons name="home-outline" size={24} color={color} />
            
  )}} />
        <Tabs.Screen name='login' options={{title: 'Login'}} />
    </Tabs>
  )
}