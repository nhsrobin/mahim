
export type AppState = 'INITIAL' | 'CELEBRATING' | 'GIFT_PENDING' | 'PRANK' | 'EXPOSED';

export interface ConfettiOptions {
  particleCount: number;
  spread: number;
  origin: { x: number; y: number };
  colors?: string[];
}

declare global {
  interface Window {
    confetti: (options: ConfettiOptions) => void;
  }
}
