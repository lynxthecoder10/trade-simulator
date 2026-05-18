'use client';

import React, { useState, useEffect } from 'react';
import { useAuthStore } from '@/stores/auth-store';
import { Shield, Cpu, Activity, Coins, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export function AuthPage() {
  const login = useAuthStore((state) => state.login);
  const [codename, setCodename] = useState('TraderOne');
  const [currency, setCurrency] = useState<'INR' | 'USD' | 'EUR'>('INR');
  const [isBooting, setIsBooting] = useState(false);
  const [bootProgress, setBootProgress] = useState(0);
  const [bootLogIndex, setBootLogIndex] = useState(0);

  const bootLogs = [
    'Initializing quantum sandbox ledger handshake...',
    'Establishing secure pipeline to Yahoo Finance feed...',
    'Syncing local portfolio-engine with memory-clock...',
    'Injecting real-time risk-engine parameters...',
    'Resolving NSE / Nasdaq asset watchlists...',
    'Holographic UI viewport assets optimized.',
    'CONNECTION ESTABLISHED. UPLINK IS SECURE.'
  ];

  useEffect(() => {
    if (!isBooting) return;

    // Tick up the progress bar
    const progressInterval = setInterval(() => {
      setBootProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        const step = Math.floor(Math.random() * 8) + 4;
        return Math.min(prev + step, 100);
      });
    }, 120);

    // Dynamic logging sequence
    const logInterval = setInterval(() => {
      setBootLogIndex((prev) => {
        if (prev >= bootLogs.length - 1) {
          clearInterval(logInterval);
          return bootLogs.length - 1;
        }
        return prev + 1;
      });
    }, 280);

    return () => {
      clearInterval(progressInterval);
      clearInterval(logInterval);
    };
  }, [isBooting]);

  useEffect(() => {
    if (bootProgress === 100) {
      const timeout = setTimeout(() => {
        login(codename, currency);
      }, 500);
      return () => clearTimeout(timeout);
    }
  }, [bootProgress, login, codename, currency]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!codename.trim()) return;
    setIsBooting(true);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#020617] text-slate-100 font-sans relative overflow-hidden selection:bg-primary/30 selection:text-white">
      {/* Immersive Holographic Grid & Backdrop */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-35" />
      
      {/* Dynamic Pulsing Background Lights */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px] animate-pulse pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-[120px] animate-pulse pointer-events-none" />

      {/* Main Connection Panel */}
      <div className="w-full max-w-lg mx-4 z-10 relative">
        <div className="bg-[#090d16]/75 border border-slate-800/80 rounded-2xl p-8 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.6),0_0_40px_rgba(59,130,246,0.05)]">
          
          {/* Logo & Subtitle */}
          <div className="flex flex-col items-center mb-8 select-none text-center">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-tr from-primary to-indigo-500 flex items-center justify-center shadow-lg shadow-primary/20 mb-3 border border-primary/30">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <span className="text-[10px] font-black text-primary tracking-[0.25em] uppercase mb-1">TradeSim Terminal v2.4</span>
            <h1 className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
              CONNECTION GATEWAY
            </h1>
          </div>

          {!isBooting ? (
            /* Gateway Entry Form */
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Codename Input */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Uplink Codename
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Cpu className="h-4 w-4 text-primary" />
                  </div>
                  <input
                    type="text"
                    required
                    value={codename}
                    onChange={(e) => setCodename(e.target.value)}
                    maxLength={16}
                    placeholder="Enter Trader Nickname..."
                    className="w-full bg-[#030712] border border-slate-800/90 rounded-xl py-3 pl-11 pr-4 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/60 transition-all font-semibold"
                  />
                </div>
              </div>

              {/* Currency Selection */}
              <div className="space-y-2.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Primary Ledger Currency
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {(['INR', 'USD', 'EUR'] as const).map((curr) => {
                    const isSelected = currency === curr;
                    let symbol = '₹';
                    if (curr === 'USD') symbol = '$';
                    if (curr === 'EUR') symbol = '€';
                    
                    return (
                      <button
                        key={curr}
                        type="button"
                        onClick={() => setCurrency(curr)}
                        className={cn(
                          "relative rounded-xl py-3.5 px-3 border text-xs font-bold transition-all flex flex-col items-center justify-center gap-1.5 select-none",
                          isSelected
                            ? "bg-primary/10 border-primary text-primary shadow-[0_0_15px_rgba(59,130,246,0.12)]"
                            : "bg-[#030712]/50 border-slate-800/80 text-slate-400 hover:border-slate-700 hover:text-slate-200"
                        )}
                      >
                        <span className="text-lg font-medium">{symbol}</span>
                        <span className="text-[10px] tracking-wider uppercase font-extrabold">{curr}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Establish Uplink Button */}
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-primary to-indigo-600 hover:from-primary/95 hover:to-indigo-500 text-white py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-primary/15 transition-all hover:-translate-y-0.5 active:translate-y-0"
              >
                <span>Establish Terminal Uplink</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            </form>
          ) : (
            /* Sci-Fi Booting Sequence logs */
            <div className="space-y-6 select-none font-mono">
              {/* Glowing Console Output */}
              <div className="w-full bg-[#02040a] rounded-xl border border-slate-800 p-4 min-h-[140px] flex flex-col justify-end space-y-1.5 overflow-hidden relative shadow-[inset_0_2px_10px_rgba(0,0,0,0.8)]">
                {/* Cyber Scanner Scanline Overlay */}
                <div className="absolute inset-0 bg-scanline pointer-events-none opacity-5 animate-scanline" />
                
                {bootLogs.slice(0, bootLogIndex + 1).map((log, index) => {
                  const isLast = index === bootLogIndex;
                  return (
                    <div
                      key={index}
                      className={cn(
                        "text-[10px] tracking-tight leading-relaxed transition-opacity flex items-center gap-1.5",
                        isLast ? "text-emerald-400 font-bold" : "text-slate-500"
                      )}
                    >
                      <span className="text-primary font-bold shrink-0">&gt;&gt;</span>
                      <span className="break-all">{log}</span>
                    </div>
                  );
                })}
              </div>

              {/* Progress & Loading State */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-[10px] font-bold text-slate-400">
                  <span className="flex items-center gap-1.5 uppercase tracking-wider">
                    <Activity className="h-3 w-3 text-emerald-400 animate-pulse" />
                    Ledger Pipeline Synchronizing
                  </span>
                  <span className="text-primary">{bootProgress}%</span>
                </div>
                {/* Glowing Progress bar */}
                <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800/80 p-[1px]">
                  <div
                    className="h-full bg-gradient-to-r from-primary via-indigo-500 to-emerald-400 rounded-full transition-all duration-75 shadow-[0_0_8px_rgba(59,130,246,0.5)]"
                    style={{ width: `${bootProgress}%` }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Secure Sandbox Disclaimer footer */}
          <div className="mt-8 pt-5 border-t border-slate-900 flex items-center justify-center gap-2 text-slate-600 text-[10px] font-semibold uppercase tracking-wider select-none text-center">
            <Coins className="h-3.5 w-3.5 text-slate-700" />
            100% Client-Side Mock Ledger Active
          </div>

        </div>
      </div>
    </div>
  );
}
