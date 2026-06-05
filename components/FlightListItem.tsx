import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

interface FlightListItemProps {
    airlineCode: string;
    airlineColor: string;
    flightNumber: string;
    routeCode: string;
    date: string;
    waypoints: string[];
    durationHours: number;
    flightType?: 'dual' | 'solo' | 'pic';
    isNight?: boolean;
    isIFR?: boolean;
    landings?: number;
}

export function FlightListItem({
    flightNumber,
    date,
    waypoints,
    durationHours,
    flightType = 'pic',
    isNight = false,
    isIFR = false,
    landings = 1,
}: FlightListItemProps) {

    // Format date nicely (e.g. from YYYY-MM-DD to DD.MM.YY)
    const formattedDate = date.split('-').reverse().join('.');

    return (
        <View style={styles.container}>
            <View style={styles.dateCol}>
                <Text style={styles.dateText}>{formattedDate}</Text>
            </View>

            <View style={styles.aircraftCol}>
                <Text style={styles.aircraftText}>{flightNumber}</Text>
                <Text style={styles.typeText}>
                    {isIFR ? 'IFR' : 'VFR'} • {flightType.toUpperCase()}
                </Text>
            </View>

            <View style={styles.routeCol}>
                <Text style={styles.routeText}>
                    {waypoints.join(' → ')}
                </Text>
                <View style={styles.subRouteRow}>
                    {landings > 1 ? (
                        <Text style={styles.subRouteText}>{landings} Ldgs</Text>
                    ) : null}
                    {isNight ? (
                        <Text style={[styles.subRouteText, styles.nightText]}>🌙 Night</Text>
                    ) : null}
                </View>
            </View>

            <View style={styles.durationCol}>
                <Text style={styles.durationText}>{durationHours.toFixed(1)}h</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#EAEAEE',
        backgroundColor: '#FFFFFF',
    },
    dateCol: {
        width: 75,
    },
    dateText: {
        color: '#666666',
        fontSize: 13,
        fontWeight: '500',
    },
    aircraftCol: {
        width: 105,
    },
    aircraftText: {
        color: '#111111',
        fontSize: 14,
        fontWeight: '600',
    },
    typeText: {
        color: '#A0A0A0',
        fontSize: 11,
        fontWeight: '500',
        marginTop: 2,
    },
    routeCol: {
        flex: 1,
    },
    routeText: {
        color: '#111111',
        fontSize: 14,
        fontWeight: '600',
    },
    subRouteRow: {
        flexDirection: 'row',
        gap: 6,
        marginTop: 4,
    },
    subRouteText: {
        fontSize: 10,
        color: '#666666',
        backgroundColor: '#F5F5F7',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
        overflow: 'hidden',
        fontWeight: '600',
    },
    nightText: {
        color: '#6200EE',
        backgroundColor: '#F3E8FF',
    },
    durationCol: {
        width: 50,
        alignItems: 'flex-end',
    },
    durationText: {
        color: '#111111',
        fontSize: 14,
        fontWeight: '600',
    },
});
