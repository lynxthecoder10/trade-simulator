'use client';

import { create } from 'zustand';

export interface UserProfile {
  username: string;
  email: string;
  avatar: string;
  tradingStyle: 'scalper' | 'day_trader' | 'swing_trader' | 'hodler';
  experienceLevel: 'beginner' | 'intermediate' | 'pro' | 'market_maker';
  displayCurrency: 'INR' | 'USD' | 'EUR';
  bio: string;
  monthlyRiskLimit: number;
}

interface AuthState {
  user: UserProfile;
  isAuthenticated: boolean;
  login: (email: string, username?: string) => void;
  register: (profile: UserProfile) => void;
  updateProfile: (profile: Partial<UserProfile>) => void;
  logout: () => void;
}

const defaultUser: UserProfile = {
  username: 'TraderOne',
  email: 'traderone@tradesim.com',
  avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=60',
  tradingStyle: 'day_trader',
  experienceLevel: 'intermediate',
  displayCurrency: 'INR',
  bio: 'Simulating the market, one position at a time. 🚀',
  monthlyRiskLimit: 50000,
};

export const useAuthStore = create<AuthState>((set) => {
  return {
    user: defaultUser,
    isAuthenticated: true,
    login: () => {},
    register: () => {},
    updateProfile: (updatedFields) => {
      set((state) => ({ user: { ...state.user, ...updatedFields } }));
    },
    logout: () => {}
  };
});
