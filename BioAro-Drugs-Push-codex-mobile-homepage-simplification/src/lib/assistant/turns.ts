import type { AskResult } from "../ask/types";

/*
 * One turn of the conversation.
 *
 * Lifted out of the React context module so the pure modules — history, and its tests —
 * can describe a thread without pulling React in. `session-context.ts` re-exports it,
 * so nothing that already imports `Turn` had to move.
 *
 * `ask` carries both halves of a typed question because the answer is patched in when
 * it resolves, rather than arriving as a separate turn.
 *
 * `image` is the attachment. `previewUrl` is an object URL that lives exactly as long
 * as the tab: it is not a file, it is not a path, and it must never be persisted — see
 * `stripForStorage` in `history.ts`, which is the one place that guarantee is enforced.
 */
export type ImageIntent = "label" | "prescription";

export type Turn =
  | { id: string; kind: "ai"; text: string }
  | { id: string; kind: "you"; text: string }
  | { id: string; kind: "ask"; question: string; result: AskResult | null }
  | { id: string; kind: "image"; intent: ImageIntent; previewUrl: string; name: string };
