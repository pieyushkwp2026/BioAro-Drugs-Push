import {
  ClipboardCheck,
  HeartPulse,
  Lock,
  MapPin,
  MessageSquareText,
  RefreshCw,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Target,
  type LucideIcon,
} from "lucide-react";
import { AI_SECTION } from "../../data/homepage";
import type { AssistantSkill, SkillId } from "../../lib/assistant/skills";

/*
 * What the assistant can help with, said out loud.
 *
 * The list itself is `lib/assistant/skills.ts` — this only draws it. Two states, and
 * the difference between them is the point: a live skill is a control, an unavailable
 * one is still a control, and picking it answers you. Nothing here is disabled, greyed
 * out, or wearing a "coming soon" ribbon, because a visitor who taps something and gets
 * nothing learns less than one who is told why.
 *
 * The framing follows the can / will-not panel already on the member Care page rather
 * than inventing a second vocabulary for the same idea.
 */

const ICONS: Record<SkillId, LucideIcon> = {
  answer: MessageSquareText,
  protocol: Target,
  availability: ShoppingBag,
  handoff: HeartPulse,
  "label-scan": ClipboardCheck,
  prescription: ShieldCheck,
  orders: ShoppingBag,
  address: MapPin,
  subscription: RefreshCw,
  consult: HeartPulse,
};

export default function SkillPalette({
  skills,
  onPick,
}: {
  skills: AssistantSkill[];
  onPick: (skill: AssistantSkill) => void;
}) {
  return (
    <section>
      <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.12em] text-ink-400">
        <Sparkles size={12} strokeWidth={2.4} aria-hidden="true" />
        {AI_SECTION.skillsHeading}
      </p>

      <ul className="mt-3 grid gap-2 sm:grid-cols-2">
        {skills.map((skill) => {
          const Icon = ICONS[skill.id];

          return (
            <li key={skill.id}>
              <button
                type="button"
                onClick={() => onPick(skill)}
                className={`flex w-full items-start gap-3 rounded-[16px] border p-3.5 text-left transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ember ${
                  skill.live
                    ? "border-line bg-white hover:border-ember/50"
                    : "border-dashed border-line bg-transparent hover:border-line-strong"
                }`}
              >
                <span
                  aria-hidden="true"
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px] ${
                    skill.live ? "bg-[rgba(193,70,42,0.09)] text-ember" : "bg-cream-200 text-ink-400"
                  }`}
                >
                  <Icon size={15} strokeWidth={2.1} />
                </span>

                <span className="min-w-0">
                  <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
                    <span className="text-[14px] font-bold tracking-[-0.02em] text-ink">
                      {skill.label}
                    </span>
                    {!skill.live && (
                      <span className="inline-flex items-center gap-1 rounded-full border border-line bg-cream-50 px-2 py-0.5 text-[10.5px] font-bold uppercase tracking-[0.08em] text-ink-400">
                        <Lock size={9} strokeWidth={2.6} aria-hidden="true" />
                        {AI_SECTION.skillsUnavailable}
                      </span>
                    )}
                  </span>
                  <span className="mt-1 block text-[12.5px] leading-[1.5] text-ink-600">
                    {skill.blurb}
                  </span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
