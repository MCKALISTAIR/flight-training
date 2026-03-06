import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

interface FlightListItemProps {
    airlineCode: string;
    airlineColor: string;
    flightNumber: string;
    routeCode: string;
    date: string;
    origin: string;
    destination: string;
}

export function FlightListItem({
    airlineCode,
    airlineColor,
    flightNumber,
    routeCode,
    date,
    origin,
    destination,
}: FlightListItemProps) {
    return (
        <View style={styles.container}>
            <View style={[styles.airlineIcon, { backgroundColor: airlineColor }]}>
                <Text style={styles.airlineText}>{airlineCode}</Text>
            </View>
            <View style={styles.content}>
                <View style={styles.topRow}>
                    <Text style={styles.flightNumber}>{flightNumber}</Text>
                    <Text style={styles.routeCode}>{routeCode}</Text>
                    <Text style={styles.date}>{date}</Text>
                </View>
                <Text style={styles.routeNames}>
                    {origin} to {destination}
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#333',
    },
    airlineIcon: {
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    airlineText: {
        color: '#FFF',
        fontSize: 12,
        fontWeight: '800',
    },
    content: {
        flex: 1,
    },
    topRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    flightNumber: {
        color: '#A0A0A0',
        fontSize: 13,
        fontWeight: '500',
        marginRight: 8,
    },
    routeCode: {
        color: '#666',
        fontSize: 13,
        flex: 1,
    },
    date: {
        color: '#A0A0A0',
        fontSize: 13,
    },
    routeNames: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '600',
    },
});
