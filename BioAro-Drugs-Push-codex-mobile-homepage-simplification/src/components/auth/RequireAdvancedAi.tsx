import type { ReactNode } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useMemberSnapshot } from "../../hooks/useMemberSnapshot";
import { isCustomerAuthConfigured } from "../../lib/shopify/customerAuth";
import { isDemoDataEnabled } from "../../lib/member/demoMode";
import { advancedAiAccessState, hasAdvancedAiAccess } from "../../lib/member/advancedAi";
import AdvancedAiGate from "../ai/AdvancedAiGate";

export default function RequireAdvancedAi({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const member = useMemberSnapshot();

  if (authLoading || member.state === "loading") return <AdvancedAiGate variant="loading" />;
  if (!isCustomerAuthConfigured() && !isDemoDataEnabled()) return <AdvancedAiGate variant="unavailable" />;
  if (!isDemoDataEnabled() && (!isAuthenticated || member.state === "unauthenticated")) {
    return <AdvancedAiGate variant="signed-out" />;
  }
  if (member.state === "error" || member.state === "unavailable") {
    return <AdvancedAiGate variant="unavailable" onRetry={member.reload} />;
  }
  if (hasAdvancedAiAccess(member.snapshot?.membership)) return <>{children}</>;

  const state = advancedAiAccessState(member.snapshot?.membership);
  return <AdvancedAiGate variant={state === "no-membership" ? "no-membership" : "inactive"} />;
}
