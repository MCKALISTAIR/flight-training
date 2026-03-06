import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Upload, ChevronRight, Plane } from 'lucide-react-native';
import { useAppStore } from '@/store/useAppStore';

export function PassportCard() {
    const flights = useAppStore((state) => state.flights);

    const totalFlights = flights.length;
    const totalHours = flights.reduce((sum, flight) => sum + flight.durationHours, 0);

    const uniqueAirports = new Set(flights.flatMap(f => f.waypoints)).size;
    const uniqueAircraft = new Set(flights.map(f => f.aircraft)).size;

    // Calculate total cost
    const totalCost = flights.reduce((sum, flight) => sum + (flight.cost || 0), 0);

    return (
        <View style={styles.card}>
            <View style={styles.headerRow}>
                <View style={styles.headerLeft}>
                    <Plane size={24} color="#FF5722" />
                    <View style={styles.headerTextContainer}>
                        <Text style={styles.title}>Pilot Totals</Text>
                        <Text style={styles.subtitle}>All Recorded Training</Text>
                    </View>
                </View>
                <TouchableOpacity>
                    <Upload size={20} color="#444" />
                </TouchableOpacity>
            </View>

            <View style={styles.statsGrid}>
                <View style={[styles.statCell, styles.primaryStatCell]}>
                    <Text style={styles.statLabel}>TOTAL HOURS</Text>
                    <Text style={styles.statValueOrange}>{totalHours.toFixed(1)} <Text style={styles.unit}>hrs</Text></Text>
                </View>
                <View style={styles.statCell}>
                    <Text style={styles.statLabel}>FLIGHTS</Text>
                    <Text style={styles.statValue}>{totalFlights}</Text>
                </View>
            </View>

            <View style={styles.statsGridSmall}>
                <View style={styles.statCellSmall}>
                    <Text style={styles.statLabel}>AIRCRAFT</Text>
                    <Text style={styles.statValueSmall}>{uniqueAircraft}</Text>
                </View>
                <View style={styles.statCellSmall}>
                    <Text style={styles.statLabel}>AIRPORTS</Text>
                    <Text style={styles.statValueSmall}>{uniqueAirports}</Text>
                </View>
                <View style={styles.statCellSmall}>
                    <Text style={styles.statLabel}>TOTAL EXPENSES</Text>
                    <Text style={styles.statValueSmall}>£{totalCost.toFixed(2)}</Text>
                </View>
            </View>

            <TouchableOpacity style={styles.footerButton}>
                <Text style={styles.footerButtonText}>View Detailed Analytics</Text>
                <ChevronRight size={16} color="#666" />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 20,
        marginHorizontal: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#EAEAEE',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerTextContainer: {
        marginLeft: 12,
    },
    title: {
        color: '#111111',
        fontSize: 18,
        fontWeight: '800',
        letterSpacing: -0.5,
    },
    subtitle: {
        color: '#666666',
        fontSize: 12,
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    statsGrid: {
        flexDirection: 'row',
        marginBottom: 20,
    },
    statCell: {
        flex: 1,
    },
    primaryStatCell: {
        flex: 1.5,
    },
    statLabel: {
        color: '#666666',
        fontSize: 11,
        fontWeight: '700',
        letterSpacing: 0.5,
        marginBottom: 4,
    },
    statValue: {
        color: '#111111',
        fontSize: 32,
        fontWeight: '800',
        letterSpacing: -1,
    },
    statValueOrange: {
        color: '#FF5722',
        fontSize: 36,
        fontWeight: '800',
        letterSpacing: -1,
    },
    unit: {
        fontSize: 16,
        fontWeight: '600',
        color: '#666666',
    },
    statsGridSmall: {
        flexDirection: 'row',
        marginBottom: 20,
        paddingTop: 16,
        borderTopWidth: StyleSheet.hairlineWidth,
        borderColor: '#EAEAEE',
    },
    statCellSmall: {
        flex: 1,
    },
    statValueSmall: {
        color: '#111111',
        fontSize: 20,
        fontWeight: '700',
        letterSpacing: -0.5,
    },
    footerButton: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 16,
        borderTopWidth: StyleSheet.hairlineWidth,
        borderColor: '#EAEAEE',
    },
    footerButtonText: {
        color: '#111111',
        fontSize: 14,
        fontWeight: '600',
    },
});
