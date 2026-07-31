import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  buildLogoutUrl,
  clearStoredTokens,
  completeLogin,
  fetchCustomer,
  getStoredTokens,
  isCustomerAuthConfigured,
  refreshTokens,
  startLogin,
  type ShopifyCustomer,
  type StoredTokens,
} from "../../lib/shopify/customerAuth";
import { AuthContext } from "./auth-context";

const REFRESH_INTERVAL_MS = 30_000;
const REFRESH_BUFFER_MS = 60_000;

export interface AuthContextValue {
  isAuthenticated: boolean;
  isLoading: boolean;
  customer: ShopifyCustomer | null;
  error: string | null;
  login: (returnTo?: string) => Promise<void>;
  handleCallback: (code: string, state: string) => Promise<string>;
  logout: () => void;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [customer, setCustomer] = useState<ShopifyCustomer | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const tokensRef = useRef<StoredTokens | null>(null);

  const loadCustomer = useCallback(async (tokens: StoredTokens) => {
    const fetchedCustomer = await fetchCustomer(tokens.accessToken);
    setCustomer(fetchedCustomer);
  }, []);

  const ensureFreshTokens = useCallback(async (): Promise<StoredTokens | null> => {
    const stored = tokensRef.current ?? getStoredTokens();
    if (!stored) return null;

    const isExpiringSoon = Date.now() >= stored.expiresAt - REFRESH_BUFFER_MS;
    if (!isExpiringSoon) {
      tokensRef.current = stored;
      return stored;
    }

    try {
      const refreshed = await refreshTokens(stored.refreshToken);
      tokensRef.current = refreshed;
      return refreshed;
    } catch {
      clearStoredTokens();
      tokensRef.current = null;
      setCustomer(null);
      return null;
    }
  }, []);

  useEffect(() => {
    let active = true;

    void (async () => {
      if (!isCustomerAuthConfigured()) {
        if (active) setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const tokens = await ensureFreshTokens();
        if (!tokens) {
          if (active) setIsLoading(false);
          return;
        }
        await loadCustomer(tokens);
      } catch {
        clearStoredTokens();
        tokensRef.current = null;
        if (active) setCustomer(null);
      } finally {
        if (active) setIsLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, [ensureFreshTokens, loadCustomer]);

  useEffect(() => {
    const interval = window.setInterval(() => {
      void (async () => {
        const tokens = await ensureFreshTokens();
        if (!tokens) return;
        try {
          await loadCustomer(tokens);
        } catch {
          // Transient network error — keep existing session, don't log out.
        }
      })();
    }, REFRESH_INTERVAL_MS);

    return () => window.clearInterval(interval);
  }, [ensureFreshTokens, loadCustomer]);

  const login = useCallback(async (returnTo?: string) => {
    setError(null);
    try {
      await startLogin(returnTo ?? window.location.pathname);
    } catch (loginError) {
      setError(
        loginError instanceof Error ? loginError.message : "Unable to start sign-in. Please try again.",
      );
    }
  }, []);

  const handleCallback = useCallback(
    async (code: string, state: string) => {
      setIsLoading(true);
      setError(null);
      try {
        const { tokens, returnTo } = await completeLogin(code, state);
        tokensRef.current = tokens;
        await loadCustomer(tokens);
        return returnTo;
      } catch (callbackError) {
        setError(
          callbackError instanceof Error ? callbackError.message : "Sign-in failed. Please try again.",
        );
        throw callbackError;
      } finally {
        setIsLoading(false);
      }
    },
    [loadCustomer],
  );

  const logout = useCallback(() => {
    const tokens = tokensRef.current ?? getStoredTokens();
    const idToken = tokens?.idToken;
    clearStoredTokens();
    tokensRef.current = null;
    setCustomer(null);
    if (idToken) {
      window.location.href = buildLogoutUrl(idToken);
    } else {
      window.location.href = "/";
    }
  }, []);

  const value = useMemo(
    () => ({
      isAuthenticated: Boolean(customer),
      isLoading,
      customer,
      error,
      login,
      handleCallback,
      logout,
    }),
    [customer, error, handleCallback, isLoading, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}