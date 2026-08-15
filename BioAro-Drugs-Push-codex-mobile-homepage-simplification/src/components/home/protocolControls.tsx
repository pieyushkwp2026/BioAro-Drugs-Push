import { type RefObject, useId, useState } from "react";
import { ArrowUp, Check, Sparkles, X } from "lucide-react";
import { AI_SECTION, GOALS } from "../../data/homepage";
import type { GoalId } from "../../lib/protocol/build";
import { useTypewriter } from "../../hooks/useTypewriter";
import { MAX_MESSAGE } from "../protocol/ProtocolSessionProvider";
import type { ProtocolSessionValue } from "../protocol/session-context";

/**
 * Free-text intent input.
 *
 * This component intentionally owns ONLY the input interaction.
 * AI matching feedback belongs to ProtocolStudio, not directly underneath
 * the homepage search field.
 */
export function IntentBox({
  session,
  onSend,
  textareaRef,
  rows = 1,
  animatedPlaceholder = false,
}: {
  session: ProtocolSessionValue;
  onSend: () => void;
  textareaRef?: RefObject<HTMLTextAreaElement | null>;
  rows?: number;
  /** Hero only. The modal's box is used mid-task and the floating bar collapses
      after a few seconds; a line rewriting itself in either is just noise. */
  animatedPlaceholder?: boolean;
}) {
  const { message, submitting } = session;
  const inputId = useId();
  const [focused, setFocused] = useState(false);

  const multiline = rows > 1;

  /* Only while the field is genuinely idle. A prompt that keeps rewriting itself
     under the caret while someone is trying to type is hostile. */
  const typing = animatedPlaceholder && !message && !focused;
  const typewriter = useTypewriter(AI_SECTION.prompts, typing);

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

      {/* The animated line, as a real element rather than the placeholder attribute —
          a placeholder cannot carry a caret. It shares the textarea's type ramp and
          padding exactly, so the handoff from prompt to typed text does not jump.
          aria-hidden and pointer-events-none: the sr-only label above is the
          accessible name, and clicks must reach the textarea underneath. */}
      <div className="relative min-w-0 flex-1">
        {typing && (
          <p
            aria-hidden="true"
            className={`pointer-events-none absolute inset-x-0 top-0 truncate text-[15px] leading-[1.5] text-ink-400 ${
              multiline ? "pt-1" : "py-1"
            }`}
          >
            {typewriter.text}
            <span
              className={`ml-0.5 inline-block h-[1.05em] w-[2px] translate-y-[0.2em] bg-ember ${
                typewriter.animating ? "animate-[bioCaret_1s_steps(1)_infinite]" : ""
              }`}
            />
          </p>
        )}

      <textarea
        ref={textareaRef}
        id={inputId}
        value={message}
        onChange={(event) => session.setMessage(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            onSend();
          }
        }}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder={typing ? "" : AI_SECTION.placeholder}
        rows={rows}
        className={`
          w-full resize-none bg-transparent
          text-[15px] leading-[1.5] text-ink
          outline-none placeholder:text-ink-400
          ${multiline ? "pt-1" : "py-1"}
        `}
      />
      </div>

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
              session.setMessage("");
              session.clearMatched();
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
  session,
  onPick,
  className = "",
}: {
  session: ProtocolSessionValue;
  onPick?: (id: GoalId) => void;
  className?: string;
}) {
  return (
    <ul className={`flex flex-wrap gap-2.5 ${className}`}>
      {GOALS.map((goal) => {
        const id = goal.id as GoalId;
        const selected = session.view.session.detectedGoals.includes(id);
        const fromMessage = session.matched.includes(id);

        return (
          <li key={goal.id}>
            <button
              type="button"
              aria-pressed={selected}
              title={fromMessage ? AI_SECTION.matchedCaption : undefined}
              onClick={() => {
                session.toggleGoal(id);
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
