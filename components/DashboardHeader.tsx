import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Settings, Plus, BookOpen } from 'lucide-react-native';
import { useAppStore } from '@/store/useAppStore';
import { useRouter } from 'expo-router';

export function DashboardHeader() {
    const profileName = useAppStore((state) => state.profileName);
    const router = useRouter();

    // Get initials for avatar
    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .substring(0, 2)
            .toUpperCase();
    };

    return (
        <View style={styles.container}>
            {/* Profile Row */}
            <View style={styles.profileRow}>
                <View style={styles.avatarContainer}>
                    <Text style={styles.avatarText}>{profileName ? getInitials(profileName) : 'PT'}</Text>
                </View>
                <View style={styles.textContainer}>
                    <Text style={styles.name}>{profileName || 'Trainee Pilot'}</Text>
                    <Text style={styles.subtitle}>Logbook Dashboard</Text>
                </View>
                <TouchableOpacity style={styles.closeButton} onPress={() => router.push('/add-flight')}>
                    <Plus size={20} color="#FFFFFF" />
                </TouchableOpacity>
            </View>

            {/* Action Buttons */}
            <View style={styles.actionsRow}>
                <TouchableOpacity style={styles.actionButton}>
                    <BookOpen size={16} color="#444" style={styles.icon} />
                    <Text style={styles.actionText}>UK Licenses</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton}>
                    <Settings size={16} color="#444" style={styles.icon} />
                    <Text style={styles.actionText}>Settings</Text>
                </TouchableOpacity>
            </View>

            {/* Tabs */}
            <View style={styles.tabsRow}>
                <TouchableOpacity style={styles.activeTab}>
                    <Text style={styles.activeTabText}>ALL-TIME</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.tab}>
                    <Text style={styles.tabText}>PPL</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.tab}>
                    <Text style={styles.tabText}>CPL</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 16,
        paddingTop: 8,
        paddingBottom: 16,
        backgroundColor: '#FFFFFF',
    },
    profileRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    avatarContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#FF5722', // Hazard Orange
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    avatarText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: '700',
    },
    textContainer: {
        flex: 1,
    },
    name: {
        color: '#111111',
        fontSize: 22,
        fontWeight: '800',
        marginBottom: 2,
        letterSpacing: -0.5,
    },
    subtitle: {
        color: '#666666',
        fontSize: 14,
        fontWeight: '500',
    },
    closeButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#FF5722',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: "#FF5722",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    actionsRow: {
        flexDirection: 'row',
        marginBottom: 24,
        gap: 12,
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F5F5F7',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 8, // More rigid, less bubbly
    },
    icon: {
        marginRight: 6,
    },
    actionText: {
        color: '#444444',
        fontSize: 14,
        fontWeight: '600',
    },
    tabsRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    activeTab: {
        backgroundColor: '#111111',
        paddingVertical: 6,
        paddingHorizontal: 14,
        borderRadius: 8,
        marginRight: 16,
    },
    activeTabText: {
        color: '#FFFFFF',
        fontSize: 12,
        fontWeight: '700',
        letterSpacing: 0.5,
    },
    tab: {
        marginRight: 16,
    },
    tabText: {
        color: '#666666',
        fontSize: 14,
        fontWeight: '600',
    },
});
