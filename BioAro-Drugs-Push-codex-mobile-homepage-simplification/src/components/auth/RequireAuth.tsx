import type { ReactNode } from "react";
import { useAuth } from "../../hooks/useAuth";
import { isDemoDataEnabled } from "../../lib/member/demoMode";
import { isCustomerAuthConfigured } from "../../lib/shopify/customerAuth";
import MemberSignedOut from "../member/MemberSignedOut";
import { MemberSkeleton } from "../member/primitives";

/*
 * The gate in front of the member dashboard. There was no route guard in this codebase
 * before — /account simply branched inside the page — so this is the first one, and it
 * is deliberately the only one: it wraps the dashboard shell, not each child, so the
 * check runs once and the section nav does not remount between routes.
 *
 * Order matters. The configuration check comes FIRST because an unconfigured build
 * would otherwise render a sign-in button that throws when pressed.
 *
 * There is no redirect anywhere in here. `AuthProvider` re-checks the session every
 * 30 seconds, and a guard that navigated on a transient unauthenticated frame would
 * throw the visitor out of the page they were reading.
 */
export default function RequireAuth({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();

  /*
   * Demonstration mode stands in for a session.
   *
   * The dashboard exists to be reviewed before the platform behind it is built, and
   * customer accounts are not switched on in local or preview builds — so without this
   * the prototype is unreachable by the people who need to look at it. It is not a
   * loosening of the gate: `isDemoDataEnabled` needs an explicit opt-in flag AND
   * refuses on the production hostname, so a real deployment can never take this path.
   */
  if (isDemoDataEnabled()) return <>{children}</>;

  if (!isCustomerAuthConfigured()) return <MemberSignedOut reason="unavailable" />;
  if (isLoading) return <MemberSkeleton />;
  if (!isAuthenticated) return <MemberSignedOut reason="signed-out" />;

  return <>{children}</>;
}
