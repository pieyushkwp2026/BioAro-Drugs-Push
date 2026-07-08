import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, ShoppingBag, X } from "lucide-react";
import RegionSelector from "./RegionSelector";
import { PRIMARY_NAV, ROUTES } from "../../lib/routes";
import { useCart } from "../../hooks/useCart";
import bioAroMark from "../../assets/logo/bioaro-mark.png";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { cart, openCart } = useCart();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled ? "border-b border-[#e7e1d5] bg-cream/90 backdrop-blur-md" : "bg-transparent"
      }`}
    >
      <div className="container-bio">
        <div className="flex min-h-[76px] items-center justify-between gap-6">
          <Link to="/" className="flex items-center gap-3 text-ink">
            <img src={bioAroMark} alt="" aria-hidden="true" className="h-[24px] w-[24px] object-contain" />
            <span className="text-[19px] font-semibold tracking-[0.01em]">BioAro Drugs</span>
          </Link>

          <nav className="hidden items-center gap-9 lg:flex">
            {PRIMARY_NAV.map((item) => (
              <NavLink
                key={item.href}
                to={item.href}
                className={({ isActive }) =>
                  `text-[15px] transition-colors ${isActive ? "font-medium text-ink" : "text-[#131012] hover:text-forest-600"}`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-3">
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
              className="flex h-10 w-10 items-center justify-center rounded-full border border-[#ddd8c9] bg-white/70 transition-colors hover:bg-white lg:hidden"
            >
              {open ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {open && (
          <div className="rounded-[24px] border border-[#e1ddce] bg-[#f7f3ed] p-5 shadow-glass-lg lg:hidden">
            <div className="mb-5 md:hidden">
              <RegionSelector />
            </div>
            <nav className="flex flex-col gap-1">
              {PRIMARY_NAV.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={() => setOpen(false)}
                  className="rounded-2xl px-3 py-3 text-[15px] text-ink transition-colors hover:bg-white/70"
                >
                  {item.label}
                </Link>
              ))}
              <Link
                to={ROUTES.support}
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
