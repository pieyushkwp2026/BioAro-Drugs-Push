import { ArrowRight, PackageCheck, ShieldCheck, SlidersHorizontal } from "lucide-react";
import { Link } from "react-router-dom";

import { useAuth } from "../hooks/useAuth";
import { useMarketHref } from "../hooks/useMarketHref";
import { ROUTES } from "../lib/routes";
import bioAroMark from "../assets/logo/bioaro-mark.png";
import authVisual from "../assets/about/protocol-slider/creagen-raw-power-lifestyle.png";

const AUTH_PROMISES = [
  {
    label: "Secure Shopify account login",
    Icon: ShieldCheck,
  },
  {
    label: "View order details",
    Icon: PackageCheck,
  },
  {
    label: "Saved customer preferences",
    Icon: SlidersHorizontal,
  },
] as const;

export default function AuthLogin() {
  const { login, isLoading, error } = useAuth();
  const marketHref = useMarketHref();

  return (
    <div className="min-h-screen overflow-hidden bg-[#f7f3ed] px-4 pb-8 pt-24 sm:px-6 md:pt-28 lg:px-10">
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute left-[-12%] top-[-18%] h-[420px] w-[420px] rounded-full bg-[#d8c2a5]/35 blur-3xl" />
        <div className="absolute bottom-[-18%] right-[-12%] h-[520px] w-[520px] rounded-full bg-[#dce9dc]/45 blur-3xl" />
      </div>

      <div className="mx-auto flex min-h-[calc(100dvh-8rem)] max-w-[1480px] flex-col overflow-hidden rounded-[30px] border border-white/72 bg-white/44 shadow-[0_34px_110px_rgba(35,29,20,0.14)] backdrop-blur-2xl xl:min-h-[780px]">
        <div className="grid flex-1 items-stretch lg:grid-cols-[39%_61%]">
          <section className="relative order-2 bg-white/76 p-6 sm:p-9 lg:order-1 lg:p-11 xl:p-12">
            <div className="flex h-full flex-col">
            <Link to={marketHref(ROUTES.home)} className="inline-flex w-fit items-center gap-3 text-ink">
              <img src={bioAroMark} alt="" aria-hidden="true" className="h-9 w-9 rounded-xl object-contain" />
              <span className="text-[18px] font-semibold tracking-[0.01em]">BioAro Drugs</span>
            </Link>

            <div className="my-auto py-10 lg:py-14">
              <p className="eyebrow">Account access</p>
              <h1 className="mt-4 max-w-[460px] text-[46px] leading-[0.95] tracking-[-0.03em] text-ink sm:text-[58px] lg:text-[62px] xl:text-[68px]">
                Sign in to your account.
              </h1>
              <p className="mt-6 max-w-[400px] text-base leading-7 text-ink/62">
                Access your orders, saved details, and account preferences through BioAro's secure Shopify customer account.
              </p>

              {error && (
                <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-700" role="alert">
                  {error}
                </div>
              )}

              <button
                type="button"
                onClick={() => void login()}
                disabled={isLoading}
                className="mt-8 inline-flex min-h-[54px] w-full items-center justify-center gap-3 rounded-full bg-ink px-7 py-4 text-[15px] font-semibold text-white shadow-[0_18px_42px_rgba(27,26,23,0.22)] transition duration-300 hover:bg-forest-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-forest-600 active:translate-y-px disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
              >
                <span>{isLoading ? "Redirecting..." : "Get Started"}</span>
                <ArrowRight size={17} aria-hidden="true" />
              </button>

              <p className="mt-4 text-xs leading-5 text-ink/45">
                You will be redirected to Shopify's secure Customer Account sign-in.
              </p>
            </div>
            </div>
          </section>

          <section className="relative order-1 min-h-[390px] overflow-hidden bg-ink lg:order-2 lg:min-h-0">
            <img
              src={authVisual}
              alt="BioAro product routine with Creagen Raw Power being prepared."
              className="absolute inset-0 h-full w-full object-cover object-[48%_50%]"
              loading="eager"
              decoding="async"
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(27,26,23,0.02),rgba(27,26,23,0.52)),linear-gradient(90deg,rgba(27,26,23,0.26),rgba(27,26,23,0.02)_58%)]" />
            <div className="absolute left-6 top-6 hidden h-14 w-14 items-center justify-center rounded-full border border-white/45 bg-white/12 text-white shadow-[0_18px_44px_rgba(0,0,0,0.18)] backdrop-blur-xl sm:flex lg:left-10 lg:top-10">
              <img src={bioAroMark} alt="" aria-hidden="true" className="h-7 w-7 brightness-0 invert" />
            </div>
            <div className="absolute inset-x-5 bottom-5 rounded-[24px] border border-white/18 bg-white/14 p-5 text-white shadow-[0_20px_60px_rgba(0,0,0,0.22)] backdrop-blur-xl sm:inset-x-8 sm:bottom-8 sm:p-6 lg:left-10 lg:right-auto lg:max-w-[520px]">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/70">Your BioAro account</p>
              <p className="mt-3 max-w-[520px] font-display text-3xl leading-[1.05] tracking-[-0.02em] sm:text-4xl">
                Keep your product routine, orders, and account details in one calm place.
              </p>
            </div>
          </section>
        </div>

        <div className="grid gap-px border-t border-white/75 bg-[#e8dfd2]/70 px-5 py-4 sm:grid-cols-3 sm:px-8 lg:px-12">
          {AUTH_PROMISES.map(({ label, Icon }) => (
            <div key={label} className="flex min-h-[54px] items-center justify-center gap-3 bg-white/28 px-3 py-2 first:rounded-l-2xl last:rounded-r-2xl sm:bg-transparent">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/70 bg-white/58 text-forest-600 shadow-[0_10px_24px_rgba(35,29,20,0.08)]">
                <Icon size={15} aria-hidden="true" />
              </span>
              <span className="text-[12.5px] font-medium leading-5 text-ink/72">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
