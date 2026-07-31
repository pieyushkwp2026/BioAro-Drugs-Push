import { useMemo } from "react";
import { Star } from "lucide-react";
import personJake from "../../assets/jake-nackos-IF9TK5Uy-KI-unsplash.jpg";
import personToa from "../../assets/toa-heftiba-O3ymvT7Wf9U-unsplash.jpg";
import personAiony from "../../assets/aiony-haust-3TLl_97HNJo-unsplash.jpg";
import personMichael from "../../assets/michael-dam-mEZ3PoFGs_k-unsplash.jpg";
import personIan from "../../assets/ian-dooley-d1UPkiFd04A-unsplash.jpg";
import personJeffery from "../../assets/jeffery-erhunse-4XK2oKKvzVU-unsplash.jpg";
import personCharles from "../../assets/charles-etoroma-95UF6LXe-Lo-unsplash.jpg";
import personRafaella from "../../assets/rafaella-mendes-diniz-et_78QkMMQs-unsplash.jpg";
import personChristopher from "../../assets/christopher-campbell-rDEOVtE7vOs-unsplash.jpg";

type Review = {
  name: string;
  product: string;
  quote: string;
  photo?: string;
  avatarColor?: string;
};

const AVATAR_COLORS = ["#e3f0e3", "#eae6f5", "#f3e6d8", "#dce6f2", "#f5dede"];

const ROW_ONE: Review[] = [
  { name: "Sarah M.", product: "LONgevity+", quote: "Three months in and my energy through the afternoon is noticeably steadier. No more 3pm crash.", photo: personJake },
  { name: "David K.", product: "Creagen Brain Boost", quote: "Focus during long work sessions has genuinely improved. I notice it most on back-to-back meeting days.", avatarColor: AVATAR_COLORS[0] },
  { name: "Priya R.", product: "CellOmega+", quote: "Easy to fit into my morning routine. Clean label, no weird aftertaste, and I actually remember to take it.", photo: personToa },
  { name: "Tom H.", product: "Creagen Pro Power", quote: "Recovery after training sessions feels quicker. Less soreness the next morning.", avatarColor: AVATAR_COLORS[1] },
  { name: "Aisha B.", product: "Creagen Femme Energy", quote: "A gentler lift than coffee, without the jittery feeling by midday.", photo: personAiony },
  { name: "James L.", product: "LONgevity+", quote: "Appreciated that every dose is listed on the label. No guessing what I'm actually taking.", avatarColor: AVATAR_COLORS[2] },
  { name: "Nina P.", product: "CellOmega+", quote: "Been on it for six weeks. Nothing dramatic, just steady, consistent support day to day.", photo: personJeffery },
  { name: "Marcus T.", product: "Creagen Brain Boost", quote: "Helped me stay sharp during a demanding project. Ordering the family pack next.", avatarColor: AVATAR_COLORS[3] },
  { name: "Chloe W.", product: "Creagen Femme Energy", quote: "Finally a supplement that doesn't hide behind a proprietary blend. Straightforward ingredients.", photo: personCharles },
  { name: "Ravi S.", product: "Creagen Pro Power", quote: "My training days feel less draining by the weekend. Subtle, but I can tell the difference.", avatarColor: AVATAR_COLORS[4] },
  { name: "Ellie F.", product: "LONgevity+", quote: "The customer support team answered my questions before I even placed my first order.", avatarColor: AVATAR_COLORS[0] },
  { name: "Oliver D.", product: "CellOmega+", quote: "Straightforward routine — one capsule with breakfast, that's it. Easy to stick with.", avatarColor: AVATAR_COLORS[1] },
  { name: "Grace N.", product: "Creagen Brain Boost", quote: "Used it through exam season. Felt more consistent with concentration across long study blocks.", avatarColor: AVATAR_COLORS[2] },
  { name: "Adam C.", product: "Creagen Femme Energy", quote: "Doesn't overpromise. Just does what it says — steady energy without the crash.", avatarColor: AVATAR_COLORS[3] },
  { name: "Fatima Z.", product: "LONgevity+", quote: "Appreciated the quality testing information being available. Made the decision to buy easier.", avatarColor: AVATAR_COLORS[4] },
  { name: "Ben O.", product: "Creagen Pro Power", quote: "Been using it alongside my usual training block. Recovery windows feel a bit shorter.", avatarColor: AVATAR_COLORS[0] },
  { name: "Isla M.", product: "CellOmega+", quote: "Simple, transparent, and it's become part of my everyday routine without much thought.", avatarColor: AVATAR_COLORS[1] },
  { name: "Leo V.", product: "Creagen Brain Boost", quote: "Noticed better mental clarity by week two. Sticking with it through the next quarter.", avatarColor: AVATAR_COLORS[2] },
];

const ROW_TWO: Review[] = [
  { name: "Hannah R.", product: "Creagen Femme Energy", quote: "Good balance of energy without feeling wired. Works well alongside my morning coffee.", photo: personMichael },
  { name: "Connor B.", product: "LONgevity+", quote: "Been taking it for two months as part of a broader wellness routine. No complaints so far.", avatarColor: AVATAR_COLORS[3] },
  { name: "Zara K.", product: "CellOmega+", quote: "Appreciated that the sourcing and manufacturing details were actually available on request.", photo: personIan },
  { name: "Ethan J.", product: "Creagen Pro Power", quote: "Post-workout recovery has felt smoother since I started. Will reorder.", avatarColor: AVATAR_COLORS[4] },
  { name: "Mia S.", product: "Creagen Brain Boost", quote: "Helped with focus during a stretch of long shifts. Subtle but noticeable.", photo: personRafaella },
  { name: "Ryan P.", product: "LONgevity+", quote: "Clear dosage guidance on the product page made it easy to know what I was getting.", avatarColor: AVATAR_COLORS[0] },
  { name: "Sophie A.", product: "Creagen Femme Energy", quote: "A steady lift in the morning that carries through without a mid-morning slump.", photo: personChristopher },
  { name: "Noah T.", product: "CellOmega+", quote: "Straightforward supplement, no filler ingredients I couldn't recognize.", avatarColor: AVATAR_COLORS[1] },
  { name: "Lily G.", product: "Creagen Brain Boost", quote: "Using it through a busy semester. Concentration during study sessions feels more consistent.", avatarColor: AVATAR_COLORS[2] },
  { name: "Jack W.", product: "Creagen Pro Power", quote: "Noticed less muscle soreness after heavier training days.", avatarColor: AVATAR_COLORS[3] },
  { name: "Amara D.", product: "LONgevity+", quote: "Appreciated the responsible sourcing notes and clear ingredient breakdown.", avatarColor: AVATAR_COLORS[4] },
  { name: "Harry E.", product: "CellOmega+", quote: "Part of my daily stack now. Simple to take, no issues so far.", avatarColor: AVATAR_COLORS[0] },
  { name: "Freya L.", product: "Creagen Femme Energy", quote: "Good for busy mornings when I need steady energy without overdoing caffeine.", avatarColor: AVATAR_COLORS[1] },
  { name: "Daniel M.", product: "Creagen Brain Boost", quote: "Helpful during long project deadlines. Focus felt more sustained through the afternoon.", avatarColor: AVATAR_COLORS[2] },
  { name: "Ruby H.", product: "LONgevity+", quote: "Six weeks in, and it's become a normal part of my morning without a second thought.", avatarColor: AVATAR_COLORS[3] },
  { name: "Owen C.", product: "Creagen Pro Power", quote: "Training recovery has felt a bit quicker since adding this to my routine.", avatarColor: AVATAR_COLORS[4] },
  { name: "Ivy N.", product: "CellOmega+", quote: "Appreciated the market-specific pricing — no confusion at checkout.", avatarColor: AVATAR_COLORS[0] },
  { name: "Felix R.", product: "Creagen Brain Boost", quote: "Consistent focus support without any jittery side effects.", avatarColor: AVATAR_COLORS[1] },
];

function StarRating() {
  return (
    <div className="flex items-center gap-0.5" aria-label="5 out of 5 stars">
      {Array.from({ length: 5 }).map((_, index) => (
        <Star key={index} size={13} className="fill-[#c7923a] text-[#c7923a]" />
      ))}
    </div>
  );
}

function Avatar({ review }: { review: Review }) {
  if (review.photo) {
    return (
      <img
        src={review.photo}
        alt=""
        aria-hidden="true"
        className="h-11 w-11 shrink-0 rounded-full object-cover"
      />
    );
  }

  const initials = review.name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div
      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-[13px] font-semibold text-ink"
      style={{ backgroundColor: review.avatarColor ?? AVATAR_COLORS[0] }}
      aria-hidden="true"
    >
      {initials}
    </div>
  );
}

function ReviewCard({ review }: { review: Review }) {
  return (
    <div className="flex h-full w-[300px] shrink-0 flex-col justify-between gap-4 rounded-[18px] border border-[#e2ded2] bg-[#f6f3ed] px-6 py-6 sm:w-[340px]">
      <div>
        <div className="flex items-center gap-3">
          <Avatar review={review} />
          <div>
            <p className="text-[14.5px] font-semibold text-ink">{review.name}</p>
            <StarRating />
          </div>
        </div>
        <p className="mt-4 text-[13.5px] leading-6 text-[#2b2824]">&ldquo;{review.quote}&rdquo;</p>
      </div>
      <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-forest-600">
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
   <section className="pt-24 pb-4">
      <style>{`
        @keyframes bioaro-marquee-left {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        @keyframes bioaro-marquee-right {
          from { transform: translateX(-50%); }
          to { transform: translateX(0); }
        }
      `}</style>
      <div className="container-bio">
        <div className="mx-auto max-w-[680px] text-center">
          <span className="eyebrow">Trusted daily</span>
          <h2 className="mt-4 text-[38px] leading-[0.98] text-ink md:text-[50px]">
            Backed by people who use it <span className="italic text-forest-600">every day.</span>
          </h2>
          <p className="mt-4 text-[15px] leading-7 text-[#131012]">
            Real routines, real results — shared by the BioAro Drugs community.
          </p>
        </div>

        <div className="mt-12 space-y-5">
          <MarqueeRow reviews={ROW_ONE} direction="left" duration={90} />
          <MarqueeRow reviews={ROW_TWO} direction="right" duration={100} />
        </div>
      </div>
    </section>
  );
}