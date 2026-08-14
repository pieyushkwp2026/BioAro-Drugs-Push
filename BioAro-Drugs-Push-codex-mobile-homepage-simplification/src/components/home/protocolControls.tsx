import { type RefObject, useId } from "react";
import { ArrowUp, Check, Sparkles, X } from "lucide-react";
import { AI_SECTION, GOALS } from "../../data/homepage";
import type { GoalId } from "../../lib/protocol/build";
import { MAX_MESSAGE, type ProtocolDraft } from "../../hooks/useProtocolDraft";

/**
 * Free-text intent input.
 *
 * This component intentionally owns ONLY the input interaction.
 * AI matching feedback belongs to ProtocolStudio, not directly underneath
 * the homepage search field.
 */
export function IntentBox({
  draft,
  onSend,
  textareaRef,
  rows = 1,
}: {
  draft: ProtocolDraft;
  onSend: () => void;
  textareaRef?: RefObject<HTMLTextAreaElement | null>;
  rows?: number;
}) {
  const { message, submitting } = draft;
  const inputId = useId();

  const multiline = rows > 1;

  return (
    <div
      className={`
        group flex gap-3 border bg-white
        transition-[border-color,box-shadow]
        duration-200
        focus-within:border-ember/60
        focus-within:shadow-[0_0_0_4px_rgba(193,70,42,0.12)]
        ${
          multiline
            ? "rounded-[22px] p-3.5"
            : "h-[52px] items-center rounded-full pl-4 pr-1.5"
        }
        ${
          message
            ? "border-ember/60 shadow-[0_0_0_4px_rgba(193,70,42,0.12)]"
            : "border-line-strong shadow-glass"
        }
      `}
    >
      <span
        aria-hidden="true"
        className={`
          flex shrink-0 items-center justify-center rounded-full
          bg-[rgba(193,70,42,0.09)] text-ember
          ${multiline ? "mt-0.5 h-9 w-9" : "h-8 w-8"}
        `}
      >
        <Sparkles
          size={17}
          strokeWidth={2.1}
          className="transition-transform duration-300 group-focus-within:scale-110 motion-reduce:transform-none"
        />
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
          if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            onSend();
          }
        }}
        placeholder={AI_SECTION.placeholder}
        rows={rows}
        className={`
          min-w-0 flex-1 resize-none bg-transparent
          text-[15px] leading-[1.5] text-ink
          outline-none placeholder:text-ink-400
          ${multiline ? "pt-1" : "py-1"}
        `}
      />

      <div
        className={
          multiline
            ? "flex shrink-0 flex-col items-end justify-between gap-2"
            : "flex shrink-0 items-center gap-2"
        }
      >
        {message && (
          <button
            type="button"
            onClick={() => {
              draft.setMessage("");
              draft.clearMatched();
              textareaRef?.current?.focus();
            }}
            aria-label="Clear"
            className="flex h-7 w-7 items-center justify-center rounded-full text-ink-400 transition-colors hover:bg-cream-50 hover:text-ink"
          >
            <X size={14} strokeWidth={2.4} />
          </button>
        )}

        <span className="text-[11px] tabular-nums text-ink-400">
          {message.length}/{MAX_MESSAGE}
        </span>

        <button
          type="button"
          onClick={onSend}
          disabled={!message.trim() || submitting}
          aria-label={AI_SECTION.send}
          className={`
            flex shrink-0 items-center justify-center
            rounded-full bg-ember text-white
            transition-[background-color,transform,opacity]
            duration-200
            hover:bg-ember-600
            active:scale-[0.95]
            disabled:cursor-not-allowed
            disabled:opacity-35
            focus-visible:outline
            focus-visible:outline-2
            focus-visible:outline-offset-2
            focus-visible:outline-ember
            ${multiline ? "h-9 w-9" : "h-10 w-10"}
          `}
        >
          <ArrowUp size={17} strokeWidth={2.6} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}

/** The goal chips. */
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
              className={`
                flex items-center gap-2 rounded-full border
                px-4 py-2.5 text-[14.5px] font-bold
                tracking-[-0.01em]
                transition-[background-color,border-color,color]
                duration-200
                focus-visible:outline
                focus-visible:outline-2
                focus-visible:outline-offset-2
                focus-visible:outline-ember
                ${
                  fromMessage
                    ? "border-ember bg-ember text-white"
                    : selected
                      ? "border-ember bg-[rgba(193,70,42,0.06)] text-ember"
                      : "border-line bg-white text-ink hover:border-line-strong"
                }
              `}
            >
              {goal.label}

              {selected && (
                <span
                  aria-hidden="true"
                  className={`
                    flex h-4 w-4 items-center justify-center rounded-full
                    ${
                      fromMessage
                        ? "bg-white text-ember"
                        : "bg-ember text-white"
                    }
                  `}
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
