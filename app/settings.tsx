import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, SafeAreaView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useAppStore } from '@/store/useAppStore';
import { X, Save, Trash2 } from 'lucide-react-native';

export default function SettingsScreen() {
    const router = useRouter();
    const store = useAppStore();

    const [name, setName] = useState(store.profileName || '');
    const [aircraft, setAircraft] = useState(store.defaultAircraft || '');
    const [cost, setCost] = useState(store.defaultCostPerHour ? store.defaultCostPerHour.toString() : '');

    const handleSave = () => {
        if (!name.trim()) {
            Alert.alert('Error', 'Please enter a pilot name.');
            return;
        }

        store.setProfileName(name.trim());
        store.setDefaultAircraft(aircraft.trim().toUpperCase());
        store.setDefaultCostPerHour(cost ? parseFloat(cost) : 0);

        router.back();
    };

    const handleReset = () => {
        Alert.alert(
            'Reset Logbook',
            'Are you sure you want to delete all flight logs and settings? This action cannot be undone.',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Reset Everything',
                    style: 'destructive',
                    onPress: () => {
                        store.resetStore();
                        router.replace('/onboarding');
                    }
                }
            ]
        );
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Settings</Text>
                <TouchableOpacity onPress={() => router.back()} style={styles.closeBtn}>
                    <X size={24} color="#111111" />
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.container} contentContainerStyle={styles.content}>
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>PILOT PROFILE</Text>
                    <View style={styles.formGroup}>
                        <Text style={styles.label}>FULL NAME</Text>
                        <TextInput
                            style={styles.input}
                            value={name}
                            onChangeText={setName}
                            placeholder="Enter pilot name"
                            placeholderTextColor="#A0A0A0"
                            autoCorrect={false}
                        />
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>LOGGING DEFAULTS</Text>
                    <View style={styles.formGroup}>
                        <Text style={styles.label}>DEFAULT AIRCRAFT REGISTRATION</Text>
                        <TextInput
                            style={styles.input}
                            value={aircraft}
                            onChangeText={setAircraft}
                            placeholder="e.g. G-BFFF or N172SP"
                            placeholderTextColor="#A0A0A0"
                            autoCapitalize="characters"
                            autoCorrect={false}
                        />
                    </View>
                    <View style={[styles.formGroup, { marginTop: 12 }]}>
                        <Text style={styles.label}>DEFAULT HOURLY RATE (£/HR)</Text>
                        <TextInput
                            style={styles.input}
                            value={cost}
                            onChangeText={setCost}
                            keyboardType="decimal-pad"
                            placeholder="e.g. 150.00"
                            placeholderTextColor="#A0A0A0"
                        />
                    </View>
                </View>

                <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                    <Save size={18} color="#FFFFFF" style={{ marginRight: 8 }} />
                    <Text style={styles.saveButtonText}>Save Settings</Text>
                </TouchableOpacity>

                <View style={styles.dangerZone}>
                    <Text style={styles.dangerZoneTitle}>DANGER ZONE</Text>
                    <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
                        <Trash2 size={16} color="#FF3B30" style={{ marginRight: 6 }} />
                        <Text style={styles.resetButtonText}>Reset All Logbook Data</Text>
                    </TouchableOpacity>
                </View>
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
    sectionTitle: {
        color: '#666666',
        fontSize: 11,
        fontWeight: '700',
        letterSpacing: 1,
        marginBottom: 16,
    },
    formGroup: {
        marginBottom: 8,
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
    saveButton: {
        flexDirection: 'row',
        backgroundColor: '#FF5722',
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 8,
        shadowColor: '#FF5722',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    saveButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '700',
    },
    dangerZone: {
        marginTop: 32,
        borderTopWidth: 1,
        borderColor: '#EAEAEE',
        paddingTop: 24,
    },
    dangerZoneTitle: {
        color: '#FF3B30',
        fontSize: 11,
        fontWeight: '700',
        letterSpacing: 1,
        marginBottom: 12,
    },
    resetButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFF2F2',
        borderColor: '#FFD1D1',
        borderWidth: 1,
        borderRadius: 8,
        paddingVertical: 12,
    },
    resetButtonText: {
        color: '#FF3B30',
        fontSize: 14,
        fontWeight: '600',
    },
});
