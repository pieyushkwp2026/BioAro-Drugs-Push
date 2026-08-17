import { useMemberContext } from "../../components/member/member-context";
import { DemoTag, MemberPanel, PanelEmpty, PanelUnavailable } from "../../components/member/primitives";

/*
 * Orders, and the two different kinds of nothing.
 *
 * `capabilities.ordering` is the market's own `checkoutEnabled`. Where it is false —
 * UK, US, CA today — no order has ever existed, so the panel states that using the
 * market's own message rather than a new "coming soon" written here. Where it is true
 * (AE), an empty list genuinely means the member has not ordered yet, which is a
 * different sentence.
 *
 * The prescription line in the demonstration data is the only place the pharmacy route
 * appears anywhere in the app. It is marked twice: DEMO in the title, and the tag on
 * the panel.
 */
export default function MemberOrders() {
  const { snapshot, source, capabilities, marketConfig } = useMemberContext();
  const orders = snapshot?.orders ?? [];

  return (
    <div>
      <h1 className="text-balance text-[34px] font-black leading-[1.05] tracking-[-0.035em] text-ink sm:text-[42px]">
        Orders
      </h1>

      <div className="mt-8 grid gap-6">
        <MemberPanel title="Order history" action={source === "demo" ? <DemoTag /> : undefined}>
          {orders.length > 0 ? (
            <ul className="space-y-5">
              {orders.map((order) => (
                <li key={order.id} className="border-t border-line pt-5 first:border-t-0 first:pt-0">
                  <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                    <p className="text-[15.5px] font-bold tracking-[-0.02em] text-ink">
                      {order.number}
                    </p>
                    <p className="text-[13px] font-bold uppercase tracking-[0.1em] text-ink-400">
                      {order.status}
                      {order.kind === "prescription" ? " · prescription" : ""}
                    </p>
                  </div>
                  <ul className="mt-2 space-y-1">
                    {order.lines.map((line) => (
                      <li key={line.title} className="text-[14.5px] leading-[1.55] text-ink-600">
                        {line.quantity} × {line.title}
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          ) : capabilities.ordering ? (
            <PanelEmpty>You have not placed an order yet.</PanelEmpty>
          ) : (
            <PanelUnavailable>{marketConfig.checkoutMessage}</PanelUnavailable>
          )}
        </MemberPanel>

        <MemberPanel title="Subscriptions">
          {capabilities.subscriptions ? (
            <PanelEmpty>You have no active subscriptions.</PanelEmpty>
          ) : (
            <PanelUnavailable>
              Repeat orders are not available yet. When they are, you will be able to set how often
              each formula arrives, and pause or cancel it from here.
            </PanelUnavailable>
          )}
        </MemberPanel>
      </div>
    </div>
  );
}
