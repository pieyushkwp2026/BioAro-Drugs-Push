import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useMarket } from "../../hooks/useMarket";
import { addCartItem, loadCart, removeCartLine, syncCartMarket, updateCartLine } from "../../lib/shopify/cartService";
import type { CartState, CatalogProduct } from "../../lib/shopify/types";
import { CartContext } from "./cart-context";

export interface CartContextValue {
  cart: CartState;
  isLoading: boolean;
  isOpen: boolean;
  error: string | null;
  openCart: () => void;
  closeCart: () => void;
  addProduct: (product: CatalogProduct, quantity?: number) => Promise<void>;
  updateQuantity: (lineId: string, quantity: number) => Promise<void>;
  removeLine: (lineId: string) => Promise<void>;
}

function createEmptyCart(country: "US" | "CA" | "GB"): CartState {
  const currencyCode = country === "CA" ? "CAD" : country === "GB" ? "GBP" : "USD";
  return {
    id: "",
    checkoutUrl: null,
    totalQuantity: 0,
    subtotal: { amount: 0, currencyCode },
    total: { amount: 0, currencyCode },
    lines: [],
    isPreview: false,
  };
}

export function CartProvider({ children }: { children: ReactNode }) {
  const { country } = useMarket();
  const [cart, setCart] = useState<CartState>(() => createEmptyCart(country));
  const [isLoading, setIsLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setIsLoading(true);
    setError(null);

    void (async () => {
      try {
        const loadedCart = await loadCart(country);
        if (!active) return;
        setCart(loadedCart);
      } catch (loadError) {
        if (!active) return;
        setCart(createEmptyCart(country));
        setError(loadError instanceof Error ? loadError.message : "Unable to load cart.");
      } finally {
        if (active) setIsLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, [country]);

  useEffect(() => {
    if (!cart.id || cart.isPreview) return;

    let active = true;
    void (async () => {
      try {
        const syncedCart = await syncCartMarket(country);
        if (active) setCart(syncedCart);
      } catch {
        if (active) setError("Unable to refresh cart pricing for the selected market.");
      }
    })();

    return () => {
      active = false;
    };
  }, [cart.id, cart.isPreview, country]);

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);

  const runCartAction = useCallback(
    async (action: () => Promise<CartState>) => {
      setIsLoading(true);
      setError(null);
      try {
        const nextCart = await action();
        setCart(nextCart);
        setIsOpen(true);
      } catch (actionError) {
        setError(actionError instanceof Error ? actionError.message : "Unable to update cart.");
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  const addProduct = useCallback(
    async (product: CatalogProduct, quantity = 1) => {
      await runCartAction(() => addCartItem(product, quantity, country));
    },
    [country, runCartAction],
  );

  const updateQuantity = useCallback(
    async (lineId: string, quantity: number) => {
      await runCartAction(() => updateCartLine(lineId, quantity, country));
    },
    [country, runCartAction],
  );

  const removeLine = useCallback(
    async (lineId: string) => {
      await runCartAction(() => removeCartLine(lineId, country));
    },
    [country, runCartAction],
  );

  const value = useMemo(
    () => ({
      cart,
      isLoading,
      isOpen,
      error,
      openCart,
      closeCart,
      addProduct,
      updateQuantity,
      removeLine,
    }),
    [addProduct, cart, error, isLoading, isOpen, removeLine, updateQuantity],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
