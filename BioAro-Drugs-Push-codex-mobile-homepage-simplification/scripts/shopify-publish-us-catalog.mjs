const SHOP_DOMAIN = process.env.SHOPIFY_ADMIN_SHOP_DOMAIN || "qumtna-6b.myshopify.com";
const ACCESS_TOKEN = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;
const API_VERSION = process.env.SHOPIFY_ADMIN_API_VERSION || "2026-07";

if (!ACCESS_TOKEN) {
  throw new Error("Missing SHOPIFY_ADMIN_ACCESS_TOKEN.");
}

const TARGET_HANDLES = [
  "mindsync",
  "magbalance",
  "vitalgreens",
  "joint-flex",
  "natural-pct",
  "ultra-test",
  "digestive-enzyme",
  "vitamin-k2-d3",
  "energized-aminos",
  "adrenal-support-plus",
  "sleepo",
];

async function shopifyAdmin(query, variables = {}) {
  const response = await fetch(`https://${SHOP_DOMAIN}/admin/api/${API_VERSION}/graphql.json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Access-Token": ACCESS_TOKEN,
    },
    body: JSON.stringify({ query, variables }),
  });

  const json = await response.json();
  if (json.errors?.length) {
    throw new Error(`GraphQL error: ${JSON.stringify(json.errors)}`);
  }
  return json.data;
}

async function fetchReferencePublications() {
  const data = await shopifyAdmin(
    `query ReferenceProduct($handle: String!) {
      productByHandle(handle: $handle) {
        id
        handle
        resourcePublicationsV2(first: 20) {
          nodes {
            publication {
              id
              name
            }
          }
        }
      }
    }`,
    { handle: "bioprotein-pro" },
  );

  const publications = data.productByHandle?.resourcePublicationsV2?.nodes
    ?.map((node) => node.publication)
    ?.filter(Boolean) ?? [];

  if (!publications.length) {
    throw new Error("Could not load reference storefront publications from bioprotein-pro.");
  }

  return publications;
}

async function fetchProduct(handle) {
  const data = await shopifyAdmin(
    `query ProductByHandle($handle: String!) {
      productByHandle(handle: $handle) {
        id
        handle
        title
        status
        resourcePublicationsV2(first: 20) {
          nodes {
            publication {
              id
              name
            }
          }
        }
      }
    }`,
    { handle },
  );

  return data.productByHandle;
}

async function activateProduct(id) {
  const data = await shopifyAdmin(
    `mutation ActivateProduct($product: ProductUpdateInput!) {
      productUpdate(product: $product) {
        product {
          id
          status
        }
        userErrors {
          field
          message
        }
      }
    }`,
    {
      product: {
        id,
        status: "ACTIVE",
      },
    },
  );

  const result = data.productUpdate;
  if (result.userErrors?.length) {
    throw new Error(`productUpdate failed: ${JSON.stringify(result.userErrors)}`);
  }

  return result.product;
}

async function publishProduct(id, publicationIds) {
  const data = await shopifyAdmin(
    `mutation PublishProduct($id: ID!, $input: [PublicationInput!]!) {
      publishablePublish(id: $id, input: $input) {
        publishable {
          ... on Product {
            id
          }
        }
        shop {
          id
        }
        userErrors {
          field
          message
        }
      }
    }`,
    {
      id,
      input: publicationIds.map((publicationId) => ({ publicationId })),
    },
  );

  const result = data.publishablePublish;
  if (result.userErrors?.length) {
    throw new Error(`publishablePublish failed: ${JSON.stringify(result.userErrors)}`);
  }

  return result.publishable;
}

async function main() {
  const apply = process.argv.includes("--apply");
  const referencePublications = await fetchReferencePublications();
  const publicationIds = referencePublications.map((publication) => publication.id);

  const results = [];

  for (const handle of TARGET_HANDLES) {
    const before = await fetchProduct(handle);
    if (!before) {
      results.push({ handle, action: "missing_product" });
      continue;
    }

    const beforePublicationIds = new Set(
      before.resourcePublicationsV2?.nodes?.map((node) => node.publication?.id).filter(Boolean) ?? [],
    );
    const missingPublicationIds = publicationIds.filter((publicationId) => !beforePublicationIds.has(publicationId));

    const entry = {
      handle,
      statusBefore: before.status,
      publicationsBefore: [...beforePublicationIds].length,
      missingPublicationCount: missingPublicationIds.length,
      action: "noop",
    };

    if (apply) {
      if (before.status !== "ACTIVE") {
        await activateProduct(before.id);
        entry.action = "activated";
      }

      if (missingPublicationIds.length) {
        await publishProduct(before.id, missingPublicationIds);
        entry.action = entry.action === "activated" ? "activated_and_published" : "published";
      }
    } else if (before.status !== "ACTIVE" || missingPublicationIds.length) {
      entry.action = "would_update";
    }

    const after = await fetchProduct(handle);
    entry.statusAfter = after?.status ?? null;
    entry.publicationsAfter =
      after?.resourcePublicationsV2?.nodes?.map((node) => node.publication?.id).filter(Boolean).length ?? 0;
    results.push(entry);
  }

  console.log(
    JSON.stringify(
      {
        apply,
        publicationNames: referencePublications.map((publication) => publication.name),
        targetHandles: TARGET_HANDLES,
        results,
      },
      null,
      2,
    ),
  );
}

await main();
