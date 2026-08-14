import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown, Clock3, Sparkles, ShieldCheck } from "lucide-react";
import { useMarketHref } from "../../hooks/useMarketHref";
import { useProtocolDraft } from "../../hooks/useProtocolDraft";
import { ROUTES } from "../../lib/routes";
import { AI_SECTION } from "../../data/homepage";
import type { CatalogProduct } from "../../lib/shopify/types";
import { Section } from "./primitives";
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

type AiProtocolEntryProps = {
  byHandle: Map<string, CatalogProduct>;
  variant?: "hero" | "floating" | "section";
  collapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
};

export default function AiProtocolEntry({
  byHandle,
  variant = "section",
  collapsed,
  onCollapsedChange,
}: AiProtocolEntryProps) {
  const marketHref = useMarketHref();
  const navigate = useNavigate();
  const draft = useProtocolDraft();

  const [open, setOpen] = useState(false);
  /* Set when the box opened the modal, so the caret lands in the modal's textarea.
     A chip tap opens it with no focus target — popping the mobile keyboard for
     someone who just tapped a chip is the wrong reflex. */
  const [focusInput, setFocusInput] = useState(false);
  const isFloating = variant === "floating";
  const isHero = variant === "hero";

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
    const query =
      draft.goals.length > 0 ? `?goals=${draft.goals.join(",")}` : "";
    /* Goals ride in the URL so the link stays shareable. The visitor's own words ride
       in router state instead — they are long, and they do not belong in a URL that
       might be shared, logged, or pasted into a support ticket. */
    navigate(`${marketHref(ROUTES.quiz)}${query}`, {
      state: draft.message.trim() ? { note: draft.message.trim() } : undefined,
    });
  };

  // Floating version = ONLY the input.
  if (isFloating) {
    return (
      <>
        {!collapsed ? (
          <div className="fixed left-1/2 top-[84px] z-[100] w-[min(820px,calc(100vw-32px))] -translate-x-1/2">
            <div className="relative">
              {/* AI floating search */}
              <div
                className="
                relative overflow-hidden
                rounded-[24px]
                border border-ember/20
                bg-white/95
                p-1.5
                shadow-[0_18px_55px_rgba(193,70,42,0.18)]
                backdrop-blur-xl
              "
              >
                {/* subtle glow */}
                <div
                  aria-hidden="true"
                  className="
                  pointer-events-none absolute inset-0
                  bg-[radial-gradient(circle_at_50%_0%,rgba(193,70,42,0.12),transparent_55%)]
                "
                />

                <div className="relative">
                  <IntentBox draft={draft} onSend={sendAndOpen} />
                </div>
              </div>

              {/* Collapse */}
              <button
                type="button"
                onClick={() => onCollapsedChange?.(true)}
                aria-label="Collapse BioAro Drugs AI"
                title="Collapse AI"
                className="
                absolute
                -right-2
                -top-3
                z-20
                flex h-7 w-7
                items-center justify-center
                rounded-full
                border border-line
                bg-white
                text-ink-400
                shadow-[0_4px_14px_rgba(0,0,0,0.14)]
                transition-all
                duration-200
                hover:scale-105
                hover:text-ink
                focus-visible:outline
                focus-visible:outline-2
                focus-visible:outline-offset-2
                focus-visible:outline-ember
              "
              >
                <ChevronDown size={14} strokeWidth={2.2} aria-hidden="true" />
              </button>
            </div>
          </div>
        ) : (
          /* ----------------------------------------------------------
           COLLAPSED AI ORB
        ---------------------------------------------------------- */
          <button
            type="button"
            onClick={() => onCollapsedChange?.(false)}
            aria-label="Open BioAro Drugs AI"
            className="
            group
            fixed
            right-5
            top-[84px]
            z-[100]
            flex
            h-14 w-14
            items-center justify-center
            rounded-full
            bg-ember
            text-white
            shadow-[0_10px_35px_rgba(193,70,42,0.35)]
            transition-all
            duration-300
            hover:scale-105
            hover:shadow-[0_14px_45px_rgba(193,70,42,0.45)]
            active:scale-95
            focus-visible:outline
            focus-visible:outline-2
            focus-visible:outline-offset-4
            focus-visible:outline-ember
            sm:right-7
            sm:h-auto
            sm:w-auto
            sm:gap-2.5
            sm:rounded-full
            sm:px-4
            sm:py-2.5
          "
          >
            {/* outer glow */}
            <span
              aria-hidden="true"
              className="
              pointer-events-none
              absolute inset-[-7px]
              rounded-full
              border border-ember/20
              opacity-70
              transition-all
              duration-300
              group-hover:inset-[-9px]
              group-hover:opacity-100
            "
            />

            {/* animated soft ring */}
            <span
              aria-hidden="true"
              className="
              pointer-events-none
              absolute inset-[-12px]
              rounded-full
              border border-ember/10
              opacity-50
            "
            />

            <span
              className="
              relative
              flex h-8 w-8
              items-center justify-center
              rounded-full
              bg-white/15
            "
            >
              <Sparkles
                size={17}
                strokeWidth={2.2}
                aria-hidden="true"
                className="
                transition-transform
                duration-300
                group-hover:rotate-12
              "
              />
            </span>

            <span className="hidden text-[13px] font-bold sm:inline">
              BioAro Drugs AI
            </span>
          </button>
        )}

        <ProtocolStudio
          open={open}
          draft={draft}
          byHandle={byHandle}
          onClose={() => setOpen(false)}
          onContinue={handoff}
          autoFocusInput={focusInput}
        />
      </>
    );
  }
  // Hero + normal section versions
  return (
    <Section
      id={isHero ? undefined : "bioaro-ai"}
      className={
        isHero
          ? "pt-2 pb-8 sm:pb-10 lg:pb-12"
          : "scroll-mt-[112px] py-12 sm:py-16 lg:py-20"
      }
    >
      <div className="relative w-full px-0 py-8 sm:py-10 lg:py-14">
        {" "}
        {/* Decorative AI glow */}
        <div
          aria-hidden="true"
          className="
      pointer-events-none
      absolute -right-32 -top-32
      h-[420px] w-[420px]
      rounded-full
      bg-[radial-gradient(circle,rgba(193,70,42,0.12),transparent_68%)]
      blur-2xl
    "
        />
        <div
          aria-hidden="true"
          className="
      pointer-events-none
      absolute -bottom-40 right-[8%]
      h-[320px] w-[320px]
      rounded-full
      border border-ember/10
    "
        />
        <div className="relative grid w-full gap-10 lg:grid-cols-[minmax(0,1.25fr)_minmax(320px,0.75fr)] lg:items-center">
          {" "}
          {/* LEFT — AI experience */}
          <div className="max-w-[760px]">
            {/* AI badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-ember/20 bg-white px-3.5 py-2 shadow-[0_4px_18px_rgba(193,70,42,0.08)]">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-ember/10">
                <Sparkles
                  size={13}
                  strokeWidth={2.2}
                  className="text-ember"
                  aria-hidden="true"
                />
              </span>

              <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-ink">
                BioAro Drugs AI
              </span>
            </div>

            <p className="mt-5 max-w-[55ch] text-[17px] leading-[1.55] text-ink-600 sm:text-[18px]">
              {AI_SECTION.body}
            </p>

            <div className="mt-7 max-w-[720px]">
              <div
                className="
            rounded-[26px]
            p-[2px]
            bg-gradient-to-r
            from-ember/30
            via-ember/10
            to-transparent
            shadow-[0_12px_45px_rgba(193,70,42,0.12)]
          "
              >
                <div className="rounded-[24px] bg-white">
                  <IntentBox draft={draft} onSend={sendAndOpen} />
                </div>
              </div>
            </div>

            <GoalChips
              draft={draft}
              onPick={() => openStudio()}
              className="mt-5 max-w-[560px]"
            />

            <div className="mt-5 flex items-center gap-2 text-[13px] text-ink-400">
              <Clock3 size={14} strokeWidth={2} aria-hidden="true" />
              <span>{AI_SECTION.duration}</span>
            </div>

            {/* Disclosure */}
            <div className="mt-6 flex max-w-[620px] items-start gap-3 rounded-[18px] border border-line bg-white/70 px-4 py-3.5">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-ember/10 text-ember">
                <ShieldCheck size={16} strokeWidth={2} aria-hidden="true" />
              </span>

              <p className="pt-0.5 text-[12.5px] leading-[1.55] text-ink-400">
                {AI_SECTION.homepageNote}
              </p>
            </div>
          </div>
          {/* RIGHT — AI focal visual */}
          <div className="relative hidden min-h-[360px] lg:flex lg:items-center lg:justify-center">
            {/* Large rings */}
            <div
              aria-hidden="true"
              className="
          absolute
          h-[300px] w-[300px]
          rounded-full
          border border-ember/10
        "
            />

            <div
              aria-hidden="true"
              className="
          absolute
          h-[240px] w-[240px]
          rounded-full
          border border-ember/10
        "
            />

            <div
              aria-hidden="true"
              className="
          absolute
          h-[190px] w-[190px]
          rounded-full
          bg-[radial-gradient(circle,rgba(193,70,42,0.14),transparent_70%)]
          blur-xl
        "
            />

            {/* Sparkle */}
            <Sparkles
              size={28}
              strokeWidth={1.8}
              aria-hidden="true"
              className="absolute right-8 top-10 text-ember/50"
            />

            {/* AI orb */}
            <button
              type="button"
              onClick={() => openStudio({ focusInput: true })}
              className="
          group
          relative
          flex h-[128px] w-[128px]
          flex-col
          items-center
          justify-center
          rounded-full
          bg-ember
          text-white
          shadow-[0_20px_55px_rgba(193,70,42,0.35)]
          transition-all
          duration-300
          hover:scale-105
          hover:shadow-[0_24px_65px_rgba(193,70,42,0.45)]
          focus-visible:outline
          focus-visible:outline-2
          focus-visible:outline-offset-4
          focus-visible:outline-ember
        "
            >
              <Sparkles
                size={23}
                strokeWidth={2}
                className="mb-2 transition-transform duration-300 group-hover:rotate-12"
              />

              <span className="text-[14px] font-bold leading-tight">
                BioAro
                <br />
                Drugs AI
              </span>
            </button>

            <span className="absolute bottom-[38px] right-[4px] -rotate-6 text-[13px] font-medium text-ink-400">
              Ask anything →
            </span>
          </div>
        </div>
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
