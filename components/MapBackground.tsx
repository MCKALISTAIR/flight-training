import React from 'react';
import { StyleSheet, View } from 'react-native';
import MapView, { PROVIDER_DEFAULT } from 'react-native-maps';

export function MapBackground() {
    return (
        <View style={StyleSheet.absoluteFillObject}>
            <MapView
                style={StyleSheet.absoluteFillObject}
                provider={PROVIDER_DEFAULT}
                initialRegion={{
                    latitude: 48.8566,
                    longitude: 2.3522,
                    latitudeDelta: 25,
                    longitudeDelta: 25,
                }}
                userInterfaceStyle="dark"
                mapType="hybrid"
            />
        </View>
    );
}
