import { Link } from "react-router-dom";
import { Minus, Plus, ShoppingBag, X } from "lucide-react";
import { useCart } from "../../hooks/useCart";
import { formatMoney } from "../../lib/market/config";
import { useMarket } from "../../hooks/useMarket";
import { useMarketHref } from "../../hooks/useMarketHref";
import { ROUTES } from "../../lib/routes";
import { getMarketConfigByCountry } from "../../config/markets";

export default function CartDrawer() {
  const { cart, closeCart, error, isLoading, isOpen, removeLine, updateQuantity } = useCart();
  const { country } = useMarket();
  const marketHref = useMarketHref();
  const marketConfig = getMarketConfigByCountry(country);

  if (!isOpen) {
    return null;
  }

  return (
    <>
      <div onClick={closeCart} className="fixed inset-0 z-40 bg-[rgba(20,16,13,0.42)]" />
      <aside className="fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-ivory shadow-glass-lg">
        <div className="flex items-center justify-between border-b border-line px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-line bg-white">
              <ShoppingBag size={17} />
            </div>
            <div>
              <p className="text-[15px] font-bold tracking-[-0.015em] text-ink">Your cart</p>
              <p className="text-[13px] text-ink-400">{cart.totalQuantity} item{cart.totalQuantity === 1 ? "" : "s"}</p>
            </div>
          </div>
          <button
            onClick={closeCart}
            className="flex h-10 w-10 items-center justify-center rounded-full text-ink transition-colors hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ember"
            aria-label="Close cart"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6">
          {error && <p className="mb-4 rounded-2xl border border-amber-300/60 bg-amber-50 px-4 py-3 text-sm text-amber-800">{error}</p>}
          {cart.lines.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full border border-line bg-white">
                <ShoppingBag size={22} className="text-ember" />
              </div>
              <h2 className="mt-6 text-balance text-[26px] font-bold leading-[1.15] tracking-[-0.03em] text-ink">Your routine starts here.</h2>
              <p className="mt-3 max-w-xs text-pretty text-[15px] leading-[1.6] text-ink-600">
                Explore BioAro formulas and save your preferred products before online ordering opens.
              </p>
              <Link to={marketHref(ROUTES.shop)} onClick={closeCart} className="btn-primary mt-7">
                Explore formulas
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.lines.map((line) => (
                <div key={line.id} className="rounded-[20px] border border-line bg-white p-4 shadow-glass">
                  <div className="flex gap-4">
                    <div className="h-24 w-20 shrink-0 overflow-hidden rounded-2xl bg-cream-200 p-3">
                      <img src={line.image.src} alt={line.image.alt} className="h-full w-full object-contain" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <Link to={marketHref(`/products/${line.handle}`)} onClick={closeCart} className="text-[15px] font-bold tracking-[-0.015em] text-ink transition-colors hover:text-ember">
                          {line.title}
                        </Link>
                        <button onClick={() => void removeLine(line.id)} className="text-[13px] text-ink-400 transition-colors hover:text-ember">
                          Remove
                        </button>
                      </div>
                      <p className="mt-2 text-[14px] text-ink-600">{formatMoney(line.price.amount, country)}</p>
                      <div className="mt-4 flex items-center justify-between">
                        <div className="flex items-center gap-2 rounded-full border border-line bg-white px-2 py-1">
                          <button
                            onClick={() => void updateQuantity(line.id, Math.max(0, line.quantity - 1))}
                            className="flex h-7 w-7 items-center justify-center rounded-full hover:bg-white"
                            aria-label={`Decrease quantity for ${line.title}`}
                          >
                            <Minus size={13} />
                          </button>
                          <span className="w-6 text-center text-sm">{line.quantity}</span>
                          <button
                            onClick={() => void updateQuantity(line.id, line.quantity + 1)}
                            className="flex h-7 w-7 items-center justify-center rounded-full hover:bg-white"
                            aria-label={`Increase quantity for ${line.title}`}
                          >
                            <Plus size={13} />
                          </button>
                        </div>
                        <p className="text-sm font-medium">{formatMoney(line.price.amount * line.quantity, country)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="border-t border-ink/10 px-6 py-5">
          <div className="flex items-center justify-between text-sm">
            <span className="text-ink/55">Estimated subtotal</span>
            <span className="font-medium">{formatMoney(cart.subtotal.amount, country)}</span>
          </div>
          <p className="mt-3 text-xs leading-relaxed text-ink/45">
            {marketConfig.shippingMessage}
          </p>
          {cart.isPreview && (
            <p className="mt-3 rounded-2xl border border-[#ddd8c9] bg-[#f7f4ee] px-4 py-3 text-xs leading-relaxed text-[#6d665f]">
              {marketConfig.checkoutMessage} For now, you can browse formulas and request availability updates.
            </p>
          )}
          {cart.checkoutUrl ? (
            <a href={cart.checkoutUrl} className="btn-primary mt-5 w-full" target="_blank" rel="noreferrer">
              Proceed to checkout
            </a>
          ) : (
            <Link to={marketHref(ROUTES.support)} onClick={closeCart} className="btn-primary mt-5 w-full">
              Request availability
            </Link>
          )}
          {isLoading && <p className="mt-3 text-center text-xs text-ink/40">Updating cart…</p>}
        </div>
      </aside>
    </>
  );
}
