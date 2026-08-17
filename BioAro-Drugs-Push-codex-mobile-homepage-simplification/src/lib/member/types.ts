import type { CurrencyCode, MarketCode } from "../../config/markets/types";
import type { GoalId, ProtocolItem } from "../protocol/build";

/*
 * The member domain — the contract a real backend will have to satisfy.
 *
 * ---------------------------------------------------------------------------
 * WHY THIS EXISTS BEFORE THE BACKEND DOES
 *
 * The platform vision — membership, health vault, doctor connect, pharmacy — needs a
 * server, and there is not one: this is a static SPA that talks to Shopify from the
 * browser. So the dashboard is built against these shapes and fed from a demonstration
 * module. When a server lands, only the bodies in `memberService.ts` change; no
 * component moves. That is the seam `lib/ai/bioaroAiService.ts` already uses for the
 * interpretation endpoint, and the resemblance is deliberate.
 *
 * NO VENDOR, PROVIDER OR SDK IS NAMED HERE OR ANYWHERE UNDER src/.
 *
 * ---------------------------------------------------------------------------
 * THE PHI BOUNDARY, stated here so it cannot be discovered late
 *
 * `ClinicalRecordRef` is a reference to a document that exists somewhere else. It has
 * no result, value, range or interpretation field, and it must never grow one — see
 * the note on the type itself. Adding one is the single change that would turn this
 * browser bundle into a processor of protected health information, at a point where
 * the customer session is a refresh token sitting in localStorage.
 *
 * That is also why the honest answer to "show me my labs" is currently a capability
 * flag set to false, not an empty array.
 * ---------------------------------------------------------------------------
 */

/** Always UTC, always full ISO-8601. */
export type IsoDateTime = string;

export interface Money {
  amount: number;
  currencyCode: CurrencyCode;
}

/**
 * Where a record came from.
 *
 * Carried by every record so a screen can state provenance rather than let a
 * demonstration row pass as a member's own. The UI branches on this, not on the
 * environment flag — a record is demonstration data because it says so, not because
 * of how the app was started.
 */
export type DataOrigin = "demo" | "member" | "commerce";

/*
 * What the platform can actually do right now.
 *
 * Every "there is nothing here" state on the dashboard is derived from this object
 * rather than from an empty array, because the two mean different things to a reader:
 * an empty list says "you have none yet", a false capability says "this does not
 * exist yet". Conflating them is how a screen ends up implying a feature ships.
 *
 * One place to change when something becomes real, so no screen can drift ahead of
 * the business. `tests/member-capabilities.test.ts` asserts the false ones stay false.
 */
export interface MemberCapabilities {
  /** Mirrors the market's own `checkoutEnabled`. */
  ordering: boolean;
  /** No selling plans exist — see the note at cartService.ts:232. */
  subscriptions: boolean;
  /** No telehealth partner. */
  telehealth: boolean;
  /** No prescribing, no pharmacy routing. */
  prescriptions: boolean;
  /** No lawful place to hold clinical records. */
  clinicalRecords: boolean;
  /** The protocol session is memory-only; a refresh loses it. */
  protocolPersistence: boolean;
}

export interface MemberProfile {
  /** The Shopify customer id — the only identity this app actually has. */
  id: string;
  firstName: string | null;
  lastName: string | null;
  emailAddress: string | null;
  market: MarketCode;
  /** Self-reported. Reuses the engine's seven-goal union, not a second vocabulary. */
  goals: GoalId[];
  joinedAt: IsoDateTime | null;
  origin: DataOrigin;
}

export type MembershipTierId = "none" | "essential" | "plus";

export interface Membership {
  tierId: MembershipTierId;
  label: string;
  status: "none" | "active" | "paused" | "cancelled";
  renewsAt: IsoDateTime | null;
  /** Null until real pricing exists. Never a placeholder number. */
  price: Money | null;
  benefits: string[];
  origin: DataOrigin;
}

/**
 * A protocol, with the identity the engine does not currently give it.
 *
 * `buildProtocol` returns `{items, notes}` and the session holds it in React state, so
 * a refresh loses it. `id`, `version` and `supersedesId` are what turn that into
 * something a member can return to — and they are precisely what phase two persists.
 */
export interface ProtocolRecord {
  id: string;
  version: number;
  /** The previous version's id. An audit chain, not a pointer to mutable state. */
  supersedesId: string | null;
  createdAt: IsoDateTime;
  goals: GoalId[];
  items: ProtocolItem[];
  notes: string[];
  source: "bioaro-ai-homepage" | "chips" | "deep-link" | "personas";
  origin: DataOrigin;
}

export interface OrderLine {
  productHandle: string | null;
  title: string;
  quantity: number;
}

export interface MemberOrder {
  id: string;
  /** Human-facing. Demonstration orders carry DEMO here so a screenshot still reads. */
  number: string;
  placedAt: IsoDateTime;
  status: "processing" | "shipped" | "delivered" | "cancelled";
  /** Prescription orders route through a licensed partner and render differently. */
  kind: "supplement" | "prescription";
  total: Money;
  lines: OrderLine[];
  origin: DataOrigin;
}

export interface SelfReportedEntry {
  id: string;
  category: "self-reported";
  kind: "goal" | "lifestyle" | "supplement" | "note";
  label: string;
  value: string;
  recordedAt: IsoDateTime;
  origin: DataOrigin;
}

export interface ClinicalRecordRef {
  id: string;
  category: "clinical";
  kind: "lab" | "prescription" | "clinician-note";
  /** The NAME of a document — "Full blood count" — never its contents. */
  label: string;
  issuedAt: IsoDateTime;
  issuedBy: string | null;
  status: "available" | "pending" | "withheld";
  origin: DataOrigin;
  /*
   * THERE IS DELIBERATELY NO `result`, `value`, `range`, `flag` OR `interpretation`
   * FIELD HERE, AND THERE MUST NEVER BE ONE.
   *
   * A clinical result is protected health information. This type is a reference to a
   * document held elsewhere, not the document. When this becomes real, values render
   * from a short-lived authenticated response into component state and die on unmount
   * — never into localStorage, sessionStorage, a URL, or an analytics event.
   *
   * `tests/member-demo-snapshot.test.ts` asserts structurally that no such key exists,
   * so adding one fails the suite rather than review.
   */
}

export type HealthVaultEntry = SelfReportedEntry | ClinicalRecordRef;

export interface Consultation {
  id: string;
  status: "requested" | "scheduled" | "completed" | "cancelled";
  scheduledFor: IsoDateTime | null;
  modality: "video" | "chat";
  clinicianName: string | null;
  /** The member's own words. Never a diagnosis, never model output. */
  reasonSummary: string | null;
  origin: DataOrigin;
}

export interface MemberSnapshot {
  profile: MemberProfile;
  membership: Membership;
  protocols: ProtocolRecord[];
  orders: MemberOrder[];
  vault: HealthVaultEntry[];
  consultations: Consultation[];
  capabilities: MemberCapabilities;
}

/**
 * Every read resolves to one of these.
 *
 * `unavailable` is the honest default and what production returns today: no endpoint,
 * no demonstration data, nothing to show. It is not an error, and the UI must not
 * render it as one. `source` is the direct analogue of `InterpretResult["source"]` —
 * the screen states where the data came from rather than implying it is the member's.
 */
export type MemberResult<T> =
  | { kind: "ready"; data: T; source: "endpoint" | "demo" }
  | { kind: "unauthenticated" }
  | { kind: "unavailable" }
  | { kind: "error"; message: string };
