import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { useAppStore } from '@/store/useAppStore';
import { Plus, Minus, X } from 'lucide-react-native';

export default function AddFlightScreen() {
    const router = useRouter();
    const addFlight = useAppStore((state) => state.addFlight);

    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
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
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>New Flight</Text>
                <TouchableOpacity onPress={() => router.back()} style={styles.closeBtn}>
                    <X size={24} color="#111111" />
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.container} contentContainerStyle={styles.content}>
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>DATE & AIRCRAFT</Text>

                    <View style={styles.formRow}>
                        <View style={[styles.formGroup, styles.flex1, { marginRight: 16 }]}>
                            <Text style={styles.label}>DATE</Text>
                            <TextInput
                                style={styles.input}
                                value={date}
                                onChangeText={setDate}
                                placeholder="YYYY-MM-DD"
                                placeholderTextColor="#A0A0A0"
                            />
                        </View>
                        <View style={[styles.formGroup, styles.flex1]}>
                            <Text style={styles.label}>AIRCRAFT</Text>
                            <TextInput
                                style={styles.input}
                                value={aircraft}
                                onChangeText={setAircraft}
                                placeholder="e.g. C172"
                                placeholderTextColor="#A0A0A0"
                                autoCapitalize="characters"
                            />
                        </View>
                    </View>
                </View>

                <View style={styles.section}>
                    <View style={styles.sectionHeaderRow}>
                        <Text style={styles.sectionTitle}>ROUTE WAYPOINTS</Text>
                        <TouchableOpacity onPress={handleAddWaypoint} style={styles.addBtn}>
                            <Plus size={14} color="#FF5722" />
                            <Text style={styles.addBtnText}>Add</Text>
                        </TouchableOpacity>
                    </View>

                    {waypoints.map((wp, index) => (
                        <View key={index} style={styles.waypointRow}>
                            <View style={[styles.formGroup, styles.flex1]}>
                                <TextInput
                                    style={styles.input}
                                    value={wp}
                                    onChangeText={(text) => updateWaypoint(text, index)}
                                    placeholder={index === 0 ? "Origin ICAO" : index === waypoints.length - 1 ? "Destination ICAO" : `Waypoint ICAO`}
                                    autoCapitalize="characters"
                                    maxLength={4}
                                    placeholderTextColor="#A0A0A0"
                                />
                            </View>
                            {waypoints.length > 2 && (
                                <TouchableOpacity onPress={() => handleRemoveWaypoint(index)} style={styles.removeBtn}>
                                    <Minus size={20} color="#666666" />
                                </TouchableOpacity>
                            )}
                        </View>
                    ))}
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>LOGGING DETAILS</Text>
                    <View style={styles.formRow}>
                        <View style={[styles.formGroup, styles.flex1, { marginRight: 16 }]}>
                            <Text style={styles.label}>DURATION (HRS)</Text>
                            <TextInput
                                style={styles.input}
                                value={duration}
                                onChangeText={setDuration}
                                keyboardType="decimal-pad"
                                placeholder="e.g. 1.5"
                                placeholderTextColor="#A0A0A0"
                            />
                        </View>
                        <View style={[styles.formGroup, styles.flex1]}>
                            <Text style={styles.label}>COST (£)</Text>
                            <TextInput
                                style={styles.input}
                                value={cost}
                                onChangeText={setCost}
                                keyboardType="decimal-pad"
                                placeholder="e.g. 120"
                                placeholderTextColor="#A0A0A0"
                            />
                        </View>
                    </View>
                </View>

                <TouchableOpacity style={styles.submitButton} onPress={handleSave}>
                    <Text style={styles.submitButtonText}>Save Flight</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 16,
        paddingHorizontal: 20,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#EAEAEE',
    },
    headerTitle: {
        color: '#111111',
        fontSize: 18,
        fontWeight: '700',
    },
    closeBtn: {
        position: 'absolute',
        right: 20,
    },
    container: {
        flex: 1,
        backgroundColor: '#F9F9F9',
    },
    content: {
        padding: 20,
    },
    section: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 16,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#EAEAEE',
    },
    sectionHeaderRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    sectionTitle: {
        color: '#666666',
        fontSize: 11,
        fontWeight: '700',
        letterSpacing: 1,
        marginBottom: 16,
    },
    formRow: {
        flexDirection: 'row',
    },
    formGroup: {
        marginBottom: 12,
    },
    flex1: {
        flex: 1,
    },
    label: {
        color: '#A0A0A0',
        fontSize: 10,
        fontWeight: '700',
        letterSpacing: 0.5,
        marginBottom: 6,
    },
    input: {
        backgroundColor: '#FFFFFF',
        color: '#111111',
        borderWidth: 1,
        borderColor: '#EAEAEE',
        borderRadius: 8,
        padding: 14,
        fontSize: 16,
        fontWeight: '500',
    },
    waypointRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    addBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 6,
        backgroundColor: '#FFF0ED',
        borderRadius: 6,
    },
    addBtnText: {
        color: '#FF5722',
        fontSize: 12,
        fontWeight: '700',
        marginLeft: 4,
    },
    removeBtn: {
        padding: 10,
        marginLeft: 8,
        marginBottom: 12,
    },
    submitButton: {
        backgroundColor: '#FF5722',
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
        marginTop: 8,
        marginBottom: 40,
        shadowColor: '#FF5722',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    submitButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '700',
    },
});
