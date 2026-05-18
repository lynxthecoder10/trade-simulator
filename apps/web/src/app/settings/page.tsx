'use client';

import { Settings, RefreshCw, HelpCircle, ShieldAlert, Sparkles, Sliders } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

export default function SettingsPage() {
  const [startingBalance, setStartingBalance] = useState<number>(100000);
  const [slippage, setSlippage] = useState<number>(0.2); // 0.2% slippage standard
  const [tickSpeed, setTickSpeed] = useState<number>(3); // 3 second ticks
  const [isResetting, setIsResetting] = useState<boolean>(false);

  const handleReset = () => {
    setIsResetting(true);
    setTimeout(() => {
      setIsResetting(false);
      alert("Simulation ledger, positions, and history have been completely reset to factory defaults! 🚀");
    }, 1200);
  };

  return (
    <div className="max-w-3xl mx-auto p-4 lg:p-8 space-y-8">
      {/* Page Header */}
      <div className="border-b border-border/60 pb-6">
        <h1 className="text-3xl font-bold tracking-tight mb-2 bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">Simulator Settings</h1>
        <p className="text-muted-foreground text-sm">
          Customize matching engine parameters, tick frequencies, account multipliers, and audit defaults.
        </p>
      </div>

      {/* Adjusters Grid */}
      <div className="bg-card border border-border/80 rounded-xl p-6 shadow-xl space-y-6">
        <div className="flex items-center gap-2 border-b border-border/60 pb-4">
          <Sliders className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-bold text-white">Engine Parameters</h2>
        </div>

        <div className="space-y-6">
          {/* Starting Balance */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm font-semibold">
              <label className="text-muted-foreground flex items-center gap-1.5">
                Starting Mock Balance
                <span title="Configures default account balance on simulation resetting.">
                  <HelpCircle className="w-3.5 h-3.5 text-muted-foreground/60 cursor-help" />
                </span>
              </label>
              <span className="text-white font-bold">₹{startingBalance.toLocaleString()}</span>
            </div>
            <input 
              type="range" 
              min={10000} 
              max={1000000} 
              step={10000}
              value={startingBalance} 
              onChange={(e) => setStartingBalance(Number(e.target.value))}
              className="w-full h-1.5 bg-background rounded-lg appearance-none cursor-pointer accent-primary border border-border/60" 
            />
          </div>

          {/* Slippage Factor */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm font-semibold">
              <label className="text-muted-foreground flex items-center gap-1.5">
                Slippage Factor (Volatility Multiplier)
                <span title="Modulates the matching slippage incurred under heavy volatility spikes.">
                  <HelpCircle className="w-3.5 h-3.5 text-muted-foreground/60 cursor-help" />
                </span>
              </label>
              <span className="text-white font-bold">{slippage.toFixed(2)}%</span>
            </div>
            <input 
              type="range" 
              min={0.05} 
              max={1.5} 
              step={0.05}
              value={slippage} 
              onChange={(e) => setSlippage(Number(e.target.value))}
              className="w-full h-1.5 bg-background rounded-lg appearance-none cursor-pointer accent-primary border border-border/60" 
            />
          </div>

          {/* Clock Tick Frequency */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm font-semibold">
              <label className="text-muted-foreground flex items-center gap-1.5">
                Clock Tick Frequency
                <span title="Specifies the duration between incoming live data tick refreshes.">
                  <HelpCircle className="w-3.5 h-3.5 text-muted-foreground/60 cursor-help" />
                </span>
              </label>
              <span className="text-white font-bold">{tickSpeed}s</span>
            </div>
            <input 
              type="range" 
              min={1} 
              max={10} 
              step={1}
              value={tickSpeed} 
              onChange={(e) => setTickSpeed(Number(e.target.value))}
              className="w-full h-1.5 bg-background rounded-lg appearance-none cursor-pointer accent-primary border border-border/60" 
            />
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-[#0f080c] border border-rose-950/40 rounded-xl p-6 shadow-xl space-y-6">
        <div className="flex items-center gap-2 border-b border-rose-950/40 pb-4">
          <ShieldAlert className="w-5 h-5 text-rose-500" />
          <h2 className="text-lg font-bold text-rose-400">Danger Zone</h2>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-white">Reset Trading History</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Resets all active portfolio valuations, ledger logs, and matching history back to initial values. This action is irreversible.
            </p>
          </div>

          <button
            onClick={handleReset}
            disabled={isResetting}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-rose-950/60 border border-rose-800/40 hover:bg-rose-900/60 text-rose-200 text-xs font-bold transition-all shadow active:scale-95 shrink-0"
          >
            <RefreshCw className={cn("w-3.5 h-3.5", isResetting && "animate-spin")} />
            {isResetting ? "RESETTING ENGINE..." : "RESET ALL DATA"}
          </button>
        </div>
      </div>
    </div>
  );
}
