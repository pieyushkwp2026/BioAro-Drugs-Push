import { Link, useLocation } from "react-router-dom";
import { ArrowRight, LockKeyhole, RefreshCw, Sparkles } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { useMarketHref } from "../../hooks/useMarketHref";
import { ROUTES } from "../../lib/routes";
import { MemberPanel } from "../member/primitives";

export type AdvancedAiGateVariant =
  | "loading"
  | "signed-out"
  | "no-membership"
  | "inactive"
  | "unavailable";

interface AdvancedAiGateProps {
  variant: AdvancedAiGateVariant;
  onRetry?: () => void;
}

const GATE_COPY: Record<Exclude<AdvancedAiGateVariant, "loading" | "unavailable">, {
  title: string;
  body: string;
  accessLabel: string;
}> = {
  "signed-out": {
    title: "Your deeper routine starts with membership.",
    body: "Sign in to check your membership and open the advanced BioAro Drugs AI workspace.",
    accessLabel: "Sign in to continue",
  },
  "no-membership": {
    title: "Advanced support for your routine.",
    body: "Membership unlocks the full AI workspace, including guided protocol building, private conversation history and richer routine support.",
    accessLabel: "View membership",
  },
  inactive: {
    title: "Your advanced AI access is paused.",
    body: "Your membership is not currently active. Review your membership to restore access to the full BioAro Drugs AI workspace.",
    accessLabel: "Review membership",
  },
};

function GateSkeleton() {
  return (
    <div className="flex min-h-[calc(100dvh-88px)] flex-col justify-center px-5 py-12 sm:px-8 md:py-20" aria-busy="true" aria-label="Loading advanced AI">
      <div className="container-bio">
        <div className="mx-auto grid max-w-[980px] gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
          <div className="h-[390px] animate-pulse rounded-[32px] bg-cream-200" />
          <div className="h-[260px] animate-pulse rounded-[28px] bg-cream-200" />
        </div>
      </div>
    </div>
  );
}

export default function AdvancedAiGate({ variant, onRetry }: AdvancedAiGateProps) {
  const marketHref = useMarketHref();
  const location = useLocation();
  const { login } = useAuth();

  if (variant === "loading") return <GateSkeleton />;

  const isSignedOut = variant === "signed-out";
  const isUnavailable = variant === "unavailable";
  const copy = !isSignedOut && !isUnavailable ? GATE_COPY[variant] : null;
  const returnTo = `${location.pathname}${location.search}`;

  return (
    <main className="flex min-h-[calc(100dvh-88px)] flex-col justify-center px-5 py-12 sm:px-8 md:py-20">
      <div className="container-bio">
        <div className="mx-auto grid max-w-[980px] gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
          <section className="rounded-[32px] border border-line bg-white p-7 shadow-glass sm:p-10">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-ember/10 text-ember">
              {isUnavailable ? <RefreshCw size={20} aria-hidden="true" /> : <Sparkles size={20} aria-hidden="true" />}
              </div>
              <p className="eyebrow">Member benefit</p>
            </div>
            <p className="mt-8 eyebrow text-ember-600">BioAro Drugs AI</p>
            <h1 className="mt-3 max-w-[14ch] text-balance text-[36px] font-black leading-[1.04] tracking-[-0.04em] text-ink sm:text-[48px]">
              {isSignedOut
                ? GATE_COPY["signed-out"].title
                : isUnavailable
                  ? "We couldn’t verify your membership."
                  : copy?.title}
            </h1>
            <p className="mt-6 max-w-[50ch] text-pretty text-[16px] leading-[1.65] text-ink-600">
              {isSignedOut
                ? GATE_COPY["signed-out"].body
                : isUnavailable
                  ? "We couldn’t verify your membership right now. Please try again, or contact support if the issue continues."
                  : copy?.body}
            </p>

            <div className="mt-8 grid gap-2.5 sm:grid-cols-3">
              {["Guided protocol building", "Private chat history", "Routine attachments"].map((item) => (
                <div key={item} className="rounded-[18px] border border-line bg-cream-50 p-3.5">
                  <LockKeyhole size={15} className="text-ember" aria-hidden="true" />
                  <p className="mt-3 text-[13px] font-bold leading-[1.35] text-ink">{item}</p>
                </div>
              ))}
            </div>
          </section>

          <div className="lg:pt-1">
          <MemberPanel title={isUnavailable ? "Access check" : "Membership access"}>
            <div className="flex items-start gap-3 rounded-[18px] border border-line bg-cream-50 p-4">
              <LockKeyhole size={17} className="mt-0.5 shrink-0 text-ember" aria-hidden="true" />
              <p className="text-[14px] leading-[1.55] text-ink-600">
                {isSignedOut
                  ? "Sign in first so we can check the membership connected to your account."
                  : isUnavailable
                    ? "Membership verification is temporarily unavailable."
                    : copy?.body}
              </p>
            </div>

            <div className="mt-7 flex flex-wrap items-center gap-4">
              {isSignedOut ? (
                <button type="button" onClick={() => void login(returnTo)} className="btn-primary">
                  Sign in
                  <ArrowRight size={15} aria-hidden="true" />
                </button>
              ) : isUnavailable ? (
                <button type="button" onClick={onRetry} className="btn-primary">
                  Try again
                  <RefreshCw size={15} aria-hidden="true" />
                </button>
              ) : (
                <Link to={marketHref(variant === "no-membership" ? ROUTES.membership : ROUTES.accountMembership)} className="btn-primary">
                  {copy?.accessLabel}
                  <ArrowRight size={15} aria-hidden="true" />
                </Link>
              )}
              <Link
                to={marketHref(isSignedOut || variant === "no-membership" ? ROUTES.membership : ROUTES.support)}
                className="rounded-full px-1 py-2 text-[14px] font-bold text-ink underline underline-offset-[5px] transition-colors hover:text-ember focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ember"
              >
                {isSignedOut || variant === "no-membership" ? "View membership" : "Contact support"}
              </Link>
            </div>
          </MemberPanel>
          </div>
        </div>
      </div>
    </main>
  );
}
