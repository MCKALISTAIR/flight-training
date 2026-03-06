import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useAppStore } from '@/store/useAppStore';
import { Plus, Minus } from 'lucide-react-native';

export default function AddFlightScreen() {
    const router = useRouter();
    const addFlight = useAppStore((state) => state.addFlight);

    const [date, setDate] = useState('2026-03-06');
    const [aircraft, setAircraft] = useState('');
    const [waypoints, setWaypoints] = useState(['', '']);
    const [duration, setDuration] = useState('');
    const [cost, setCost] = useState('');

    const updateWaypoint = (text: string, index: number) => {
        const newWaypoints = [...waypoints];
        newWaypoints[index] = text.toUpperCase();
        setWaypoints(newWaypoints);
    };

    const handleAddWaypoint = () => {
        setWaypoints([...waypoints, '']);
    };

    const handleRemoveWaypoint = (index: number) => {
        if (waypoints.length <= 2) return;
        const newWaypoints = [...waypoints];
        newWaypoints.splice(index, 1);
        setWaypoints(newWaypoints);
    };

    const handleSave = () => {
        const validWaypoints = waypoints.filter(wp => wp.trim().length > 0);

        if (!aircraft || validWaypoints.length < 2 || !duration) {
            alert('Please fill out aircraft, at least two waypoints, and duration.');
            return;
        }

        addFlight({
            date,
            aircraft,
            waypoints: validWaypoints,
            durationHours: parseFloat(duration),
            cost: cost ? parseFloat(cost) : undefined,
        });

        router.back();
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <Text style={styles.headerTitle}>Log a Flight</Text>

            <View style={styles.formGroup}>
                <Text style={styles.label}>DATE</Text>
                <TextInput
                    style={styles.input}
                    value={date}
                    onChangeText={setDate}
                    placeholder="YYYY-MM-DD"
                    placeholderTextColor="#666"
                />
            </View>

            <View style={styles.waypointsContainer}>
                <View style={styles.waypointHeaderRow}>
                    <Text style={styles.label}>ROUTE WAYPOINTS (ICAO)</Text>
                    <TouchableOpacity onPress={handleAddWaypoint} style={styles.addWaypointBtn}>
                        <Plus size={16} color="#8DF5AA" />
                        <Text style={styles.addWaypointText}>Add</Text>
                    </TouchableOpacity>
                </View>

                {waypoints.map((wp, index) => (
                    <View key={index} style={styles.waypointRow}>
                        <View style={[styles.formGroup, styles.flex1, { marginBottom: 12 }]}>
                            <TextInput
                                style={styles.input}
                                value={wp}
                                onChangeText={(text) => updateWaypoint(text, index)}
                                placeholder={index === 0 ? "Origin" : index === waypoints.length - 1 ? "Destination" : `Waypoint ${index + 1}`}
                                autoCapitalize="characters"
                                maxLength={4}
                                placeholderTextColor="#666"
                            />
                        </View>
                        {waypoints.length > 2 && (
                            <TouchableOpacity onPress={() => handleRemoveWaypoint(index)} style={styles.removeWaypointBtn}>
                                <Minus size={20} color="#FF6666" />
                            </TouchableOpacity>
                        )}
                    </View>
                ))}
            </View>

            <View style={styles.formGroup}>
                <Text style={styles.label}>AIRCRAFT TYPE</Text>
                <TextInput
                    style={styles.input}
                    value={aircraft}
                    onChangeText={setAircraft}
                    placeholder="e.g. Cessna 152"
                    placeholderTextColor="#666"
                />
            </View>

            <View style={styles.formRow}>
                <View style={[styles.formGroup, styles.flex1, { marginRight: 16 }]}>
                    <Text style={styles.label}>DURATION (HOURS)</Text>
                    <TextInput
                        style={styles.input}
                        value={duration}
                        onChangeText={setDuration}
                        keyboardType="decimal-pad"
                        placeholder="e.g. 1.5"
                        placeholderTextColor="#666"
                    />
                </View>
                <View style={[styles.formGroup, styles.flex1]}>
                    <Text style={styles.label}>COST (£) (OPTIONAL)</Text>
                    <TextInput
                        style={styles.input}
                        value={cost}
                        onChangeText={setCost}
                        keyboardType="decimal-pad"
                        placeholder="e.g. 120"
                        placeholderTextColor="#666"
                    />
                </View>
            </View>

            <TouchableOpacity style={styles.submitButton} onPress={handleSave}>
                <Text style={styles.submitButtonText}>Save Flight</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1E1E1E',
    },
    content: {
        padding: 24,
    },
    headerTitle: {
        color: '#FFF',
        fontSize: 28,
        fontWeight: '700',
        marginBottom: 32,
    },
    formGroup: {
        marginBottom: 24,
    },
    waypointsContainer: {
        marginBottom: 12,
    },
    waypointHeaderRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        marginBottom: 12,
    },
    addWaypointBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 4,
        backgroundColor: 'rgba(141, 245, 170, 0.1)',
        borderRadius: 8,
    },
    addWaypointText: {
        color: '#8DF5AA',
        fontSize: 12,
        fontWeight: '600',
        marginLeft: 4,
    },
    waypointRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    removeWaypointBtn: {
        padding: 12,
        marginLeft: 8,
        backgroundColor: '#2A2A2A',
        borderRadius: 8,
        marginBottom: 12,
    },
    flex1: {
        flex: 1,
    },
    formRow: {
        flexDirection: 'row',
    },
    label: {
        color: '#8DF5AA',
        fontSize: 12,
        fontWeight: '700',
        letterSpacing: 1,
        marginBottom: 8,
    },
    input: {
        backgroundColor: '#2A2A2A',
        color: '#FFF',
        borderRadius: 8,
        padding: 16,
        fontSize: 16,
    },
    submitButton: {
        backgroundColor: '#8DF5AA',
        borderRadius: 8,
        padding: 16,
        alignItems: 'center',
        marginTop: 16,
    },
    submitButtonText: {
        color: '#000',
        fontSize: 16,
        fontWeight: '700',
    },
});
