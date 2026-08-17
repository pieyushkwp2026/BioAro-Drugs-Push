import { Link } from "react-router-dom";
import { useMarketHref } from "../../hooks/useMarketHref";
import { useProtocolSession } from "../../hooks/useProtocolSession";
import { ROUTES } from "../../lib/routes";
import type { ProtocolItem, ProtocolSlot } from "../../lib/protocol/build";
import { useMemberContext } from "../../components/member/member-context";
import { DemoTag, MemberPanel, PanelEmpty, PanelUnavailable } from "../../components/member/primitives";

/*
 * The protocol the member is actually carrying.
 *
 * THIS PAGE SHOWS REAL ENGINE OUTPUT, not a fixture: it reads the live session, the
 * same instance the homepage studio and /quiz write to. That is deliberate, because
 * the most useful thing this dashboard can demonstrate is the gap — a protocol exists,
 * it is genuinely derived, and it disappears on refresh because nothing persists it.
 * The notice below says so in the member's own terms rather than hiding it.
 *
 * The demonstration snapshot adds a version history underneath, which is the one part
 * of the shape the live session cannot show: a protocol with an id, a version and a
 * predecessor.
 */

const SLOT_ORDER: ProtocolSlot[] = ["Morning", "Around training", "Evening"];

function ItemRow({ item }: { item: ProtocolItem }) {
  return (
    <li className="border-t border-line py-4 first:border-t-0 first:pt-0">
      <p className="text-[15.5px] font-bold tracking-[-0.02em] text-ink">{item.handle}</p>
      <p className="mt-1 text-pretty text-[14.5px] leading-[1.55] text-ink-600">{item.reason}</p>
    </li>
  );
}

export default function MemberProtocol() {
  const marketHref = useMarketHref();
  const { view } = useProtocolSession();
  const { snapshot, source, capabilities } = useMemberContext();

  const protocol = view.protocol;
  const items = protocol?.items ?? [];

  return (
    <div>
      <h1 className="text-balance text-[34px] font-black leading-[1.05] tracking-[-0.035em] text-ink sm:text-[42px]">
        Your protocol
      </h1>

      <div className="mt-8 grid gap-6">
        <MemberPanel title="Current protocol">
          {items.length === 0 ? (
            <PanelEmpty>
              You have not built a protocol yet.{" "}
              <Link
                to={marketHref(ROUTES.quiz)}
                className="rounded-sm font-medium text-ink underline underline-offset-[4px] transition-colors hover:text-ember focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ember"
              >
                Answer a few questions
              </Link>{" "}
              and it will appear here.
            </PanelEmpty>
          ) : (
            <div className="space-y-8">
              {SLOT_ORDER.map((slot) => {
                const slotItems = items.filter((item) => item.slot === slot);
                if (slotItems.length === 0) return null;

                return (
                  <div key={slot}>
                    <p className="eyebrow">{slot}</p>
                    <ul className="mt-3">
                      {slotItems.map((item) => (
                        <ItemRow key={`${slot}-${item.handle}`} item={item} />
                      ))}
                    </ul>
                  </div>
                );
              })}

              {protocol && protocol.notes.length > 0 && (
                <div className="border-t border-line-strong pt-6">
                  <p className="eyebrow">Worth knowing</p>
                  <ul className="mt-3 space-y-2">
                    {protocol.notes.map((note) => (
                      <li key={note} className="text-pretty text-[14.5px] leading-[1.6] text-ink-600">
                        {note}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </MemberPanel>

        {/* The honest disclosure, and the reason phase two starts with persistence. */}
        {!capabilities.protocolPersistence && items.length > 0 && (
          <PanelUnavailable>
            This protocol is held in this browser only. It is not saved to your account yet, so
            refreshing or switching device will lose it.
          </PanelUnavailable>
        )}

        <MemberPanel
          title="History"
          action={source === "demo" ? <DemoTag /> : undefined}
        >
          {source === "demo" && snapshot ? (
            <ul className="space-y-4">
              {snapshot.protocols.map((record) => (
                <li key={record.id} className="border-t border-line pt-4 first:border-t-0 first:pt-0">
                  <p className="text-[15px] font-bold tracking-[-0.02em] text-ink">
                    Version {record.version}
                    {record.supersedesId ? " — replaced the one before it" : " — first build"}
                  </p>
                  <p className="mt-1 text-[14px] leading-[1.55] text-ink-600">
                    {record.items.length} {record.items.length === 1 ? "formula" : "formulas"} ·{" "}
                    {record.goals.join(", ")}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <PanelEmpty>
              Once protocols are saved to your account, each rebuild will be kept here so you can
              see what changed and when.
            </PanelEmpty>
          )}
        </MemberPanel>
      </div>
    </div>
  );
}
