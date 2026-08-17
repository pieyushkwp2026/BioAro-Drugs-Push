import { useMemberContext } from "../../components/member/member-context";
import { DemoTag, MemberPanel, PanelEmpty, PanelUnavailable } from "../../components/member/primitives";

/*
 * Doctor connect — named, and openly not available.
 *
 * There is no telehealth partner, no scheduling, and no clinician identity anywhere in
 * this application. So this page has no calendar, no "book a consultation" button, and
 * no empty table with column headers: each of those reads as a feature that is nearly
 * here, and none of them would do anything.
 *
 * What it does carry is the boundary the platform intends to hold — the AI can arrange
 * and it can pass on context a member chooses to share, and it does not diagnose or
 * prescribe. Stating that now is cheaper than retrofitting it once someone expects
 * otherwise.
 */
export default function MemberCare() {
  const { snapshot, source, capabilities, marketConfig } = useMemberContext();
  const consultations = snapshot?.consultations ?? [];

  return (
    <div>
      <h1 className="text-balance text-[34px] font-black leading-[1.05] tracking-[-0.035em] text-ink sm:text-[42px]">
        Care
      </h1>

      <div className="mt-8 grid gap-6">
        <MemberPanel
          title="Consultations"
          action={source === "demo" && consultations.length > 0 ? <DemoTag /> : undefined}
        >
          {capabilities.telehealth ? (
            <PanelEmpty>You have no consultations booked.</PanelEmpty>
          ) : (
            <div className="space-y-5">
              <PanelUnavailable>
                Doctor consultations are not available in {marketConfig.name}. This is planned with
                a licensed telehealth partner, and nothing here is bookable yet.
              </PanelUnavailable>

              {source === "demo" && consultations.length > 0 && (
                <ul className="space-y-3">
                  {consultations.map((consultation) => (
                    <li
                      key={consultation.id}
                      className="border-t border-line pt-3 first:border-t-0 first:pt-0"
                    >
                      <p className="text-[15px] font-bold tracking-[-0.02em] text-ink">
                        {consultation.clinicianName}
                      </p>
                      <p className="mt-0.5 text-[14px] leading-[1.5] text-ink-600">
                        {consultation.status} · {consultation.modality}
                      </p>
                      {consultation.reasonSummary && (
                        <p className="mt-1 text-[14px] leading-[1.55] text-ink-400">
                          &ldquo;{consultation.reasonSummary}&rdquo;
                        </p>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </MemberPanel>

        <MemberPanel title="What BioAro Drugs AI will and will not do">
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <p className="eyebrow">It can</p>
              <ul className="mt-3 space-y-2 text-[14.5px] leading-[1.6] text-ink-600">
                <li>Suggest formulas based on the goals you give it</li>
                <li>Pass on context you choose to share with a doctor</li>
                <li>Arrange a consultation and keep track of it</li>
                <li>Keep your protocol and repeat orders in order</li>
              </ul>
            </div>
            <div>
              <p className="eyebrow">It will not</p>
              <ul className="mt-3 space-y-2 text-[14.5px] leading-[1.6] text-ink-600">
                <li>Diagnose a condition</li>
                <li>Prescribe a medication</li>
                <li>Tell you what a test result means</li>
                <li>Stand in for a doctor&rsquo;s judgement</li>
              </ul>
            </div>
          </div>
        </MemberPanel>
      </div>
    </div>
  );
}
