import { useState } from "react";
import { Trash2 } from "lucide-react";
import { AI_SECTION } from "../../data/homepage";
import {
  clearHistory,
  deleteConversation,
  type Conversation,
} from "../../lib/assistant/history";

/*
 * Previous conversations.
 *
 * ---------------------------------------------------------------------------
 * A local record that can be resumed
 *
 * Opening one shows the transcript. Continue chat restores the saved protocol session
 * when available, while older records still restore their text turns safely.
 *
 * Images are absent by construction: `stripForStorage` drops them before anything is
 * written, so an attached prescription cannot reappear here on a shared device.
 * ---------------------------------------------------------------------------
 */
export default function ConversationHistory({
  conversations,
  onChanged,
  onResume,
}: {
  conversations: Conversation[];
  onChanged: () => void;
  onResume: (conversation: Conversation) => void;
}) {
  const [openId, setOpenId] = useState<string | null>(null);

  if (conversations.length === 0) {
    return (
      <div>
        <p className="text-[15px] leading-[1.6] text-ink-600">{AI_SECTION.historyEmpty}</p>
        <p className="mt-3 text-[12.5px] leading-[1.55] text-ink-400">{AI_SECTION.historyLocal}</p>
      </div>
    );
  }

  return (
    <div>
      <p className="text-[12.5px] leading-[1.55] text-ink-400">{AI_SECTION.historyLocal}</p>

      <ul className="mt-4 space-y-2">
        {conversations.map((conversation) => {
          const open = openId === conversation.id;

          return (
            <li key={conversation.id} className="rounded-[16px] border border-line bg-white">
              <div className="flex items-center gap-2 p-3">
                <button
                  type="button"
                  onClick={() => setOpenId(open ? null : conversation.id)}
                  aria-expanded={open}
                  className="min-w-0 flex-1 rounded-[10px] px-1 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ember"
                >
                  <span className="block truncate text-[14px] font-bold tracking-[-0.02em] text-ink">
                    {conversation.title}
                  </span>
                  <span className="mt-0.5 block text-[12px] text-ink-400">
                    {new Date(conversation.updatedAt).toLocaleDateString()}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    deleteConversation(conversation.id);
                    onChanged();
                  }}
                  aria-label={`${AI_SECTION.historyDelete}: ${conversation.title}`}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-ink-400 transition-colors hover:bg-cream-50 hover:text-ember focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ember"
                >
                  <Trash2 size={15} strokeWidth={2.1} aria-hidden="true" />
                </button>
              </div>

              {open && (
                <div className="space-y-2 border-t border-line px-4 py-3">
                  {conversation.turns.map((turn) => (
                    <p key={turn.id} className="text-[13.5px] leading-[1.55] text-ink-600">
                      <span className="font-bold text-ink">
                        {turn.kind === "you" || turn.kind === "ask" ? "You: " : "BioAro Drugs AI: "}
                      </span>
                      {turn.kind === "ask" ? turn.question : turn.kind === "image" ? turn.name : turn.text}
                    </p>
                  ))}
                  <button
                    type="button"
                    onClick={() => onResume(conversation)}
                    className="mt-2 rounded-full bg-ember px-4 py-2 text-[13px] font-bold text-white transition-colors hover:bg-ember-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ember"
                  >
                    Continue chat
                  </button>
                </div>
              )}
            </li>
          );
        })}
      </ul>

      <button
        type="button"
        onClick={() => {
          clearHistory();
          onChanged();
        }}
        className="mt-5 rounded-full text-[13px] font-medium text-ink-400 underline underline-offset-[5px] transition-colors hover:text-ember focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ember"
      >
        {AI_SECTION.historyClear}
      </button>
    </div>
  );
}
