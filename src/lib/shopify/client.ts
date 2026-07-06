const DOMAIN = import.meta.env.VITE_SHOPIFY_DOMAIN;
const TOKEN = import.meta.env.VITE_SHOPIFY_STOREFRONT_TOKEN;
const API_VERSION = "2026-07";

export function isShopifyConfigured() {
  return Boolean(DOMAIN && TOKEN);
}

export async function shopifyFetch<T>(query: string, variables: Record<string, unknown> = {}): Promise<T> {
  if (!DOMAIN || !TOKEN) {
    throw new Error("Shopify is not configured. Add VITE_SHOPIFY_DOMAIN and VITE_SHOPIFY_STOREFRONT_TOKEN to your .env file.");
  }

  const response = await fetch(`https://${DOMAIN}/api/${API_VERSION}/graphql.json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": TOKEN,
    },
    body: JSON.stringify({ query, variables }),
  });

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
