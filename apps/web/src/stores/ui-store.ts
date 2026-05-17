import { create } from 'zustand';

interface UiState {
  selectedSymbol: string | null;
  isOrderPanelOpen: boolean;
  setSelectedSymbol: (symbol: string) => void;
  setOrderPanelOpen: (isOpen: boolean) => void;
}

export const useUiStore = create<UiState>((set) => ({
  selectedSymbol: 'RELIANCE',
  isOrderPanelOpen: true,
  setSelectedSymbol: (symbol) => set({ selectedSymbol: symbol }),
  setOrderPanelOpen: (isOpen) => set({ isOrderPanelOpen: isOpen }),
}));
