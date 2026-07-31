import { type ChangeEvent, type FormEvent, useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  ChevronDown,
  Info,
  Loader2,
  ShieldAlert,
  Sparkles,
  X,
} from "lucide-react";
import { Link } from "react-router-dom";
import { PRODUCT_CARD_IMAGES } from "../../data/productCardImages";
import { PREVIEW_PRODUCTS } from "../../data/products";
import type { ProductEditorial } from "../../lib/shopify/types";

const SUGGESTIONS = [
  "I want more energy during the day",
  "Help me recover after training",
  "I want to support healthy aging",
  "How can I improve mental focus?",
  "I'm looking for antioxidant support",
] as const;

const QUICK_PROMPTS = ["Improve daily energy", "Support healthy aging", "Recover after training"] as const;

const PRODUCT_HANDLES = [
  "longevity-plus",
  "cellomega-plus",
  "creagen-brain-boost",
  "creagen-raw-power",
  "creagen-pro-power",
  "creagen-femme-energy",
  "glutara",
] as const;

type ProductHandle = (typeof PRODUCT_HANDLES)[number];

type SheetState = "closed" | "loading" | "result" | "no-match" | "sensitive" | "error";

type RecommendationResult = {
  handle: ProductHandle;
  product: ProductEditorial;
  alternatives: ProductEditorial[];
  tags: string[];
  reason: string;
};

type HeroAISearchProps = {
  shopHref: string;
  onSheetOpenChange?: (isOpen: boolean) => void;
};

const PRODUCT_MAP = new Map(PREVIEW_PRODUCTS.map((product) => [product.handle, product] as const));

const ALTERNATIVES: Record<ProductHandle, ProductHandle[]> = {
  "longevity-plus": ["cellomega-plus", "glutara"],
  "cellomega-plus": ["longevity-plus", "creagen-brain-boost"],
  "creagen-brain-boost": ["cellomega-plus", "longevity-plus"],
  "creagen-raw-power": ["creagen-pro-power", "creagen-brain-boost"],
  "creagen-pro-power": ["creagen-raw-power", "cellomega-plus"],
  "creagen-femme-energy": ["creagen-brain-boost", "longevity-plus"],
  glutara: ["longevity-plus", "cellomega-plus"],
};

const MATCH_RULES: Array<{
  handle: ProductHandle;
  tags: string[];
  reason: string;
  keywords: RegExp[];
}> = [
  {
    handle: "longevity-plus",
    tags: ["Healthy ageing", "Cellular energy", "Daily vitality"],
    reason:
      "LONgevity+ is the closest fit because the goal points toward healthy ageing, cellular energy and long-term daily vitality.",
    keywords: [
      /ageing|aging|longevity|long[-\s]?term|cellular energy|vitality|nad|nmn|older|age better|daily energy/i,
    ],
  },
  {
    handle: "cellomega-plus",
    tags: ["Omega support", "Heart health", "Brain health"],
    reason:
      "CellOmega+ is the closest fit because the goal mentions omega support, heart health, brain health or EPA/DHA-style wellness.",
    keywords: [/omega|heart|brain health|dha|epa|fatty acid|cellular wellness|circulation/i],
  },
  {
    handle: "creagen-brain-boost",
    tags: ["Focus", "Mental clarity", "Cognitive performance"],
    reason:
      "Creagen Brain Boost is the closest fit because the goal is about focus, concentration and clear mental performance.",
    keywords: [/focus|concentration|cognitive|mental clarity|clarity|memory|think|study|work/i],
  },
  {
    handle: "creagen-raw-power",
    tags: ["Strength", "Gym", "Muscle support"],
    reason:
      "Creagen Raw Power is the closest fit because the goal is centred on strength, gym sessions, muscle output or workout support.",
    keywords: [/strength|gym|muscle|workout|lifting|power|creatine|strong/i],
  },
  {
    handle: "creagen-pro-power",
    tags: ["Performance", "Endurance", "Training"],
    reason:
      "Creagen Pro Power is the closest fit because the goal is about training performance, endurance and athletic routine support.",
    keywords: [/performance|endurance|athlete|training|stamina|recover faster|recovery|soreness|peak/i],
  },
  {
    handle: "creagen-femme-energy",
    tags: ["Women's energy", "Female wellness", "Daily support"],
    reason:
      "Creagen Femme Energy is the closest fit because the goal points toward women's energy and active daily routine support.",
    keywords: [/women|woman|female|femme|hormonal|period|active women/i],
  },
  {
    handle: "glutara",
    tags: ["Antioxidant support", "Skin", "Cellular protection"],
    reason:
      "Glutara is the closest fit because the goal is about antioxidant support, glutathione and cellular protection.",
    keywords: [/antioxidant|skin|glutathione|cellular protection|detox|glow|oxidative/i],
  },
];

const SENSITIVE_TERMS = [
  /emergency|urgent|severe pain|chest pain|heart attack|stroke|suicide|self harm/i,
  /cancer|tumou?r|diabetes|kidney|liver|blood pressure|pregnan|breastfeeding/i,
  /diagnose|diagnosis|cure|treat|disease|symptom|medication|medicine|depression|anxiety/i,
];

const SAFETY_NOTE =
  "BioAro AI provides general product guidance using approved BioAro product information. It does not diagnose conditions or replace professional medical advice.";

const FOLLOW_UP_ACTIONS = [
  { key: "why", label: "Why does this match?" },
  { key: "compare", label: "Compare my options" },
  { key: "ingredients", label: "Show key ingredients" },
  { key: "suitable", label: "Is this suitable for me?" },
] as const;

type FollowUpKey = (typeof FOLLOW_UP_ACTIONS)[number]["key"];

function usePrefersReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setPrefersReducedMotion(mediaQuery.matches);

    updatePreference();
    mediaQuery.addEventListener("change", updatePreference);
    return () => mediaQuery.removeEventListener("change", updatePreference);
  }, []);

  return prefersReducedMotion;
}

function HealthIntelligenceIcon({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 28 28" aria-hidden="true" fill="none">
      <path
        d="M4.5 15.5h4.1l2.7-7.4 5.2 12.8 2.9-5.4h4.1"
        stroke="currentColor"
        strokeWidth="1.65"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M17.3 6.1c3-.5 5.1.5 6.1 2.4-2.5.4-4.5 1.6-5.8 3.6-.9-1.7-1-3.7-.3-6Z"
        stroke="currentColor"
        strokeWidth="1.45"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function getProduct(handle: ProductHandle) {
  return PRODUCT_MAP.get(handle);
}

function getProductHref(shopHref: string, handle: string) {
  const cleanHref = shopHref.replace(/\/$/, "");
  return cleanHref.endsWith("/shop")
    ? `${cleanHref.slice(0, -"/shop".length)}/products/${handle}`
    : `${cleanHref}/products/${handle}`;
}

function getCountryFromHref(shopHref: string) {
  const market = shopHref.split("/").filter(Boolean)[0]?.toLowerCase();
  if (market === "us") return "US";
  if (market === "ca") return "CA";
  if (market === "ae") return "AE";
  return "GB";
}

function formatProductPrice(product: ProductEditorial, shopHref: string) {
  const country = getCountryFromHref(shopHref);
  const price = (product.priceByCountry as Partial<Record<string, number>> | undefined)?.[country];

  if (typeof price !== "number") return null;

  const currencyByCountry: Record<string, { currency: "USD" | "CAD" | "GBP" | "AED"; locale: string }> = {
    US: { currency: "USD", locale: "en-US" },
    CA: { currency: "CAD", locale: "en-CA" },
    GB: { currency: "GBP", locale: "en-GB" },
    AE: { currency: "AED", locale: "en-AE" },
  };
  const { currency, locale } = currencyByCountry[country] ?? currencyByCountry.GB;

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: Number.isInteger(price) ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(price);
}

function getRecommendationImage(product: ProductEditorial) {
  return product.image?.src
    ? product.image
    : PRODUCT_CARD_IMAGES[product.handle] ?? {
        src: "",
        alt: `${product.title} product image`,
      };
}

function getRecommendation(goal: string): { state: SheetState; result?: RecommendationResult; tags: string[] } {
  if (SENSITIVE_TERMS.some((term) => term.test(goal))) {
    return { state: "sensitive", tags: ["Professional guidance", "General wellness"] };
  }

  const match = MATCH_RULES.find((rule) => rule.keywords.some((keyword) => keyword.test(goal)));

  if (!match) {
    return { state: "no-match", tags: ["General wellness", "Needs more detail"] };
  }

  const product = getProduct(match.handle);

  if (!product) {
    return { state: "error", tags: ["Product data unavailable"] };
  }

  const alternatives = ALTERNATIVES[match.handle]
    .map((handle) => getProduct(handle))
    .filter((item): item is ProductEditorial => Boolean(item))
    .slice(0, 2);

  return {
    state: "result",
    tags: match.tags,
    result: {
      handle: match.handle,
      product,
      alternatives,
      tags: match.tags,
      reason: match.reason,
    },
  };
}

function ProductMatchCard({
  product,
  shopHref,
  isPrimary = false,
}: {
  product: ProductEditorial;
  shopHref: string;
  isPrimary?: boolean;
}) {
  const image = getRecommendationImage(product);
  const price = formatProductPrice(product, shopHref);
  const href = getProductHref(shopHref, product.handle);
  const ingredients = product.ingredients.slice(0, 3).map((ingredient) => ingredient.name);

  return (
    <article
      className={`overflow-hidden border border-white/60 bg-white/44 backdrop-blur-xl ${
        isPrimary
          ? "rounded-[28px] shadow-[0_18px_54px_rgba(42,34,24,0.12)] md:grid md:grid-cols-[0.9fr_1.1fr]"
          : "rounded-[22px] shadow-[0_12px_34px_rgba(42,34,24,0.08)]"
      }`}
    >
      <div
        className={`relative grid place-items-center overflow-hidden bg-[#eeeae1] ${
          isPrimary ? "min-h-[228px] p-6 sm:min-h-[260px] sm:p-8" : "aspect-[4/3] p-5"
        }`}
      >
        {image.src ? (
          <img
            src={image.src}
            alt={image.alt}
            className="h-full w-full object-contain object-center"
            loading="lazy"
            decoding="async"
          />
        ) : null}
        {isPrimary ? (
          <span className="absolute left-4 top-4 rounded-full bg-[#c6922e] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-white">
            Best match
          </span>
        ) : null}
      </div>
      <div className="flex flex-col p-5 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#1f5a42]">{product.category}</p>
            <h3 className="mt-2 font-serif text-[30px] leading-none text-[#1f1a14]">{product.title}</h3>
          </div>
          {price ? <p className="text-sm font-semibold text-[#1f1a14]">{price}</p> : null}
        </div>
        <p className="mt-3 text-sm leading-6 text-[#4c463d]">{product.tagline}</p>
        {ingredients.length ? (
          <div className="mt-4 flex flex-wrap gap-2">
            {ingredients.map((ingredient) => (
              <span
                key={ingredient}
                className="rounded-full border border-[#d7c8ad]/80 bg-white/45 px-3 py-1 text-[11px] font-medium text-[#2d4d3d]"
              >
                {ingredient}
              </span>
            ))}
          </div>
        ) : null}
        <Link
          to={href}
          className={`mt-5 inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-5 text-sm font-semibold motion-safe:transition hover:translate-x-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#234f3b] ${
            isPrimary ? "bg-[#234f3b] text-white" : "border border-[#cdbb9e] bg-white/42 text-[#1f1a14]"
          }`}
        >
          View {product.title}
          <ArrowRight size={15} aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
}

function FollowUpContent({ action, recommendation }: { action: FollowUpKey; recommendation: RecommendationResult }) {
  const { product, alternatives, reason } = recommendation;

  if (action === "why") {
    return (
      <p>
        {reason} It uses BioAro’s approved product information and keeps the recommendation tied to the goal you
        submitted.
      </p>
    );
  }

  if (action === "compare") {
    return (
      <div className="grid gap-3 sm:grid-cols-3">
        {[product, ...alternatives].map((item) => (
          <div key={item.handle} className="rounded-2xl border border-white/60 bg-white/42 p-4">
            <p className="font-semibold text-[#1f1a14]">{item.title}</p>
            <p className="mt-1 text-xs leading-5 text-[#6f685e]">{item.bestFor}</p>
          </div>
        ))}
      </div>
    );
  }

  if (action === "ingredients") {
    return (
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {product.ingredients.slice(0, 6).map((ingredient) => (
          <div key={ingredient.name} className="rounded-2xl border border-white/60 bg-white/42 p-4">
            <p className="font-semibold text-[#1f1a14]">{ingredient.name}</p>
            <p className="mt-1 text-sm text-[#234f3b]">{ingredient.amount}</p>
            <p className="mt-2 text-xs leading-5 text-[#6f685e]">{ingredient.purpose}</p>
          </div>
        ))}
      </div>
    );
  }

  return (
    <p>
      This recommendation is general product guidance only. If you are pregnant, breastfeeding, managing a health
      condition, using medication or unsure about suitability, speak with a qualified healthcare professional first.
    </p>
  );
}

export default function HeroAISearch({ shopHref, onSheetOpenChange }: HeroAISearchProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);
  const typedSinceEmptyBlurRef = useRef(false);
  const swapTimeoutRef = useRef<number | null>(null);
  const recommendationTimeoutRef = useRef<number | null>(null);
  const sheetMotionTimeoutRef = useRef<number | null>(null);
  const prefersReducedMotion = usePrefersReducedMotion();
  const [value, setValue] = useState("");
  const [activeSuggestion, setActiveSuggestion] = useState(0);
  const [isFocused, setIsFocused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isSwapping, setIsSwapping] = useState(false);
  const [sheetState, setSheetState] = useState<SheetState>("closed");
  const [sheetMotion, setSheetMotion] = useState<"entering" | "open" | "leaving">("open");
  const [submittedGoal, setSubmittedGoal] = useState("");
  const [interpretedTags, setInterpretedTags] = useState<string[]>([]);
  const [recommendation, setRecommendation] = useState<RecommendationResult | null>(null);
  const [expandedAction, setExpandedAction] = useState<FollowUpKey | null>(null);
  const [refinementValue, setRefinementValue] = useState("");

  const hasQuery = value.trim().length > 0;
  const isSheetOpen = sheetState !== "closed";
  const shouldShowSuggestion = !hasQuery && !isFocused;
  const shouldRotate = shouldShowSuggestion && !isHovered && !prefersReducedMotion;

  useEffect(() => {
    onSheetOpenChange?.(isSheetOpen);
  }, [isSheetOpen, onSheetOpenChange]);

  useEffect(() => {
    return () => {
      onSheetOpenChange?.(false);
    };
  }, [onSheetOpenChange]);

  useEffect(() => {
    if (!shouldRotate) {
      setIsSwapping(false);
      return;
    }

    const interval = window.setInterval(() => {
      setIsSwapping(true);
      swapTimeoutRef.current = window.setTimeout(() => {
        setActiveSuggestion((current) => (current + 1) % SUGGESTIONS.length);
        setIsSwapping(false);
      }, 220);
    }, 3000);

    return () => {
      window.clearInterval(interval);
      if (swapTimeoutRef.current) {
        window.clearTimeout(swapTimeoutRef.current);
      }
    };
  }, [shouldRotate]);

  const closeSheet = () => {
    if (sheetMotion === "leaving") return;

    if (recommendationTimeoutRef.current) {
      window.clearTimeout(recommendationTimeoutRef.current);
    }

    const finishClose = () => {
      setSheetState("closed");
      setSheetMotion("open");
      setExpandedAction(null);
      window.setTimeout(() => {
        (triggerRef.current ?? inputRef.current)?.focus({ preventScroll: true });
      }, 0);
    };

    if (prefersReducedMotion) {
      finishClose();
      return;
    }

    setSheetMotion("leaving");
    sheetMotionTimeoutRef.current = window.setTimeout(finishClose, 300);
  };

  useEffect(() => {
    if (!isSheetOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.requestAnimationFrame(() => closeButtonRef.current?.focus({ preventScroll: true }));

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeSheet();
        return;
      }

      if (event.key !== "Tab" || !sheetRef.current) return;

      const focusable = Array.from(
        sheetRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      ).filter((element) => !element.hasAttribute("disabled") && element.offsetParent !== null);

      if (!focusable.length) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isSheetOpen]);

  useEffect(() => {
    return () => {
      if (recommendationTimeoutRef.current) {
        window.clearTimeout(recommendationTimeoutRef.current);
      }
      if (sheetMotionTimeoutRef.current) {
        window.clearTimeout(sheetMotionTimeoutRef.current);
      }
    };
  }, []);

  const runRecommendation = (goal: string) => {
    const trimmedGoal = goal.trim();
    if (!trimmedGoal) {
      inputRef.current?.focus();
      return;
    }

    triggerRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : inputRef.current;
    setSubmittedGoal(trimmedGoal);
    setRecommendation(null);
    setExpandedAction(null);
    setInterpretedTags([]);
    setSheetMotion(prefersReducedMotion ? "open" : "entering");
    setSheetState("loading");
    if (!prefersReducedMotion) {
      window.requestAnimationFrame(() => setSheetMotion("open"));
    }

    if (recommendationTimeoutRef.current) {
      window.clearTimeout(recommendationTimeoutRef.current);
    }

    recommendationTimeoutRef.current = window.setTimeout(
      () => {
        const nextRecommendation = getRecommendation(trimmedGoal);
        setInterpretedTags(nextRecommendation.tags);
        setRecommendation(nextRecommendation.result ?? null);
        setSheetState(nextRecommendation.state);
      },
      prefersReducedMotion ? 0 : 1050,
    );
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const nextValue = event.target.value;
    setValue(nextValue);
    typedSinceEmptyBlurRef.current = nextValue.trim().length > 0;
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    runRecommendation(value);
  };

  const handleRefinementSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    runRecommendation(refinementValue);
  };

  const handleBlur = () => {
    setIsFocused(false);
    if (!prefersReducedMotion && typedSinceEmptyBlurRef.current && value.trim().length === 0) {
      setActiveSuggestion((current) => (current + 1) % SUGGESTIONS.length);
    }
    typedSinceEmptyBlurRef.current = false;
  };

  const selectPrompt = (prompt: string) => {
    setValue(prompt);
    setRefinementValue("");
    typedSinceEmptyBlurRef.current = true;
    runRecommendation(prompt);
  };

  return (
    <>
      <section className="mt-7 w-full max-w-[620px] md:mt-9" aria-labelledby="hero-ai-search-label">
        <form onSubmit={handleSubmit}>
          <label
            id="hero-ai-search-label"
            htmlFor="hero-ai-search"
            className="block text-[10px] font-semibold uppercase tracking-[0.24em] text-[#4d3a28]"
          >
            Ask BioAro AI
          </label>

          <div
            className="group relative mt-2 overflow-hidden rounded-[24px] border border-[#cdbb9e]/85 bg-[rgba(255,252,244,0.84)] shadow-[0_18px_46px_rgba(54,43,29,0.14),inset_0_1px_0_rgba(255,255,255,0.86)] backdrop-blur-xl motion-safe:transition motion-safe:duration-300 focus-within:border-[#234f3b]/55 focus-within:bg-white/90 focus-within:shadow-[0_22px_52px_rgba(54,43,29,0.18),0_0_0_4px_rgba(35,79,59,0.08)] hover:border-[#bba77f]"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <div className="pointer-events-none absolute left-4 top-1/2 z-20 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-[#f4eddf] text-[#234f3b] shadow-[inset_0_1px_0_rgba(255,255,255,0.8)] sm:left-5 sm:size-11">
              <HealthIntelligenceIcon className="size-6" />
            </div>

            {shouldShowSuggestion ? (
              <span
                className={`pointer-events-none absolute left-[68px] right-[72px] top-1/2 z-10 -translate-y-1/2 truncate text-[16px] font-medium text-[#8c877d] motion-safe:transition-opacity motion-safe:duration-300 sm:left-[78px] sm:right-[84px] sm:text-[18px] ${
                  isSwapping ? "opacity-0" : "opacity-100"
                }`}
                aria-hidden="true"
              >
                {SUGGESTIONS[activeSuggestion]}
              </span>
            ) : null}

            <input
              ref={inputRef}
              id="hero-ai-search"
              type="text"
              value={value}
              onChange={handleChange}
              onFocus={() => setIsFocused(true)}
              onBlur={handleBlur}
              autoComplete="off"
              aria-label="Ask BioAro AI about your wellness goal"
              placeholder={isFocused ? "Tell us your health goal..." : ""}
              className="relative z-10 h-[64px] w-full bg-transparent pl-[68px] pr-[72px] text-[16px] font-medium text-[#1e1a15] outline-none placeholder:text-[#9a9488] sm:h-[74px] sm:pl-[78px] sm:pr-[84px] sm:text-[18px]"
            />

            <button
              type="submit"
              aria-label="Submit BioAro AI search"
              className={`absolute right-3 top-1/2 z-20 flex size-11 -translate-y-1/2 items-center justify-center rounded-full motion-safe:transition motion-safe:duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#234f3b] sm:size-12 ${
                hasQuery
                  ? "bg-[#171411] text-white shadow-[0_12px_24px_rgba(23,20,17,0.2)]"
                  : "bg-[#171411] text-white shadow-[0_12px_24px_rgba(23,20,17,0.16)] group-hover:translate-x-0.5"
              }`}
            >
              <ArrowRight size={18} aria-hidden="true" />
            </button>
          </div>

          <div className="mt-3 flex flex-wrap gap-2" aria-label="Suggested wellness goals">
            {QUICK_PROMPTS.map((prompt) => (
              <button
                key={prompt}
                type="button"
                onClick={() => selectPrompt(prompt)}
                className="inline-flex min-h-12 items-center rounded-full border border-[#d8c9ae]/85 bg-white/52 px-4 text-[13px] font-medium text-[#3a342c] backdrop-blur-md motion-safe:transition motion-safe:duration-200 hover:border-[#bba77f] hover:bg-white/78 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#234f3b]"
              >
                <Sparkles size={13} aria-hidden="true" className="mr-2 text-[#234f3b]" />
                {prompt}
              </button>
            ))}
          </div>

          <Link
            to={shopHref}
            className="mt-6 inline-flex items-center gap-2 rounded-full text-[15px] font-medium text-[#1e1a15] motion-safe:transition hover:text-[#234f3b] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#234f3b]"
          >
            Or browse all products
            <ArrowRight size={15} aria-hidden="true" />
          </Link>
        </form>
      </section>

      {isSheetOpen ? (
        <div
          className="fixed inset-0 z-[90] flex items-end justify-center bg-[#15120e]/18 px-0 pt-8 backdrop-blur-[1px] sm:px-6"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeSheet();
          }}
        >
          <div
            ref={sheetRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="bioaro-ai-title"
            aria-describedby="bioaro-ai-description"
          className={`relative flex h-[min(90dvh,860px)] w-full flex-col overflow-hidden rounded-t-[34px] border border-b-0 border-[#e4dacb]/90 bg-[rgba(242,235,223,0.7)] shadow-[0_-18px_70px_rgba(22,18,13,0.24),inset_0_1px_0_rgba(255,255,255,0.72)] backdrop-blur-xl motion-safe:transition-[transform,opacity] motion-safe:duration-300 motion-safe:ease-out sm:h-[min(84dvh,820px)] sm:w-[min(1100px,calc(100vw-48px))] sm:rounded-t-[40px] ${
              sheetMotion === "open" ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-full opacity-0"
            }`}
          >
            <header className="relative z-20 shrink-0 border-b border-[#e4dacb]/85 bg-[rgba(250,246,238,0.94)] px-5 py-4 sm:px-8">
              <button
                ref={closeButtonRef}
                type="button"
                onClick={closeSheet}
                className="absolute right-4 top-4 flex size-11 items-center justify-center rounded-full border border-white/60 bg-white/55 text-[#1f1a14] shadow-[0_10px_28px_rgba(42,34,24,0.14)] motion-safe:transition hover:bg-white/82 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#234f3b]"
                aria-label="Close BioAro AI recommendation sheet"
              >
                <X size={19} aria-hidden="true" />
              </button>
              <div className="pr-14">
                <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#a07120]">BioAro AI</p>
                <h2 id="bioaro-ai-title" className="mt-2 font-serif text-[34px] leading-none text-[#1f1a14] sm:text-[52px]">
                  Your BioAro recommendation
                </h2>
                <p id="bioaro-ai-description" className="mt-2 max-w-2xl text-sm leading-6 text-[#4c463d] sm:text-base">
                  Front-end guidance based on approved BioAro product information and the goal you entered.
                </p>
              </div>
            </header>

            <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5 [scrollbar-color:rgba(64,55,44,0.35)_transparent] [scrollbar-width:thin] sm:px-8 sm:py-7">
              {sheetState === "loading" ? (
                <div className="grid min-h-[420px] place-items-center text-center">
                  <div>
                    <div className="mx-auto flex size-16 items-center justify-center rounded-full border border-white/70 bg-white/50 text-[#234f3b] shadow-[0_18px_46px_rgba(42,34,24,0.12)]">
                      <Loader2 className="size-7 motion-safe:animate-spin" aria-hidden="true" />
                    </div>
                    <h3 className="mt-6 font-serif text-[34px] leading-tight text-[#1f1a14]">Understanding your goal</h3>
                    <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-[#5c554b]">
                      Reviewing BioAro’s approved product information to find the closest match.
                    </p>
                  </div>
                </div>
              ) : null}

              {sheetState === "result" && recommendation ? (
                <div className="space-y-5">
                  <div className="rounded-[22px] border border-[#e6ddcf] bg-[rgba(255,253,248,0.9)] p-4 sm:p-5">
                    <div className="flex flex-wrap gap-2">
                      {interpretedTags.map((tag) => (
                        <span key={tag} className="rounded-full border border-[#d4c2a5]/70 bg-[rgba(255,253,248,0.86)] px-3 py-1 text-xs text-[#4c463d]">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="mt-4 flex flex-col gap-2 rounded-2xl border border-[#e6ddcf] bg-[rgba(255,253,248,0.82)] px-4 py-3 sm:flex-row sm:items-center">
                      <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#234f3b]">Your goal</span>
                      <p className="text-sm text-[#1f1a14]">{submittedGoal}</p>
                    </div>
                  </div>

                  <ProductMatchCard product={recommendation.product} shopHref={shopHref} isPrimary />

                  {recommendation.alternatives.length ? (
                    <section aria-labelledby="bioaro-ai-secondary-title">
                      <h3 id="bioaro-ai-secondary-title" className="text-sm font-semibold text-[#1f1a14]">
                        Also consider
                      </h3>
                      <div className="mt-3 grid gap-4 md:grid-cols-2">
                        {recommendation.alternatives.map((product) => (
                          <ProductMatchCard key={product.handle} product={product} shopHref={shopHref} />
                        ))}
                      </div>
                    </section>
                  ) : null}

                  {expandedAction ? (
                    <div className="rounded-[24px] border border-[#e6ddcf] bg-[rgba(255,253,248,0.82)] p-5 text-sm leading-6 text-[#514a41]">
                      <FollowUpContent action={expandedAction} recommendation={recommendation} />
                    </div>
                  ) : null}
                </div>
              ) : null}

              {sheetState === "no-match" ? (
                <div className="grid min-h-[420px] place-items-center">
                  <div className="max-w-xl text-center">
                    <div className="mx-auto flex size-16 items-center justify-center rounded-full border border-white/70 bg-white/50 text-[#234f3b]">
                      <Sparkles size={26} aria-hidden="true" />
                    </div>
                    <h3 className="mt-6 font-serif text-[38px] leading-tight text-[#1f1a14]">Let’s refine your goal</h3>
                    <p className="mt-4 text-sm leading-6 text-[#5c554b]">
                      We don’t have enough information to recommend a product confidently. Try describing whether your
                      priority is energy, healthy ageing, focus, training performance, women’s energy, omega support or
                      antioxidant support.
                    </p>
                  </div>
                </div>
              ) : null}

              {sheetState === "sensitive" ? (
                <div className="grid min-h-[420px] place-items-center">
                  <div className="max-w-xl text-center">
                    <div className="mx-auto flex size-16 items-center justify-center rounded-full border border-white/70 bg-white/50 text-[#8b5a22]">
                      <ShieldAlert size={27} aria-hidden="true" />
                    </div>
                    <h3 className="mt-6 font-serif text-[38px] leading-tight text-[#1f1a14]">
                      This needs professional guidance
                    </h3>
                    <p className="mt-4 text-sm leading-6 text-[#5c554b]">
                      BioAro can help you explore general wellness products, but it cannot assess urgent symptoms,
                      diagnose a condition or replace medical care. Please speak with a qualified healthcare
                      professional for personal guidance.
                    </p>
                  </div>
                </div>
              ) : null}

              {sheetState === "error" ? (
                <div className="grid min-h-[420px] place-items-center">
                  <div className="max-w-xl text-center">
                    <h3 className="font-serif text-[38px] leading-tight text-[#1f1a14]">We could not load a match</h3>
                    <p className="mt-4 text-sm leading-6 text-[#5c554b]">
                      Please try a different goal or browse the BioAro product range.
                    </p>
                    <Link
                      to={shopHref}
                      className="mt-6 inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#1f1a14] px-5 text-sm font-semibold text-white"
                    >
                      Browse products
                      <ArrowRight size={15} aria-hidden="true" />
                    </Link>
                  </div>
                </div>
              ) : null}
            </div>

            <footer className="relative z-20 shrink-0 border-t border-[#e4dacb]/85 bg-[rgba(249,244,235,0.95)] px-5 py-4 sm:px-8">
              <p className="flex gap-2 text-xs leading-5 text-[#5c554b]">
                <Info className="mt-0.5 size-4 shrink-0 text-[#234f3b]" aria-hidden="true" />
                {SAFETY_NOTE}
              </p>

              {sheetState === "result" && recommendation ? (
                <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
                  {FOLLOW_UP_ACTIONS.map((action) => (
                    <button
                      key={action.key}
                      type="button"
                      onClick={() => setExpandedAction((current) => (current === action.key ? null : action.key))}
                      className="flex min-h-11 items-center justify-between gap-3 rounded-xl border border-[#e4dacb] bg-[rgba(255,253,248,0.82)] px-3 text-left text-xs font-medium text-[#1f1a14] motion-safe:transition hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#234f3b]"
                      aria-expanded={expandedAction === action.key}
                    >
                      {action.label}
                      <ChevronDown
                        className={`size-4 shrink-0 motion-safe:transition ${expandedAction === action.key ? "rotate-180" : ""}`}
                        aria-hidden="true"
                      />
                    </button>
                  ))}
                </div>
              ) : null}

              {sheetState !== "loading" ? (
                <form onSubmit={handleRefinementSubmit} className="mt-4">
                  <label htmlFor="bioaro-ai-refinement" className="sr-only">
                    Refine your BioAro AI recommendation
                  </label>
                  <div className="flex items-center gap-2 rounded-[20px] border border-[#e4dacb] bg-[rgba(255,253,248,0.92)] p-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]">
                    <input
                      id="bioaro-ai-refinement"
                      type="text"
                      value={refinementValue}
                      onChange={(event) => setRefinementValue(event.target.value)}
                      placeholder="Ask about this recommendation..."
                      className="h-11 min-w-0 flex-1 bg-transparent px-3 text-sm text-[#1f1a14] outline-none placeholder:text-[#8c877d]"
                    />
                    <button
                      type="submit"
                      className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-[#234f3b] text-white shadow-[0_12px_24px_rgba(35,79,59,0.22)] motion-safe:transition hover:translate-x-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#234f3b]"
                      aria-label="Refine recommendation"
                    >
                      <ArrowRight size={17} aria-hidden="true" />
                    </button>
                  </div>
                </form>
              ) : null}
            </footer>
          </div>
        </div>
      ) : null}
    </>
  );
}
