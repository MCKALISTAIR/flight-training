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
                <Text style={styles.title}>Pilot Profile.</Text>
                <Text style={styles.subtitle}>Enter your name to initialize your modern logbook, track flight hours, and manage aircraft stats.</Text>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>FULL NAME</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Tap to enter name"
                        placeholderTextColor="#A0A0A0"
                        value={name}
                        onChangeText={setName}
                        autoCapitalize="words"
                        autoCorrect={false}
                        autoFocus={true}
                    />
                </View>

                <TouchableOpacity
                    style={[styles.button, !name.trim() && styles.buttonDisabled]}
                    onPress={handleComplete}
                    disabled={!name.trim()}
                >
                    <Text style={styles.buttonText}>Initialize Logbook</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 32,
    },
    title: {
        color: '#111111',
        fontSize: 42,
        fontWeight: '800',
        marginBottom: 16,
        letterSpacing: -1.5,
    },
    subtitle: {
        color: '#666666',
        fontSize: 16,
        lineHeight: 24,
        marginBottom: 48,
        fontWeight: '500',
    },
    inputContainer: {
        marginBottom: 40,
    },
    label: {
        color: '#A0A0A0',
        fontSize: 12,
        fontWeight: '700',
        letterSpacing: 1.5,
        marginBottom: 8,
    },
    input: {
        color: '#111111',
        fontSize: 24,
        fontWeight: '600',
        borderBottomWidth: 2,
        borderBottomColor: '#EAEAEE',
        paddingVertical: 12,
    },
    button: {
        backgroundColor: '#FF5722',
        paddingVertical: 18,
        borderRadius: 12,
        alignItems: 'center',
        shadowColor: '#FF5722',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 5,
    },
    buttonDisabled: {
        backgroundColor: '#F2F2F2',
        shadowOpacity: 0,
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: '700',
    },
});
