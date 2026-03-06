import React from 'react';
import { StyleSheet, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { MapBackground } from '@/components/MapBackground';
import { DashboardSheet } from '@/components/DashboardSheet';

export default function HomeScreen() {
  return (
    <GestureHandlerRootView style={styles.container}>
      <MapBackground />
      <DashboardSheet />
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
});
