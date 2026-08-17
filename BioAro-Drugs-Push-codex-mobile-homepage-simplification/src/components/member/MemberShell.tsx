import { Outlet } from "react-router-dom";
import { getMarketConfigByMarket } from "../../config/markets";
import { useMarket } from "../../hooks/useMarket";
import { useMemberSnapshot } from "../../hooks/useMemberSnapshot";
import type { MemberOutletContext } from "./member-context";
import DemoModeBanner from "./DemoModeBanner";
import MemberNav from "./MemberNav";
import { MemberSkeleton } from "./primitives";

/*
 * The dashboard frame: one snapshot read, one nav, one banner, and the routed page.
 *
 * The snapshot is fetched HERE and handed down through the router's outlet context
 * rather than re-read per page. Every child needs the same object, and `AuthProvider`
 * is already polling the customer every 30 seconds — a second fetch per navigation
 * would be a third source of load for one answer.
 *
 * `pt-28 md:pt-36` is the standard clearance for the fixed 88px header, matching every
 * other page in the app.
 */

export default function MemberShell() {
  const { market } = useMarket();
  const marketConfig = getMarketConfigByMarket(market);
  const { snapshot, state, source, capabilities } = useMemberSnapshot();

  const context: MemberOutletContext = { snapshot, state, source, capabilities, marketConfig };

  return (
    <div className="pb-24 pt-28 md:pb-28 md:pt-36">
      {source === "demo" && <DemoModeBanner />}

      <div className="container-bio">
        <MemberNav />

        <div className="mt-10">
          {state === "loading" ? <MemberSkeleton /> : <Outlet context={context} />}
        </div>
      </div>
    </div>
  );
}
