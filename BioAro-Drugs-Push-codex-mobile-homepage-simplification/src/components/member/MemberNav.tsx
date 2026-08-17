import { NavLink } from "react-router-dom";
import { useMarketHref } from "../../hooks/useMarketHref";
import { MEMBER_NAV, ROUTES } from "../../lib/routes";

/*
 * The dashboard's section rail.
 *
 * Borrows its whole visual language from `components/product/SectionNav.tsx` — sticky
 * under the fixed 88px header, bled to the gutters, horizontally scrollable with the
 * scrollbar hidden, ember-free pills that invert when active. It is a separate file
 * rather than a reuse because the mechanics differ: SectionNav scroll-spies anchors
 * inside one page with an IntersectionObserver, this one is route-aware. Merging them
 * would put router knowledge inside a product-page component.
 *
 * `NavLink` supplies `aria-current="page"` itself, which is the accessible half of
 * what the observer was doing there.
 *
 * `end` is set on the overview link only: without it, "/account" would stay active on
 * every child route, because React Router treats it as a prefix match.
 */
export default function MemberNav() {
  const marketHref = useMarketHref();

  return (
    <nav
      aria-label="Account sections"
      className="sticky top-[88px] z-20 -mx-5 border-y border-line bg-cream/95 px-5 backdrop-blur-[2px] sm:-mx-8 sm:px-8 lg:-mx-12 lg:px-12"
    >
      <ul className="flex gap-2 overflow-x-auto py-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {MEMBER_NAV.map((item) => (
          <li key={item.href}>
            <NavLink
              to={marketHref(item.href)}
              end={item.href === ROUTES.account}
              className={({ isActive }) =>
                `inline-flex whitespace-nowrap rounded-full px-4 py-2 text-[13.5px] font-bold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ember ${
                  isActive ? "bg-ink text-white" : "text-ink-600 hover:bg-white hover:text-ink"
                }`
              }
            >
              {item.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
