const HANDLE = "bioaro-drugs-ai-membership";
const apply = process.argv.includes("--apply");
const shopDomain = process.env.SHOPIFY_ADMIN_SHOP_DOMAIN;
const accessToken = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;
const apiVersion = process.env.SHOPIFY_ADMIN_API_VERSION ?? "2026-07";

if (!shopDomain || !accessToken) {
  throw new Error("SHOPIFY_ADMIN_SHOP_DOMAIN and SHOPIFY_ADMIN_ACCESS_TOKEN are required.");
}

const endpoint = `https://${shopDomain}/admin/api/${apiVersion}/graphql.json`;

async function graphql(query, variables = {}) {
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Access-Token": accessToken,
    },
    body: JSON.stringify({ query, variables }),
  });
  const json = await response.json();
  if (!response.ok || json.errors?.length) throw new Error(JSON.stringify(json.errors ?? json, null, 2));
  return json.data;
}

function assertNoUserErrors(payload, key) {
  const errors = payload[key]?.userErrors ?? [];
  if (errors.length) throw new Error(`${key}: ${errors.map((error) => error.message).join("; ")}`);
  return payload[key];
}

async function findProduct() {
  const data = await graphql(`query MembershipProduct($query: String!) {
    products(first: 5, query: $query) {
      nodes {
        id handle title status
        variants(first: 5) { nodes { id price sku } }
        sellingPlanGroups(first: 10) {
          nodes { id name sellingPlans(first: 10) { nodes { id name } } }
        }
      }
    }
  }`, { query: `handle:${HANDLE}` });
  return data.products.nodes.find((product) => product.handle === HANDLE) ?? null;
}

async function createProduct() {
  const result = await graphql(`mutation CreateMembership($product: ProductCreateInput!) {
    productCreate(product: $product) {
      product { id handle title status }
      userErrors { field message }
    }
  }`, {
    product: {
      title: "BioAro Drugs AI Membership",
      handle: HANDLE,
      productType: "Digital membership",
      descriptionHtml: "<p>A persistent BioAro Drugs AI workspace for asking, building and evolving your everyday routine.</p>",
      status: "ACTIVE",
    },
  });
  return assertNoUserErrors(result, "productCreate").product;
}

async function setVariant(product) {
  const current = await findProduct();
  const variant = current?.variants.nodes[0];
  if (!variant) throw new Error("Membership product has no default variant.");

  const result = await graphql(`mutation SetMembershipVariant($productId: ID!, $variants: [ProductVariantsBulkInput!]!) {
    productVariantsBulkUpdate(productId: $productId, variants: $variants) {
      productVariants { id price sku }
      userErrors { field message }
    }
  }`, {
    productId: product.id,
    variants: [{ id: variant.id, price: "20.00", inventoryItem: { tracked: false } }],
  });
  return assertNoUserErrors(result, "productVariantsBulkUpdate").productVariants[0];
}

async function createSellingPlan(product) {
  const existing = await findProduct();
  if (existing?.sellingPlanGroups.nodes.some((group) => group.sellingPlans.nodes.some((plan) => plan.name === "Monthly membership"))) {
    return existing.sellingPlanGroups.nodes.flatMap((group) => group.sellingPlans.nodes).find((plan) => plan.name === "Monthly membership");
  }

  const result = await graphql(`mutation CreateMembershipPlan($input: SellingPlanGroupInput!, $resources: SellingPlanGroupResourceInput) {
    sellingPlanGroupCreate(input: $input, resources: $resources) {
      sellingPlanGroup {
        id
        name
        sellingPlans(first: 10) { nodes { id name } }
      }
      userErrors { field message }
    }
  }`, {
    input: {
      name: "Monthly membership",
      merchantCode: "bioaro-ai-monthly",
      options: ["Billing frequency"],
      description: "BioAro Drugs AI Membership billed monthly.",
      sellingPlansToCreate: [{
        name: "Monthly membership",
        options: ["Every month"],
        category: "SUBSCRIPTION",
        billingPolicy: { recurring: { interval: "MONTH", intervalCount: 1 } },
        deliveryPolicy: { recurring: { interval: "MONTH", intervalCount: 1 } },
      }],
    },
    resources: { productIds: [product.id], productVariantIds: [] },
  });
  const group = assertNoUserErrors(result, "sellingPlanGroupCreate").sellingPlanGroup;
  return group.sellingPlans.nodes[0];
}

async function publishMembership(product) {
  const data = await graphql(`query MembershipPublications {
    publications(first: 50) { nodes { id name } }
  }`);
  const names = new Set([
    "My Store Headless",
    "Readonly inspector",
    "My Store Headless 03",
    "My Store Headless 04",
    "For bioarodrugs 25 july 2026",
  ]);
  const publicationIds = data.publications.nodes
    .filter((publication) => names.has(publication.name))
    .map((publication) => publication.id);
  if (!publicationIds.length) throw new Error("No approved headless publication was found.");

  const result = await graphql(`mutation PublishMembership($id: ID!, $input: [PublicationInput!]!) {
    publishablePublish(id: $id, input: $input) { userErrors { field message } }
  }`, {
    id: product.id,
    input: publicationIds.map((publicationId) => ({ publicationId })),
  });
  assertNoUserErrors(result, "publishablePublish");
  return publicationIds;
}

async function setUnitedStatesPrice(variant) {
  const data = await graphql(`query UnitedStatesPriceList {
    priceLists(first: 50) { nodes { id name currency } }
  }`);
  const priceList = data.priceLists.nodes.find(
    (candidate) => candidate.currency === "USD" && candidate.name.startsWith("United States -"),
  );
  if (!priceList) throw new Error("The United States USD price list was not found.");

  const result = await graphql(`mutation SetUnitedStatesMembershipPrice($priceListId: ID!, $pricesToAdd: [PriceListPriceInput!]!) {
    priceListFixedPricesUpdate(
      priceListId: $priceListId
      pricesToAdd: $pricesToAdd
      variantIdsToDelete: []
    ) { userErrors { field message } }
  }`, {
    priceListId: priceList.id,
    pricesToAdd: [{ variantId: variant.id, price: { amount: "20.00", currencyCode: "USD" } }],
  });
  assertNoUserErrors(result, "priceListFixedPricesUpdate");
  return { id: priceList.id, currency: priceList.currency };
}

const existing = await findProduct();
if (!apply) {
  console.log(JSON.stringify({ mode: "dry-run", handle: HANDLE, exists: Boolean(existing), existing }, null, 2));
  process.exit(0);
}

const product = existing ?? await createProduct();
const variant = await setVariant(product);
const sellingPlan = await createSellingPlan(product);
const publications = await publishMembership(product);
const usPriceList = await setUnitedStatesPrice(variant);
console.log(JSON.stringify({
  mode: "applied",
  product: { id: product.id, handle: product.handle, title: product.title, status: product.status },
  variant,
  sellingPlan,
  publications,
  usPriceList,
}, null, 2));
