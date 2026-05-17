export const getDeterministicTimestamp = (baseTimeMs: number, ticksElapsed: number, msPerTick: number): number => {
  return baseTimeMs + (ticksElapsed * msPerTick);
};
