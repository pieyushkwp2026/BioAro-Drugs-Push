import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Clock3, Sparkles } from "lucide-react";
import { useMarketHref } from "../../hooks/useMarketHref";
import { useProtocolDraft } from "../../hooks/useProtocolDraft";
import { ROUTES } from "../../lib/routes";
import { AI_SECTION } from "../../data/homepage";
import type { CatalogProduct } from "../../lib/shopify/types";
import { Eyebrow, Section, SectionHeading } from "./primitives";
import ProtocolStudio from "./ProtocolStudio";
import { GoalChips, IntentBox } from "./protocolControls";

/*
 * BioAro Drugs AI — the entry to the protocol path.
 *
 * ---------------------------------------------------------------------------
 * AN INVITATION, NOT THE INTERACTION.
 *
 * The controls are here because the free-text box is the front door and belongs on
 * the page. Everything that HAPPENS — chips resolving, the protocol arranging — opens
 * in the studio modal instead of expanding inline, so the section stays short and no
 * pane is sized for content that does not exist yet.
 *
 * The draft lives here rather than in the modal. Two consequences worth keeping:
 * what you type on the page is already in the modal when it opens, with no seed to
 * thread through, and closing the modal discards nothing.
 *
 * The box does not pattern-match text into goals itself; `bioaroAiService` does, and
 * the chips say where the result came from. Nothing in the copy claims a model read
 * the sentence while no endpoint exists.
 * ---------------------------------------------------------------------------
 */

export default function AiProtocolEntry({ byHandle }: { byHandle: Map<string, CatalogProduct> }) {
  const marketHref = useMarketHref();
  const navigate = useNavigate();
  const draft = useProtocolDraft();

  const [open, setOpen] = useState(false);
  /* Set when the box opened the modal, so the caret lands in the modal's textarea.
     A chip tap opens it with no focus target — popping the mobile keyboard for
     someone who just tapped a chip is the wrong reflex. */
  const [focusInput, setFocusInput] = useState(false);

  const openStudio = (options?: { focusInput?: boolean }) => {
    setFocusInput(Boolean(options?.focusInput));
    setOpen(true);
  };

  /* Send resolves the goals FIRST, then opens — so the modal appears with the chips
     already lit and the protocol already arranged, rather than opening empty and
     rearranging itself while someone is still looking for it. */
  const sendAndOpen = () => {
    void draft.send().then(() => openStudio({ focusInput: true }));
  };

  const handoff = () => {
    const query = draft.goals.length > 0 ? `?goals=${draft.goals.join(",")}` : "";
    /* Goals ride in the URL so the link stays shareable. The visitor's own words ride
       in router state instead — they are long, and they do not belong in a URL that
       might be shared, logged, or pasted into a support ticket. */
    navigate(`${marketHref(ROUTES.quiz)}${query}`, {
      state: draft.message.trim() ? { note: draft.message.trim() } : undefined,
    });
  };

  return (
    <Section id="bioaro-ai" className="scroll-mt-[112px] pb-20 sm:pb-24 lg:pb-28">
      <div className="mx-auto max-w-[720px] text-center">
        <div className="flex items-center justify-center gap-2.5">
          <Sparkles size={15} strokeWidth={2.2} aria-hidden="true" className="text-ember" />
          <Eyebrow>{AI_SECTION.eyebrow}</Eyebrow>
        </div>

        <SectionHeading className="mx-auto mt-4 max-w-[16ch]">{AI_SECTION.headline}</SectionHeading>

        <p className="mx-auto mt-5 max-w-[48ch] text-pretty text-[16px] leading-[1.6] text-ink-600">
          {AI_SECTION.body}
        </p>

        {/* text-left inside a centred column: a text field and its result lines are
            read, not scanned, and centred prose in an input reads as broken. */}
        <div className="mt-8 text-left">
          <IntentBox draft={draft} onSend={sendAndOpen} />
        </div>

        {/* Capped narrower than the column on purpose. The seven chips need 769px and
            the column is 720, so at full width they break 6 + 1 and leave Women's
            Health stranded on a line of its own. Capping forces a deliberate 4 + 3. */}
        <GoalChips draft={draft} onPick={() => openStudio()} className="mx-auto mt-5 max-w-[440px] justify-center" />

        <button type="button" onClick={() => openStudio()} className="btn-primary group mt-8">
          {draft.goals.length > 0 ? AI_SECTION.continueCta : AI_SECTION.cta}
          <ArrowRight
            size={16}
            strokeWidth={2.4}
            aria-hidden="true"
            className="transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transform-none"
          />
        </button>

        <p className="mt-3 flex items-center justify-center gap-2 text-[13px] text-ink-400">
          <Clock3 size={14} strokeWidth={2} aria-hidden="true" />
          {AI_SECTION.duration}
        </p>

        {/* One line of honesty stays on the page. The section is claim-adjacent
            whether or not anyone opens the modal, and the fuller disclosure inside it
            is no use to someone who never does. */}
        <p className="mx-auto mt-7 max-w-[58ch] text-[13px] leading-[1.6] text-ink-400">{AI_SECTION.homepageNote}</p>
      </div>

      <ProtocolStudio
        open={open}
        draft={draft}
        byHandle={byHandle}
        onClose={() => setOpen(false)}
        onContinue={handoff}
        autoFocusInput={focusInput}
      />
    </Section>
  );
}
