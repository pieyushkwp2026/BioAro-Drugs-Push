import { Link } from "react-router-dom";
import { Minus, Plus, ShoppingBag, X } from "lucide-react";
import { useCart } from "../../hooks/useCart";
import { formatMoney } from "../../lib/market/config";
import { useMarket } from "../../hooks/useMarket";

export default function CartDrawer() {
  const { cart, closeCart, error, isLoading, isOpen, removeLine, updateQuantity } = useCart();
  const { country } = useMarket();

  return (
    <>
      <div
        onClick={closeCart}
        className={`fixed inset-0 z-40 bg-ink/30 transition-opacity ${isOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"}`}
      />
      <aside
        className={`fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-cream shadow-glass-lg transition-transform duration-300 ${isOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex items-center justify-between border-b border-ink/10 px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full glass">
              <ShoppingBag size={17} />
            </div>
            <div>
              <p className="text-sm font-medium">Your cart</p>
              <p className="text-xs text-ink/45">{cart.totalQuantity} item{cart.totalQuantity === 1 ? "" : "s"}</p>
            </div>
          </div>
          <button
            onClick={closeCart}
            className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-white/60"
            aria-label="Close cart"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6">
          {error && <p className="mb-4 rounded-2xl border border-amber-300/60 bg-amber-50 px-4 py-3 text-sm text-amber-800">{error}</p>}
          {cart.lines.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full glass">
                <ShoppingBag size={22} className="text-forest-600" />
              </div>
              <h2 className="mt-5 text-2xl">Your cart is empty.</h2>
              <p className="mt-3 max-w-xs text-sm leading-relaxed text-ink/55">
                Add a product to start a routine. Market-aware pricing and policies will carry through to checkout.
              </p>
              <Link to="/shop" onClick={closeCart} className="btn-primary mt-7">
                Explore formulas
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.lines.map((line) => (
                <div key={line.id} className="glass-card p-4">
                  <div className="flex gap-4">
                    <div className="h-24 w-20 shrink-0 overflow-hidden rounded-2xl bg-[#EDEBE4] p-3">
                      <img src={line.image.src} alt={line.image.alt} className="h-full w-full object-contain" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <Link to={`/shop/${line.handle}`} onClick={closeCart} className="text-sm font-medium hover:text-forest-600">
                          {line.title}
                        </Link>
                        <button onClick={() => void removeLine(line.id)} className="text-xs text-ink/40 hover:text-ink">
                          Remove
                        </button>
                      </div>
                      <p className="mt-2 text-sm text-ink/55">{formatMoney(line.price.amount, country)}</p>
                      <div className="mt-4 flex items-center justify-between">
                        <div className="flex items-center gap-2 rounded-full border border-ink/10 bg-white/60 px-2 py-1">
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
            <span className="text-ink/55">Subtotal</span>
            <span className="font-medium">{formatMoney(cart.subtotal.amount, country)}</span>
          </div>
          <p className="mt-3 text-xs leading-relaxed text-ink/45">
            Taxes, shipping, and any market-specific delivery details are confirmed during checkout.
          </p>
          {cart.isPreview && (
            <p className="mt-3 rounded-2xl border border-ink/10 bg-white/50 px-4 py-3 text-xs leading-relaxed text-ink/50">
              Preview mode is active because Shopify credentials are not configured in this environment. Connect the Storefront API to enable live checkout.
            </p>
          )}
          {cart.checkoutUrl ? (
            <a href={cart.checkoutUrl} className="btn-primary mt-5 w-full" target="_blank" rel="noreferrer">
              Proceed to checkout
            </a>
          ) : (
            <button disabled className="btn-primary mt-5 w-full opacity-60">
              Checkout unavailable in preview
            </button>
          )}
          {isLoading && <p className="mt-3 text-center text-xs text-ink/40">Updating cart…</p>}
        </div>
      </aside>
    </>
  );
}
