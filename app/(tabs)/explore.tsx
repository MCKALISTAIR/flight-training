import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { Search, Compass, CloudSun, CheckSquare, ChevronRight, Wind, Eye, Cloud, Thermometer, Radio } from 'lucide-react-native';
import { Fonts } from '@/constants/theme';

// ── Mock Airfields Data ──────────────────────────────────────────────────────
const AIRFIELDS = [
    {
        icao: 'EGTG',
        name: 'Kemble (Cotswold Airport)',
        runways: '08 / 26 (Asphalt, 2009m)',
        frequency: 'Cotswold Radio: 118.435 MHz',
        elevation: '436 ft',
        details: 'Popular training hub in Gloucestershire. Home of many historic jets.'
    },
    {
        icao: 'EGBJ',
        name: 'Gloucestershire Airport',
        runways: '09 / 27 (1431m), 04 / 22 (987m), 18 / 36 (799m)',
        frequency: 'Gloucester Tower: 122.905 MHz',
        elevation: '101 ft',
        details: 'Busy general aviation airfield. Watch out for intensive instrument training.'
    },
    {
        icao: 'EGLF',
        name: 'Fairoaks Airport',
        runways: '06 / 24 (Asphalt, 813m)',
        frequency: 'Fairoaks Radio: 122.480 MHz',
        elevation: '80 ft',
        details: 'GA airfield located inside the London TMA, close to Heathrow airspace.'
    },
    {
        icao: 'EGTO',
        name: 'Rochester Airport',
        runways: '02 / 20 (Grass, 827m), 16 / 34 (Grass, 831m)',
        frequency: 'Rochester Radio: 122.255 MHz',
        elevation: '432 ft',
        details: 'Historic grass airfield in Kent. Watch out for crosswinds on Grass 02.'
    },
    {
        icao: 'EGGD',
        name: 'Bristol Airport',
        runways: '09 / 27 (Asphalt, 2011m)',
        frequency: 'Bristol Tower: 136.080 MHz',
        elevation: '622 ft',
        details: 'Commercial international airport. Training allowed by prior permission.'
    }
];

// ── Mock Checklists Data ─────────────────────────────────────────────────────
const CHECKLISTS = [
    {
        id: 'preflight',
        title: 'Pre-Flight Walkaround',
        icon: 'plane',
        items: [
            'Control locks - Removed',
            'Ignition switches - OFF',
            'Master switch - ON & check fuel quantity',
            'Flaps - Extend fully for inspection',
            'Master switch - OFF',
            'Fuel tank sumps - Drain & check for water/contaminants',
            'Pitot tube cover - Removed & clear',
            'Windshield - Clean',
            'Propeller & Spinner - Check security & nicks',
            'Alternator belt - Tension & condition',
            'Fuel vents - Clear & open'
        ]
    },
    {
        id: 'takeoff',
        title: 'Pre-Takeoff (CHIFT/CG)',
        icon: 'arrow-up-right',
        items: [
            'Controls - Free and correct movement',
            'Harnesses & Seats - Secure & locked',
            'Instruments - Checked & set (Altimeter set QNH, DI aligned)',
            'Fuel - Selector BOTH, contents check, Fuel Pump ON',
            'Flaps - Set for takeoff (usually 10° or UP)',
            'Trim - Set to Takeoff range',
            'Cabin doors - Closed and locked',
            'Gyro - Compass aligned'
        ]
    },
    {
        id: 'emergency',
        title: 'Emergency Engine Failure',
        icon: 'alert-triangle',
        isDanger: true,
        items: [
            'Airspeed - Establish Glide at 65 KIAS',
            'Best Landing Field - Select & steer towards it',
            'Carburetor Heat - ON',
            'Fuel Selector Valve - BOTH',
            'Mixture - RICH',
            'Fuel Pump Switch - ON',
            'Ignition Switch - BOTH (or START if prop stopped)',
            'Mayday Radio Call - 121.5 MHz (Report position & intentions)',
            'Transponder - Squawk 7700',
            'Ignition/Master Switches - OFF (Right before landing)',
            'Cabin Doors - Unlatch prior to touchdown'
        ]
    }
];

export default function ExploreScreen() {
    const [activeTab, setActiveTab] = useState<'airports' | 'weather' | 'checklists'>('airports');

    // Airport Search State
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedAirport, setSelectedAirport] = useState<string | null>(null);

    // Weather Search State
    const [weatherQuery, setWeatherQuery] = useState('');
    const [weatherData, setWeatherData] = useState<any>(null);
    const [weatherError, setWeatherError] = useState('');

    // Checklist State
    const [activeChecklist, setActiveChecklist] = useState<string | null>(null);
    const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

    const handleAirportSearch = (text: string) => {
        setSearchQuery(text);
        setSelectedAirport(null);
    };

    const filteredAirports = AIRFIELDS.filter(
        (af) =>
            af.icao.toLowerCase().includes(searchQuery.toLowerCase()) ||
            af.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // ── Weather METAR Engine ─────────────────────────────────────────────────
    const generateMockMETAR = (icao: string) => {
        const cleanIcao = icao.toUpperCase().trim();
        if (cleanIcao.length < 3 || cleanIcao.length > 4) {
            setWeatherError('Please enter a valid 3-4 letter ICAO code.');
            setWeatherData(null);
            return;
        }

        // Seed generator for deterministic results per ICAO code
        const day = new Date().getDate();
        let seed = 0;
        for (let i = 0; i < cleanIcao.length; i++) {
            seed += cleanIcao.charCodeAt(i);
        }
        seed += day;

        const random = () => {
            const x = Math.sin(seed++) * 10000;
            return x - Math.floor(x);
        };

        const windDir = Math.floor(random() * 36) * 10;
        const windSpeed = Math.floor(random() * 25);
        const vis = random() > 0.3 ? 9999 : Math.floor(random() * 8000) + 1200;
        const temp = Math.floor(random() * 15) + 8;
        const dew = temp - Math.floor(random() * 5) - 1;
        const qnh = Math.floor(random() * 26) + 995;

        const cloudsArr = ['SKC', 'FEW015', 'FEW025', 'SCT030', 'BKN012', 'BKN022', 'OVC008', 'OVC015'];
        const clouds = cloudsArr[Math.floor(random() * cloudsArr.length)];

        // Compute categories
        let category: 'VFR' | 'MVFR' | 'IFR' = 'VFR';
        if (vis < 5000 || clouds.startsWith('OVC008') || clouds.startsWith('OVC010') || clouds.startsWith('BKN012')) {
            category = 'IFR';
        } else if (vis < 8000 || clouds.startsWith('FEW015') || clouds.startsWith('BKN022') || clouds.startsWith('SCT030')) {
            category = 'MVFR';
        }

        const windDirStr = windDir.toString().padStart(3, '0');
        const windSpeedStr = windSpeed.toString().padStart(2, '0');
        const visStr = vis === 9999 ? '9999' : vis.toString().padStart(4, '0');
        const timeDay = new Date().getUTCDate().toString().padStart(2, '0');
        const timeHr = new Date().getUTCHours().toString().padStart(2, '0');
        const timeMin = new Date().getUTCMinutes().toString().padStart(2, '0');

        const metar = `${cleanIcao} ${timeDay}${timeHr}${timeMin}Z AUTO ${windDirStr}${windSpeedStr}KT ${visStr} ${clouds} ${temp}/${dew} Q${qnh}`;

        setWeatherData({
            metar,
            icao: cleanIcao,
            wind: `${windDirStr}° at ${windSpeedStr} KT`,
            visibility: vis === 9999 ? '10 km+' : `${(vis / 1000).toFixed(1)} km`,
            clouds: clouds === 'SKC' ? 'Clear skies (SKC)' : `${clouds.substring(0, 3)} at ${parseInt(clouds.substring(3)) * 100} ft`,
            tempDew: `${temp}°C / ${dew}°C`,
            qnh: `${qnh} hPa`,
            category
        });
        setWeatherError('');
    };

    // ── Checklist Handlers ────────────────────────────────────────────────────
    const selectChecklist = (id: string) => {
        setActiveChecklist(id);
        setCheckedItems({});
    };

    const toggleCheckItem = (index: number) => {
        const key = `${activeChecklist}-${index}`;
        setCheckedItems((prev) => ({
            ...prev,
            [key]: !prev[key]
        }));
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={[styles.headerTitle, { fontFamily: Fonts.rounded }]}>Flight Explore</Text>
                <Text style={styles.headerSubtitle}>Essential Pilot Training Utilities</Text>
            </View>

            {/* Utility Tabs */}
            <View style={styles.tabsContainer}>
                <TouchableOpacity
                    style={[styles.tabButton, activeTab === 'airports' && styles.tabButtonActive]}
                    onPress={() => setActiveTab('airports')}
                >
                    <Compass size={18} color={activeTab === 'airports' ? '#FF5722' : '#666666'} />
                    <Text style={[styles.tabButtonText, activeTab === 'airports' && styles.tabButtonTextActive]}>Airfields</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.tabButton, activeTab === 'weather' && styles.tabButtonActive]}
                    onPress={() => setActiveTab('weather')}
                >
                    <CloudSun size={18} color={activeTab === 'weather' ? '#FF5722' : '#666666'} />
                    <Text style={[styles.tabButtonText, activeTab === 'weather' && styles.tabButtonTextActive]}>Weather</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.tabButton, activeTab === 'checklists' && styles.tabButtonActive]}
                    onPress={() => {
                        setActiveTab('checklists');
                        setActiveChecklist(null);
                    }}
                >
                    <CheckSquare size={18} color={activeTab === 'checklists' ? '#FF5722' : '#666666'} />
                    <Text style={[styles.tabButtonText, activeTab === 'checklists' && styles.tabButtonTextActive]}>Checklists</Text>
                </TouchableOpacity>
            </View>

            {/* Main Content Area */}
            <ScrollView style={styles.container} contentContainerStyle={styles.content}>
                
                {/* ── TAB 1: AIRPORTS DIRECTORY ────────────────────────────────────── */}
                {activeTab === 'airports' && (
                    <View>
                        <View style={styles.searchContainer}>
                            <Search size={20} color="#A0A0A0" style={styles.searchIcon} />
                            <TextInput
                                style={styles.searchInput}
                                placeholder="Search by name or ICAO (e.g. EGTG)..."
                                placeholderTextColor="#A0A0A0"
                                value={searchQuery}
                                onChangeText={handleAirportSearch}
                                autoCapitalize="characters"
                                autoCorrect={false}
                            />
                        </View>

                        {selectedAirport === null ? (
                            filteredAirports.map((af) => (
                                <TouchableOpacity
                                    key={af.icao}
                                    style={styles.card}
                                    onPress={() => setSelectedAirport(af.icao)}
                                >
                                    <View style={styles.cardHeader}>
                                        <View>
                                            <Text style={styles.icaoCode}>{af.icao}</Text>
                                            <Text style={styles.airfieldName}>{af.name}</Text>
                                        </View>
                                        <ChevronRight size={20} color="#A0A0A0" />
                                    </View>
                                </TouchableOpacity>
                            ))
                        ) : (
                            (() => {
                                const af = AIRFIELDS.find((item) => item.icao === selectedAirport)!;
                                return (
                                    <View style={styles.detailsCard}>
                                        <TouchableOpacity onPress={() => setSelectedAirport(null)} style={styles.backButton}>
                                            <Text style={styles.backButtonText}>← Back to Airfields</Text>
                                        </TouchableOpacity>

                                        <Text style={styles.detailIcao}>{af.icao}</Text>
                                        <Text style={styles.detailName}>{af.name}</Text>

                                        <View style={styles.detailRow}>
                                            <Radio size={16} color="#666" style={{ marginRight: 8 }} />
                                            <View>
                                                <Text style={styles.detailLabel}>RADIO FREQUENCY</Text>
                                                <Text style={styles.detailValue}>{af.frequency}</Text>
                                            </View>
                                        </View>

                                        <View style={styles.detailRow}>
                                            <Compass size={16} color="#666" style={{ marginRight: 8 }} />
                                            <View>
                                                <Text style={styles.detailLabel}>RUNWAY INFO</Text>
                                                <Text style={styles.detailValue}>{af.runways}</Text>
                                            </View>
                                        </View>

                                        <View style={styles.detailRow}>
                                            <Cloud size={16} color="#666" style={{ marginRight: 8 }} />
                                            <View>
                                                <Text style={styles.detailLabel}>ELEVATION</Text>
                                                <Text style={styles.detailValue}>{af.elevation}</Text>
                                            </View>
                                        </View>

                                        <Text style={styles.detailLabelHeader}>PILOT NOTES</Text>
                                        <Text style={styles.detailNotesText}>{af.details}</Text>

                                        <TouchableOpacity
                                            style={styles.weatherShortcut}
                                            onPress={() => {
                                                setActiveTab('weather');
                                                setWeatherQuery(af.icao);
                                                generateMockMETAR(af.icao);
                                            }}
                                        >
                                            <Text style={styles.weatherShortcutText}>Get Current METAR Weather →</Text>
                                        </TouchableOpacity>
                                    </View>
                                );
                            })()
                        )}
                    </View>
                )}

                {/* ── TAB 2: METAR WEATHER STATUS ─────────────────────────────────── */}
                {activeTab === 'weather' && (
                    <View>
                        <Text style={styles.sectionHeading}>METAR Station Weather Info</Text>
                        <Text style={styles.sectionDesc}>Enter any UK or international ICAO station code to simulate and decode current atmospheric observations.</Text>

                        <View style={styles.searchRow}>
                            <TextInput
                                style={[styles.searchInput, styles.flex1, { borderTopRightRadius: 0, borderBottomRightRadius: 0 }]}
                                placeholder="Enter Station ICAO (e.g. EGGD)"
                                placeholderTextColor="#A0A0A0"
                                value={weatherQuery}
                                onChangeText={setWeatherQuery}
                                autoCapitalize="characters"
                                autoCorrect={false}
                                maxLength={4}
                            />
                            <TouchableOpacity
                                style={styles.weatherBtn}
                                onPress={() => generateMockMETAR(weatherQuery)}
                            >
                                <Text style={styles.weatherBtnText}>Decode</Text>
                            </TouchableOpacity>
                        </View>

                        {weatherError ? (
                            <Text style={styles.errorText}>{weatherError}</Text>
                        ) : null}

                        {weatherData && (
                            <View style={styles.weatherCard}>
                                <View style={styles.weatherHeaderRow}>
                                    <Text style={styles.weatherIcao}>{weatherData.icao}</Text>
                                    <View style={[
                                        styles.categoryBadge,
                                        weatherData.category === 'VFR' && styles.badgeVFR,
                                        weatherData.category === 'MVFR' && styles.badgeMVFR,
                                        weatherData.category === 'IFR' && styles.badgeIFR,
                                    ]}>
                                        <Text style={styles.categoryBadgeText}>{weatherData.category}</Text>
                                    </View>
                                </View>

                                <View style={styles.rawMetarBox}>
                                    <Text style={styles.rawMetarLabel}>RAW METAR REPORT</Text>
                                    <Text style={styles.rawMetarText}>{weatherData.metar}</Text>
                                </View>

                                <Text style={styles.rawMetarLabel}>DECODED DETAILS</Text>

                                <View style={styles.decodedRow}>
                                    <Wind size={18} color="#666666" />
                                    <Text style={styles.decodedLabel}>WIND</Text>
                                    <Text style={styles.decodedValue}>{weatherData.wind}</Text>
                                </View>

                                <View style={styles.decodedRow}>
                                    <Eye size={18} color="#666666" />
                                    <Text style={styles.decodedLabel}>VISIBILITY</Text>
                                    <Text style={styles.decodedValue}>{weatherData.visibility}</Text>
                                </View>

                                <View style={styles.decodedRow}>
                                    <Cloud size={18} color="#666666" />
                                    <Text style={styles.decodedLabel}>SKY CLOUDS</Text>
                                    <Text style={styles.decodedValue}>{weatherData.clouds}</Text>
                                </View>

                                <View style={styles.decodedRow}>
                                    <Thermometer size={18} color="#666666" />
                                    <Text style={styles.decodedLabel}>TEMP/DEW</Text>
                                    <Text style={styles.decodedValue}>{weatherData.tempDew}</Text>
                                </View>

                                <View style={[styles.decodedRow, { borderBottomWidth: 0 }]}>
                                    <Compass size={18} color="#666666" />
                                    <Text style={styles.decodedLabel}>BAROMETER</Text>
                                    <Text style={styles.decodedValue}>{weatherData.qnh}</Text>
                                </View>
                            </View>
                        )}
                    </View>
                )}

                {/* ── TAB 3: CHECKLIST RUNNER ─────────────────────────────────────── */}
                {activeTab === 'checklists' && (
                    <View>
                        {activeChecklist === null ? (
                            <View>
                                <Text style={styles.sectionHeading}>Interactive Pilot Checklists</Text>
                                <Text style={styles.sectionDesc}>Select a checklists stack below to complete critical flight training steps.</Text>
                                
                                {CHECKLISTS.map((cl) => (
                                    <TouchableOpacity
                                        key={cl.id}
                                        style={[styles.card, cl.isDanger && styles.dangerCard]}
                                        onPress={() => selectChecklist(cl.id)}
                                    >
                                        <View style={styles.cardHeader}>
                                            <View>
                                                <Text style={[styles.checklistTitle, cl.isDanger && styles.dangerTitleText]}>{cl.title}</Text>
                                                <Text style={styles.checklistSubtitle}>{cl.items.length} checklist steps</Text>
                                            </View>
                                            <ChevronRight size={20} color={cl.isDanger ? '#FF3B30' : '#A0A0A0'} />
                                        </View>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        ) : (
                            (() => {
                                const cl = CHECKLISTS.find((c) => c.id === activeChecklist)!;
                                return (
                                    <View style={styles.checklistRunnerCard}>
                                        <TouchableOpacity onPress={() => setActiveChecklist(null)} style={styles.backButton}>
                                            <Text style={styles.backButtonText}>← Back to Checklists</Text>
                                        </TouchableOpacity>

                                        <Text style={[styles.runnerTitle, cl.isDanger && styles.dangerTitleText]}>{cl.title}</Text>
                                        <Text style={styles.runnerDesc}>Tap checklist items to check them off as completed.</Text>

                                        <View style={styles.checklistList}>
                                            {cl.items.map((item, idx) => {
                                                const key = `${cl.id}-${idx}`;
                                                const isCompleted = !!checkedItems[key];
                                                return (
                                                    <TouchableOpacity
                                                        key={idx}
                                                        style={[styles.checkItemRow, isCompleted && styles.checkItemRowCompleted]}
                                                        onPress={() => toggleCheckItem(idx)}
                                                    >
                                                        <View style={[styles.checkBox, isCompleted && styles.checkBoxCompleted]}>
                                                            {isCompleted && <Text style={styles.checkMark}>✓</Text>}
                                                        </View>
                                                        <Text style={[styles.checkText, isCompleted && styles.checkTextCompleted]}>
                                                            {item}
                                                        </Text>
                                                    </TouchableOpacity>
                                                );
                                            })}
                                        </View>
                                    </View>
                                );
                            })()
                        )}
                    </View>
                )}

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
        paddingHorizontal: 20,
        paddingTop: 16,
        paddingBottom: 16,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#EAEAEE',
        backgroundColor: '#FFFFFF',
    },
    headerTitle: {
        color: '#111111',
        fontSize: 24,
        fontWeight: '800',
        letterSpacing: -0.8,
    },
    headerSubtitle: {
        color: '#666666',
        fontSize: 13,
        fontWeight: '500',
        marginTop: 2,
    },
    tabsContainer: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        paddingVertical: 10,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#EAEAEE',
        gap: 8,
    },
    tabButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
        borderRadius: 8,
        backgroundColor: '#F5F5F7',
        gap: 6,
    },
    tabButtonActive: {
        backgroundColor: '#FFF0ED',
    },
    tabButtonText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#666666',
    },
    tabButtonTextActive: {
        color: '#FF5722',
        fontWeight: '700',
    },
    container: {
        flex: 1,
        backgroundColor: '#F9F9F9',
    },
    content: {
        padding: 20,
        paddingBottom: 40,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#EAEAEE',
        borderRadius: 8,
        paddingHorizontal: 12,
        marginBottom: 16,
    },
    searchIcon: {
        marginRight: 8,
    },
    searchInput: {
        height: 48,
        color: '#111111',
        fontSize: 15,
        fontWeight: '500',
        flex: 1,
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#EAEAEE',
    },
    dangerCard: {
        borderColor: '#FFD1D1',
        backgroundColor: '#FFF8F8',
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    icaoCode: {
        fontSize: 16,
        fontWeight: '800',
        color: '#FF5722',
    },
    airfieldName: {
        fontSize: 14,
        fontWeight: '600',
        color: '#111111',
        marginTop: 2,
    },
    detailsCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 20,
        borderWidth: 1,
        borderColor: '#EAEAEE',
    },
    backButton: {
        marginBottom: 20,
    },
    backButtonText: {
        color: '#FF5722',
        fontSize: 14,
        fontWeight: '700',
    },
    detailIcao: {
        fontSize: 28,
        fontWeight: '800',
        color: '#111111',
        letterSpacing: -0.5,
    },
    detailName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#666666',
        marginBottom: 24,
    },
    detailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#EAEAEE',
    },
    detailLabel: {
        fontSize: 9,
        fontWeight: '700',
        color: '#A0A0A0',
        letterSpacing: 0.5,
        marginBottom: 2,
    },
    detailValue: {
        fontSize: 14,
        fontWeight: '600',
        color: '#111111',
    },
    detailLabelHeader: {
        fontSize: 10,
        fontWeight: '700',
        color: '#A0A0A0',
        letterSpacing: 0.5,
        marginTop: 20,
        marginBottom: 6,
    },
    detailNotesText: {
        fontSize: 13,
        color: '#444444',
        lineHeight: 18,
        fontWeight: '500',
    },
    weatherShortcut: {
        marginTop: 28,
        backgroundColor: '#FFF0ED',
        paddingVertical: 14,
        borderRadius: 8,
        alignItems: 'center',
    },
    weatherShortcutText: {
        color: '#FF5722',
        fontSize: 14,
        fontWeight: '700',
    },
    sectionHeading: {
        fontSize: 16,
        fontWeight: '800',
        color: '#111111',
        marginBottom: 6,
    },
    sectionDesc: {
        fontSize: 13,
        color: '#666666',
        lineHeight: 18,
        fontWeight: '500',
        marginBottom: 20,
    },
    searchRow: {
        flexDirection: 'row',
        marginBottom: 16,
    },
    weatherBtn: {
        backgroundColor: '#FF5722',
        borderTopRightRadius: 8,
        borderBottomRightRadius: 8,
        paddingHorizontal: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    weatherBtnText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '700',
    },
    errorText: {
        color: '#FF3B30',
        fontSize: 13,
        fontWeight: '600',
        marginBottom: 16,
    },
    weatherCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 20,
        borderWidth: 1,
        borderColor: '#EAEAEE',
    },
    weatherHeaderRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    weatherIcao: {
        fontSize: 24,
        fontWeight: '800',
        color: '#111111',
    },
    categoryBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 6,
        justifyContent: 'center',
        alignItems: 'center',
    },
    badgeVFR: {
        backgroundColor: '#E2FBE9',
    },
    badgeMVFR: {
        backgroundColor: '#E0F0FF',
    },
    badgeIFR: {
        backgroundColor: '#FFE5E5',
    },
    categoryBadgeText: {
        fontSize: 12,
        fontWeight: '800',
    },
    rawMetarBox: {
        backgroundColor: '#F5F5F7',
        borderRadius: 8,
        padding: 12,
        marginBottom: 24,
    },
    rawMetarLabel: {
        fontSize: 9,
        fontWeight: '800',
        color: '#A0A0A0',
        letterSpacing: 0.5,
        marginBottom: 6,
    },
    rawMetarText: {
        fontSize: 13,
        color: '#111111',
        fontWeight: '700',
        fontFamily: Fonts.mono,
        lineHeight: 18,
    },
    decodedRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#EAEAEE',
    },
    decodedLabel: {
        fontSize: 10,
        fontWeight: '700',
        color: '#A0A0A0',
        width: 100,
        marginLeft: 10,
    },
    decodedValue: {
        flex: 1,
        fontSize: 14,
        fontWeight: '600',
        color: '#111111',
        textAlign: 'right',
    },
    checklistTitle: {
        fontSize: 15,
        fontWeight: '700',
        color: '#111111',
    },
    dangerTitleText: {
        color: '#FF3B30',
    },
    checklistSubtitle: {
        fontSize: 12,
        color: '#666666',
        marginTop: 2,
    },
    checklistRunnerCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 20,
        borderWidth: 1,
        borderColor: '#EAEAEE',
    },
    runnerTitle: {
        fontSize: 20,
        fontWeight: '800',
        color: '#111111',
        marginBottom: 4,
    },
    runnerDesc: {
        fontSize: 12,
        color: '#666666',
        marginBottom: 24,
    },
    checklistList: {
        marginTop: 8,
    },
    checkItemRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#EAEAEE',
    },
    checkItemRowCompleted: {
        opacity: 0.6,
    },
    checkBox: {
        width: 20,
        height: 20,
        borderRadius: 4,
        borderWidth: 1.5,
        borderColor: '#A0A0A0',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    checkBoxCompleted: {
        backgroundColor: '#4CD964',
        borderColor: '#4CD964',
    },
    checkMark: {
        color: '#FFFFFF',
        fontSize: 12,
        fontWeight: '800',
    },
    checkText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#111111',
        flex: 1,
    },
    checkTextCompleted: {
        textDecorationLine: 'line-through',
        color: '#666666',
    },
    flex1: {
        flex: 1,
    }
});
