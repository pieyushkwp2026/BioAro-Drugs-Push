import { useCallback, useMemo, useState, type ReactNode } from "react";
import { AiChatContext } from "./chat-context";

/*
 * Holds the open state for BioAro Drugs AI so anything on the page can raise it —
 * the band's CTA, the corner launcher, and any future entry point — without each
 * one owning its own copy of the panel.
 */
export function AiChatProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [seed, setSeed] = useState<string | null>(null);

  const openChat = useCallback((seedQuestion?: string) => {
    if (seedQuestion) setSeed(seedQuestion);
    setIsOpen(true);
  }, []);

  const closeChat = useCallback(() => setIsOpen(false), []);
  const clearSeed = useCallback(() => setSeed(null), []);

  const value = useMemo(
    () => ({ isOpen, openChat, closeChat, seed, clearSeed }),
    [isOpen, openChat, closeChat, seed, clearSeed],
  );

  return <AiChatContext.Provider value={value}>{children}</AiChatContext.Provider>;
}
