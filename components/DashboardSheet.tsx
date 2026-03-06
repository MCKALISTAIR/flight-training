import React, { useMemo, useRef } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { DashboardHeader } from '@/components/DashboardHeader';
import { PassportCard, DelayCard } from '@/components/StatsCards';
import { FlightListItem } from '@/components/FlightListItem';

export function DashboardSheet() {
    const bottomSheetRef = useRef<BottomSheet>(null);

    // Define snap points (30%, 60% and 90% of screen height)
    const snapPoints = useMemo(() => ['30%', '60%', '90%'], []);

    const sampleFlights2026 = [
        { id: '1', date: '12 Jan 2026', airline: 'EI', color: '#00855A', number: 'EI 3250', route: 'DUB → EDI', origin: 'Dublin', dest: 'Edinburgh' },
        { id: '2', date: '11 Jan 2026', airline: 'EI', color: '#00855A', number: 'EI 3258', route: 'DUB → EDI', origin: 'Dublin', dest: 'Edinburgh' },
        { id: '3', date: '10 Jan 2026', airline: 'EI', color: '#00855A', number: 'EI 50', route: 'LAS → DUB', origin: 'Las Vegas', dest: 'Dublin' },
        { id: '4', date: '3 Jan 2026', airline: 'EI', color: '#00855A', number: 'EI 51', route: 'DUB → LAS', origin: 'Dublin', dest: 'Las Vegas' },
    ];

    const sampleFlights2025 = [
        { id: '5', date: '14 Nov 2025', airline: 'U2', color: '#FF6600', number: 'U2 3302', route: 'AMS → EDI', origin: 'Amsterdam', dest: 'Edinburgh' },
        { id: '6', date: '12 Nov 2025', airline: 'KL', color: '#00A1DE', number: 'KL 932', route: 'EDI → AMS', origin: 'Edinburgh', dest: 'Amsterdam' },
        { id: '7', date: '6 Sep 2025', airline: 'AC', color: '#F01428', number: 'AC 936', route: 'YUL → EDI', origin: 'Montreal', dest: 'Edinburgh' },
    ];

    return (
        <BottomSheet
            ref={bottomSheetRef}
            index={1}
            snapPoints={snapPoints}
            backgroundStyle={styles.background}
            handleIndicatorStyle={styles.indicator}
        >
            <BottomSheetScrollView contentContainerStyle={styles.contentContainer}>
                <DashboardHeader name="Alistair McKay" subtitle="My Flight Log" />

                <View style={styles.cardsSection}>
                    <PassportCard />
                    <DelayCard />
                </View>

                {/* 2026 Flights Section */}
                <View style={styles.yearSection}>
                    <View style={styles.yearHeader}>
                        <Text style={styles.yearTitle}>2026</Text>
                        <Text style={styles.yearCount}>5 FLIGHTS</Text>
                    </View>
                    {sampleFlights2026.map(flight => (
                        <FlightListItem
                            key={flight.id}
                            airlineCode={flight.airline}
                            airlineColor={flight.color}
                            flightNumber={flight.number}
                            routeCode={flight.route}
                            date={flight.date}
                            origin={flight.origin}
                            destination={flight.dest}
                        />
                    ))}
                </View>

                {/* 2025 Flights Section */}
                <View style={styles.yearSection}>
                    <View style={styles.yearHeader}>
                        <Text style={styles.yearTitle}>2025</Text>
                        <Text style={styles.yearCount}>8 FLIGHTS</Text>
                    </View>
                    {sampleFlights2025.map(flight => (
                        <FlightListItem
                            key={flight.id}
                            airlineCode={flight.airline}
                            airlineColor={flight.color}
                            flightNumber={flight.number}
                            routeCode={flight.route}
                            date={flight.date}
                            origin={flight.origin}
                            destination={flight.dest}
                        />
                    ))}
                </View>
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
