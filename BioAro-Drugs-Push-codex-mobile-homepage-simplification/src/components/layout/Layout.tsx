import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import CartDrawer from "../cart/CartDrawer";
import AiBand from "../ask/AiBand";
import AiChatWidget from "../ask/AiChatWidget";
import { AiChatProvider } from "../ask/AiChatProvider";
import RegionalSeo from "../seo/RegionalSeo";

function ScrollToTop() {
  const { pathname, search } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [pathname, search]);

  return null;
}

/** Market home: "/uk", "/us/", etc. The bare "/" redirects before reaching Layout. */
const MARKET_HOME = /^\/(uk|us|ca|ae)\/?$/i;

export default function Layout() {
  const { pathname } = useLocation();

  /*
   * The band ships once per page. Every route gets it immediately above the footer,
   * except the homepage — which places it mid-page, between the protocol example and
   * the founder note, so it lands inside the reading flow rather than stacking
   * against the closing photograph. Rendering it here as well would give the
   * homepage two.
   */
  const bandBeforeFooter = !MARKET_HOME.test(pathname);

  return (
    <AiChatProvider>
      <div className="min-h-screen flex flex-col">
        <ScrollToTop />
        <RegionalSeo />
        <Header />
        <main className="flex-1">
          <Outlet />
        </main>
        {bandBeforeFooter && <AiBand />}
        <Footer />
        <CartDrawer />
        <AiChatWidget />
      </div>
    </AiChatProvider>
  );
}
