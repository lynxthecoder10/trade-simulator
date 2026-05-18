'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore, UserProfile } from '@/stores/auth-store';
import { Sparkles, Shield, User, Mail, Lock, CheckCircle2, ChevronRight, Briefcase } from 'lucide-react';
import { cn } from '@/lib/utils';

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=150&auto=format&fit=crop&q=80',
];

export default function AuthPage() {
  const router = useRouter();
  const { login, register } = useAuthStore();
  const [isLoginView, setIsLoginView] = useState(true);

  // Form states
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(PRESET_AVATARS[0]);
  const [tradingStyle, setTradingStyle] = useState<UserProfile['tradingStyle']>('day_trader');
  const [experienceLevel, setExperienceLevel] = useState<UserProfile['experienceLevel']>('intermediate');
  const [displayCurrency, setDisplayCurrency] = useState<UserProfile['displayCurrency']>('INR');
  const [bio, setBio] = useState('');

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || (!isLoginView && !username) || !password) {
      alert("Please fill in all required fields!");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      
      setTimeout(() => {
        if (isLoginView) {
          login(email, username || email.split('@')[0]);
        } else {
          register({
            username,
            email,
            avatar: selectedAvatar,
            tradingStyle,
            experienceLevel,
            displayCurrency,
            bio: bio || "Ready to execute trades! 🚀",
            monthlyRiskLimit: 50000,
          });
        }
        router.push('/');
      }, 1000);
    }, 1200);
  };

  return (
    <div className="min-h-screen w-full bg-[#020617] flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Decorative Blur Orbs */}
      <div className="absolute top-1/4 left-1/4 w-[300px] h-[300px] rounded-full bg-primary/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[350px] h-[350px] rounded-full bg-indigo-500/10 blur-[130px] pointer-events-none" />

      {/* Main Glassmorphic Panel */}
      <div className="relative w-full max-w-lg bg-card/60 backdrop-blur-xl border border-border/80 rounded-2xl p-6 lg:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-all">
        
        {/* Header Branding */}
        <div className="text-center mb-8">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-tr from-primary to-indigo-600 font-black text-2xl text-white shadow-[0_0_20px_rgba(59,130,246,0.4)] mb-4">
            T
          </div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight">
            Welcome to <span className="bg-gradient-to-r from-primary to-indigo-400 bg-clip-text text-transparent">TradeSim</span>
          </h1>
          <p className="text-muted-foreground text-xs lg:text-sm mt-1.5 leading-relaxed">
            Institutional-Grade Simulated Workspace & AI Behavior Engine.
          </p>
        </div>

        {/* Tab Selector */}
        <div className="flex bg-background/80 border border-border/60 rounded-xl p-1 mb-6 shadow-inner">
          <button
            onClick={() => setIsLoginView(true)}
            className={cn(
              "flex-1 py-2 text-xs lg:text-sm font-semibold rounded-lg transition-all",
              isLoginView 
                ? "bg-primary text-primary-foreground shadow-md" 
                : "text-muted-foreground hover:text-white"
            )}
          >
            Sign In
          </button>
          <button
            onClick={() => setIsLoginView(false)}
            className={cn(
              "flex-1 py-2 text-xs lg:text-sm font-semibold rounded-lg transition-all",
              !isLoginView 
                ? "bg-primary text-primary-foreground shadow-md" 
                : "text-muted-foreground hover:text-white"
            )}
          >
            Create Account
          </button>
        </div>

        {/* Auth form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Username Input (Register Only) */}
          {!isLoginView && (
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                <User className="w-3.5 h-3.5" />
                Username
              </label>
              <input
                type="text"
                placeholder="e.g. BullishMax"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required={!isLoginView}
                className="w-full h-11 bg-background border border-border/80 focus:border-primary/60 focus:ring-1 focus:ring-primary/60 text-sm rounded-lg px-4 outline-none text-white transition-all"
              />
            </div>
          )}

          {/* Email Input */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5" />
              Email Address
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full h-11 bg-background border border-border/80 focus:border-primary/60 focus:ring-1 focus:ring-primary/60 text-sm rounded-lg px-4 outline-none text-white transition-all"
            />
          </div>

          {/* Password Input */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5" />
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full h-11 bg-background border border-border/80 focus:border-primary/60 focus:ring-1 focus:ring-primary/60 text-sm rounded-lg px-4 outline-none text-white transition-all"
            />
          </div>

          {/* Advanced Profile Configuration (Register Only) */}
          {!isLoginView && (
            <div className="space-y-4 pt-2 border-t border-border/60 mt-4">
              
              {/* Avatar Selector */}
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block">
                  Select Trading Avatar
                </label>
                <div className="flex gap-3.5 justify-center">
                  {PRESET_AVATARS.map((avatarUrl, idx) => (
                    <button
                      type="button"
                      key={idx}
                      onClick={() => setSelectedAvatar(avatarUrl)}
                      className={cn(
                        "w-12 h-12 rounded-full overflow-hidden border-2 transition-all transform active:scale-95 shadow-md",
                        selectedAvatar === avatarUrl 
                          ? "border-primary scale-110 shadow-primary/30" 
                          : "border-transparent opacity-60 hover:opacity-100"
                      )}
                    >
                      <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Trading Style & Experience */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                    Trading Style
                  </label>
                  <select
                    value={tradingStyle}
                    onChange={(e) => setTradingStyle(e.target.value as any)}
                    className="w-full h-10 bg-background border border-border/80 text-xs rounded-lg px-3 outline-none text-white focus:border-primary"
                  >
                    <option value="day_trader">Day Trader</option>
                    <option value="scalper">Scalper</option>
                    <option value="swing_trader">Swing Trader</option>
                    <option value="hodler">HODLer</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                    Experience
                  </label>
                  <select
                    value={experienceLevel}
                    onChange={(e) => setExperienceLevel(e.target.value as any)}
                    className="w-full h-10 bg-background border border-border/80 text-xs rounded-lg px-3 outline-none text-white focus:border-primary"
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="pro">Pro Trader</option>
                    <option value="market_maker">Market Maker</option>
                  </select>
                </div>
              </div>

              {/* Display Currency */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                  Display Currency
                </label>
                <div className="flex bg-background border border-border/60 rounded-lg p-0.5">
                  {(['INR', 'USD', 'EUR'] as const).map((curr) => (
                    <button
                      type="button"
                      key={curr}
                      onClick={() => setDisplayCurrency(curr)}
                      className={cn(
                        "flex-1 py-1.5 text-xs font-bold rounded",
                        displayCurrency === curr 
                          ? "bg-primary text-primary-foreground shadow-sm" 
                          : "text-muted-foreground hover:text-white"
                      )}
                    >
                      {curr === 'INR' ? '₹ INR' : curr === 'USD' ? '$ USD' : '€ EUR'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Bio */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block">
                  Signature Statement / Bio
                </label>
                <textarea
                  placeholder="e.g. Master of Risk Rewards..."
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full h-16 bg-background border border-border/80 text-xs rounded-lg p-3 outline-none text-white focus:border-primary resize-none"
                />
              </div>
            </div>
          )}

          {/* Action Button */}
          <button
            type="submit"
            disabled={loading || success}
            className={cn(
              "w-full h-11 rounded-lg text-sm font-extrabold tracking-wide transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2 mt-6",
              success 
                ? "bg-emerald-500 text-white shadow-emerald-500/20" 
                : "bg-gradient-to-r from-primary to-indigo-600 hover:from-primary/95 hover:to-indigo-500 text-white shadow-primary/20"
            )}
          >
            {loading ? (
              <span className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin"></span>
            ) : success ? (
              <>
                <CheckCircle2 className="w-5 h-5 animate-bounce" />
                SESSION SECURED!
              </>
            ) : (
              <>
                {isLoginView ? 'SECURE LOGIN' : 'INITIALIZE SIMULATION'}
                <ChevronRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer Info */}
        <div className="mt-6 flex items-center justify-center gap-1.5 text-[10px] text-muted-foreground font-semibold">
          <Shield className="w-3.5 h-3.5 text-primary" />
          SIMULATED PLATFORM DATA IS LOCALLY SECURED
        </div>
      </div>
    </div>
  );
}
