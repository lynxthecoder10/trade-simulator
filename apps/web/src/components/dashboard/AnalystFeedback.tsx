'use client';

import { useState, useEffect } from 'react';
import { globalAdaptiveAnalyst, Recommendation, ConfidenceLevel } from '@trade/adaptive-analyst';
import { globalEventBus, EventType } from '@trade/event-bus';
import { Brain, AlertCircle, TrendingUp, ShieldCheck } from 'lucide-react';
import { clsx } from 'clsx';

export function AnalystFeedback({ symbol }: { symbol: string }) {
  const [recommendation, setRecommendation] = useState<Recommendation | null>(null);

  useEffect(() => {
    // Generate initial recommendation
    const initial = globalAdaptiveAnalyst.analyzeAsset(symbol, 0.5, 0.5);
    setRecommendation(initial);

    // Refresh recommendation on ticks
    const unsubscribe = globalEventBus.subscribe(EventType.MARKET_TICK, (payload: any) => {
      if (payload.symbol === symbol) {
        // In real use, we'd pull volatility/momentum from Signal Engine
        const next = globalAdaptiveAnalyst.analyzeAsset(symbol, Math.random(), Math.random());
        setRecommendation(next);
      }
    });

    return () => {
      if (typeof unsubscribe === 'function') unsubscribe();
      else if (unsubscribe && 'unsubscribe' in unsubscribe) (unsubscribe as any).unsubscribe();
    };
  }, [symbol]);

  if (!recommendation) return null;

  const config = {
    [ConfidenceLevel.HIGH]: { color: 'text-emerald-400', bg: 'bg-emerald-400/10', icon: ShieldCheck, label: 'High Confidence' },
    [ConfidenceLevel.MEDIUM]: { color: 'text-blue-400', bg: 'bg-blue-400/10', icon: TrendingUp, label: 'Moderate' },
    [ConfidenceLevel.LOW]: { color: 'text-amber-400', bg: 'bg-amber-400/10', icon: AlertCircle, label: 'Low Confidence' },
    [ConfidenceLevel.AVOID]: { color: 'text-rose-400', bg: 'bg-rose-400/10', icon: AlertCircle, label: 'Avoid Action' },
  }[recommendation.confidence];

  const Icon = config.icon;

  return (
    <div className={clsx("rounded-xl border border-white/5 p-4 transition-all duration-500", config.bg)}>
      <div className="flex items-center gap-3 mb-3">
        <div className="p-2 rounded-lg bg-white/5">
          <Brain className="w-5 h-5 text-indigo-400" />
        </div>
        <div>
          <h4 className="text-sm font-semibold text-white/90">Adaptive Analyst</h4>
          <div className={clsx("text-xs font-medium uppercase tracking-wider", config.color)}>
            {config.label}
          </div>
        </div>
      </div>

      <div className="space-y-2">
        {recommendation.reasons.map((reason, idx) => (
          <div key={idx} className="flex gap-2 text-xs text-white/60">
            <div className="mt-1.5 w-1 h-1 rounded-full bg-white/20 shrink-0" />
            <span>{reason}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
