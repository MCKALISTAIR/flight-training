import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Upload, ChevronRight } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

export function PassportCard() {
    return (
        <LinearGradient
            colors={['#1F1160', '#0B297E']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.card}
        >
            <View style={styles.headerRow}>
                <View>
                    <Text style={styles.title}>ALL-TIME FLIGHTY PASSPORT</Text>
                    <Text style={styles.subtitle}>✈ PASSPORT • PASS • PASAPORTE</Text>
                </View>
                <TouchableOpacity>
                    <Upload size={20} color="#FFF" />
                </TouchableOpacity>
            </View>

            <View style={styles.statsGrid}>
                <View style={styles.statCell}>
                    <Text style={styles.statLabel}>FLIGHTS</Text>
                    <Text style={styles.statValue}>25</Text>
                    <Text style={styles.statSubValue}>12 Long Haul</Text>
                </View>
                <View style={styles.statCell}>
                    <Text style={styles.statLabel}>DISTANCE</Text>
                    <Text style={styles.statValue}>62,072 mi</Text>
                    <Text style={styles.statSubValue}>2.5x around the world</Text>
                </View>
            </View>

            <View style={styles.statsGridSmall}>
                <View style={styles.statCellSmall}>
                    <Text style={styles.statLabel}>FLIGHT TIME</Text>
                    <Text style={styles.statValueSmall}>5d 10h</Text>
                </View>
                <View style={styles.statCellSmall}>
                    <Text style={styles.statLabel}>AIRPORTS</Text>
                    <Text style={styles.statValueSmall}>18</Text>
                </View>
                <View style={styles.statCellSmall}>
                    <Text style={styles.statLabel}>AIRLINES</Text>
                    <Text style={styles.statValueSmall}>9</Text>
                </View>
            </View>

            <TouchableOpacity style={styles.footerButton}>
                <Text style={styles.footerButtonText}>All Flight Stats</Text>
                <ChevronRight size={16} color="#FFF" />
            </TouchableOpacity>
        </LinearGradient>
    );
}

export function DelayCard() {
    return (
        <View style={[styles.card, styles.delayCard]}>
            <View style={styles.headerRow}>
                <View>
                    <Text style={styles.delayHugeValue}>4</Text>
                    <Text style={styles.delayTitle}>hours lost from delays</Text>
                    <Text style={styles.delaySubtitle}>Delayed flights averaged 21m late</Text>
                </View>
                <TouchableOpacity>
                    <Upload size={20} color="#FFF" />
                </TouchableOpacity>
            </View>

            <TouchableOpacity style={[styles.footerButton, styles.delayFooter]}>
                <Text style={styles.footerButtonText}>All Delay Stats</Text>
                <ChevronRight size={16} color="#FFF" />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        borderRadius: 16,
        padding: 20,
        marginHorizontal: 16,
        marginBottom: 16,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 24,
    },
    title: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '600',
        letterSpacing: 0.5,
        marginBottom: 4,
    },
    subtitle: {
        color: '#A0B0FF',
        fontSize: 10,
        fontWeight: '700',
        letterSpacing: 1,
    },
    statsGrid: {
        flexDirection: 'row',
        marginBottom: 24,
    },
    statCell: {
        flex: 1,
    },
    statLabel: {
        color: '#A0B0FF',
        fontSize: 11,
        fontWeight: '600',
        letterSpacing: 0.5,
        marginBottom: 4,
    },
    statValue: {
        color: '#FFF',
        fontSize: 32,
        fontWeight: '700',
        marginBottom: 4,
    },
    statSubValue: {
        color: '#A0B0FF',
        fontSize: 13,
    },
    statsGridSmall: {
        flexDirection: 'row',
        marginBottom: 24,
    },
    statCellSmall: {
        flex: 1,
    },
    statValueSmall: {
        color: '#FFF',
        fontSize: 20,
        fontWeight: '700',
    },
    footerButton: {
        backgroundColor: 'rgba(255,255,255,0.1)',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 8,
    },
    footerButtonText: {
        color: '#FFF',
        fontSize: 14,
        fontWeight: '600',
    },
    delayCard: {
        backgroundColor: '#8B1A10',
    },
    delayHugeValue: {
        color: '#FFF',
        fontSize: 56,
        fontWeight: '800',
        lineHeight: 60,
    },
    delayTitle: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 4,
    },
    delaySubtitle: {
        color: '#FFB4A9',
        fontSize: 13,
    },
    delayFooter: {
        backgroundColor: 'rgba(255,255,255,0.15)',
        marginTop: 16,
    },
});
