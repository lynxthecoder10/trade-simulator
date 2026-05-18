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
  login: (username: string, displayCurrency: 'INR' | 'USD' | 'EUR') => void;
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

// Client-only helper to read initial values to prevent Next.js hydration errors
const getInitialState = () => {
  if (typeof window === 'undefined') {
    return {
      user: defaultUser,
      isAuthenticated: false,
    };
  }
  
  const savedUser = localStorage.getItem('tradesim_user');
  const savedAuth = localStorage.getItem('tradesim_auth');
  
  return {
    user: savedUser ? JSON.parse(savedUser) : defaultUser,
    isAuthenticated: savedAuth === 'true',
  };
};

export const useAuthStore = create<AuthState>((set) => {
  const initial = getInitialState();
  
  return {
    user: initial.user,
    isAuthenticated: initial.isAuthenticated,
    login: (username, displayCurrency) => {
      const cleanUsername = username.trim() || 'TraderOne';
      
      // Let's pick a nice gradient avatar based on the username
      let avatar = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=60';
      if (cleanUsername !== 'TraderOne') {
        avatar = `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(cleanUsername)}`;
      }

      const updatedUser: UserProfile = {
        ...defaultUser,
        username: cleanUsername,
        displayCurrency,
        avatar,
      };

      if (typeof window !== 'undefined') {
        localStorage.setItem('tradesim_user', JSON.stringify(updatedUser));
        localStorage.setItem('tradesim_auth', 'true');
      }

      set({
        user: updatedUser,
        isAuthenticated: true,
      });
    },
    updateProfile: (updatedFields) => {
      set((state) => {
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
        localStorage.removeItem('tradesim_auth');
      }
      set({
        user: defaultUser,
        isAuthenticated: false,
      });
    }
  };
});
