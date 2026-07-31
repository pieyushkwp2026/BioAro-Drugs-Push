const DOMAIN = import.meta.env.VITE_SHOPIFY_DOMAIN;
const TOKEN = import.meta.env.VITE_SHOPIFY_STOREFRONT_TOKEN;
const API_VERSION = "2026-07";
const SHOPIFY_REQUEST_TIMEOUT_MS = 8000;

export function isShopifyConfigured() {
  return Boolean(DOMAIN && TOKEN);
}

export async function shopifyFetch<T>(query: string, variables: Record<string, unknown> = {}): Promise<T> {
  if (!DOMAIN || !TOKEN) {
    throw new Error("Shopify is not configured. Add VITE_SHOPIFY_DOMAIN and VITE_SHOPIFY_STOREFRONT_TOKEN to your .env file.");
  }

  const controller = new AbortController();
  const timeout = globalThis.setTimeout(() => controller.abort(), SHOPIFY_REQUEST_TIMEOUT_MS);

  const response = await fetch(`https://${DOMAIN}/api/${API_VERSION}/graphql.json`, {
    method: "POST",
    signal: controller.signal,
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": TOKEN,
    },
    body: JSON.stringify({ query, variables }),
  }).finally(() => globalThis.clearTimeout(timeout));

  if (!response.ok) {
    throw new Error(`Shopify request failed with status ${response.status}.`);
  }

  const json = (await response.json()) as {
    data?: T;
    errors?: Array<{ message?: string }>;
  };

  if (json.errors?.length) {
    throw new Error(json.errors[0]?.message ?? "Shopify GraphQL error");
  }

  if (!json.data) {
    throw new Error("Shopify returned no data.");
  }

  return json.data;
}
