import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { BottomTabNavigator } from './src/navigation/BottomTabNavigator';

export default function App() {
  return (
    <>
      <StatusBar style="light" backgroundColor="#0b0d19" />
      <BottomTabNavigator />
    </>
  );
}

