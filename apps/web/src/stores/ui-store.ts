import { create } from 'zustand';

interface UiState {
  selectedSymbol: string | null;
  isOrderPanelOpen: boolean;
  isWatchlistOpen: boolean;
  isTerminalMode: boolean;
  chartGrid: number; // 1, 2, or 4 charts
  setSelectedSymbol: (symbol: string) => void;
  setOrderPanelOpen: (isOpen: boolean) => void;
  setWatchlistOpen: (isOpen: boolean) => void;
  setTerminalMode: (isTerminal: boolean) => void;
  setChartGrid: (grid: number) => void;
}

export const useUiStore = create<UiState>((set) => ({
  selectedSymbol: 'RELIANCE.NS',
  isOrderPanelOpen: true,
  isWatchlistOpen: true,
  isTerminalMode: false,
  chartGrid: 1,
  setSelectedSymbol: (symbol) => set({ selectedSymbol: symbol }),
  setOrderPanelOpen: (isOpen) => set({ isOrderPanelOpen: isOpen }),
  setWatchlistOpen: (isOpen) => set({ isWatchlistOpen: isOpen }),
  setTerminalMode: (isTerminal) => set({ isTerminalMode: isTerminal }),
  setChartGrid: (grid) => set({ chartGrid: grid }),
}));
