import React, { useMemo, useRef } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { DashboardHeader } from '@/components/DashboardHeader';
import { PassportCard, DelayCard } from '@/components/StatsCards';
import { FlightListItem } from '@/components/FlightListItem';
import { useAppStore } from '@/store/useAppStore';

export function DashboardSheet() {
    const bottomSheetRef = useRef<BottomSheet>(null);
    const flights = useAppStore((state) => state.flights);

    // Define snap points (30%, 60% and 90% of screen height)
    const snapPoints = useMemo(() => ['30%', '60%', '90%'], []);

    // Helper to group flights by year
    const groupedFlights = flights.reduce((acc, flight) => {
        const year = flight.date.split('-')[0] || new Date().getFullYear().toString();
        if (!acc[year]) acc[year] = [];
        acc[year].push(flight);
        return acc;
    }, {} as Record<string, typeof flights>);

    // Sort years descending
    const sortedYears = Object.keys(groupedFlights).sort((a, b) => parseInt(b) - parseInt(a));

    return (
        <BottomSheet
            ref={bottomSheetRef}
            index={1}
            snapPoints={snapPoints}
            backgroundStyle={styles.background}
            handleIndicatorStyle={styles.indicator}
        >
            <BottomSheetScrollView contentContainerStyle={styles.contentContainer}>
                <DashboardHeader />

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
                                airlineCode={flight.aircraft.substring(0, 2).toUpperCase()} // Pseudo-airline code for training
                                airlineColor="#333" // Default dark color for training flights
                                flightNumber={flight.aircraft}
                                routeCode={`${flight.waypoints[0]} → ${flight.waypoints[flight.waypoints.length - 1]}`}
                                date={flight.date}
                                waypoints={flight.waypoints}
                            />
                        ))}
                    </View>
                ))}
            </BottomSheetScrollView>
        </BottomSheet>
    );
}

const styles = StyleSheet.create({
    background: {
        backgroundColor: '#1C1C1E',
    },
    indicator: {
        backgroundColor: 'rgba(255,255,255,0.3)',
        width: 40,
    },
    contentContainer: {
        paddingBottom: 40,
    },
    cardsSection: {
        paddingTop: 8,
    },
    yearSection: {
        marginTop: 8,
    },
    yearHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#151515',
    },
    yearTitle: {
        color: '#FFF',
        fontSize: 14,
        fontWeight: '700',
    },
    yearCount: {
        color: '#A0A0A0',
        fontSize: 12,
        fontWeight: '500',
    }
});
