/*
 * Restored from git blob 81795c47 (branch bioarodrugs-finaldraft). Review text,
 * names and product tags are unchanged at the client's instruction; only the
 * visual treatment was migrated onto the current token system.
 *
 * Two things to resolve before launch, both one-line changes:
 *  - every card renders "Verified", which is a claim this project cannot support;
 *    PRODUCT.md records customer testimonials as "none confirmed real".
 *  - StarRating() renders five stars unconditionally. There is no rating data
 *    behind it, so it is decoration rather than a measurement.
 *
 * The nine Unsplash portraits previously used as customer faces were removed:
 * they showed real, identifiable people as BioAro customers. Everyone now gets
 * an initials circle tinted from the four domain colours.
 */
import { useMemo } from "react";
import { Star } from "lucide-react";

type Review = {
  name: string;
  product: string;
  quote: string;
  avatarColor?: string;
};

// Low-alpha domain colours so the avatars belong to the same system as the pillars.
const AVATAR_COLORS = [
  "rgba(59,84,196,0.12)",
  "rgba(193,70,42,0.12)",
  "rgba(14,118,122,0.12)",
  "rgba(42,99,71,0.12)",
  "rgba(28,25,23,0.08)",
];

const ROW_ONE: Review[] = [
  { name: "Sarah M.", product: "LONgevity+", quote: "Three months in and my energy through the afternoon is noticeably steadier. No more 3pm crash." },
  { name: "David K.", product: "Creagen Brain Boost", quote: "Focus during long work sessions has genuinely improved. I notice it most on back-to-back meeting days.", avatarColor: AVATAR_COLORS[0] },
  { name: "Priya R.", product: "CellOmega+", quote: "Easy to fit into my morning routine. Clean label, no weird aftertaste, and I actually remember to take it." },
  { name: "Tom H.", product: "Creagen Pro Power", quote: "Recovery after training sessions feels quicker. Less soreness the next morning.", avatarColor: AVATAR_COLORS[1] },
  { name: "Aisha B.", product: "Creagen Femme Energy", quote: "A gentler lift than coffee, without the jittery feeling by midday." },
  { name: "James L.", product: "LONgevity+", quote: "Appreciated that every dose is listed on the label. No guessing what I'm actually taking.", avatarColor: AVATAR_COLORS[2] },
  { name: "Nina P.", product: "CellOmega+", quote: "Been on it for six weeks. Nothing dramatic, just steady, consistent support day to day." },
  { name: "Marcus T.", product: "Creagen Brain Boost", quote: "Helped me stay sharp during a demanding project. Ordering the family pack next.", avatarColor: AVATAR_COLORS[3] },
  { name: "Chloe W.", product: "Creagen Femme Energy", quote: "Finally a supplement that doesn't hide behind a proprietary blend. Straightforward ingredients." },
  { name: "Ravi S.", product: "Creagen Pro Power", quote: "My training days feel less draining by the weekend. Subtle, but I can tell the difference.", avatarColor: AVATAR_COLORS[4] },
  { name: "Ellie F.", product: "LONgevity+", quote: "The customer support team answered my questions before I even placed my first order.", avatarColor: AVATAR_COLORS[0] },
  { name: "Oliver D.", product: "CellOmega+", quote: "Straightforward routine - one capsule with breakfast, that's it. Easy to stick with.", avatarColor: AVATAR_COLORS[1] },
  { name: "Grace N.", product: "Creagen Brain Boost", quote: "Used it through exam season. Felt more consistent with concentration across long study blocks.", avatarColor: AVATAR_COLORS[2] },
  { name: "Adam C.", product: "Creagen Femme Energy", quote: "Doesn't overpromise. Just does what it says - steady energy without the crash.", avatarColor: AVATAR_COLORS[3] },
  { name: "Fatima Z.", product: "LONgevity+", quote: "Appreciated the quality testing information being available. Made the decision to buy easier.", avatarColor: AVATAR_COLORS[4] },
  { name: "Ben O.", product: "Creagen Pro Power", quote: "Been using it alongside my usual training block. Recovery windows feel a bit shorter.", avatarColor: AVATAR_COLORS[0] },
  { name: "Isla M.", product: "CellOmega+", quote: "Simple, transparent, and it's become part of my everyday routine without much thought.", avatarColor: AVATAR_COLORS[1] },
  { name: "Leo V.", product: "Creagen Brain Boost", quote: "Noticed better mental clarity by week two. Sticking with it through the next quarter.", avatarColor: AVATAR_COLORS[2] },
];

const ROW_TWO: Review[] = [
  { name: "Hannah R.", product: "Creagen Femme Energy", quote: "Good balance of energy without feeling wired. Works well alongside my morning coffee." },
  { name: "Connor B.", product: "LONgevity+", quote: "Been taking it for two months as part of a broader wellness routine. No complaints so far.", avatarColor: AVATAR_COLORS[3] },
  { name: "Zara K.", product: "CellOmega+", quote: "Appreciated that the sourcing and manufacturing details were actually available on request." },
  { name: "Ethan J.", product: "Creagen Pro Power", quote: "Post-workout recovery has felt smoother since I started. Will reorder.", avatarColor: AVATAR_COLORS[4] },
  { name: "Mia S.", product: "Creagen Brain Boost", quote: "Helped with focus during a stretch of long shifts. Subtle but noticeable." },
  { name: "Ryan P.", product: "LONgevity+", quote: "Clear dosage guidance on the product page made it easy to know what I was getting.", avatarColor: AVATAR_COLORS[0] },
  { name: "Sophie A.", product: "Creagen Femme Energy", quote: "A steady lift in the morning that carries through without a mid-morning slump." },
  { name: "Noah T.", product: "CellOmega+", quote: "Straightforward supplement, no filler ingredients I couldn't recognize.", avatarColor: AVATAR_COLORS[1] },
  { name: "Lily G.", product: "Creagen Brain Boost", quote: "Using it through a busy semester. Concentration during study sessions feels more consistent.", avatarColor: AVATAR_COLORS[2] },
  { name: "Jack W.", product: "Creagen Pro Power", quote: "Noticed less muscle soreness after heavier training days.", avatarColor: AVATAR_COLORS[3] },
  { name: "Amara D.", product: "LONgevity+", quote: "Appreciated the responsible sourcing notes and clear ingredient breakdown.", avatarColor: AVATAR_COLORS[4] },
  { name: "Harry E.", product: "CellOmega+", quote: "Part of my daily stack now. Simple to take, no issues so far.", avatarColor: AVATAR_COLORS[0] },
  { name: "Freya L.", product: "Creagen Femme Energy", quote: "Good for busy mornings when I need steady energy without overdoing caffeine.", avatarColor: AVATAR_COLORS[1] },
  { name: "Daniel M.", product: "Creagen Brain Boost", quote: "Helpful during long project deadlines. Focus felt more sustained through the afternoon.", avatarColor: AVATAR_COLORS[2] },
  { name: "Ruby H.", product: "LONgevity+", quote: "Six weeks in, and it's become a normal part of my morning without a second thought.", avatarColor: AVATAR_COLORS[3] },
  { name: "Owen C.", product: "Creagen Pro Power", quote: "Training recovery has felt a bit quicker since adding this to my routine.", avatarColor: AVATAR_COLORS[4] },
  { name: "Ivy N.", product: "CellOmega+", quote: "Appreciated the market-specific pricing - no confusion at checkout.", avatarColor: AVATAR_COLORS[0] },
  { name: "Felix R.", product: "Creagen Brain Boost", quote: "Consistent focus support without any jittery side effects.", avatarColor: AVATAR_COLORS[1] },
];

function StarRating() {
  return (
    <div className="flex items-center gap-0.5" aria-label="5 out of 5 stars">
      {Array.from({ length: 5 }).map((_, index) => (
        <Star key={index} size={13} className="fill-ember text-ember" />
      ))}
    </div>
  );
}

function Avatar({ review }: { review: Review }) {
  const initials = review.name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div
      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-[13px] font-bold tracking-[-0.01em] text-ink"
      style={{ backgroundColor: review.avatarColor ?? AVATAR_COLORS[0] }}
      aria-hidden="true"
    >
      {initials}
    </div>
  );
}

function ReviewCard({ review }: { review: Review }) {
  return (
    <div className="flex h-full w-[300px] shrink-0 flex-col justify-between gap-4 rounded-[28px] border border-line bg-white px-6 py-6 shadow-[0_18px_38px_-32px_rgba(28,25,23,0.32)] sm:w-[340px]">
      <div>
        <div className="flex items-center gap-3">
          <Avatar review={review} />
          <div>
            <p className="text-[15px] font-bold tracking-[-0.015em] text-ink">{review.name}</p>
            <StarRating />
          </div>
        </div>
        <p className="mt-4 text-pretty text-[14.5px] leading-[1.6] text-ink-600">&ldquo;{review.quote}&rdquo;</p>
      </div>
      <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-ember">
        Verified · {review.product}
      </span>
    </div>
  );
}

function MarqueeRow({ reviews, direction, duration }: { reviews: Review[]; direction: "left" | "right"; duration: number }) {
  const loopedReviews = useMemo(() => [...reviews, ...reviews], [reviews]);
  const animationName = direction === "left" ? "bioaro-marquee-left" : "bioaro-marquee-right";

  return (
    <div className="group overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)]">
      <div
        className="flex w-max items-stretch gap-5 group-hover:[animation-play-state:paused]"
        style={{ animation: `${animationName} ${duration}s linear infinite` }}
      >
        {loopedReviews.map((review, index) => (
          <ReviewCard key={`${review.name}-${index}`} review={review} />
        ))}
      </div>
    </div>
  );
}

export default function Testimonials() {
  return (
    <section className="pb-24 pt-4 sm:pb-28 lg:pb-32">
      <div className="container-bio">
        <div className="mx-auto max-w-[680px] text-center">
          <span className="eyebrow">Trusted daily</span>
          <h2 className="mt-4 text-balance text-[34px] font-black leading-[1.0] tracking-[-0.035em] text-ink sm:text-[44px] lg:text-[54px]">
            Backed by people who use it <span className="italic text-ember">every day.</span>
          </h2>
          <p className="mt-5 text-pretty text-[16.5px] leading-[1.6] text-ink-600">
            Real routines, real results - shared by the BioAro Drugs community.
          </p>
        </div>

      </div>

      <div className="mt-12 space-y-5">
        <MarqueeRow reviews={ROW_ONE} direction="left" duration={90} />
        <MarqueeRow reviews={ROW_TWO} direction="right" duration={100} />
      </div>
    </section>
  );
}
