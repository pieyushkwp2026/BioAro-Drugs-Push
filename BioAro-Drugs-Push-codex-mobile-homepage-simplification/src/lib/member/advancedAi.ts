import type { Membership } from "./types";

export type AdvancedAiAccessState = "eligible" | "no-membership" | "inactive";

/** Advanced AI is a paid member benefit, not an authentication benefit. */
export function hasAdvancedAiAccess(membership: Membership | null | undefined): boolean {
  return Boolean(
    membership &&
      membership.status === "active" &&
      (membership.tierId === "essential" || membership.tierId === "plus"),
  );
}

export function advancedAiAccessState(membership: Membership | null | undefined): AdvancedAiAccessState {
  if (hasAdvancedAiAccess(membership)) return "eligible";
  if (!membership || membership.status === "none" || membership.tierId === "none") {
    return "no-membership";
  }
  return "inactive";
}
