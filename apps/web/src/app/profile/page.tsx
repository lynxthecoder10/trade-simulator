'use client';

import React, { useState } from 'react';
import { useAuthStore, UserProfile } from '@/stores/auth-store';
import { usePortfolioStore } from '@/stores/portfolio-store';
import { Tooltip } from '@/components/ui/Tooltip';
import { User, Shield, CheckCircle, Save, Award, Activity, CircleDollarSign, Compass } from 'lucide-react';
import { cn } from '@/lib/utils';

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=150&auto=format&fit=crop&q=80',
];

export default function ProfilePage() {
  const { user, updateProfile } = useAuthStore();
  const balance = usePortfolioStore((state) => state.balance);

  // Profile forms
  const [username, setUsername] = useState(user?.username || '');
  const [email, setEmail] = useState(user?.email || '');
  const [selectedAvatar, setSelectedAvatar] = useState(user?.avatar || PRESET_AVATARS[0]);
  const [tradingStyle, setTradingStyle] = useState<UserProfile['tradingStyle']>(user?.tradingStyle || 'day_trader');
  const [experienceLevel, setExperienceLevel] = useState<UserProfile['experienceLevel']>(user?.experienceLevel || 'intermediate');
  const [displayCurrency, setDisplayCurrency] = useState<UserProfile['displayCurrency']>(user?.displayCurrency || 'INR');
  const [bio, setBio] = useState(user?.bio || '');
  const [monthlyRiskLimit, setMonthlyRiskLimit] = useState(user?.monthlyRiskLimit || 50000);

  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      username,
      email,
      avatar: selectedAvatar,
      tradingStyle,
      experienceLevel,
      displayCurrency,
      bio,
      monthlyRiskLimit,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto p-4 lg:p-8 space-y-6 h-full overflow-y-auto pb-16">
      
      {/* Page Header */}
      <div className="border-b border-border/60 pb-6">
        <h1 className="text-3xl font-extrabold tracking-tight mb-2 bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
          User Settings & Profile
        </h1>
        <p className="text-muted-foreground text-sm leading-relaxed">
          Manage your simulated credentials, customize trading configurations, and review analytics benchmarks.
        </p>
      </div>

      {saved && (
        <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/40 text-emerald-400 p-3 rounded-lg text-xs font-bold animate-pulse">
          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
          YOUR SIMULATED ACCOUNT SETTINGS HAVE BEEN SECURELY SAVED!
        </div>
      )}

      {/* Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left Side: Avatar Card */}
        <div className="md:col-span-1 bg-card border border-border/80 rounded-xl p-5 shadow-xl flex flex-col items-center justify-between text-center relative overflow-hidden h-fit">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary to-indigo-600" />
          
          <div className="space-y-4 w-full">
            <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-border shadow-lg mx-auto mt-4">
              <img src={selectedAvatar} alt="Profile" className="w-full h-full object-cover" />
            </div>
            
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">{username || 'Trader'}</h2>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-extrabold tracking-wide bg-primary/10 text-primary uppercase border border-primary/20 mt-1">
                {tradingStyle.replace('_', ' ')}
              </span>
            </div>

            <p className="text-xs text-muted-foreground italic leading-relaxed px-2 bg-background/50 border border-border/40 py-2.5 rounded-lg">
              "{bio || 'Simulating the market with discipline.'}"
            </p>
          </div>

          <div className="border-t border-border/80 w-full mt-6 pt-5 grid grid-cols-2 gap-2 text-left">
            <div className="bg-background/40 p-2.5 rounded-lg border border-border/60">
              <span className="text-[9px] text-muted-foreground font-bold uppercase tracking-wider block">Mock Balance</span>
              <span className="text-sm font-extrabold text-white tabular-nums">
                {displayCurrency === 'USD' ? '$' : displayCurrency === 'EUR' ? '€' : '₹'}
                {balance.toLocaleString()}
              </span>
            </div>
            <div className="bg-background/40 p-2.5 rounded-lg border border-border/60">
              <span className="text-[9px] text-muted-foreground font-bold uppercase tracking-wider block">Exp. Tier</span>
              <span className="text-xs font-extrabold text-primary uppercase">
                {experienceLevel.replace('_', ' ')}
              </span>
            </div>
          </div>
        </div>

        {/* Right Side: Form Configuration */}
        <div className="md:col-span-2 bg-card border border-border/80 rounded-xl p-6 shadow-xl space-y-6">
          <form onSubmit={handleSave} className="space-y-5">
            
            {/* Standard Profile Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                  Account Handle
                  <Tooltip title="Account Handle" content="Your unique simulated identity handle displayed across analytics matrices." />
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full h-10 bg-background border border-border/80 focus:border-primary/60 focus:ring-1 focus:ring-primary/60 text-xs rounded-lg px-3 outline-none text-white transition-all font-semibold"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                  Notification Email
                  <Tooltip title="Simulation Email" content="The simulated email used for receiving end-of-day portfolio health reports." />
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-10 bg-background border border-border/80 focus:border-primary/60 focus:ring-1 focus:ring-primary/60 text-xs rounded-lg px-3 outline-none text-white transition-all font-semibold"
                />
              </div>
            </div>

            {/* Avatar Preset Grid */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block">
                Choose Simulation Avatar Card
              </label>
              <div className="flex gap-4">
                {PRESET_AVATARS.map((avatarUrl, idx) => (
                  <button
                    type="button"
                    key={idx}
                    onClick={() => setSelectedAvatar(avatarUrl)}
                    className={cn(
                      "w-12 h-12 rounded-full overflow-hidden border-2 transition-all transform active:scale-95 shadow-md",
                      selectedAvatar === avatarUrl 
                        ? "border-primary scale-105" 
                        : "border-transparent opacity-60 hover:opacity-100"
                    )}
                  >
                    <img src={avatarUrl} alt="Avatar Selection" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Trading Parameters Selector */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-border/60 pt-4">
              
              {/* Style */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                  Trading Style
                  <Tooltip title="Trading Style Preset" content="Modulates the AI analyst recommendations relative to your typical trade holding timeline." />
                </label>
                <select
                  value={tradingStyle}
                  onChange={(e) => setTradingStyle(e.target.value as any)}
                  className="w-full h-10 bg-background border border-border/80 text-xs rounded-lg px-3 outline-none text-white focus:border-primary font-semibold"
                >
                  <option value="day_trader">Day Trader</option>
                  <option value="scalper">Scalper (Mins)</option>
                  <option value="swing_trader">Swing Trader (Days)</option>
                  <option value="hodler">HODLer (Months)</option>
                </select>
              </div>

              {/* Experience */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                  Experience Tier
                  <Tooltip title="Experience Tier" content="Enables progressive UI complexity filters and specialized professional tools." />
                </label>
                <select
                  value={experienceLevel}
                  onChange={(e) => setExperienceLevel(e.target.value as any)}
                  className="w-full h-10 bg-background border border-border/80 text-xs rounded-lg px-3 outline-none text-white focus:border-primary font-semibold"
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="pro">Pro Trader</option>
                  <option value="market_maker">Market Maker</option>
                </select>
              </div>

              {/* Currency */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                  Display Currency
                  <Tooltip title="Display Currency" content="Adjusts the primary currency multiplier symbol (₹ INR, $ USD, or € EUR)." />
                </label>
                <select
                  value={displayCurrency}
                  onChange={(e) => setDisplayCurrency(e.target.value as any)}
                  className="w-full h-10 bg-background border border-border/80 text-xs rounded-lg px-3 outline-none text-white focus:border-primary font-semibold"
                >
                  <option value="INR">₹ INR (Rupees)</option>
                  <option value="USD">$ USD (Dollars)</option>
                  <option value="EUR">€ EUR (Euros)</option>
                </select>
              </div>
            </div>

            {/* Signature statement Bio */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block">
                Signature Bio
              </label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full h-20 bg-background border border-border/80 text-xs rounded-lg p-3 outline-none text-white focus:border-primary resize-none font-semibold leading-relaxed"
                placeholder="Write a quick bio..."
              />
            </div>

            {/* Save Controls */}
            <div className="border-t border-border/60 pt-4 flex justify-end">
              <button
                type="submit"
                className="flex items-center gap-2 bg-primary hover:bg-primary/95 text-primary-foreground font-bold text-xs rounded-lg px-4 py-2.5 shadow transition-all active:scale-95"
              >
                <Save className="w-3.5 h-3.5" />
                SAVE ACCOUNT CHANGES
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
