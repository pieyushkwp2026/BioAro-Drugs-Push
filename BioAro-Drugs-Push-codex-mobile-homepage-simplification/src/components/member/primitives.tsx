import type { ReactNode } from "react";

/*
 * The dashboard's shared pieces, promoted from the local Shell/Panel/Row that
 * `pages/Account.tsx` had grown. Named exports, structured like
 * `components/home/primitives.tsx`.
 *
 * THE ONE IDEA WORTH READING: `PanelEmpty` and `PanelUnavailable` are different
 * components because they say different things. "You have no orders yet" and "ordering
 * does not exist here yet" are both blank screens and are not the same statement, and
 * collapsing them is how a dashboard ends up implying a feature ships. Empty is a
 * state of the member's data; unavailable is a state of the platform.
 */

export function MemberPanel({
  title,
  action,
  children,
}: {
  title: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="rounded-[28px] border border-line bg-white p-7 shadow-glass sm:p-9">
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
        <h2 className="text-[19px] font-bold tracking-[-0.025em] text-ink">{title}</h2>
        {action}
      </div>
      <div className="mt-6">{children}</div>
    </section>
  );
}

export function PanelRow({ term, children }: { term: string; children: ReactNode }) {
  return (
    <div className="border-t border-line pt-4 first:border-t-0 first:pt-0">
      <dt className="text-[13px] font-bold uppercase tracking-[0.1em] text-ink-400">{term}</dt>
      <dd className="mt-1.5 text-pretty text-[15.5px] leading-[1.55] text-ink-600">{children}</dd>
    </div>
  );
}

/** The member has none of this yet, but the feature exists. */
export function PanelEmpty({ children }: { children: ReactNode }) {
  return <p className="text-pretty text-[15.5px] leading-[1.6] text-ink-600">{children}</p>;
}

/*
 * The feature does not exist yet.
 *
 * Deliberately not a greyed-out table, a skeleton row, or a "coming soon" badge sitting
 * on a fabricated record: those all read as a thing that is nearly here. A sentence
 * that names what will be here and says plainly that it is not, is the same treatment
 * PRECISION_TIER gets on the homepage.
 */
export function PanelUnavailable({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-[24px] border border-dashed border-line-strong bg-cream-50 p-6">
      <p className="text-pretty text-[15.5px] leading-[1.6] text-ink-600">{children}</p>
    </div>
  );
}

/** Marks a single record as fabricated, wherever one is rendered. */
export function DemoTag() {
  return (
    <span className="inline-flex shrink-0 items-center rounded-full border border-ember/30 bg-ember/10 px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.12em] text-ember-600">
      Demo data
    </span>
  );
}

/*
 * The loading state, shaped like the dashboard rather than like a spinner, so the
 * layout does not jump when the auth check resolves. Same idiom as the skeleton in
 * `pages/Account.tsx` and `pages/AuthLogin.tsx`.
 */
export function MemberSkeleton() {
  return (
    <div aria-busy="true" aria-label="Loading your account">
      <div className="h-[46px] w-[52%] animate-pulse rounded-2xl bg-cream-200" />
      <div className="mt-8 h-[44px] w-full animate-pulse rounded-full bg-cream-200" />
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="h-[220px] animate-pulse rounded-[28px] bg-cream-200" />
        <div className="h-[220px] animate-pulse rounded-[28px] bg-cream-200" />
      </div>
    </div>
  );
}
