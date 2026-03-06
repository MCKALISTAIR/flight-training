import React from 'react';
import { StyleSheet, View } from 'react-native';
import MapView, { PROVIDER_DEFAULT, Polyline } from 'react-native-maps';
import { useAppStore } from '@/store/useAppStore';

// Mock database of some common ICAO coordinates for the demo
const AIRPORT_COORDS: Record<string, { latitude: number; longitude: number }> = {
    'EGLL': { latitude: 51.4700, longitude: -0.4543 },
    'EGKK': { latitude: 51.1537, longitude: -0.1821 },
    'EGCC': { latitude: 53.3537, longitude: -2.2750 },
    'EGPH': { latitude: 55.9500, longitude: -3.3725 },
    'EGPF': { latitude: 55.8719, longitude: -4.4331 },
    'EIDW': { latitude: 53.4213, longitude: -6.2701 },
    'EGNT': { latitude: 55.0375, longitude: -1.6917 },
    'EGPE': { latitude: 57.5406, longitude: -4.0475 },
    'EGBB': { latitude: 52.4539, longitude: -1.7480 },
    'EGGD': { latitude: 51.3827, longitude: -2.7191 },
    'EGGW': { latitude: 51.8747, longitude: -0.3683 },
    'EGSS': { latitude: 51.8850, longitude: 0.2350 },
    'EHAM': { latitude: 52.3105, longitude: 4.7683 }, // Amsterdam
    'LFPG': { latitude: 49.0097, longitude: 2.5479 }, // Paris CDG
    'KJFK': { latitude: 40.6413, longitude: -73.7781 }, // JFK
    'KLAS': { latitude: 36.0840, longitude: -115.1536 }, // Las Vegas
    'CYUL': { latitude: 45.4706, longitude: -73.7408 }, // Montreal
};

export function MapBackground() {
    const flights = useAppStore((state) => state.flights);

    return (
        <View style={StyleSheet.absoluteFillObject}>
            <MapView
                style={StyleSheet.absoluteFillObject}
                provider={PROVIDER_DEFAULT}
                initialRegion={{
                    latitude: 54.0, // Center on UK
                    longitude: -2.5,
                    latitudeDelta: 10,
                    longitudeDelta: 10,
                }}
                userInterfaceStyle="dark"
                mapType="hybrid"
            >
                {flights.map(flight => {
                    // Try to resolve standard ICAO codes to coords
                    const coordinates = flight.waypoints
                        .map(wp => AIRPORT_COORDS[wp])
                        .filter(coord => coord !== undefined);

                    if (coordinates.length < 2) return null;

                    return (
                        <Polyline
                            key={flight.id}
                            coordinates={coordinates}
                            strokeColor="rgba(141, 245, 170, 0.7)" // neon vibrant green
                            strokeWidth={3}
                            lineCap="round"
                            lineJoin="round"
                            geodesic={true}
                        />
                    );
                })}
            </MapView>
        </View>
    );
}
