import { type RefObject, useId } from "react";
import { ArrowUp, Check, Sparkles } from "lucide-react";
import { AI_SECTION, GOALS } from "../../data/homepage";
import type { GoalId } from "../../lib/protocol/build";
import { MAX_MESSAGE, type ProtocolDraft } from "../../hooks/useProtocolDraft";

/*
 * The two controls that appear in BOTH frames — the homepage invitation and the
 * modal.
 *
 * They are shared rather than written twice because the chip states carry meaning:
 * outlined is your own choice, filled came from your message, plain is untouched. Two
 * copies of that logic would drift, and the first thing to go would be the provenance
 * — which is the part that keeps a keyword table from reading like a model.
 */

/** Free-text intent, with send, the counter, and both result lines. */
export function IntentBox({
  draft,
  onSend,
  textareaRef,
  rows = 2,
}: {
  draft: ProtocolDraft;
  onSend: () => void;
  textareaRef?: RefObject<HTMLTextAreaElement | null>;
  rows?: number;
}) {
  const { message, submitting, noMatch, matched } = draft;
  /* Both frames can be mounted at once — the homepage invitation and the open modal —
     so a hardcoded id would put a duplicate in the document and the label would bind
     to whichever came first. */
  const inputId = useId();

  return (
    <>
      <div className="rounded-[20px] border border-line bg-cream-50 p-4 transition-colors focus-within:border-ember/50">
        <div className="flex gap-3">
          <span
            aria-hidden="true"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[rgba(193,70,42,0.09)] text-ember"
          >
            <Sparkles size={17} strokeWidth={2.1} />
          </span>
          <label htmlFor={inputId} className="sr-only">
            What would you like to improve?
          </label>
          <textarea
            ref={textareaRef}
            id={inputId}
            value={message}
            onChange={(event) => draft.setMessage(event.target.value)}
            onKeyDown={(event) => {
              // Enter sends; Shift+Enter keeps its newline.
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                onSend();
              }
            }}
            placeholder={AI_SECTION.placeholder}
            rows={rows}
            className="min-w-0 flex-1 resize-none bg-transparent pt-2 text-[15px] leading-[1.5] text-ink outline-none placeholder:text-ink-400"
          />
        </div>

        <div className="mt-1 flex items-center justify-end gap-3">
          <span className="text-[12px] tabular-nums text-ink-400">
            {message.length}/{MAX_MESSAGE}
          </span>
          {/* type="button" throughout: sending resolves goals, it never submits a form. */}
          <button
            type="button"
            onClick={onSend}
            disabled={!message.trim() || submitting}
            aria-label={AI_SECTION.send}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-ember text-white transition-[background-color,opacity] duration-200 hover:bg-ember-600 disabled:opacity-35 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ember"
          >
            <ArrowUp size={16} strokeWidth={2.6} aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* Nothing matched is a real outcome, said plainly and pointed at the chips —
          not silence, which reads as a broken button. */}
      {noMatch && (
        <p role="status" className="mt-3 max-w-[46ch] text-[13.5px] leading-[1.55] text-ink-600">
          {AI_SECTION.noMatch}
        </p>
      )}

      {matched.length > 0 && (
        /* Inline flow rather than a flex row: at narrow widths a flex row breaks the
           icon and the Clear control onto lines of their own. */
        <p className="mt-3 max-w-[46ch] text-[13px] leading-[1.6] text-ink-400">
          <Sparkles
            size={13}
            strokeWidth={2.2}
            aria-hidden="true"
            className="mr-1.5 inline-block -translate-y-px text-ember"
          />
          {AI_SECTION.matchedCaption}{" "}
          <button
            type="button"
            onClick={draft.clearMatched}
            className="font-bold text-ink underline-offset-4 hover:text-ember hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ember"
          >
            {AI_SECTION.matchedClear}
          </button>
        </p>
      )}
    </>
  );
}

/** The goal chips. `onPick` runs after the toggle, so the homepage can open the modal. */
export function GoalChips({
  draft,
  onPick,
  className = "",
}: {
  draft: ProtocolDraft;
  onPick?: (id: GoalId) => void;
  className?: string;
}) {
  return (
    <ul className={`flex flex-wrap gap-2.5 ${className}`}>
      {GOALS.map((goal) => {
        const id = goal.id as GoalId;
        const selected = draft.goals.includes(id);
        const fromMessage = draft.matched.includes(id);
        /* Matched chips stay toggleable. "Locked" is honoured visually, not
           functionally — a control you cannot undo after the machine guessed for you
           is hostile, and a wrong match is exactly when someone needs to correct it. */
        return (
          <li key={goal.id}>
            <button
              type="button"
              aria-pressed={selected}
              title={fromMessage ? AI_SECTION.matchedCaption : undefined}
              onClick={() => {
                draft.toggleGoal(id);
                onPick?.(id);
              }}
              className={`flex items-center gap-2 rounded-full border px-4 py-2.5 text-[14.5px] font-bold tracking-[-0.01em] transition-[background-color,border-color,color] duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ember ${
                fromMessage
                  ? "border-ember bg-ember text-white"
                  : selected
                    ? "border-ember bg-[rgba(193,70,42,0.06)] text-ember"
                    : "border-line bg-white text-ink hover:border-line-strong"
              }`}
            >
              {goal.label}
              {selected && (
                <span
                  aria-hidden="true"
                  className={`flex h-4 w-4 items-center justify-center rounded-full ${
                    fromMessage ? "bg-white text-ember" : "bg-ember text-white"
                  }`}
                >
                  <Check size={10} strokeWidth={3.5} />
                </span>
              )}
            </button>
          </li>
        );
      })}
    </ul>
  );
}
