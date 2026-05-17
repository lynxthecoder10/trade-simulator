import { EventType, TradeEventPayloads } from './event-types';

type Subscriber<T extends EventType> = (payload: TradeEventPayloads[T]) => void;

class EventBus {
  private subscribers: Map<EventType, Set<Subscriber<any>>> = new Map();

  subscribe<T extends EventType>(eventType: T, callback: Subscriber<T>): () => void {
    if (!this.subscribers.has(eventType)) {
      this.subscribers.set(eventType, new Set());
    }
    
    this.subscribers.get(eventType)!.add(callback);

    // Return unsubscribe function
    return () => {
      const set = this.subscribers.get(eventType);
      if (set) {
        set.delete(callback);
        if (set.size === 0) {
          this.subscribers.delete(eventType);
        }
      }
    };
  }

  publish<T extends EventType>(eventType: T, payload: TradeEventPayloads[T]): void {
    const set = this.subscribers.get(eventType);
    if (set) {
      set.forEach(callback => {
        try {
          callback(payload);
        } catch (error) {
          console.error(`Error executing subscriber for event ${eventType}:`, error);
        }
      });
    }
  }

  clear(): void {
    this.subscribers.clear();
  }
}

export const globalEventBus = new EventBus();
