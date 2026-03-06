import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

interface FlightListItemProps {
    airlineCode: string;
    airlineColor: string;
    flightNumber: string;
    routeCode: string;
    date: string;
    waypoints: string[];
}

export function FlightListItem({
    airlineCode,
    flightNumber,
    date,
    waypoints,
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
                <Text style={styles.typeText}>VFR</Text>
            </View>

            <View style={styles.routeCol}>
                <Text style={styles.routeText}>
                    {waypoints.join(' → ')}
                </Text>
            </View>

            <View style={styles.durationCol}>
                <Text style={styles.durationText}>--</Text>
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
        width: 70,
    },
    dateText: {
        color: '#666666',
        fontSize: 13,
        fontWeight: '500',
    },
    aircraftCol: {
        width: 100,
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
    },
    routeCol: {
        flex: 1,
    },
    routeText: {
        color: '#111111',
        fontSize: 14,
        fontWeight: '600',
    },
    durationCol: {
        width: 40,
        alignItems: 'flex-end',
    },
    durationText: {
        color: '#111111',
        fontSize: 14,
        fontWeight: '600',
    },
});
