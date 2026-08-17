import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "./Header";
import CartDrawer from "../cart/CartDrawer";
import { AiChatProvider } from "../ask/AiChatProvider";
import { ProtocolSessionProvider } from "../protocol/ProtocolSessionProvider";
import RegionalSeo from "../seo/RegionalSeo";

function ScrollToTop() {
  const { pathname, search } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [pathname, search]);

  return null;
}

/** Market home: "/uk", "/us/", etc. The bare "/" redirects before reaching Layout. */
// const MARKET_HOME = /^\/(uk|us|ca|ae)\/?$/i;

export default function Layout() {
  // const { pathname } = useLocation();

  /*
   * The band ships once per page. Every route gets it immediately above the footer,
   * except the homepage — which places it mid-page, between the protocol example and
   * the founder note, so it lands inside the reading flow rather than stacking
   * against the closing photograph. Rendering it here as well would give the
   * homepage two.
   */

  return (
    <AiChatProvider>
      {/* Above the routes on purpose: the homepage modal and the /quiz page have to
          read the same session, or the handoff between them reintroduces the seam
          this replaced. */}
      <ProtocolSessionProvider>
      <div className="min-h-screen flex flex-col">
        <ScrollToTop />
        <RegionalSeo />
        <Header />
        {/* main / footer / corner assistant now belong to the route frame below, so a
            subtree can opt out of them. Everything that must not remount when crossing
            between frames — the providers, the header, the cart — stays here. */}
        <Outlet />
        <CartDrawer />
      </div>
      </ProtocolSessionProvider>
    </AiChatProvider>
  );
}
