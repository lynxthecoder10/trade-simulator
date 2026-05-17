import { MarketPhase } from './market-session';
import { globalEventBus, EventType } from '@trade/event-bus';

export class SimulationClock {
  private baseTime: number;
  private currentTicks: number = 0;
  private msPerTick: number;
  private currentPhase: MarketPhase;
  private isRunning: boolean = false;
  private intervalId: NodeJS.Timeout | null = null;
  private speedMultiplier: number = 1;

  constructor(baseTime: number = Date.now(), msPerTick: number = 1000, initialPhase: MarketPhase = MarketPhase.OPEN_VOLATILITY) {
    this.baseTime = baseTime;
    this.msPerTick = msPerTick;
    this.currentPhase = initialPhase;
  }

  start() {
    if (this.isRunning) return;
    this.isRunning = true;
    
    globalEventBus.publish(EventType.SESSION_STARTED, { 
      phase: this.currentPhase, 
      timestamp: this.getCurrentTime() 
    });

    this.tick();
  }

  stop() {
    this.isRunning = false;
    if (this.intervalId) {
      clearTimeout(this.intervalId);
      this.intervalId = null;
    }
    
    globalEventBus.publish(EventType.SESSION_ENDED, { 
      timestamp: this.getCurrentTime() 
    });
  }

  setSpeed(multiplier: number) {
    this.speedMultiplier = multiplier;
  }

  setPhase(phase: MarketPhase) {
    this.currentPhase = phase;
  }

  getCurrentTime(): number {
    return this.baseTime + (this.currentTicks * this.msPerTick);
  }

  getCurrentPhase(): MarketPhase {
    return this.currentPhase;
  }

  private tick = () => {
    if (!this.isRunning) return;

    this.currentTicks++;
    const nextTickDelay = this.msPerTick / this.speedMultiplier;

    // Simulate scheduling next tick based on multiplier
    this.intervalId = setTimeout(this.tick, nextTickDelay);
  }
}

export const globalClock = new SimulationClock();
