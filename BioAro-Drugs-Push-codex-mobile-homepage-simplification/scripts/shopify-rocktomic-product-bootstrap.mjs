#!/usr/bin/env node

import process from "node:process";

const PRODUCTS = [
  {
    sku: "ROC2821",
    handle: "bioprotein-pro",
    title: "BioProtein Pro",
    description: "BioProtein Pro is a premium whey protein isolate formulated to support muscle recovery, growth, and maintenance. Enriched with BCAAs (Leucine, Isoleucine, and Valine) to stimulate muscle protein synthesis, while digestive enzymes (Protease and Papain) enhance protein digestion and absorption. Ideal for athletes and active individuals seeking faster recovery and lean muscle development.",
  },
  {
    sku: "ROC263V",
    handle: "plantcore",
    title: "PlantCore",
    description: "PlantCore is a plant-based protein blend combining organic pea and rice proteins to deliver a complete amino acid profile. Designed to support muscle maintenance and recovery while providing an excellent dairy-free alternative for vegetarians, vegans, and individuals with lactose intolerance.",
  },
  {
    sku: "ROC606",
    handle: "bioignite",
    title: "BioIgnite",
    description: "BioIgnite is a comprehensive pre-workout formula containing electrolytes, B vitamins, amino acids, and performance-enhancing ingredients such as L-Arginine Alpha-Ketoglutarate, Beta-Alanine, Taurine, and L-Tyrosine. Designed to support energy production, muscular endurance, hydration, focus, and nitric oxide production for improved exercise performance.",
  },
  {
    sku: "ROC603",
    handle: "musclerecover",
    title: "MuscleRecover",
    description: "MuscleRecover provides a clinically recognized 2:1:1 ratio of Leucine, Isoleucine, and Valine together with L-Glutamine and Vitamin B6 to promote muscle recovery, reduce exercise-induced muscle breakdown, and support protein synthesis during and after intense physical activity.",
  },
  {
    sku: "ROC017",
    handle: "hydrareload",
    title: "HydraReload",
    description: "HydraReload is a post-workout recovery formula designed to replenish energy stores, restore electrolytes lost through sweat, and support muscle recovery following prolonged or high-intensity exercise. The combination of carbohydrates, electrolytes, BCAAs, L-Glutamine, and Vitamin B6 helps accelerate recovery and prepare the body for subsequent training sessions.",
  },
  {
    sku: "ROC507W",
    handle: "womens-vitalprime",
    title: "Women's VitalPrime",
    description: "Women's VitalPrime is a comprehensive women's multivitamin providing essential vitamins, minerals, antioxidants, and specialized botanical blends to support energy metabolism, immune health, bone health, skin vitality, and overall wellness. Formulated to meet the unique nutritional needs of active women.",
  },
  {
    sku: "ROC018",
    handle: "nitricflow",
    title: "NitricFlow",
    description: "NitricFlow is an advanced stimulant-enhanced pre-workout featuring Citrulline Malate, Beta-Alanine, Betaine, Alpha GPC, Taurine, caffeine, and electrolytes. Formulated to support increased blood flow, muscular endurance, strength, focus, hydration, and workout intensity.",
  },
  {
    sku: "ROC507",
    handle: "mens-vitalprime",
    title: "Men's VitalPrime",
    description: "Men's VitalPrime is a complete men's multivitamin delivering essential vitamins, minerals, antioxidants, and specialized botanical blends to support energy production, immune function, cardiovascular health, hormone support, and overall daily wellness.",
  },
  {
    sku: "ROC450",
    handle: "biocollagen",
    title: "BioCollagen",
    description: "BioCollagen contains hydrolyzed bovine collagen peptides providing Type I and III collagen to support healthy skin, joints, tendons, ligaments, and connective tissues. Particularly beneficial for individuals seeking to maintain mobility, support recovery, and promote healthy aging.",
  },
  {
    sku: "ROC914",
    handle: "nitric-roots",
    title: "Nitric Roots",
    description: "Nitric Roots contains organic beetroot powder naturally rich in dietary nitrates that support nitric oxide production, healthy blood flow, oxygen delivery, and cardiovascular performance. Commonly used to enhance endurance, exercise efficiency, and recovery during aerobic activities.",
  },
  {
    sku: "ROC812",
    handle: "mindsync",
    title: "MindSync",
    description: "MindSync is a comprehensive cognitive support formula combining essential vitamins, minerals, amino acids, botanical extracts, and nootropic ingredients including Bacopa, DMAE, Green Tea Extract, Choline, and N-Acetyl L-Tyrosine. Designed to support mental clarity, focus, memory, cognitive performance, and sustained concentration.",
  },
  {
    sku: "ROC824",
    handle: "magbalance",
    title: "MagBalance",
    description: "MagBalance is a highly bioavailable form of magnesium formulated to support normal muscle and nerve function, relaxation, electrolyte balance, sleep quality, and recovery. Magnesium glycinate is gentle on the digestive system and well suited for individuals with increased magnesium requirements.",
  },
  {
    sku: "ROC303",
    handle: "digestive-enzyme",
    title: "Digestive Enzyme",
    description: "Digestive Enzyme is a broad-spectrum digestive enzyme formula containing proteases, lactase, alpha-galactosidase, bromelain, papain, and beneficial probiotics to support efficient digestion of proteins, carbohydrates, dairy products, and other nutrients while promoting digestive comfort and nutrient absorption.",
  },
  {
    sku: "ROC503",
    handle: "natural-pct",
    title: "Natural PCT",
    description: "Natural PCT is a specialized post-cycle support formula containing botanical blends designed to help maintain hormonal balance, support liver function, and promote overall recovery. Intended for individuals seeking nutritional support following periods of intense physical training or supplementation.",
  },
  {
    sku: "ROC506",
    handle: "ultra-test",
    title: "Ultra Test",
    description: "Ultra Test is a men's wellness formula featuring Tribulus, Longjack (Tongkat Ali), Horny Goat Weed, Zinc, Magnesium, Saw Palmetto, Hawthorn, and Cissus Quadrangularis. Designed to support healthy testosterone levels already within the normal range, male vitality, strength, exercise performance, and recovery.",
  },
  {
    sku: "ROC613",
    handle: "energized-aminos",
    title: "Energized Aminos",
    description: "Energized Aminos is a B-vitamin enriched amino acid formula designed to support natural energy metabolism, reduce fatigue, and promote recovery. The inclusion of essential B vitamins, including folate, biotin, and vitamin B12, supports cellular energy production and overall vitality throughout the day.",
  },
  {
    sku: "ROC736",
    handle: "adrenal-support-plus",
    title: "Adrenal Support Plus",
    description: "Adrenal Support Plus is an adaptogenic wellness formula featuring Cordyceps, Rhodiola, Eleuthero, Chlorella, Burdock, and botanical extracts traditionally used to support the body's response to physical and mental stress. Designed to promote energy, resilience, recovery, and overall well-being during periods of increased physical or emotional demand.",
  },
  {
    sku: "ROC808",
    handle: "joint-flex",
    title: "Joint Flex",
    description: "Joint Flex is a comprehensive joint support formula combining Glucosamine, Chondroitin, MSM, Boswellia, Turmeric, Quercetin, Bromelain, and Methionine to help maintain joint comfort, cartilage integrity, flexibility, and a healthy inflammatory response, supporting long-term mobility and active lifestyles.",
  },
  {
    sku: "ROC831",
    handle: "vitamin-k2-d3",
    title: "Vitamin K2 + D3",
    description: "Vitamin K2 + D3 is a synergistic combination of Vitamins D3 and K2 with calcium and BioPerine designed to support calcium absorption, bone strength, cardiovascular health, and optimal skeletal function. Particularly beneficial for maintaining healthy bones and muscle function.",
  },
  {
    sku: "ROC937",
    handle: "vitalgreens",
    title: "VitalGreens",
    description: "VitalGreens is a nutrient-dense superfood blend combining organic greens, antioxidant-rich red fruits, probiotics, vitamins, and minerals to support daily nutrition, digestive health, immune function, antioxidant protection, and overall vitality.",
  },
];

const args = new Set(process.argv.slice(2));
const apply = args.has("--apply");
const updateExisting = args.has("--update-existing");
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
  if (!response.ok || json.errors?.length) {
    throw new Error(JSON.stringify(json.errors ?? json, null, 2));
  }
  return json.data;
}

function assertNoUserErrors(result, key) {
  const errors = result[key]?.userErrors ?? [];
  if (errors.length) {
    throw new Error(`${key}: ${errors.map((error) => error.message).join("; ")}`);
  }
  return result[key];
}

async function productByHandle(handle) {
  const data = await graphql(
    `query ProductByHandle($query: String!) {
      products(first: 2, query: $query) {
        nodes { id handle title status descriptionHtml }
      }
    }`,
    { query: `handle:${handle}` },
  );
  return data.products.nodes.find((item) => item.handle === handle) ?? null;
}

async function createProduct(product) {
  const result = await graphql(
    `mutation ProductCreate($product: ProductCreateInput!) {
      productCreate(product: $product) {
        product { id handle title status }
        userErrors { field message }
      }
    }`,
    {
      product: {
        title: product.title,
        handle: product.handle,
        descriptionHtml: product.description,
        status: "DRAFT",
      },
    },
  );
  return assertNoUserErrors(result, "productCreate").product;
}

async function updateProduct(existing, product) {
  const result = await graphql(
    `mutation ProductUpdate($product: ProductUpdateInput!) {
      productUpdate(product: $product) {
        product { id handle title status }
        userErrors { field message }
      }
    }`,
    {
      product: {
        id: existing.id,
        title: product.title,
        descriptionHtml: product.description,
      },
    },
  );
  return assertNoUserErrors(result, "productUpdate").product;
}

async function main() {
  const results = [];

  for (const product of PRODUCTS) {
    const existing = await productByHandle(product.handle);

    if (!existing) {
      if (!apply) {
        results.push({ handle: product.handle, action: "would_create_draft", sku: product.sku, title: product.title });
        continue;
      }
      const created = await createProduct(product);
      results.push({ handle: product.handle, action: "created_draft", sku: product.sku, title: created.title, status: created.status });
      continue;
    }

    if (updateExisting) {
      if (!apply) {
        results.push({ handle: product.handle, action: "would_update_existing", sku: product.sku, existingTitle: existing.title, targetTitle: product.title, status: existing.status });
        continue;
      }
      const updated = await updateProduct(existing, product);
      results.push({ handle: product.handle, action: "updated_existing", sku: product.sku, title: updated.title, status: updated.status });
      continue;
    }

    results.push({ handle: product.handle, action: "left_existing_untouched", sku: product.sku, title: existing.title, status: existing.status });
  }

  const summary = {
    shopDomain,
    apiVersion,
    apply,
    updateExisting,
    total: PRODUCTS.length,
    created: results.filter((item) => item.action === "created_draft").length,
    updated: results.filter((item) => item.action === "updated_existing").length,
    untouched: results.filter((item) => item.action === "left_existing_untouched").length,
  };

  console.log(JSON.stringify({ summary, results }, null, 2));
}

main().catch((error) => {
  console.error(error instanceof Error ? error.stack : error);
  process.exitCode = 1;
});
