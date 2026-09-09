import { create } from 'zustand';

export interface MatchData {
  id: string;
  league: string;
  home: string;
  home_short: string;
  away: string;
  away_short: string;
  status: string;
  start_time: string;
  home_score: number;
  away_score: number;
  current_minute: number;
  events: any[];
  odds: any;
}

interface MatchesState {
  matches: MatchData[];
  loading: boolean;
  error: string | null;
  fetchMatches: () => Promise<void>;
  startPolling: () => void;
  stopPolling: () => void;
}

let pollInterval: any;

export const useMatchesStore = create<MatchesState>((set, get) => ({
  matches: [],
  loading: false,
  error: null,
  
  fetchMatches: async () => {
    try {
      const res = await fetch('/api/matches');
      const data = await res.json();
      if (res.ok) {
        set({ matches: data.matches, error: null });
      } else {
        set({ error: data.error });
      }
    } catch (err: any) {
      set({ error: err.message });
    }
  },

  startPolling: () => {
    get().fetchMatches();
    pollInterval = setInterval(() => {
      get().fetchMatches();
    }, 5000); // Poll every 5s
  },

  stopPolling: () => {
    if (pollInterval) clearInterval(pollInterval);
  }
}));
