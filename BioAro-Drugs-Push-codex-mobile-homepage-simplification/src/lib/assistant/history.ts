import type { Turn } from "./turns";

/*
 * Previous conversations, kept in this browser.
 *
 * ---------------------------------------------------------------------------
 * WHAT IS STORED, AND WHAT DELIBERATELY IS NOT
 *
 * Text turns only. `image` turns are dropped before anything is written — an attached
 * photo is held for the length of the tab and never persisted, because the reason a
 * prescription photograph can be shown at all is that it goes nowhere. Writing one to
 * localStorage would quietly undo that, and localStorage is exactly where a shared
 * device leaks. `stripForStorage` is the single choke point and a test guards it.
 *
 * This also updates a claim made elsewhere: the chat widget's header says the thread
 * "is not stored and is not sent anywhere". Half of that stays true and matters more —
 * nothing is SENT. Storage is local, visible, and deletable, and the UI says so.
 *
 * ---------------------------------------------------------------------------
 * WHY IT LOOKS LIKE THIS
 *
 * There is no shared storage helper in this project; the closest thing is the
 * read/write snapshot pair in `lib/shopify/cartService.ts`, which is also the only one
 * that wraps `JSON.parse` in a try/catch. This copies that shape rather than inventing
 * a utility for a fourth case. Key naming follows the newer `bioaro.<domain>.<thing>`
 * convention, not the `shopify_*` one auth uses.
 *
 * `isRemoteConfigured` is the seam for the day history belongs to the account instead
 * of the device. Same shape as `memberService.isConfigured` on purpose.
 * ---------------------------------------------------------------------------
 */

const STORAGE_KEY = "bioaro.assistant.history.v1";

/** Enough to be useful, few enough that the sidebar stays readable. */
const MAX_CONVERSATIONS = 30;

export interface Conversation {
  id: string;
  /** Kept per market: a UK conversation should not surface under /us. */
  market: string;
  /** The first thing the visitor said, trimmed. Never generated. */
  title: string;
  startedAt: string;
  updatedAt: string;
  turns: Turn[];
}

/**
 * Whether history lives on the account rather than the device.
 *
 * False, and it will stay false until there is a server. The sidebar reads this to
 * decide whether to say "in this browser" — so the day it flips, the copy stops
 * claiming something that is no longer true.
 */
export function isRemoteConfigured(): boolean {
  return false;
}

/** Text turns only. The one place an image can be dropped, so the only place to test. */
export function stripForStorage(turns: Turn[]): Turn[] {
  return turns.filter((turn) => turn.kind !== "image");
}

export function titleFor(turns: Turn[]): string {
  const first = turns.find((turn) => turn.kind === "you" || turn.kind === "ask");
  const text = first ? (first.kind === "you" ? first.text : first.question) : "";
  const trimmed = text.trim();
  if (!trimmed) return "New conversation";
  return trimmed.length > 60 ? `${trimmed.slice(0, 57)}…` : trimmed;
}

function readAll(): Conversation[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? (parsed as Conversation[]) : [];
  } catch {
    /* A corrupt entry is not worth an error state in front of a visitor. */
    return [];
  }
}

function writeAll(conversations: Conversation[]): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations.slice(0, MAX_CONVERSATIONS)));
  } catch {
    /* Private mode, or the quota. Losing history is not worth breaking the page. */
  }
}

export function listConversations(market: string): Conversation[] {
  return readAll()
    .filter((conversation) => conversation.market === market)
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export function saveConversation(conversation: Conversation): void {
  const stored: Conversation = { ...conversation, turns: stripForStorage(conversation.turns) };
  if (stored.turns.length === 0) return;

  const rest = readAll().filter((entry) => entry.id !== stored.id);
  writeAll([stored, ...rest]);
}

export function deleteConversation(id: string): void {
  writeAll(readAll().filter((conversation) => conversation.id !== id));
}

export function clearHistory(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* Nothing useful to do. */
  }
}
