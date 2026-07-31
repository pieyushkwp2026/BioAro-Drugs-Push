const SHOP_ID = import.meta.env.VITE_SHOPIFY_SHOP_ID;
const CLIENT_ID = import.meta.env.VITE_SHOPIFY_CUSTOMER_ACCOUNT_CLIENT_ID;
const API_VERSION = "2026-07";

const AUTHORIZE_ENDPOINT = `https://shopify.com/authentication/${SHOP_ID}/oauth/authorize`;
const TOKEN_ENDPOINT = `https://shopify.com/authentication/${SHOP_ID}/oauth/token`;
const LOGOUT_ENDPOINT = `https://shopify.com/authentication/${SHOP_ID}/logout`;
const GRAPHQL_ENDPOINT = `https://shopify.com/${SHOP_ID}/account/customer/api/${API_VERSION}/graphql`;

const SCOPES = "openid email customer-account-api:full";

const STORAGE_KEYS = {
  accessToken: "shopify_customer_access_token",
  refreshToken: "shopify_customer_refresh_token",
  idToken: "shopify_customer_id_token",
  expiresAt: "shopify_customer_token_expires_at",
};

const SESSION_KEYS = {
  verifier: "shopify_auth_code_verifier",
  state: "shopify_auth_state",
  returnTo: "shopify_auth_return_to",
};

export function isCustomerAuthConfigured() {
  return Boolean(SHOP_ID && CLIENT_ID);
}

// ---- PKCE helpers ----

function base64UrlEncode(buffer: ArrayBuffer) {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  bytes.forEach((b) => {
    binary += String.fromCharCode(b);
  });
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function generateRandomString(length: number) {
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return base64UrlEncode(array.buffer).slice(0, length);
}

async function generateCodeChallenge(verifier: string) {
  const encoder = new TextEncoder();
  const data = encoder.encode(verifier);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return base64UrlEncode(digest);
}

// ---- Token storage (localStorage, per confirmed BioAro Labs pattern) ----

export interface StoredTokens {
  accessToken: string;
  refreshToken: string;
  idToken: string;
  expiresAt: number; // epoch ms
}

export function getStoredTokens(): StoredTokens | null {
  const accessToken = localStorage.getItem(STORAGE_KEYS.accessToken);
  const refreshToken = localStorage.getItem(STORAGE_KEYS.refreshToken);
  const idToken = localStorage.getItem(STORAGE_KEYS.idToken);
  const expiresAt = localStorage.getItem(STORAGE_KEYS.expiresAt);

  if (!accessToken || !refreshToken || !expiresAt) return null;

  return {
    accessToken,
    refreshToken,
    idToken: idToken ?? "",
    expiresAt: Number(expiresAt),
  };
}

export function storeTokens(tokens: StoredTokens) {
  localStorage.setItem(STORAGE_KEYS.accessToken, tokens.accessToken);
  localStorage.setItem(STORAGE_KEYS.refreshToken, tokens.refreshToken);
  localStorage.setItem(STORAGE_KEYS.idToken, tokens.idToken);
  localStorage.setItem(STORAGE_KEYS.expiresAt, String(tokens.expiresAt));
}

export function clearStoredTokens() {
  localStorage.removeItem(STORAGE_KEYS.accessToken);
  localStorage.removeItem(STORAGE_KEYS.refreshToken);
  localStorage.removeItem(STORAGE_KEYS.idToken);
  localStorage.removeItem(STORAGE_KEYS.expiresAt);
}

// ---- Authorization flow ----

export async function startLogin(returnTo: string) {
  if (!isCustomerAuthConfigured()) {
    throw new Error(
      "Customer Account API is not configured. Add VITE_SHOPIFY_SHOP_ID and VITE_SHOPIFY_CUSTOMER_ACCOUNT_CLIENT_ID to your .env file.",
    );
  }

  const verifier = generateRandomString(64);
  const state = generateRandomString(32);
  const challenge = await generateCodeChallenge(verifier);

  sessionStorage.setItem(SESSION_KEYS.verifier, verifier);
  sessionStorage.setItem(SESSION_KEYS.state, state);
  sessionStorage.setItem(SESSION_KEYS.returnTo, returnTo);

  const redirectUri = `${window.location.origin}/auth/callback`;

  const params = new URLSearchParams({
    client_id: CLIENT_ID,
    response_type: "code",
    redirect_uri: redirectUri,
    scope: SCOPES,
    state,
    code_challenge: challenge,
    code_challenge_method: "S256",
  });

  window.location.href = `${AUTHORIZE_ENDPOINT}?${params.toString()}`;
}

export interface TokenExchangeResult {
  tokens: StoredTokens;
  returnTo: string;
}

export async function completeLogin(code: string, state: string): Promise<TokenExchangeResult> {
  const storedState = sessionStorage.getItem(SESSION_KEYS.state);
  const verifier = sessionStorage.getItem(SESSION_KEYS.verifier);
  const returnTo = sessionStorage.getItem(SESSION_KEYS.returnTo) ?? "/";

  if (!storedState || !verifier) {
    throw new Error("Missing login session data. Please try signing in again.");
  }

  if (state !== storedState) {
    throw new Error("Login state mismatch. Please try signing in again.");
  }

  const redirectUri = `${window.location.origin}/auth/callback`;

  const body = new URLSearchParams({
    grant_type: "authorization_code",
    client_id: CLIENT_ID,
    redirect_uri: redirectUri,
    code,
    code_verifier: verifier,
  });

  const response = await fetch(TOKEN_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: body.toString(),
  });

  if (!response.ok) {
    throw new Error("Failed to exchange authorization code for tokens.");
  }

  const json = (await response.json()) as {
    access_token: string;
    refresh_token: string;
    id_token?: string;
    expires_in: number;
  };

  const tokens: StoredTokens = {
    accessToken: json.access_token,
    refreshToken: json.refresh_token,
    idToken: json.id_token ?? "",
    expiresAt: Date.now() + json.expires_in * 1000,
  };

  storeTokens(tokens);
  sessionStorage.removeItem(SESSION_KEYS.verifier);
  sessionStorage.removeItem(SESSION_KEYS.state);
  sessionStorage.removeItem(SESSION_KEYS.returnTo);

  return { tokens, returnTo };
}

export async function refreshTokens(refreshToken: string): Promise<StoredTokens> {
  const body = new URLSearchParams({
    grant_type: "refresh_token",
    client_id: CLIENT_ID,
    refresh_token: refreshToken,
  });

  const response = await fetch(TOKEN_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: body.toString(),
  });

  if (!response.ok) {
    throw new Error("Failed to refresh session.");
  }

  const json = (await response.json()) as {
    access_token: string;
    refresh_token: string;
    id_token?: string;
    expires_in: number;
  };

  const tokens: StoredTokens = {
    accessToken: json.access_token,
    refreshToken: json.refresh_token,
    idToken: json.id_token ?? "",
    expiresAt: Date.now() + json.expires_in * 1000,
  };

  storeTokens(tokens);
  return tokens;
}

export function buildLogoutUrl(idToken: string) {
  const params = new URLSearchParams({
    id_token_hint: idToken,
    post_logout_redirect_uri: window.location.origin,
  });
  return `${LOGOUT_ENDPOINT}?${params.toString()}`;
}

// ---- Customer data ----

export interface ShopifyCustomer {
  id: string;
  firstName: string | null;
  lastName: string | null;
  emailAddress: string | null;
}

interface CustomerQueryData {
  customer: {
    id: string;
    firstName: string | null;
    lastName: string | null;
    emailAddress: { emailAddress: string } | null;
  };
}

export async function fetchCustomer(accessToken: string): Promise<ShopifyCustomer> {
  const query = `
    query CustomerDetails {
      customer {
        id
        firstName
        lastName
        emailAddress {
          emailAddress
        }
      }
    }
  `;

  const response = await fetch(GRAPHQL_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ query }),
  });

  if (!response.ok) {
    throw new Error(`Customer Account API request failed with status ${response.status}.`);
  }

  const json = (await response.json()) as {
    data?: CustomerQueryData;
    errors?: Array<{ message?: string }>;
  };

  if (json.errors?.length) {
    throw new Error(json.errors[0]?.message ?? "Customer Account API GraphQL error");
  }

  if (!json.data) {
    throw new Error("Customer Account API returned no data.");
  }

  return {
    id: json.data.customer.id,
    firstName: json.data.customer.firstName,
    lastName: json.data.customer.lastName,
    emailAddress: json.data.customer.emailAddress?.emailAddress ?? null,
  };
}