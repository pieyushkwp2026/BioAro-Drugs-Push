import type { MarketConfig } from "../../config/markets/types";
import { capabilitiesForMarket } from "./capabilities";
import type { MemberSnapshot } from "./types";

/*
 * The demonstration snapshot.
 *
 * ---------------------------------------------------------------------------
 * EVERY RECORD HERE IS FABRICATED AND MUST ALWAYS SAY SO
 *
 * PRODUCT.md is explicit: future work must not fabricate, imply, or design
 * placeholders that read as real. A dashboard with nothing in it demonstrates nothing,
 * so a preview needs contents — and the cost of that is a standing obligation to make
 * the contents unmistakable.
 *
 * Four things carry that obligation, and they are independent:
 *   1. `origin: "demo"` on every record.
 *   2. The word DEMO inside every human-visible identifier and name, so a cropped
 *      screenshot still reads as a demonstration.
 *   3. `demoMode.ts` refuses to enable on the production hostname at all.
 *   4. The dashboard renders a standing banner whenever `source === "demo"`.
 *
 * WHAT IS DELIBERATELY NOT HERE: any clinical value. There is no lab result, no dose,
 * no reading. `ClinicalRecordRef` has nowhere to put one, and the three references
 * below are document names with a status. A convincing fake blood panel is exactly the
 * placeholder that reads as real.
 *
 * PRODUCT HANDLES ARE REAL UK CATALOGUE HANDLES. A demonstration order for a product
 * that does not exist would break the moment a screen resolved its title, and would be
 * a worse fiction than the order.
 *
 * DATES ARE FIXED STRINGS, never computed from the clock, so the fixture is
 * deterministic and `node --test` can compare it directly.
 * ---------------------------------------------------------------------------
 */
export function buildDemoSnapshot(config: MarketConfig): MemberSnapshot {
  const currencyCode = config.currency;

  return {
    profile: {
      id: "demo-member",
      firstName: "Sam",
      lastName: "Example (demo)",
      emailAddress: "demo.member@example.com",
      market: config.code,
      goals: ["longevity", "energy"],
      joinedAt: "2026-03-04T09:12:00.000Z",
      origin: "demo",
    },

    membership: {
      tierId: "plus",
      label: "DEMO — Plus",
      status: "active",
      renewsAt: "2026-09-04T09:12:00.000Z",
      /* A demonstration figure, and tagged as one everywhere it renders. Real pricing
         does not exist, and the launch checklist forbids savings messaging until
         subscriptions are real. */
      price: { amount: 39, currencyCode },
      benefits: [
        "Your protocol kept up to date as your goals change",
        "Priority support from the BioAro Drugs team",
        "Early access to new formulations",
      ],
      origin: "demo",
    },

    /* Two versions of one protocol, so the shape of history is visible: v2 supersedes
       v1. Both are outputs `buildProtocol` could genuinely produce — real handles,
       real slots, and a reason on every item, as the engine emits. */
    protocols: [
      {
        id: "demo-protocol-2",
        version: 2,
        supersedesId: "demo-protocol-1",
        createdAt: "2026-07-19T07:40:00.000Z",
        goals: ["longevity", "energy"],
        items: [
          {
            handle: "longevity-plus",
            slot: "Morning",
            reason: "Leads on longevity — taken with breakfast.",
          },
          {
            handle: "cellomega-plus",
            slot: "Morning",
            reason: "Added for cellular energy alongside the longevity formula.",
          },
          {
            handle: "glutara",
            slot: "Evening",
            reason: "Evening slot. This is not a sleep formula.",
          },
        ],
        notes: [
          "Sleep is not covered by a shipping product yet, so nothing here is a sleep formula.",
          "Speak to a healthcare professional before starting if you take prescribed medication.",
        ],
        source: "bioaro-ai-homepage",
        origin: "demo",
      },
      {
        id: "demo-protocol-1",
        version: 1,
        supersedesId: null,
        createdAt: "2026-03-05T18:02:00.000Z",
        goals: ["longevity"],
        items: [
          {
            handle: "longevity-plus",
            slot: "Morning",
            reason: "Leads on longevity — taken with breakfast.",
          },
        ],
        notes: [],
        source: "chips",
        origin: "demo",
      },
    ],

    orders: [
      {
        id: "demo-order-1042",
        number: "DEMO-1042",
        placedAt: "2026-07-20T11:05:00.000Z",
        status: "delivered",
        kind: "supplement",
        total: { amount: 96, currencyCode },
        lines: [
          { productHandle: "longevity-plus", title: "DEMO — LONgevity+", quantity: 1 },
          { productHandle: "cellomega-plus", title: "DEMO — CellOmega+", quantity: 1 },
        ],
        origin: "demo",
      },
      {
        /* The only place the prescription flow is visible anywhere in the app. It is a
           demonstration of a route that does not exist, and is marked twice over. */
        id: "demo-order-1043",
        number: "DEMO-1043",
        placedAt: "2026-07-28T09:30:00.000Z",
        status: "processing",
        kind: "prescription",
        total: { amount: 0, currencyCode },
        lines: [{ productHandle: null, title: "DEMO — prescription item", quantity: 1 }],
        origin: "demo",
      },
    ],

    vault: [
      {
        id: "demo-vault-1",
        category: "self-reported",
        kind: "goal",
        label: "Primary goal",
        value: "Healthy ageing and everyday vitality",
        recordedAt: "2026-03-04T09:14:00.000Z",
        origin: "demo",
      },
      {
        id: "demo-vault-2",
        category: "self-reported",
        kind: "lifestyle",
        label: "Training",
        value: "Two or three sessions a week",
        recordedAt: "2026-03-04T09:15:00.000Z",
        origin: "demo",
      },
      {
        id: "demo-vault-3",
        category: "self-reported",
        kind: "supplement",
        label: "Already taking",
        value: "Vitamin D in winter",
        recordedAt: "2026-03-04T09:16:00.000Z",
        origin: "demo",
      },
      /* Document names and a status. No values, because the type has no room for one. */
      {
        id: "demo-vault-4",
        category: "clinical",
        kind: "lab",
        label: "DEMO — full blood count",
        issuedAt: "2026-06-02T00:00:00.000Z",
        issuedBy: "DEMO — Example Clinic",
        status: "withheld",
        origin: "demo",
      },
      {
        id: "demo-vault-5",
        category: "clinical",
        kind: "clinician-note",
        label: "DEMO — consultation summary",
        issuedAt: "2026-06-02T00:00:00.000Z",
        issuedBy: "DEMO — Dr A. Example",
        status: "withheld",
        origin: "demo",
      },
    ],

    consultations: [
      {
        id: "demo-consult-1",
        status: "completed",
        scheduledFor: "2026-06-02T14:00:00.000Z",
        modality: "video",
        clinicianName: "DEMO — Dr A. Example",
        reasonSummary: "Wanted to talk through energy through the afternoon.",
        origin: "demo",
      },
    ],

    /* Capabilities are NOT faked, even in demonstration mode. The screens still tell
       the truth about what the platform can do; only the records are invented. */
    capabilities: capabilitiesForMarket(config),
  };
}
