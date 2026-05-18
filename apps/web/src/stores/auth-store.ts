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
  user: UserProfile | null;
  isAuthenticated: boolean;
  login: (email: string, username?: string) => void;
  register: (profile: UserProfile) => void;
  updateProfile: (profile: Partial<UserProfile>) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => {
  // Load persistent user from client localStorage safely
  let persistedUser: UserProfile | null = null;
  let persistedAuth = false;
  
  if (typeof window !== 'undefined') {
    try {
      const uStr = localStorage.getItem('tradesim_user');
      if (uStr) {
        const parsed = JSON.parse(uStr);
        // Robust schema check to prevent data corruption crashes
        if (
          parsed && 
          typeof parsed === 'object' && 
          typeof parsed.username === 'string' &&
          ['INR', 'USD', 'EUR'].includes(parsed.displayCurrency)
        ) {
          persistedUser = parsed;
          persistedAuth = true;
        } else {
          // Heal corrupted schema automatically
          console.warn("Detected corrupted TradeSim session schema. Auto-healing to default state.");
          localStorage.removeItem('tradesim_user');
        }
      }
    } catch (e) {
      console.error("Failed to parse persistent user, auto-healing corrupted storage.", e);
      try {
        localStorage.removeItem('tradesim_user');
      } catch (_) {}
    }
  }

  return {
    user: persistedUser,
    isAuthenticated: persistedAuth,
    login: (email, username = 'TraderOne') => {
      const defaultUser: UserProfile = {
        username,
        email,
        avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=60',
        tradingStyle: 'day_trader',
        experienceLevel: 'intermediate',
        displayCurrency: 'INR',
        bio: 'Simulating the market, one position at a time. 🚀',
        monthlyRiskLimit: 50000,
      };
      
      if (typeof window !== 'undefined') {
        localStorage.setItem('tradesim_user', JSON.stringify(defaultUser));
      }
      set({ user: defaultUser, isAuthenticated: true });
    },
    register: (profile) => {
      if (typeof window !== 'undefined') {
        localStorage.setItem('tradesim_user', JSON.stringify(profile));
      }
      set({ user: profile, isAuthenticated: true });
    },
    updateProfile: (updatedFields) => {
      set((state) => {
        if (!state.user) return state;
        const newUser = { ...state.user, ...updatedFields };
        if (typeof window !== 'undefined') {
          localStorage.setItem('tradesim_user', JSON.stringify(newUser));
        }
        return { user: newUser };
      });
    },
    logout: () => {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('tradesim_user');
      }
      set({ user: null, isAuthenticated: false });
    }
  };
});
