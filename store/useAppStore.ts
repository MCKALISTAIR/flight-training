import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Flight {
    id: string;
    date: string;
    aircraft: string;
    waypoints: string[];
    durationHours: number;
    cost?: number;
    flightType: 'dual' | 'solo' | 'pic';
    isNight: boolean;
    isIFR: boolean;
    landings: number;
    notes?: string;
}

interface AppState {
    profileName: string | null;
    hasSeenOnboarding: boolean;
    flights: Flight[];
    defaultAircraft: string;
    defaultCostPerHour: number;

    // Actions
    setProfileName: (name: string) => void;
    completeOnboarding: () => void;
    addFlight: (flight: Omit<Flight, 'id'>) => void;
    removeFlight: (id: string) => void;
    resetStore: () => void;
    setDefaultAircraft: (aircraft: string) => void;
    setDefaultCostPerHour: (cost: number) => void;
}

export const useAppStore = create<AppState>()(
    persist(
        (set) => ({
            profileName: null,
            hasSeenOnboarding: false,
            flights: [],
            defaultAircraft: '',
            defaultCostPerHour: 0,

            setProfileName: (name) => set({ profileName: name }),

            completeOnboarding: () => set({ hasSeenOnboarding: true }),

            addFlight: (flight) => set((state) => ({
                flights: [
                    ...state.flights,
                    { ...flight, id: Math.random().toString(36).substring(2, 11) }
                ]
            })),

            removeFlight: (id) => set((state) => ({
                flights: state.flights.filter((f) => f.id !== id)
            })),

            resetStore: () => set({
                profileName: null,
                hasSeenOnboarding: false,
                flights: [],
                defaultAircraft: '',
                defaultCostPerHour: 0,
            }),

            setDefaultAircraft: (aircraft) => set({ defaultAircraft: aircraft }),
            setDefaultCostPerHour: (cost) => set({ defaultCostPerHour: cost }),
        }),
        {
            name: 'flight-training-storage',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);
