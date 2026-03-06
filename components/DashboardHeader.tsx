import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Upload, Plane, Settings, Users } from 'lucide-react-native';

interface DashboardHeaderProps {
    name: string;
    subtitle: string;
}

export function DashboardHeader({ name, subtitle }: DashboardHeaderProps) {
    return (
        <View style={styles.container}>
            {/* Profile Row */}
            <View style={styles.profileRow}>
                <View style={styles.avatarContainer}>
                    <Text style={styles.avatarText}>AM</Text>
                </View>
                <View style={styles.textContainer}>
                    <Text style={styles.name}>{name}</Text>
                    <Text style={styles.subtitle}>{subtitle}</Text>
                </View>
                <TouchableOpacity style={styles.closeButton}>
                    <Text style={styles.closeText}>✕</Text>
                </TouchableOpacity>
            </View>

            {/* Action Buttons */}
            <View style={styles.actionsRow}>
                <TouchableOpacity style={styles.actionButton}>
                    <Users size={16} color="#FFFFFF" style={styles.icon} />
                    <Text style={styles.actionText}>Flighty Friends</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton}>
                    <Settings size={16} color="#FFFFFF" style={styles.icon} />
                    <Text style={styles.actionText}>Settings</Text>
                </TouchableOpacity>
            </View>

            {/* Tabs */}
            <View style={styles.tabsRow}>
                <TouchableOpacity style={styles.activeTab}>
                    <Text style={styles.activeTabText}>ALL-TIME</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.tab}>
                    <Text style={styles.tabText}>2026</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.tab}>
                    <Text style={styles.tabText}>2025</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.tab}>
                    <Text style={styles.tabText}>2024</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.tab}>
                    <Text style={styles.tabText}>2023</Text>
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
        backgroundColor: '#8DF5AA',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    avatarText: {
        color: '#000',
        fontSize: 18,
        fontWeight: '600',
    },
    textContainer: {
        flex: 1,
    },
    name: {
        color: '#FFF',
        fontSize: 22,
        fontWeight: '700',
        marginBottom: 2,
    },
    subtitle: {
        color: '#A0A0A0',
        fontSize: 14,
    },
    closeButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#2A2A2A',
        justifyContent: 'center',
        alignItems: 'center',
    },
    closeText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '500',
    },
    actionsRow: {
        flexDirection: 'row',
        marginBottom: 24,
        gap: 12,
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#2A2A2A',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
    },
    icon: {
        marginRight: 6,
    },
    actionText: {
        color: '#FFF',
        fontSize: 14,
        fontWeight: '500',
    },
    tabsRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    activeTab: {
        backgroundColor: '#333',
        paddingVertical: 6,
        paddingHorizontal: 14,
        borderRadius: 16,
        marginRight: 16,
    },
    activeTabText: {
        color: '#FFF',
        fontSize: 12,
        fontWeight: '600',
        letterSpacing: 0.5,
    },
    tab: {
        marginRight: 16,
    },
    tabText: {
        color: '#A0A0A0',
        fontSize: 14,
        fontWeight: '500',
    },
});
