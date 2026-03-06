import React from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DashboardHeader } from '@/components/DashboardHeader';
import { PassportCard } from '@/components/StatsCards';
import { FlightListItem } from '@/components/FlightListItem';
import { useAppStore } from '@/store/useAppStore';

export default function HomeScreen() {
  const flights = useAppStore((state) => state.flights);

  // Group flights by year (descending)
  const groupedFlights = flights.reduce((acc, flight) => {
    const year = flight.date.split('-')[0] || new Date().getFullYear().toString();
    if (!acc[year]) acc[year] = [];
    acc[year].push(flight);
    return acc;
  }, {} as Record<string, typeof flights>);

  const sortedYears = Object.keys(groupedFlights).sort((a, b) => parseInt(b) - parseInt(a));

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <DashboardHeader />
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>

        <View style={styles.cardsSection}>
          <PassportCard />
        </View>

        {sortedYears.map((year) => (
          <View key={year} style={styles.yearSection}>
            <View style={styles.yearHeader}>
              <Text style={styles.yearTitle}>{year}</Text>
              <Text style={styles.yearCount}>{groupedFlights[year].length} FLIGHTS</Text>
            </View>
            {groupedFlights[year].map((flight) => (
              <FlightListItem
                key={flight.id}
                airlineCode={flight.aircraft.substring(0, 2).toUpperCase()}
                airlineColor="#F2F2F2" // Light gray for minimalist look
                flightNumber={flight.aircraft}
                routeCode={`${flight.waypoints[0]} → ${flight.waypoints[flight.waypoints.length - 1]}`}
                date={flight.date}
                waypoints={flight.waypoints}
              />
            ))}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    paddingBottom: 40,
  },
  cardsSection: {
    paddingTop: 8,
  },
  yearSection: {
    marginTop: 24,
  },
  yearHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#F9F9F9',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#EAEAEE',
  },
  yearTitle: {
    color: '#111111',
    fontSize: 14,
    fontWeight: '700',
  },
  yearCount: {
    color: '#666666',
    fontSize: 12,
    fontWeight: '600',
  }
});
