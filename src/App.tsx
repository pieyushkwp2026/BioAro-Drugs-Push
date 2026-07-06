import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import Product from "./pages/Product";
import Quiz from "./pages/Quiz";
import Science from "./pages/Science";
import Journal from "./pages/Journal";
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
import { MarketProvider } from "./lib/market/context";
import { CartProvider } from "./components/cart/CartProvider";

export default function App() {
  return (
    <BrowserRouter>
      <MarketProvider>
        <CartProvider>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Home />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/shop/:handle" element={<Product />} />
              <Route path="/quiz" element={<Quiz />} />
              <Route path="/science" element={<Science />} />
              <Route path="/journal" element={<Journal />} />
              <Route path="/about" element={<About />} />
              <Route path="/account" element={<Account />} />
              <Route path="/supplement-disclaimer" element={<SupplementDisclaimer />} />
              <Route path="/shipping-policy" element={<ShippingPolicy />} />
              <Route path="/returns-refunds" element={<ReturnsRefunds />} />
              <Route path="/contact-support" element={<ContactSupport />} />
              <Route path="/living-2-0" element={<Living />} />
              <Route path="/quality-testing" element={<QualityTesting />} />
              <Route path="/faq" element={<Faq />} />
              <Route path="/protocols" element={<Protocols />} />
              <Route path="/partners" element={<Partners />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </CartProvider>
      </MarketProvider>
    </BrowserRouter>
  );
}
