import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ProductCard from "../components/sections/ProductCard";
import { fetchAllProducts } from "../lib/shopify/productService";
import type { CatalogProduct } from "../lib/shopify/types";
import { useMarket } from "../hooks/useMarket";

const FILTERS = ["All", "Longevity", "Focus", "Recovery", "Sleep"] as const;
const SORTS = ["Featured", "Price: Low to High", "Price: High to Low"] as const;

type FilterOption = (typeof FILTERS)[number];
type SortOption = (typeof SORTS)[number];

function normalizeFilter(value: string | null): FilterOption {
  return FILTERS.includes(value as FilterOption) ? (value as FilterOption) : "All";
}

export default function Shop() {
  const { country } = useMarket();
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<CatalogProduct[]>([]);
  const [filter, setFilter] = useState<FilterOption>(() => normalizeFilter(searchParams.get("category")));
  const [sort, setSort] = useState<SortOption>("Featured");

  useEffect(() => {
    void fetchAllProducts(country).then(setProducts);
  }, [country]);

  useEffect(() => {
    setFilter(normalizeFilter(searchParams.get("category")));
  }, [searchParams]);

  const visible = useMemo(() => {
    let list = filter === "All" ? products : products.filter((product) => product.category === filter);
    list = [...list];

    if (sort === "Price: Low to High") list.sort((a, b) => a.price.amount - b.price.amount);
    if (sort === "Price: High to Low") list.sort((a, b) => b.price.amount - a.price.amount);

    return list;
  }, [products, filter, sort]);

  const applyFilter = (nextFilter: FilterOption) => {
    setFilter(nextFilter);
    const params = new URLSearchParams(searchParams);
    if (nextFilter === "All") params.delete("category");
    else params.set("category", nextFilter);
    setSearchParams(params, { replace: true });
  };

  return (
    <div className="pt-32 pb-20">
      <div className="container-bio">
        <span className="eyebrow">Shop</span>
        <h1 className="mt-3 text-[48px] leading-none md:text-[64px]">All formulas.</h1>
        <p className="mt-5 max-w-2xl text-[15px] leading-7 text-[#564b46]">
          Explore BioAro products through a cleaner, routine-led catalog with market-aware pricing, dosage guidance, and direct cart access.
        </p>

        <div className="mt-10 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-2">
            {FILTERS.map((option) => (
              <button
                key={option}
                onClick={() => applyFilter(option)}
                className={`rounded-full border px-4 py-2 text-sm transition-colors ${
                  filter === option
                    ? "border-ink bg-ink text-white"
                    : "border-[#ddd8c9] bg-white/70 text-ink hover:bg-white"
                }`}
              >
                {option}
              </button>
            ))}
          </div>

          <select
            value={sort}
            onChange={(event) => setSort(event.target.value as SortOption)}
            className="h-10 rounded-full border border-[#ddd8c9] bg-white/70 px-4 text-sm text-ink outline-none"
          >
            {SORTS.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {visible.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {visible.length === 0 && (
          <p className="py-20 text-center text-sm text-[#8a8678]">No formulas in this category yet.</p>
        )}
      </div>
    </div>
  );
}
