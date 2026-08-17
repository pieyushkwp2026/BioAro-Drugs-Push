import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useMarketHref } from "../../hooks/useMarketHref";
import { useProtocolSession } from "../../hooks/useProtocolSession";
import { ROUTES } from "../../lib/routes";
import { useMemberContext } from "../../components/member/member-context";
import { DemoTag, MemberPanel, PanelEmpty, PanelRow } from "../../components/member/primitives";

/*
 * The overview: one card per layer of the platform, each telling the truth about that
 * layer right now.
 *
 * The four cards are the vision's four layers — protocol, orders, health vault, care —
 * so the shape of the platform is legible even while three of them are empty. What
 * each card must never do is imply its layer is further along than it is; that is why
 * the copy comes from `capabilities` and from the market's own `checkoutMessage`
 * rather than from a hopeful string written here.
 */
export default function MemberOverview() {
  const marketHref = useMarketHref();
  const { customer, logout } = useAuth();
  const { view } = useProtocolSession();
  const { snapshot, source, capabilities, marketConfig } = useMemberContext();

  /* The demonstration profile stands in when there is no session behind the page. */
  const displayName = customer?.firstName ?? snapshot?.profile.firstName ?? "there";
  const liveItems = view.protocol?.items.length ?? 0;
  const demoOrders = snapshot?.orders.length ?? 0;

  return (
    <div>
      <h1 className="text-balance text-[38px] font-black leading-[1.0] tracking-[-0.035em] text-ink sm:text-[46px] lg:text-[54px]">
        Welcome back, {displayName}.
      </h1>
      <p className="mt-6 max-w-[56ch] text-pretty text-[17px] leading-[1.6] text-ink-600">
        You are signed in to the {marketConfig.name} store. This is where your protocol, orders and
        records will live as each one opens.
      </p>

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <MemberPanel
          title="Your protocol"
          action={
            <Link
              to={marketHref(ROUTES.accountProtocol)}
              className="rounded-full text-[14px] font-bold text-ink underline underline-offset-[5px] transition-colors hover:text-ember focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ember"
            >
              Open
            </Link>
          }
        >
          {liveItems > 0 ? (
            <PanelEmpty>
              {liveItems} {liveItems === 1 ? "formula" : "formulas"} in your current protocol. It is
              held in this browser only — it is not saved to your account yet.
            </PanelEmpty>
          ) : (
            <PanelEmpty>
              You have not built a protocol yet.{" "}
              <Link
                to={marketHref(ROUTES.quiz)}
                className="rounded-sm font-medium text-ink underline underline-offset-[4px] transition-colors hover:text-ember focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ember"
              >
                Build one
              </Link>{" "}
              and it will appear here.
            </PanelEmpty>
          )}
        </MemberPanel>

        <MemberPanel
          title="Orders"
          action={
            <Link
              to={marketHref(ROUTES.accountOrders)}
              className="rounded-full text-[14px] font-bold text-ink underline underline-offset-[5px] transition-colors hover:text-ember focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ember"
            >
              Open
            </Link>
          }
        >
          {source === "demo" && demoOrders > 0 ? (
            <div className="flex items-start justify-between gap-4">
              <PanelEmpty>
                {demoOrders} orders, including one prescription route that does not exist yet.
              </PanelEmpty>
              <DemoTag />
            </div>
          ) : (
            <PanelEmpty>{marketConfig.checkoutMessage}</PanelEmpty>
          )}
        </MemberPanel>

        <MemberPanel
          title="Health vault"
          action={
            <Link
              to={marketHref(ROUTES.accountVault)}
              className="rounded-full text-[14px] font-bold text-ink underline underline-offset-[5px] transition-colors hover:text-ember focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ember"
            >
              Open
            </Link>
          }
        >
          <PanelEmpty>
            What you have told us — your goals and your routine. Clinical records are not part of
            BioAro Drugs yet.
          </PanelEmpty>
        </MemberPanel>

        <MemberPanel
          title="Care"
          action={
            <Link
              to={marketHref(ROUTES.accountCare)}
              className="rounded-full text-[14px] font-bold text-ink underline underline-offset-[5px] transition-colors hover:text-ember focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ember"
            >
              Open
            </Link>
          }
        >
          <PanelEmpty>
            {capabilities.telehealth
              ? "Book and review consultations."
              : `Doctor consultations are not available in ${marketConfig.name} yet.`}
          </PanelEmpty>
        </MemberPanel>
      </div>

      <div className="mt-6">
        <MemberPanel title="Your details">
          <dl className="space-y-5">
          {(customer?.emailAddress ?? snapshot?.profile.emailAddress) && (
            <PanelRow term="Email">
              {customer?.emailAddress ?? snapshot?.profile.emailAddress}
            </PanelRow>
          )}
          <PanelRow term="Region">
            {marketConfig.name} &middot; {marketConfig.currency}
          </PanelRow>
          <PanelRow term="Where your data lives">
            Your name and email are held with your BioAro Drugs customer account. Your goals and
            routine answers stay in this browser — they are not stored on our side yet.
          </PanelRow>
          </dl>
        </MemberPanel>
      </div>

      {/* The quietest control on the page, as it was on the account page before. */}
      <button
        type="button"
        onClick={logout}
        className="mt-10 rounded-full text-[14px] font-medium text-ink-400 underline underline-offset-[5px] transition-colors hover:text-ember focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ember"
      >
        Sign out
      </button>
    </div>
  );
}
