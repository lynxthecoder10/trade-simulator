'use client';

import { BookOpen, HelpCircle, CheckCircle, ChevronRight, Award, Shield } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

export default function LearnPage() {
  const [activeTab, setActiveTab] = useState<'lessons' | 'quiz'>('lessons');
  const [selectedQuizAnswer, setSelectedQuizAnswer] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  const lessons = [
    { title: 'Kelly Criterion & Position Sizing', duration: '8 mins', desc: 'Calculate the mathematical optimal trade size to maximize long-term compound growth while avoiding capital ruin.', difficulty: 'Intermediate', points: '120 XP' },
    { title: 'Market vs Limit Executions', duration: '5 mins', desc: 'Understand queue priorities, order books, slippage, and spread dynamics across varying market depth cycles.', difficulty: 'Beginner', points: '80 XP' },
    { title: 'RSI & Dynamic Momentum Triggers', duration: '12 mins', desc: 'Calculate Relative Strength Index (RSI) triggers and identify divergences to capture high-probability momentum reversals.', difficulty: 'Advanced', points: '200 XP' },
  ];

  const quizQuestion = {
    question: "If a trading account has ₹1,00,000 and the maximum risk limit per trade is 1.5%, what is the maximum loss amount allowed if a stop-loss is triggered?",
    options: [
      "₹150",
      "₹1,500",
      "₹15,000",
      "₹150,000"
    ],
    correctIdx: 1,
    explanation: "Correct! 1.5% of ₹1,00,000 is calculated as: 1,00,000 * 0.015 = ₹1,500. This is the absolute maximum loss threshold allowed for single positions."
  };

  return (
    <div className="max-w-4xl mx-auto p-4 lg:p-8 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-border/60 pb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2 bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">Institutional Learning Core</h1>
          <p className="text-muted-foreground text-sm">
            Master professional-grade risk management mechanics, order execution parameters, and cognitive behavioral disciplines.
          </p>
        </div>

        {/* User Rank Indicator */}
        <div className="flex items-center gap-3 bg-primary/5 border border-primary/20 rounded-xl px-4 py-2 self-start md:self-auto shrink-0 shadow-lg">
          <Award className="w-5 h-5 text-primary" />
          <div>
            <div className="text-xs text-muted-foreground font-semibold">ACADEMY RANK</div>
            <div className="text-sm font-black text-white">PRO DIGEST / Lvl 4</div>
          </div>
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="flex bg-background border border-border/60 rounded-xl p-1 self-start max-w-xs shadow-inner">
        <button
          onClick={() => setActiveTab('lessons')}
          className={cn(
            "flex-1 text-center py-2 px-4 rounded-lg text-sm font-semibold transition-all",
            activeTab === 'lessons'
              ? "bg-primary text-primary-foreground shadow-sm font-bold"
              : "text-muted-foreground hover:text-white"
          )}
        >
          Curriculum
        </button>
        <button
          onClick={() => setActiveTab('quiz')}
          className={cn(
            "flex-1 text-center py-2 px-4 rounded-lg text-sm font-semibold transition-all",
            activeTab === 'quiz'
              ? "bg-primary text-primary-foreground shadow-sm font-bold"
              : "text-muted-foreground hover:text-white"
          )}
        >
          Daily Challenge
        </button>
      </div>

      {/* Tab Contents */}
      {activeTab === 'lessons' ? (
        <div className="space-y-4">
          {lessons.map((lesson) => (
            <div 
              key={lesson.title} 
              className="bg-card border border-border/80 rounded-xl p-5 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-primary/40 transition-all duration-300 group"
            >
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2">
                  <span className={cn(
                    "text-[10px] font-extrabold tracking-wider uppercase px-2 py-0.5 rounded border",
                    lesson.difficulty === 'Beginner' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' :
                    lesson.difficulty === 'Intermediate' ? 'bg-sky-500/10 border-sky-500/30 text-sky-400' :
                    'bg-indigo-500/10 border-indigo-500/30 text-indigo-400'
                  )}>
                    {lesson.difficulty}
                  </span>
                  <span className="text-xs text-muted-foreground font-medium">{lesson.duration}</span>
                </div>
                <h3 className="text-base font-bold text-white group-hover:text-primary transition-colors">{lesson.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{lesson.desc}</p>
              </div>

              <div className="flex items-center gap-4 shrink-0">
                <div className="text-right">
                  <div className="text-xs text-muted-foreground font-semibold">AWARD</div>
                  <div className="text-xs font-black text-primary">{lesson.points}</div>
                </div>
                <div className="p-2 rounded bg-background border border-border group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-card border border-border/80 rounded-xl p-6 shadow-xl space-y-6">
          <div className="flex items-center gap-2 border-b border-border/60 pb-4">
            <HelpCircle className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-bold text-white">Daily Simulation Challenge</h2>
          </div>

          <div className="space-y-4">
            <p className="text-sm font-semibold text-white leading-relaxed">{quizQuestion.question}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {quizQuestion.options.map((opt, idx) => (
                <button
                  key={opt}
                  disabled={quizSubmitted}
                  onClick={() => setSelectedQuizAnswer(idx)}
                  className={cn(
                    "p-4 border rounded-xl text-left text-sm font-semibold transition-all duration-200 outline-none flex items-center justify-between",
                    selectedQuizAnswer === idx
                      ? quizSubmitted
                        ? idx === quizQuestion.correctIdx
                          ? "bg-emerald-500/10 border-emerald-500/50 text-emerald-400"
                          : "bg-rose-500/10 border-rose-500/50 text-rose-400"
                        : "bg-primary/10 border-primary text-primary-foreground"
                      : quizSubmitted && idx === quizQuestion.correctIdx
                        ? "bg-emerald-500/10 border-emerald-500/50 text-emerald-400"
                        : "bg-background hover:bg-muted/30 border-border/80 text-muted-foreground hover:text-white"
                  )}
                >
                  <span>{opt}</span>
                  {quizSubmitted && idx === quizQuestion.correctIdx && (
                    <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                  )}
                </button>
              ))}
            </div>

            {!quizSubmitted ? (
              <button
                disabled={selectedQuizAnswer === null}
                onClick={() => setQuizSubmitted(true)}
                className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-extrabold text-sm shadow-md hover:opacity-95 disabled:opacity-50 transition-opacity active:scale-98"
              >
                SUBMIT ATTEMPT
              </button>
            ) : (
              <div className="p-4 rounded-lg bg-background border border-border/80 space-y-2 animate-fadeIn">
                <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-white">
                  <Shield className="w-4 h-4 text-primary" />
                  Execution Audit Review
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">{quizQuestion.explanation}</p>
                <button
                  onClick={() => {
                    setSelectedQuizAnswer(null);
                    setQuizSubmitted(false);
                  }}
                  className="mt-2 text-xs font-bold text-primary hover:underline"
                >
                  Retry Challenge
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
