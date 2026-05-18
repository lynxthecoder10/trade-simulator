'use client';

import React from 'react';
import { HelpCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TooltipProps {
  title: string;
  content: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
}

export function Tooltip({ title, content, position = 'top', className }: TooltipProps) {
  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2 origin-bottom',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2 origin-top',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2 origin-right',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2 origin-left',
  };

  return (
    <span className={cn("inline-flex items-center justify-center relative group shrink-0 select-none cursor-help", className)}>
      <span className="w-3.5 h-3.5 flex items-center justify-center rounded-full bg-[#182235] text-muted-foreground group-hover:bg-primary/20 group-hover:text-primary transition-all text-[9px] font-black border border-border/80">
        ?
      </span>
      
      {/* Popover Bubble */}
      <span 
        className={cn(
          "absolute scale-90 opacity-0 pointer-events-none group-hover:scale-100 group-hover:opacity-100 transition-all duration-200 z-[999] w-64 p-3.5 rounded-lg border border-border/80 bg-[#090d16]/98 backdrop-blur-lg shadow-[0_10px_30px_rgba(0,0,0,0.8)] text-left font-normal normal-case whitespace-normal leading-relaxed text-muted-foreground",
          positionClasses[position]
        )}
      >
        <span className="block text-xs font-bold text-white mb-1.5 border-b border-border/60 pb-1.5 flex items-center gap-1.5">
          <HelpCircle className="w-3 h-3 text-primary shrink-0" />
          {title}
        </span>
        <span className="block text-[11px] text-slate-300">
          {content}
        </span>
      </span>
    </span>
  );
}
