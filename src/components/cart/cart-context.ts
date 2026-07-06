import { createContext } from "react";
import type { CartContextValue } from "./CartProvider";

export const CartContext = createContext<CartContextValue | null>(null);
