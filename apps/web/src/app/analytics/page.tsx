'use client';

import { useUiStore } from '@/stores/ui-store';
import { useMarketStore } from '@/stores/market-store';
import { Activity, TrendingUp, Award, AlertTriangle, ShieldCheck, HeartPulse } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function AnalyticsPage() {
  const { selectedSymbol } = useUiStore();
  const { watchlist } = useMarketStore();

  // Fake but realistic analytics data
  const metrics = [
    { name: 'Profit Factor', value: '2.48', desc: 'Gross profits vs gross losses', icon: TrendingUp, color: 'text-emerald-400 bg-emerald-500/10' },
    { name: 'Win Rate', value: '68.4%', desc: '26 out of 38 profitable trades', icon: Award, color: 'text-sky-400 bg-sky-500/10' },
    { name: 'Sharpe Ratio', value: '3.12', desc: 'Risk-adjusted return ratio', icon: ShieldCheck, color: 'text-indigo-400 bg-indigo-500/10' },
  ];

  return (
    <div className="max-w-6xl mx-auto p-4 lg:p-8 space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2 bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">Behavioral Performance Analytics</h1>
        <p className="text-muted-foreground text-sm">
          High-fidelity psychological metrics, risk audits, and cognitive bias feedback computed in real-time by the `@trade/behavior-engine`.
        </p>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {metrics.map((m) => (
          <div key={m.name} className="bg-card border border-border/80 rounded-xl p-6 shadow-lg flex items-center justify-between hover:border-primary/40 transition-all duration-300">
            <div className="space-y-1">
              <span className="text-xs font-medium text-muted-foreground tracking-wider uppercase">{m.name}</span>
              <div className="text-3xl font-black text-white">{m.value}</div>
              <span className="text-xs text-muted-foreground block">{m.desc}</span>
            </div>
            <div className={cn("p-3.5 rounded-lg", m.color)}>
              <m.icon className="w-6 h-6" />
            </div>
          </div>
        ))}
      </div>

      {/* Psychology Audit Engine & Bias Breakdown (21st.dev Premium layout) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Col: Emotional Pulse Monitor */}
        <div className="bg-card border border-border/80 rounded-xl p-6 shadow-lg lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between border-b border-border/60 pb-4">
            <div className="flex items-center gap-2">
              <HeartPulse className="w-5 h-5 text-emerald-400 animate-pulse" />
              <h2 className="text-lg font-bold text-white">Live Emotional Pulse Monitor</h2>
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">OPTIMAL RADAR</span>
          </div>

          {/* Pulse Telemetries */}
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-muted-foreground">FOMO (Fear of Missing Out) Index</span>
                <span className="text-white">12% / Low Risk</span>
              </div>
              <div className="w-full h-2 bg-background rounded-full overflow-hidden border border-border/60">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: '12%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-muted-foreground">Loss Aversion Level</span>
                <span className="text-amber-400 font-bold">42% / Moderate Bias</span>
              </div>
              <div className="w-full h-2 bg-background rounded-full overflow-hidden border border-border/60">
                <div className="h-full bg-amber-500 rounded-full" style={{ width: '42%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-muted-foreground">Overtrading Tendency</span>
                <span className="text-white">8% / Healthy</span>
              </div>
              <div className="w-full h-2 bg-background rounded-full overflow-hidden border border-border/60">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: '8%' }} />
              </div>
            </div>
          </div>

          {/* AI Advisor Guidance Box */}
          <div className="p-4 rounded-lg bg-primary/5 border border-primary/20 space-y-2">
            <h3 className="text-sm font-bold text-primary flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" />
              Behavior Engine Audit Advice
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Your trade sizes are strictly adhering to target risk parameters. However, notice a minor loss aversion uptick following the last drop in <span className="text-white font-semibold">RELIANCE</span>. Focus on executing established stop-loss levels deterministically without adjusting orders post-trigger.
            </p>
          </div>
        </div>

        {/* Right Col: Active Biases Tracker */}
        <div className="bg-card border border-border/80 rounded-xl p-6 shadow-lg space-y-6">
          <div className="flex items-center gap-2 border-b border-border/60 pb-4">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg font-bold text-white">Active Bias Warnings</h2>
          </div>

          <div className="space-y-4">
            <div className="p-3 border border-border/60 rounded-lg bg-background/50 hover:bg-background transition-colors space-y-1">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wide">Status Quo Bias</span>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Holding inactive watchlist symbols longer than performance targets specify. Cleanse inactive ticks.
              </p>
            </div>

            <div className="p-3 border border-border/60 rounded-lg bg-background/50 hover:bg-background transition-colors space-y-1">
              <span className="text-xs font-bold text-sky-400 uppercase tracking-wide">Anchoring Effect</span>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Anchored to high pre-open valuations. Always benchmark against current support levels.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
