import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { useAppStore } from '@/store/useAppStore';
import { Plus, Minus, X } from 'lucide-react-native';

export default function AddFlightScreen() {
    const router = useRouter();
    const addFlight = useAppStore((state) => state.addFlight);
    const defaultAircraft = useAppStore((state) => state.defaultAircraft);
    const defaultCostPerHour = useAppStore((state) => state.defaultCostPerHour);

    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [aircraft, setAircraft] = useState(defaultAircraft || '');
    const [waypoints, setWaypoints] = useState(['', '']);
    const [duration, setDuration] = useState('');
    const [cost, setCost] = useState('');
    const [flightType, setFlightType] = useState<'pic' | 'dual' | 'solo'>('pic');
    const [isNight, setIsNight] = useState(false);
    const [isIFR, setIsIFR] = useState(false);
    const [landings, setLandings] = useState(1);
    const [notes, setNotes] = useState('');

    // Auto calculate cost when duration updates, if a default hourly rate is set
    useEffect(() => {
        if (defaultCostPerHour && duration) {
            const hours = parseFloat(duration);
            if (!isNaN(hours)) {
                setCost((hours * defaultCostPerHour).toFixed(2));
            } else {
                setCost('');
            }
        }
    }, [duration, defaultCostPerHour]);

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

    const incrementLandings = () => setLandings((l) => l + 1);
    const decrementLandings = () => setLandings((l) => Math.max(1, l - 1));

    const handleSave = () => {
        const validWaypoints = waypoints.filter(wp => wp.trim().length > 0);

        if (!aircraft || validWaypoints.length < 2 || !duration) {
            alert('Please fill out aircraft, at least two waypoints, and duration.');
            return;
        }

        const durationVal = parseFloat(duration);
        if (isNaN(durationVal) || durationVal <= 0) {
            alert('Please enter a valid flight duration.');
            return;
        }

        addFlight({
            date,
            aircraft,
            waypoints: validWaypoints,
            durationHours: durationVal,
            cost: cost ? parseFloat(cost) : undefined,
            flightType,
            isNight,
            isIFR,
            landings,
            notes: notes.trim() || undefined,
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
                    <Text style={styles.sectionTitle}>FLIGHT CLASSIFICATION</Text>
                    
                    <Text style={styles.label}>PILOT ROLE / FLIGHT TYPE</Text>
                    <View style={styles.segmentedRow}>
                        {(['pic', 'dual', 'solo'] as const).map((type) => (
                            <TouchableOpacity
                                key={type}
                                style={[
                                    styles.segmentButton,
                                    flightType === type && styles.segmentButtonActive
                                ]}
                                onPress={() => setFlightType(type)}
                            >
                                <Text style={[
                                    styles.segmentButtonText,
                                    flightType === type && styles.segmentButtonTextActive
                                ]}>
                                    {type === 'pic' ? 'PIC' : type.toUpperCase()}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    <View style={styles.toggleRow}>
                        <View>
                            <Text style={styles.toggleTitle}>Night Flight</Text>
                            <Text style={styles.toggleSubtitle}>Log hours flown after sunset</Text>
                        </View>
                        <TouchableOpacity
                            style={[styles.customToggle, isNight && styles.customToggleActive]}
                            onPress={() => setIsNight(!isNight)}
                        >
                            <View style={[styles.customToggleCircle, isNight && styles.customToggleCircleActive]} />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.toggleRow}>
                        <View>
                            <Text style={styles.toggleTitle}>IFR Rules</Text>
                            <Text style={styles.toggleSubtitle}>Log under Instrument Flight Rules</Text>
                        </View>
                        <TouchableOpacity
                            style={[styles.customToggle, isIFR && styles.customToggleActive]}
                            onPress={() => setIsIFR(!isIFR)}
                        >
                            <View style={[styles.customToggleCircle, isIFR && styles.customToggleCircleActive]} />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.counterSection}>
                        <View>
                            <Text style={styles.label}>NUMBER OF LANDINGS</Text>
                            <Text style={styles.counterSub}>Standard landings for currency</Text>
                        </View>
                        <View style={styles.counterRow}>
                            <TouchableOpacity onPress={decrementLandings} style={styles.counterBtn}>
                                <Minus size={16} color="#111111" />
                            </TouchableOpacity>
                            <Text style={styles.counterValue}>{landings}</Text>
                            <TouchableOpacity onPress={incrementLandings} style={styles.counterBtn}>
                                <Plus size={16} color="#111111" />
                            </TouchableOpacity>
                        </View>
                    </View>
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
                                placeholder={defaultCostPerHour ? "Estimated" : "e.g. 120"}
                                placeholderTextColor="#A0A0A0"
                            />
                        </View>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>FLIGHT MEMO / NOTES</Text>
                    <TextInput
                        style={styles.notesInput}
                        value={notes}
                        onChangeText={setNotes}
                        placeholder="Log exercise numbers, route weather details, or general notes..."
                        placeholderTextColor="#A0A0A0"
                        multiline={true}
                        numberOfLines={4}
                    />
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
        marginBottom: 12,
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
    },
    segmentedRow: {
        flexDirection: 'row',
        backgroundColor: '#F5F5F7',
        borderRadius: 8,
        padding: 4,
        marginBottom: 18,
    },
    segmentButton: {
        flex: 1,
        paddingVertical: 10,
        alignItems: 'center',
        borderRadius: 6,
    },
    segmentButtonActive: {
        backgroundColor: '#FFFFFF',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    segmentButtonText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#666666',
    },
    segmentButtonTextActive: {
        color: '#111111',
        fontWeight: '700',
    },
    toggleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#EAEAEE',
    },
    toggleTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#111111',
    },
    toggleSubtitle: {
        fontSize: 11,
        color: '#A0A0A0',
        marginTop: 2,
    },
    customToggle: {
        width: 48,
        height: 28,
        borderRadius: 14,
        backgroundColor: '#EAEAEE',
        padding: 2,
        justifyContent: 'center',
    },
    customToggleActive: {
        backgroundColor: '#FF5722',
    },
    customToggleCircle: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#FFFFFF',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.15,
        shadowRadius: 1.5,
        elevation: 2,
    },
    customToggleCircleActive: {
        alignSelf: 'flex-end',
    },
    counterSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 16,
    },
    counterSub: {
        fontSize: 10,
        color: '#A0A0A0',
        marginTop: 2,
    },
    counterRow: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#EAEAEE',
        borderRadius: 8,
        backgroundColor: '#F5F5F7',
        padding: 4,
    },
    counterBtn: {
        width: 32,
        height: 32,
        borderRadius: 6,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 1,
        elevation: 1,
    },
    counterValue: {
        fontSize: 16,
        fontWeight: '700',
        color: '#111111',
        paddingHorizontal: 16,
        textAlign: 'center',
        minWidth: 40,
    },
    notesInput: {
        backgroundColor: '#FFFFFF',
        color: '#111111',
        borderWidth: 1,
        borderColor: '#EAEAEE',
        borderRadius: 8,
        padding: 14,
        fontSize: 16,
        fontWeight: '500',
        minHeight: 100,
        textAlignVertical: 'top',
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
