import { createContext } from "react";
import type { MarketContextValue } from "./context";

export const MarketContext = createContext<MarketContextValue | null>(null);
