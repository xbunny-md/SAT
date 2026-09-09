import { create } from 'zustand';

export interface BetSelection {
  id: string; // unique selection ID (e.g., matchId_marketId_outcome)
  matchId: string;
  matchName: string; // e.g., "Arsenal vs Chelsea"
  marketName: string; // e.g., "Match Winner"
  outcome: string; // e.g., "1", "X", "2", "Over 2.5"
  odds: number;
}

interface BetSlipState {
  selections: BetSelection[];
  stake: number;
  isOpen: boolean;
  addSelection: (selection: BetSelection) => void;
  removeSelection: (id: string) => void;
  clearSelections: () => void;
  setStake: (stake: number) => void;
  setIsOpen: (isOpen: boolean) => void;
  toggleOpen: () => void;
}

export const useBetSlipStore = create<BetSlipState>((set) => ({
  selections: [],
  stake: 10,
  isOpen: false,
  addSelection: (selection) =>
    set((state) => {
      // Check if already in bet slip
      const exists = state.selections.find((s) => s.id === selection.id);
      if (exists) {
        return { selections: state.selections.filter((s) => s.id !== selection.id) };
      }
      
      // If adding a different outcome for the same market in the same match, replace it
      const filtered = state.selections.filter(
        (s) => !(s.matchId === selection.matchId && s.marketName === selection.marketName)
      );
      
      return { selections: [...filtered, selection], isOpen: true };
    }),
  removeSelection: (id) =>
    set((state) => ({ selections: state.selections.filter((s) => s.id !== id) })),
  clearSelections: () => set({ selections: [] }),
  setStake: (stake) => set({ stake }),
  setIsOpen: (isOpen) => set({ isOpen }),
  toggleOpen: () => set((state) => ({ isOpen: !state.isOpen })),
}));
