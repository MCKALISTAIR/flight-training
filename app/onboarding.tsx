import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useAppStore } from '@/store/useAppStore';

export default function OnboardingScreen() {
    const [name, setName] = useState('');
    const setProfileName = useAppStore((state) => state.setProfileName);
    const completeOnboarding = useAppStore((state) => state.completeOnboarding);
    const router = useRouter();

    const handleComplete = () => {
        if (name.trim()) {
            setProfileName(name.trim());
            completeOnboarding();
            router.replace('/(tabs)');
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <View style={styles.content}>
                <Text style={styles.title}>Welcome Pilot.</Text>
                <Text style={styles.subtitle}>Enter your name to begin logging your flight hours, aircraft stats, and training costs.</Text>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>FULL NAME</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Tap here"
                        placeholderTextColor="#666"
                        value={name}
                        onChangeText={setName}
                        autoCapitalize="words"
                        autoCorrect={false}
                    />
                </View>

                <TouchableOpacity
                    style={[styles.button, !name.trim() && styles.buttonDisabled]}
                    onPress={handleComplete}
                    disabled={!name.trim()}
                >
                    <Text style={styles.buttonText}>Start Logging</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 24,
    },
    title: {
        color: '#FFF',
        fontSize: 40,
        fontWeight: '800',
        marginBottom: 16,
        letterSpacing: -1,
    },
    subtitle: {
        color: '#A0A0A0',
        fontSize: 16,
        lineHeight: 24,
        marginBottom: 48,
    },
    inputContainer: {
        marginBottom: 32,
    },
    label: {
        color: '#666',
        fontSize: 12,
        fontWeight: '700',
        letterSpacing: 1.5,
        marginBottom: 8,
    },
    input: {
        color: '#FFF',
        fontSize: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#333',
        paddingVertical: 12,
    },
    button: {
        backgroundColor: '#8DF5AA',
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
        shadowColor: '#8DF5AA',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 5,
    },
    buttonDisabled: {
        backgroundColor: '#333',
        shadowOpacity: 0,
    },
    buttonText: {
        color: '#000',
        fontSize: 18,
        fontWeight: '700',
    },
});
