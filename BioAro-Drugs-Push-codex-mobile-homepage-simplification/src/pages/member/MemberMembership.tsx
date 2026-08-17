import { useMemberContext } from "../../components/member/member-context";
import { DemoTag, MemberPanel, PanelUnavailable } from "../../components/member/primitives";

/*
 * Membership.
 *
 * NO TIER CARDS AND NO PRICES when this is not real, and that is a deliberate refusal
 * rather than an oversight: the launch checklist carries a P0 to remove fake
 * subscription cues and a P1 forbidding savings messaging until subscriptions actually
 * exist. A three-column pricing table with a "coming soon" ribbon is exactly the cue
 * that item is about.
 *
 * What ships instead is prose describing what a membership would hold. Under
 * demonstration mode a tier appears with a figure attached, and it is tagged.
 */
export default function MemberMembership() {
  const { snapshot, source, capabilities } = useMemberContext();
  const membership = snapshot?.membership;
  const showDemo = source === "demo" && membership;

  return (
    <div>
      <h1 className="text-balance text-[34px] font-black leading-[1.05] tracking-[-0.035em] text-ink sm:text-[42px]">
        Membership
      </h1>

      <div className="mt-8 grid gap-6">
        <MemberPanel title="Your membership" action={showDemo ? <DemoTag /> : undefined}>
          {showDemo ? (
            <div className="space-y-4">
              <p className="text-[15.5px] font-bold tracking-[-0.02em] text-ink">
                {membership.label} · {membership.status}
              </p>
              {membership.price && (
                <p className="text-[14.5px] leading-[1.55] text-ink-600">
                  {membership.price.currencyCode} {membership.price.amount} a month
                </p>
              )}
              <ul className="space-y-2 text-[14.5px] leading-[1.6] text-ink-600">
                {membership.benefits.map((benefit) => (
                  <li key={benefit}>{benefit}</li>
                ))}
              </ul>
            </div>
          ) : (
            <PanelUnavailable>
              Membership is not open yet, so there is nothing to join and no pricing to show. When
              it opens, this is where your tier, what it includes, and your billing will live.
            </PanelUnavailable>
          )}
        </MemberPanel>

        {!capabilities.subscriptions && (
          <MemberPanel title="Repeat orders">
            <PanelUnavailable>
              Repeat orders are part of membership and are not available yet. Nothing on this site
              can currently be set to arrive automatically.
            </PanelUnavailable>
          </MemberPanel>
        )}
      </div>
    </div>
  );
}
