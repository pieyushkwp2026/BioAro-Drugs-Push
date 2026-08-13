import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { ArrowRight, Menu, ShoppingBag, User, X } from "lucide-react";
import RegionSelector from "./RegionSelector";
import { ROUTES } from "../../lib/routes";
import { useCart } from "../../hooks/useCart";
import { useAuth } from "../../hooks/useAuth";
import { useMarketHref } from "../../hooks/useMarketHref";
import bioAroMark from "../../assets/logo/bioaro-mark.png";

/*
 * ONE header, every route. This previously branched on `isRegionalHomepage` and
 * rendered two different bars - different nav items, different type size, a CTA on
 * one and not the other, and a different left edge - which read as a broken header
 * the moment you navigated off the homepage. The branch is gone.
 *
 * Quiz is deliberately absent from the nav list: it is the CTA.
 */
const NAV = [
  { label: "Shop", href: ROUTES.shop },
  { label: "Science", href: ROUTES.science },
  { label: "Journal", href: ROUTES.journal },
  { label: "About", href: ROUTES.about },
] as const;

const CONTROL =
  "rounded-full border border-line bg-white/70 text-ink transition-colors hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ember";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  // Zooki-style directional bar: retracts on the way down, returns on the way up.
  const [hidden, setHidden] = useState(false);
  const lastYRef = useRef(0);
  const [open, setOpen] = useState(false);
  const { cart, openCart } = useCart();
  const { isAuthenticated, customer } = useAuth();
  const marketHref = useMarketHref();
  const { pathname } = useLocation();
  const headerRef = useRef<HTMLElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    // One passive listener doing both jobs, rAF-guarded so a fast scroll cannot
    // queue a setState per frame.
    let ticking = false;

    const update = () => {
      const y = window.scrollY;
      // The bar is transparent at the very top so it sits seamlessly on the ivory
      // ground; it goes solid almost immediately or content scrolls underneath it.
      setScrolled(y > 8);

      const previous = lastYRef.current;
      // 6px of slack stops trackpad jitter from flickering the bar.
      if (y < 140) setHidden(false);
      else if (y > previous + 6) setHidden(true);
      else if (y < previous - 6) setHidden(false);

      lastYRef.current = y;
      ticking = false;
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setOpen(false);
      menuButtonRef.current?.focus();
    };
    // Tested against the whole header, not just the panel: RegionSelector renders
    // inside the panel and runs its own outside-click listener, so a narrower
    // target would close the menu on every region choice.
    const onPointerDown = (event: PointerEvent) => {
      if (headerRef.current && !headerRef.current.contains(event.target as Node)) setOpen(false);
    };

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [open]);

  const accountHref = isAuthenticated ? marketHref(ROUTES.account) : marketHref("/auth");
  const accountLabel = isAuthenticated ? customer?.firstName ?? "Account" : "Sign in";
  const cartLabel = `Cart, ${cart.totalQuantity} item${cart.totalQuantity === 1 ? "" : "s"}`;

  const surface = scrolled
    ? "border-b border-line bg-ivory shadow-[0_10px_30px_-18px_rgba(28,25,23,0.45)]"
    : "border-b border-transparent bg-transparent";

  return (
    <header
      ref={headerRef}
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,box-shadow,transform] duration-300 will-change-transform ${surface} ${
        // Never retract while the mobile menu is open, or it takes the menu with it.
        hidden && !open ? "-translate-y-full" : "translate-y-0"
      }`}
    >
      <div className="container-bio">
        <div className="flex min-h-[88px] items-center justify-between gap-3 sm:gap-6">
          <Link
            to={marketHref(ROUTES.home)}
            className="flex shrink-0 items-center gap-2.5 rounded-full text-ink transition-colors hover:text-ember focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ember sm:gap-3"
          >
            <img src={bioAroMark} alt="" aria-hidden="true" className="h-[24px] w-[24px] shrink-0 object-contain" />
            <span className="whitespace-nowrap text-[16px] font-bold tracking-[-0.02em] sm:text-[18px]">
              BioAro Drugs
            </span>
          </Link>

          <nav aria-label="Primary" className="hidden min-w-0 items-center gap-8 xl:flex min-[1400px]:gap-10">
            {NAV.map((item) => (
              <NavLink
                key={item.href}
                to={marketHref(item.href)}
                className={({ isActive }) =>
                  `whitespace-nowrap text-[13px] font-bold tracking-[-0.005em] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ember ${
                    isActive ? "text-ember" : "text-ink hover:text-ember"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <Link
              to={marketHref(ROUTES.quiz)}
              className="hidden h-10 items-center gap-2 rounded-full bg-ember px-5 text-[13px] font-bold tracking-[-0.01em] text-white shadow-[0_10px_24px_-14px_rgba(193,70,42,0.9)] transition-[background-color,transform] duration-200 hover:bg-ember-600 active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ember motion-reduce:active:scale-100 xl:inline-flex"
            >
              <span>Find your fit</span>
              <ArrowRight size={15} strokeWidth={2.4} />
            </Link>

            <div className="hidden md:block">
              <RegionSelector />
            </div>

            <Link
              to={accountHref}
              aria-label={accountLabel}
              className={`hidden h-10 items-center gap-2 px-3.5 text-[13px] md:flex ${CONTROL}`}
            >
              <User size={17} strokeWidth={1.5} />
              {/* Unbounded first names are the largest single term in the width
                  budget at 1280px; 9ch caps the worst case. */}
              <span className="max-w-[9ch] truncate">{accountLabel}</span>
            </Link>
            <Link
              to={accountHref}
              aria-label={accountLabel}
              className={`flex h-10 w-10 items-center justify-center md:hidden ${CONTROL}`}
            >
              <User size={17} strokeWidth={1.5} />
            </Link>

            <button
              type="button"
              onClick={openCart}
              aria-label={cartLabel}
              className={`hidden h-10 items-center gap-2 px-4 text-[13px] md:flex ${CONTROL}`}
            >
              <ShoppingBag size={17} strokeWidth={1.5} />
              <span>{cart.totalQuantity}</span>
            </button>
            <button
              type="button"
              onClick={openCart}
              aria-label={cartLabel}
              className={`relative flex h-10 w-10 items-center justify-center md:hidden ${CONTROL}`}
            >
              <ShoppingBag size={17} strokeWidth={1.5} />
              {cart.totalQuantity > 0 && (
                <span
                  aria-hidden="true"
                  className="absolute -right-1 -top-1 min-w-4 rounded-full bg-ember px-1.5 py-0.5 text-[10px] text-white"
                >
                  {cart.totalQuantity}
                </span>
              )}
            </button>

            <button
              type="button"
              ref={menuButtonRef}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              aria-controls="site-menu"
              onClick={() => setOpen((value) => !value)}
              className={`flex h-10 w-10 items-center justify-center xl:hidden ${CONTROL}`}
            >
              {open ? <X size={18} strokeWidth={1.6} /> : <Menu size={18} strokeWidth={1.6} />}
            </button>
          </div>
        </div>

        {open && (
          <div
            id="site-menu"
            /* Scrolls internally rather than locking the body: the drawer is live up
               to 1279px, and locking scroll at desktop widths removes the classic
               scrollbar and reflows the whole page by ~15px on open. */
            className="mb-4 overflow-y-auto overscroll-contain rounded-[28px] border border-line bg-white p-5 shadow-glass-lg max-h-[calc(100vh-100px)] xl:hidden"
            style={{ maxHeight: "calc(100dvh - 100px)" }}
          >
            <div className="mb-5 md:hidden">
              <RegionSelector />
            </div>

            {/* The desktop CTA is xl-only, so without this the entire mobile
                experience has no route to the quiz. */}
            <Link
              to={marketHref(ROUTES.quiz)}
              onClick={() => setOpen(false)}
              className="mb-4 flex h-12 items-center justify-center gap-2 rounded-full bg-ember text-[15px] font-bold tracking-[-0.01em] text-white transition-[background-color,transform] duration-200 hover:bg-ember-600 active:scale-[0.99] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ember motion-reduce:active:scale-100"
            >
              <span>Find your fit</span>
              <ArrowRight size={16} strokeWidth={2.4} />
            </Link>

            <nav aria-label="Menu" className="flex flex-col gap-1">
              {NAV.map((item) => (
                <NavLink
                  key={item.href}
                  to={marketHref(item.href)}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `rounded-2xl px-3 py-3 text-[15px] font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ember ${
                      isActive ? "bg-cream text-ember" : "text-ink hover:bg-cream"
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
              <Link
                to={accountHref}
                onClick={() => setOpen(false)}
                className="rounded-2xl px-3 py-3 text-[15px] font-medium text-ink transition-colors hover:bg-cream focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ember"
              >
                {accountLabel}
              </Link>
              <Link
                to={marketHref(ROUTES.support)}
                onClick={() => setOpen(false)}
                className="rounded-2xl px-3 py-3 text-[15px] font-medium text-ink transition-colors hover:bg-cream focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ember"
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
