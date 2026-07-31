import type { LucideIcon } from "lucide-react";
import { BadgeCheck, CircleCheck, ShieldCheck, Sprout, LeafyGreen } from "lucide-react";
import nonGmoAsset from "../../assets/certifications/non-gmo.png";
import glutenFreeAsset from "../../assets/certifications/gluten-free.png";
import sugarFreeAsset from "../../assets/certifications/sugar-free.png";
import nutFreeAsset from "../../assets/certifications/nut-free.png";
import veganSafeAsset from "../../assets/certifications/vegan-safe.png";

type CertificationFallback = {
  label: string;
  description: string;
  icon: LucideIcon;
};

type CertificationCard = {
  key: string;
  image?: string;
  alt: string;
  fallback: CertificationFallback;
};

const CERTIFICATIONS: CertificationCard[] = [
  {
    key: "non-gmo",
    image: nonGmoAsset,
    alt: "Non-GMO certification card showing no genetically modified ingredients",
    fallback: {
      label: "NON-GMO",
      description: "No genetically modified ingredients",
      icon: ShieldCheck,
    },
  },
  {
    key: "gluten-free",
    image: glutenFreeAsset,
    alt: "Gluten Free certification card showing suitable for gluten-free diets",
    fallback: {
      label: "GLUTEN FREE",
      description: "Suitable for gluten-free diets",
      icon: Sprout,
    },
  },
  {
    key: "sugar-free",
    image: sugarFreeAsset,
    alt: "Sugar Free certification card showing no added sugar",
    fallback: {
      label: "SUGAR FREE",
      description: "No added sugar",
      icon: CircleCheck,
    },
  },
  {
    key: "nut-free",
    image: nutFreeAsset,
    alt: "Nut Free certification card showing contains no nut ingredients",
    fallback: {
      label: "NUT FREE",
      description: "Contains no nut ingredients",
      icon: BadgeCheck,
    },
  },
  {
    key: "vegan",
    image: veganSafeAsset,
    alt: "100% Vegan certification card showing 100% plant-based",
    fallback: {
      label: "VEGAN SAFE",
      description: "100% plant-based",
      icon: LeafyGreen,
    },
  },
];

const CERTIFICATION_KEYS_BY_HANDLE: Record<string, string[]> = {
  "glutara": ["non-gmo", "gluten-free", "sugar-free", "nut-free", "vegan"],
  "cellomega-plus": ["non-gmo", "gluten-free", "sugar-free", "nut-free", "vegan"],
  "creagen-brain-boost": ["non-gmo", "gluten-free", "sugar-free", "nut-free", "vegan"],
  "creagen-femme-energy": ["non-gmo", "gluten-free", "sugar-free", "nut-free", "vegan"],
  "creagen-raw-power": ["non-gmo", "gluten-free", "sugar-free", "nut-free", "vegan"],
  "creagen-pro-power": ["non-gmo", "gluten-free", "sugar-free", "nut-free", "vegan"],
  "longevity-plus": ["non-gmo", "gluten-free", "sugar-free", "nut-free", "vegan"],
};

function CertificationFallbackCard({ fallback }: { fallback: CertificationFallback }) {
  const Icon = fallback.icon;

  return (
    <div className="flex h-full flex-col items-center justify-center rounded-2xl border border-ink/8 bg-white/55 px-4 py-5 text-center shadow-[0_12px_30px_-24px_rgba(27,26,23,0.18)] backdrop-blur-sm">
      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-forest-600/10 text-forest-600">
        <Icon size={18} strokeWidth={2.2} />
      </div>
      <p className="mt-4 text-[12px] font-semibold uppercase tracking-[0.14em] text-ink/80">{fallback.label}</p>
      <p className="mt-2 max-w-[13rem] text-xs leading-relaxed text-ink/50">{fallback.description}</p>
    </div>
  );
}

export default function QualityPurityStrip({
  title = "Quality & Purity",
  productHandle,
}: {
  title?: string;
  productHandle?: string;
}) {
  const certificationKeys = productHandle ? CERTIFICATION_KEYS_BY_HANDLE[productHandle] ?? CERTIFICATIONS.map((item) => item.key) : CERTIFICATIONS.map((item) => item.key);
  const visibleCertifications = CERTIFICATIONS.filter((item) => certificationKeys.includes(item.key));

  return (
    <section className="mt-12 glass-card border border-ink/8 bg-[rgba(255,255,255,0.62)] p-6 md:p-8">
      <span className="eyebrow">{title}</span>
      <div className="mt-5 grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
        {visibleCertifications.map((item) => (
          <div
            key={item.key}
            className="aspect-square overflow-hidden rounded-2xl border border-ink/8 bg-white/55 p-2.5 shadow-[0_12px_30px_-24px_rgba(27,26,23,0.18)]"
          >
            {item.image ? (
              <img
                src={item.image}
                alt={item.alt}
                className="block h-full w-full object-contain"
                loading="lazy"
              />
            ) : (
              <CertificationFallbackCard fallback={item.fallback} />
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
