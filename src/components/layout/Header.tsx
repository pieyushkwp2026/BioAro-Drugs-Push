import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Menu, ShoppingBag, X } from "lucide-react";
import RegionSelector from "./RegionSelector";
import { PRIMARY_NAV, ROUTES } from "../../lib/routes";
import { useCart } from "../../hooks/useCart";
import { useMarketHref } from "../../hooks/useMarketHref";
import { stripMarketPrefix } from "../../lib/marketRouting";
import bioAroMark from "../../assets/logo/bioaro-mark.png";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { cart, openCart } = useCart();
  const marketHref = useMarketHref();
  const { pathname } = useLocation();
  const isRegionalHomepage = stripMarketPrefix(pathname) === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > (isRegionalHomepage ? 48 : 24));
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [isRegionalHomepage]);

  const headerSurface = isRegionalHomepage
    ? scrolled
      ? "border-b border-white/55 bg-[#f8f5ef]/86 shadow-[0_10px_30px_rgba(35,29,20,0.08)] backdrop-blur-xl"
      : "border-white/40 bg-[#f8f5ef]/82 shadow-[0_6px_24px_rgba(35,29,20,0.06)] backdrop-blur-md xl:border-transparent xl:bg-transparent xl:shadow-none xl:backdrop-blur-none"
    : scrolled
      ? "border-b border-[#e7e1d5] bg-cream/90 backdrop-blur-md"
      : "bg-transparent";

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b transition-all duration-300 ${headerSurface}`}
    >
      <div className="container-bio">
        <div className="flex min-h-[76px] items-center justify-between gap-3 sm:gap-6">
          <Link to={marketHref(ROUTES.home)} className="flex shrink-0 items-center gap-2.5 text-ink sm:gap-3">
            <img src={bioAroMark} alt="" aria-hidden="true" className="h-[24px] w-[24px] shrink-0 object-contain" />
            <span className="whitespace-nowrap text-[16px] font-semibold tracking-[0.01em] sm:text-[19px]">BioAro Drugs</span>
          </Link>

          <nav className="hidden items-center gap-9 xl:flex">
            {PRIMARY_NAV.map((item) => (
              <NavLink
                key={item.href}
                to={marketHref(item.href)}
                className={({ isActive }) =>
                  `text-[15px] transition-colors ${isActive ? "font-medium text-ink" : "text-[#131012] hover:text-forest-600"}`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <div className="hidden md:block">
              <RegionSelector />
            </div>
            <button
              onClick={openCart}
              aria-label="Cart"
              className="hidden h-9 items-center gap-2 rounded-full border border-[#ddd8c9] bg-white/70 px-4 text-sm text-ink transition-colors hover:bg-white md:flex"
            >
              <ShoppingBag size={16} />
              <span>{cart.totalQuantity}</span>
            </button>
            <button
              onClick={openCart}
              aria-label="Cart"
              className="relative flex h-10 w-10 items-center justify-center rounded-full border border-[#ddd8c9] bg-white/70 transition-colors hover:bg-white md:hidden"
            >
              <ShoppingBag size={16} />
              {cart.totalQuantity > 0 && (
                <span className="absolute -right-1 -top-1 min-w-4 rounded-full bg-ink px-1.5 py-0.5 text-[10px] text-white">
                  {cart.totalQuantity}
                </span>
              )}
            </button>
            <button
              aria-label="Menu"
              onClick={() => setOpen((value) => !value)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-[#ddd8c9] bg-white/70 transition-colors hover:bg-white xl:hidden"
            >
              {open ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {open && (
          <div className="rounded-[24px] border border-[#e1ddce] bg-[#f7f3ed] p-5 shadow-glass-lg xl:hidden">
            <div className="mb-5 md:hidden">
              <RegionSelector />
            </div>
            <nav className="flex flex-col gap-1">
              {PRIMARY_NAV.map((item) => (
                <Link
                  key={item.href}
                  to={marketHref(item.href)}
                  onClick={() => setOpen(false)}
                  className="rounded-2xl px-3 py-3 text-[15px] text-ink transition-colors hover:bg-white/70"
                >
                  {item.label}
                </Link>
              ))}
              <Link
                to={marketHref(ROUTES.support)}
                onClick={() => setOpen(false)}
                className="rounded-2xl px-3 py-3 text-[15px] text-ink transition-colors hover:bg-white/70"
              >
                Support
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
