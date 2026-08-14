import { Dumbbell, Info, Moon, ShieldCheck, Sunrise, Target } from "lucide-react";
import { GOALS } from "../../data/homepage";
import type { GoalId, Protocol, ProtocolSlot } from "../../lib/protocol/build";
import type { CatalogProduct } from "../../lib/shopify/types";

/*
 * The live protocol preview.
 *
 * This is genuine output from `buildProtocol` — the same engine the Protocol Builder
 * runs — not a mock-up of one. That is the whole reason it is worth building: a
 * visitor picking Energy and Focus sees the products they would actually be given,
 * with the real slot each one belongs to.
 *
 * It stays honest about what it is. It is labelled a preview because the builder asks
 * three more questions (energy, sleep, training) that this surface has not asked yet,
 * so the protocol can still change. Any note the engine returns — the "no sleep
 * formula" disclosure in particular — is rendered here rather than swallowed.
 */

const SLOT_ICONS: Record<ProtocolSlot, typeof Sunrise> = {
  Morning: Sunrise,
  "Around training": Dumbbell,
  Evening: Moon,
};

function Plate({ icon: Icon }: { icon: typeof Sunrise }) {
  return (
    <span
      aria-hidden="true"
      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px] bg-[rgba(193,70,42,0.08)] text-ember"
    >
      <Icon size={19} strokeWidth={1.9} />
    </span>
  );
}

export default function ProtocolPreview({
  goals,
  protocol,
  byHandle,
}: {
  goals: GoalId[];
  protocol: Protocol | null;
  byHandle: Map<string, CatalogProduct>;
}) {
  const goalLabels = goals
    .map((id) => GOALS.find((goal) => goal.id === id)?.label)
    .filter((label): label is string => Boolean(label));

  const rows = (protocol?.items ?? [])
    .map((item) => ({ item, product: byHandle.get(item.handle) }))
    .filter((row): row is { item: NonNullable<Protocol["items"]>[number]; product: CatalogProduct } =>
      Boolean(row.product),
    );

  return (
    <div className="rounded-[24px] border border-line bg-white p-5 shadow-glass sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
        <p className="text-[12px] font-bold uppercase tracking-[0.14em] text-ember">Your starting protocol</p>
        <p className="flex items-center gap-2 text-[12.5px] text-ink-400">
          <span aria-hidden="true" className="h-2 w-2 rounded-full bg-longevity" />
          Live preview
        </p>
      </div>

      {goalLabels.length === 0 ? (
        /* Also the error and unavailable state. One empty state, so a visitor never
           sees a different message depending on why nothing is shown. */
        <div className="mt-5 rounded-[18px] border border-dashed border-line px-5 py-10 text-center">
          <p className="text-[15px] font-bold tracking-[-0.02em] text-ink">Choose a goal to continue</p>
          <p className="mx-auto mt-2 max-w-[34ch] text-[13.5px] leading-[1.55] text-ink-600">
            Pick what you want to improve and a starting protocol appears here.
          </p>
        </div>
      ) : (
        <div className="mt-5 overflow-hidden rounded-[18px] border border-line">
          <div className="flex items-center gap-4 border-b border-line p-4">
            <Plate icon={Target} />
            <div className="min-w-0">
              <p className="text-[12.5px] text-ink-400">Goal</p>
              <p className="text-[17px] font-bold tracking-[-0.025em] text-ink">{goalLabels.join(" + ")}</p>
            </div>
          </div>

          {rows.map(({ item, product }) => (
            <div key={item.handle} className="flex items-center gap-4 border-b border-line p-4 last:border-b-0">
              <Plate icon={SLOT_ICONS[item.slot]} />
              <div className="min-w-0 flex-1">
                <p className="text-[12.5px] font-bold text-ember">{item.slot}</p>
                <p className="truncate text-[16px] font-bold tracking-[-0.025em] text-ink">{product.title}</p>
                <p className="mt-0.5 line-clamp-2 text-[13.5px] leading-[1.45] text-ink-600">{product.tagline}</p>
              </div>
              <img
                src={product.image?.src}
                alt=""
                aria-hidden="true"
                loading="lazy"
                decoding="async"
                className="hidden h-16 w-16 shrink-0 rounded-[10px] object-contain sm:block"
              />
            </div>
          ))}
        </div>
      )}

      {/* Engine notes are surfaced, not swallowed — this is where the "no sleep
          formula yet" disclosure has to appear if someone picked Sleep. */}
      {protocol?.notes.map((note) => (
        <p
          key={note}
          className="mt-4 flex items-start gap-2.5 rounded-[16px] bg-cream-50 p-4 text-[13px] leading-[1.55] text-ink-600"
        >
          <Info size={15} strokeWidth={2} aria-hidden="true" className="mt-0.5 shrink-0 text-ember" />
          {note}
        </p>
      ))}

      {rows.length > 0 && (
        <div className="mt-4 flex items-start gap-3 rounded-[16px] bg-cream-50 p-4">
          <ShieldCheck size={18} strokeWidth={1.9} aria-hidden="true" className="mt-0.5 shrink-0 text-ember" />
          <div>
            <p className="text-[14.5px] font-bold tracking-[-0.02em] text-ink">Why these?</p>
            <p className="mt-1 text-[13.5px] leading-[1.5] text-ink-600">
              Matched to the goals you selected. The builder asks three more questions before this is final.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
