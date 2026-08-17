import { useProtocolSession } from "../../hooks/useProtocolSession";
import { useMemberContext } from "../../components/member/member-context";
import { DemoTag, MemberPanel, PanelEmpty, PanelUnavailable } from "../../components/member/primitives";

/*
 * The health vault, in two halves that are not the same kind of thing.
 *
 * SELF-REPORTED is real and already exists: the goals and routine answers the visitor
 * gave the protocol builder. It is shown back to them as their own words, because that
 * is what it is.
 *
 * CLINICAL is named and switched off. There is no server, no BAA, and no lawful home
 * for a lab result, so the honest rendering is a sentence saying so — the same
 * treatment PRECISION_TIER gets on the homepage. Even in demonstration mode the
 * entries are document NAMES with a status and never a value, because
 * `ClinicalRecordRef` has nowhere to put one.
 *
 * The copy also states the boundary the platform intends to keep: BioAro Drugs AI does
 * not interpret results. That is a product commitment, not a limitation to apologise
 * for, so it is written as a fact.
 */
export default function MemberVault() {
  const { view } = useProtocolSession();
  const { snapshot, source, capabilities } = useMemberContext();

  const goals = view.session.detectedGoals;
  const answers = Object.entries(view.session.answers).filter(([, value]) => Boolean(value));
  const clinical = (snapshot?.vault ?? []).filter((entry) => entry.category === "clinical");

  return (
    <div>
      <h1 className="text-balance text-[34px] font-black leading-[1.05] tracking-[-0.035em] text-ink sm:text-[42px]">
        Health vault
      </h1>
      <p className="mt-6 max-w-[58ch] text-pretty text-[16.5px] leading-[1.6] text-ink-600">
        What you have told us, and what a record would hold. You choose what to share.
      </p>

      <div className="mt-8 grid gap-6 lg:grid-cols-2 lg:items-start">
        <MemberPanel title="What you told us">
          {goals.length === 0 && answers.length === 0 ? (
            <PanelEmpty>
              Nothing yet. Anything you tell the protocol builder about your goals and routine will
              be listed here.
            </PanelEmpty>
          ) : (
            <div className="space-y-6">
              {goals.length > 0 && (
                <div>
                  <p className="eyebrow">Goals</p>
                  <p className="mt-2 text-[15.5px] leading-[1.55] text-ink-600">
                    {goals.join(", ")}
                  </p>
                </div>
              )}

              {answers.length > 0 && (
                <div className="border-t border-line pt-5">
                  <p className="eyebrow">Your routine</p>
                  <dl className="mt-3 space-y-3">
                    {answers.map(([field, value]) => (
                      <div key={field}>
                        <dt className="text-[13px] font-bold uppercase tracking-[0.1em] text-ink-400">
                          {field}
                        </dt>
                        <dd className="mt-0.5 text-[15px] leading-[1.55] text-ink-600">
                          {String(value)}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>
              )}

              <p className="border-t border-line pt-5 text-[14px] leading-[1.6] text-ink-400">
                Held in this browser only. It is not stored on our side yet.
              </p>
            </div>
          )}
        </MemberPanel>

        <MemberPanel
          title="Clinical records"
          action={source === "demo" && clinical.length > 0 ? <DemoTag /> : undefined}
        >
          {capabilities.clinicalRecords ? (
            <PanelEmpty>No records have been shared with your account yet.</PanelEmpty>
          ) : (
            <div className="space-y-5">
              <PanelUnavailable>
                Labs, prescriptions and clinician notes are not part of BioAro Drugs yet. When they
                are, you will choose what to share — and BioAro Drugs AI will not interpret a result
                for you. Reading a result is a doctor&rsquo;s job.
              </PanelUnavailable>

              {source === "demo" && clinical.length > 0 && (
                <ul className="space-y-3">
                  {clinical.map((entry) => (
                    <li key={entry.id} className="border-t border-line pt-3 first:border-t-0 first:pt-0">
                      <p className="text-[15px] font-bold tracking-[-0.02em] text-ink">{entry.label}</p>
                      <p className="mt-0.5 text-[14px] leading-[1.5] text-ink-400">
                        {entry.category === "clinical" ? entry.status : ""} · document name only, no
                        result is held
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </MemberPanel>
      </div>
    </div>
  );
}
