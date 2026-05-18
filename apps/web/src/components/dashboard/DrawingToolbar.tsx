'use client';

import { useState } from 'react';
import { 
  Move, 
  TrendingUp, 
  Grid3X3, 
  Brush, 
  Type, 
  Smile, 
  Ruler, 
  Search, 
  Magnet, 
  Lock, 
  Unlock, 
  Eye, 
  EyeOff, 
  Trash2 
} from 'lucide-react';
import { cn } from '@/lib/utils';

export function DrawingToolbar() {
  const [activeTool, setActiveTool] = useState<string>('cursor');
  const [isLocked, setIsLocked] = useState<boolean>(false);
  const [isDrawingVisible, setIsDrawingVisible] = useState<boolean>(true);
  const [isMagnetActive, setIsMagnetActive] = useState<boolean>(false);

  const tools = [
    { id: 'cursor', title: 'Crosshair / Cursor (V)', icon: Move },
    { id: 'trend', title: 'Trend Line drawing (T)', icon: TrendingUp },
    { id: 'fib', title: 'Fibonacci Retracement (F)', icon: Grid3X3 },
    { id: 'brush', title: 'Brush & Geometric Pen (B)', icon: Brush },
    { id: 'text', title: 'Text Annotation (A)', icon: Type },
    { id: 'smiley', title: 'Icons & Emoji Markers', icon: Smile },
    { id: 'ruler', title: 'Measure Price & Bars (Shift+Click)', icon: Ruler },
    { id: 'zoom', title: 'Zoom Area Selector', icon: Search },
  ];

  const handleToolClick = (toolId: string) => {
    setActiveTool(toolId);
  };

  const handleClearDrawings = () => {
    alert("Simulated canvas cleared! Drawing vectors successfully removed. 🧹");
  };

  return (
    <div className="w-[42px] h-full bg-[#090d16] border-r border-border/80 flex flex-col items-center py-2 shrink-0 select-none z-10 gap-1.5 transition-all">
      {/* Dynamic Tools */}
      {tools.map((tool) => {
        const IconComponent = tool.icon;
        const isActive = activeTool === tool.id;

        return (
          <button
            key={tool.id}
            onClick={() => handleToolClick(tool.id)}
            className={cn(
              "w-8 h-8 rounded flex items-center justify-center transition-all duration-150 transform active:scale-95 group relative border border-transparent",
              isActive 
                ? "bg-primary/20 text-primary border-primary/30 shadow-inner" 
                : "text-muted-foreground hover:bg-muted/30 hover:text-white"
            )}
            title={tool.title}
          >
            <IconComponent className="w-4 h-4" />
            
            {/* Float Tooltip */}
            <span className="absolute left-[50px] z-50 scale-0 group-hover:scale-100 transition-all duration-150 origin-left px-2 py-1 rounded bg-[#0b0f19] border border-border text-[10px] font-bold text-white shadow-xl pointer-events-none whitespace-nowrap">
              {tool.title}
            </span>
          </button>
        );
      })}

      <div className="w-6 h-[1px] bg-border/80 my-1 shrink-0" />

      {/* Magnet toggle */}
      <button
        onClick={() => setIsMagnetActive(!isMagnetActive)}
        className={cn(
          "w-8 h-8 rounded flex items-center justify-center transition-all transform active:scale-95 group relative border border-transparent",
          isMagnetActive 
            ? "bg-indigo-500/20 text-indigo-400 border-indigo-500/30" 
            : "text-muted-foreground hover:bg-muted/30 hover:text-white"
        )}
        title="Magnet Mode (Snaps to HLC ticks)"
      >
        <Magnet className="w-4 h-4" />
        <span className="absolute left-[50px] z-50 scale-0 group-hover:scale-100 transition-all duration-150 origin-left px-2 py-1 rounded bg-[#0b0f19] border border-border text-[10px] font-bold text-white shadow-xl pointer-events-none whitespace-nowrap">
          Magnet Mode {isMagnetActive ? '(ON)' : '(OFF)'}
        </span>
      </button>

      {/* Lock toggle */}
      <button
        onClick={() => setIsLocked(!isLocked)}
        className={cn(
          "w-8 h-8 rounded flex items-center justify-center transition-all transform active:scale-95 group relative border border-transparent",
          isLocked 
            ? "bg-amber-500/20 text-amber-400 border-amber-500/30" 
            : "text-muted-foreground hover:bg-muted/30 hover:text-white"
        )}
        title="Lock All Drawing Tools"
      >
        {isLocked ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
        <span className="absolute left-[50px] z-50 scale-0 group-hover:scale-100 transition-all duration-150 origin-left px-2 py-1 rounded bg-[#0b0f19] border border-border text-[10px] font-bold text-white shadow-xl pointer-events-none whitespace-nowrap">
          {isLocked ? 'Lock Drawings (ON)' : 'Lock Drawings (OFF)'}
        </span>
      </button>

      {/* Hide drawings toggle */}
      <button
        onClick={() => setIsDrawingVisible(!isDrawingVisible)}
        className={cn(
          "w-8 h-8 rounded flex items-center justify-center transition-all transform active:scale-95 group relative border border-transparent",
          !isDrawingVisible 
            ? "bg-rose-500/20 text-rose-400 border-rose-500/30" 
            : "text-muted-foreground hover:bg-muted/30 hover:text-white"
        )}
        title="Hide All Drawings"
      >
        {isDrawingVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
        <span className="absolute left-[50px] z-50 scale-0 group-hover:scale-100 transition-all duration-150 origin-left px-2 py-1 rounded bg-[#0b0f19] border border-border text-[10px] font-bold text-white shadow-xl pointer-events-none whitespace-nowrap">
          {isDrawingVisible ? 'Drawings Visible' : 'Drawings Hidden'}
        </span>
      </button>

      {/* Delete/Clear drawings */}
      <button
        onClick={handleClearDrawings}
        className="w-8 h-8 rounded flex items-center justify-center text-muted-foreground hover:bg-rose-500/10 hover:text-rose-400 transition-all transform active:scale-95 group relative border border-transparent mt-auto"
        title="Clear All Drawings"
      >
        <Trash2 className="w-4 h-4" />
        <span className="absolute left-[50px] z-50 scale-0 group-hover:scale-100 transition-all duration-150 origin-left px-2 py-1 rounded bg-[#0b0f19] border border-border text-[10px] font-bold text-white shadow-xl pointer-events-none whitespace-nowrap">
          Clear All Drawings
        </span>
      </button>
    </div>
  );
}
