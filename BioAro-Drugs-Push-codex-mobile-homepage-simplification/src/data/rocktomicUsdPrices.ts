export type RocktomicAlignedPrice = {
  sku: string;
  handle: string;
  title: string;
  priceUsd: number;
};

// Source: Rocktomic products(Hoja1).csv, column E "Price to sell"
export const ROCKTOMIC_USD_PRICES: RocktomicAlignedPrice[] = [
  { sku: "ROC2821", handle: "bioprotein-pro", title: "BioProtein Pro", priceUsd: 36.36 },
  { sku: "ROC263V", handle: "plantcore", title: "PlantCore", priceUsd: 39.16 },
  { sku: "ROC606", handle: "bioignite", title: "BioIgnite", priceUsd: 23.84 },
  { sku: "ROC603", handle: "musclerecover", title: "MuscleRecover", priceUsd: 21.66 },
  { sku: "ROC017", handle: "hydrareload", title: "HydraReload", priceUsd: 22.57 },
  { sku: "ROC507W", handle: "womens-vitalprime", title: "Women's VitalPrime", priceUsd: 13.5 },
  { sku: "ROC018", handle: "nitricflow", title: "NitricFlow", priceUsd: 29.72 },
  { sku: "ROC507", handle: "mens-vitalprime", title: "Men's VitalPrime", priceUsd: 11.98 },
  { sku: "ROC450", handle: "biocollagen", title: "BioCollagen", priceUsd: 22.36 },
  { sku: "ROC914", handle: "nitric-roots", title: "Nitric Roots", priceUsd: 10.08 },
  { sku: "ROC812", handle: "mindsync", title: "MindSync", priceUsd: 8.6 },
  { sku: "ROC824", handle: "magbalance", title: "MagBalance", priceUsd: 18.16 },
  { sku: "ROC937", handle: "vitalgreens", title: "VitalGreens", priceUsd: 23.74 },
  { sku: "ROC808", handle: "joint-flex", title: "Joint Flex", priceUsd: 9.06 },
  { sku: "ROC503", handle: "natural-pct", title: "Natural PCT", priceUsd: 11.93 },
  { sku: "ROC506", handle: "ultra-test", title: "Ultra Test", priceUsd: 13.31 },
  { sku: "ROC303", handle: "digestive-enzyme", title: "Digestive Enzyme", priceUsd: 15.57 },
  { sku: "ROC831", handle: "vitamin-k2-d3", title: "Vitamin K2 + D3", priceUsd: 11.68 },
  { sku: "ROC613", handle: "energized-aminos", title: "Energized Aminos", priceUsd: 26.39 },
  { sku: "ROC736", handle: "adrenal-support-plus", title: "Adrenal Support Plus", priceUsd: 22.36 },
];

export const ROCKTOMIC_USD_PRICE_BY_HANDLE = Object.fromEntries(
  ROCKTOMIC_USD_PRICES.map((product) => [product.handle, product.priceUsd]),
) as Record<string, number>;
