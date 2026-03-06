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
}

interface AppState {
    profileName: string | null;
    hasSeenOnboarding: boolean;
    flights: Flight[];

    // Actions
    setProfileName: (name: string) => void;
    completeOnboarding: () => void;
    addFlight: (flight: Omit<Flight, 'id'>) => void;
    removeFlight: (id: string) => void;
    resetStore: () => void;
}

export const useAppStore = create<AppState>()(
    persist(
        (set) => ({
            profileName: null,
            hasSeenOnboarding: false,
            flights: [],

            setProfileName: (name) => set({ profileName: name }),

            completeOnboarding: () => set({ hasSeenOnboarding: true }),

            addFlight: (flight) => set((state) => ({
                flights: [
                    ...state.flights,
                    { ...flight, id: Math.random().toString(36).substr(2, 9) }
                ]
            })),

            removeFlight: (id) => set((state) => ({
                flights: state.flights.filter((f) => f.id !== id)
            })),

            resetStore: () => set({
                profileName: null,
                hasSeenOnboarding: false,
                flights: [],
            })
        }),
        {
            name: 'flight-training-storage',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);
