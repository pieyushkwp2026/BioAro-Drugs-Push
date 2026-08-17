import type { MarketConfig } from "../../config/markets/types";

/*
 * What BioAro Drugs AI can actually do, in one list.
 *
 * ---------------------------------------------------------------------------
 * WHY A CATALOGUE RATHER THAN BUTTONS ON A SCREEN
 *
 * An assistant is judged on what it claims. Spread those claims across two surfaces
 * and they drift: the modal offers something the page does not, a control appears that
 * does nothing, and the product quietly starts promising more than it has. This file
 * is the single place that decides, and `tests/assistant-skills.test.ts` holds it to it.
 *
 * `live: false` is not a soft no. It carries `unavailable`, a sentence that says what
 * is missing in plain language — the treatment `PRECISION_TIER` already uses on the
 * homepage, and the opposite of a greyed-out control with a "coming soon" ribbon.
 * Picking one of these is a real answer in the conversation, because being told
 * straight is better service than a button that swallows a tap.
 *
 * NO ICONS HERE. This module stays free of React and of lucide-react so it compiles in
 * the CommonJS test build; the palette maps ids to icons at the edge.
 * ---------------------------------------------------------------------------
 */

export type SkillId =
  | "answer"
  | "protocol"
  | "availability"
  | "handoff"
  | "label-scan"
  | "prescription"
  | "orders"
  | "address"
  | "subscription"
  | "consult";

export type SkillSurface = "page" | "modal";

export interface AssistantSkill {
  id: SkillId;
  label: string;
  /** One line, plain language, no engineering terms. */
  blurb: string;
  /** Where the affordance is offered. Uploads and history are page-only. */
  surfaces: SkillSurface[];
  live: boolean;
  /** Required whenever `live` is false. What is missing, and why. */
  unavailable?: string;
}

/*
 * Availability is derived, never typed in twice.
 *
 * `orders` follows the market's own `checkoutEnabled`, so a region where ordering opens
 * gains the skill without anybody remembering to edit this file. Everything else is
 * false because the capability genuinely does not exist — no server, no model, no
 * telehealth partner — and each says so in its own words.
 */
export function skillsFor(config: MarketConfig): AssistantSkill[] {
  return [
    {
      id: "answer",
      label: "Answer a question",
      blurb: "Ingredients and their doses, how the sachets work, third-party testing.",
      surfaces: ["page", "modal"],
      live: true,
    },
    {
      id: "protocol",
      label: "Build my protocol",
      blurb: "Turn your goals and routine into a starting protocol you can change.",
      surfaces: ["page", "modal"],
      live: true,
    },
    {
      id: "availability",
      label: "What ships to me",
      blurb: `What is carried in ${config.name}, and what is not yet.`,
      surfaces: ["page", "modal"],
      live: true,
    },
    {
      id: "handoff",
      label: "Talk to a person",
      blurb: "Hand this to the BioAro Drugs team instead.",
      surfaces: ["page", "modal"],
      live: true,
    },

    /* ------------------------------------------------ named, and not available */
    {
      id: "label-scan",
      label: "Check a supplement I already take",
      blurb: "Photograph a label and see how it sits alongside your protocol.",
      surfaces: ["page"],
      live: false,
      unavailable:
        "You can attach a photo and it stays on this device, but nothing reads it yet. Tell me the product name and I can answer from what we publish.",
    },
    {
      id: "prescription",
      label: "Share a prescription",
      blurb: "Keep a prescription beside the conversation.",
      surfaces: ["page"],
      live: false,
      unavailable:
        "A photo stays on this device and is never sent anywhere. BioAro Drugs AI does not read prescriptions and will not interpret one — that is a doctor's or pharmacist's job.",
    },
    {
      id: "orders",
      label: "Help with an order",
      blurb: "Track a delivery, or start a return.",
      surfaces: ["page"],
      live: config.checkoutEnabled,
      unavailable: config.checkoutEnabled
        ? undefined
        : config.checkoutMessage,
    },
    {
      id: "address",
      label: "Update my details",
      blurb: "Change the address or contact details on your account.",
      surfaces: ["page"],
      live: false,
      unavailable:
        "Account details cannot be changed from here yet. You can update them wherever you signed in, or ask the team.",
    },
    {
      id: "subscription",
      label: "Change a repeat order",
      blurb: "Set how often a formula arrives, pause it, or stop it.",
      surfaces: ["page"],
      live: false,
      unavailable: "Repeat orders are not available yet, so there is nothing to change.",
    },
    {
      id: "consult",
      label: "Speak to a clinician",
      blurb: "Arrange a consultation about your routine.",
      surfaces: ["page"],
      live: false,
      unavailable: `Consultations are not available in ${config.name}. This is planned with a licensed telehealth partner, and nothing here is bookable yet.`,
    },
  ];
}

/** The skills a given surface offers, in catalogue order. */
export function skillsForSurface(config: MarketConfig, surface: SkillSurface): AssistantSkill[] {
  return skillsFor(config).filter((skill) => skill.surfaces.includes(surface));
}
