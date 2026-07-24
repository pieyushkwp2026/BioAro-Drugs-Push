import { BrowserRouter, Navigate, Outlet, Route, Routes, useLocation, useParams } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import Product from "./pages/Product";
import Quiz from "./pages/Quiz";
import Science from "./pages/Science";
import Journal from "./pages/Journal";
import JournalArticle from "./pages/JournalArticle";
import About from "./pages/About";
import Account from "./pages/Account";
import SupplementDisclaimer from "./pages/SupplementDisclaimer";
import ShippingPolicy from "./pages/ShippingPolicy";
import ReturnsRefunds from "./pages/ReturnsRefunds";
import ContactSupport from "./pages/ContactSupport";
import Living from "./pages/Living";
import QualityTesting from "./pages/QualityTesting";
import Faq from "./pages/Faq";
import Protocols from "./pages/Protocols";
import Partners from "./pages/Partners";
import NotFound from "./pages/NotFound";
import AuthLogin from "./pages/AuthLogin";
import AuthCallback from "./pages/AuthCallback";
import { MarketProvider } from "./lib/market/context";
import { CartProvider } from "./components/cart/CartProvider";
import { AuthProvider } from "./components/auth/AuthProvider";
import { buildMarketHref } from "./lib/marketRouting";
import { useMarket } from "./hooks/useMarket";
import type { MarketCode } from "./config/markets";

const SUPPORTED_MARKETS = new Set<MarketCode>(["uk", "us", "ca", "ae"]);

const REGIONAL_PAGES = [
  { path: "", element: <Home /> },
  { path: "shop", element: <Shop /> },
  { path: "products/:handle", element: <Product /> },
  { path: "quiz", element: <Quiz /> },
  { path: "science", element: <Science /> },
  { path: "journal", element: <Journal /> },
  { path: "journal/:slug", element: <JournalArticle /> },
  { path: "about", element: <About /> },
  { path: "account", element: <Account /> },
  { path: "supplement-disclaimer", element: <SupplementDisclaimer /> },
  { path: "shipping-policy", element: <ShippingPolicy /> },
  { path: "returns-refunds", element: <ReturnsRefunds /> },
  { path: "contact-support", element: <ContactSupport /> },
  { path: "living-2-0", element: <Living /> },
  { path: "quality-testing", element: <QualityTesting /> },
  { path: "faq", element: <Faq /> },
  { path: "protocols", element: <Protocols /> },
  { path: "partners", element: <Partners /> },
] as const;

function MarketGuard() {
  const { market } = useParams();

  if (!market || !SUPPORTED_MARKETS.has(market as MarketCode)) {
    return <Navigate to="/uk" replace />;
  }

  return <Outlet />;
}

function LegacyRouteRedirect({ target }: { target: string }) {
  const { market } = useMarket();
  const location = useLocation();

  return <Navigate to={buildMarketHref(market, `${target}${location.search}`)} replace />;
}

function LegacyProductRedirect() {
  const { market } = useMarket();
  const { handle } = useParams();
  const location = useLocation();

  if (!handle) return <Navigate to={buildMarketHref(market, `/shop${location.search}`)} replace />;
  return <Navigate to={buildMarketHref(market, `/products/${handle}${location.search}`)} replace />;
}

function LegacyJournalArticleRedirect() {
  const { market } = useMarket();
  const { slug } = useParams();
  const location = useLocation();

  if (!slug) return <Navigate to={buildMarketHref(market, `/journal${location.search}`)} replace />;
  return <Navigate to={buildMarketHref(market, `/journal/${slug}${location.search}`)} replace />;
}

function RegionalProductRedirect() {
  const { market, handle } = useParams();
  const location = useLocation();

  if (!market || !SUPPORTED_MARKETS.has(market as MarketCode)) {
    return <Navigate to="/uk" replace />;
  }

  if (!handle) {
    return <Navigate to={`/${market}/shop${location.search}`} replace />;
  }

  return <Navigate to={`/${market}/products/${handle}${location.search}`} replace />;
}

function LegacyRootRedirect() {
  return <Navigate to="/uk" replace />;
}

function RegionalRoutes() {
  return (
    <Route path=":market" element={<MarketGuard />}>
      <Route element={<Layout />}>
        {REGIONAL_PAGES.map((page) => (
          <Route key={page.path || "home"} path={page.path} element={page.element} />
        ))}
      </Route>
    </Route>
  );
}

function LegacyRedirectRoutes() {
  return (
    <>
      <Route path="/shop" element={<LegacyRouteRedirect target="/shop" />} />
      <Route path="/shop/:handle" element={<LegacyProductRedirect />} />
      <Route path="/products/:handle" element={<LegacyProductRedirect />} />
      <Route path="/quiz" element={<LegacyRouteRedirect target="/quiz" />} />
      <Route path="/science" element={<LegacyRouteRedirect target="/science" />} />
      <Route path="/journal" element={<LegacyRouteRedirect target="/journal" />} />
      <Route path="/journal/:slug" element={<LegacyJournalArticleRedirect />} />
      <Route path="/about" element={<LegacyRouteRedirect target="/about" />} />
      <Route path="/account" element={<LegacyRouteRedirect target="/account" />} />
      <Route path="/supplement-disclaimer" element={<LegacyRouteRedirect target="/supplement-disclaimer" />} />
      <Route path="/shipping-policy" element={<LegacyRouteRedirect target="/shipping-policy" />} />
      <Route path="/returns-refunds" element={<LegacyRouteRedirect target="/returns-refunds" />} />
      <Route path="/contact-support" element={<LegacyRouteRedirect target="/contact-support" />} />
      <Route path="/living-2-0" element={<LegacyRouteRedirect target="/living-2-0" />} />
      <Route path="/quality-testing" element={<LegacyRouteRedirect target="/quality-testing" />} />
      <Route path="/faq" element={<LegacyRouteRedirect target="/faq" />} />
      <Route path="/protocols" element={<LegacyRouteRedirect target="/protocols" />} />
      <Route path="/partners" element={<LegacyRouteRedirect target="/partners" />} />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <MarketProvider>
        <CartProvider>
          <AuthProvider>
            <Routes>
              <Route path="/" element={<LegacyRootRedirect />} />
              <Route path="/auth" element={<AuthLogin />} />
              <Route path="/auth/callback" element={<AuthCallback />} />
              {RegionalRoutes()}
              <Route path="/:market/shop/:handle" element={<RegionalProductRedirect />} />
              {LegacyRedirectRoutes()}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </CartProvider>
      </MarketProvider>
    </BrowserRouter>
  );
}