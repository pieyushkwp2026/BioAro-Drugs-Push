import { createContext } from "react";

export interface AiChatContextValue {
  isOpen: boolean;
  openChat: (seedQuestion?: string) => void;
  closeChat: () => void;
  /** Consumed once by the widget when it mounts a seeded question. */
  seed: string | null;
  clearSeed: () => void;
}

/*
 * Kept in its own module so the provider file exports only a component. Vite's fast
 * refresh warns when a file mixes component and non-component exports, and the cart
 * context in this project already follows the same split.
 */
export const AiChatContext = createContext<AiChatContextValue | null>(null);
