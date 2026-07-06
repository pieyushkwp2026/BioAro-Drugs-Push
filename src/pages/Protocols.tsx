import { Link } from "react-router-dom";
import PageHero from "../components/page/PageHero";
import { PROTOCOLS, PROTOCOLS_INTRO, PROTOCOLS_PAGE_HERO } from "../data/siteContent";

export default function Protocols() {
  return (
    <div className="pt-32 pb-24">
      <div className="container-bio">
        <PageHero {...PROTOCOLS_PAGE_HERO} />
        <div className="mt-10 max-w-3xl text-sm leading-relaxed text-ink/55">{PROTOCOLS_INTRO}</div>
        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          {PROTOCOLS.map((protocol) => (
            <section key={protocol.title} className="glass-card flex flex-col p-6 md:p-8">
              <h2 className="text-2xl">{protocol.title}</h2>
              <p className="mt-4 text-sm leading-relaxed text-ink/55">{protocol.description}</p>
              <div className="mt-6">
                <p className="text-xs uppercase tracking-[0.2em] text-ink/35">Suggested fit</p>
                <ul className="mt-3 space-y-2 text-sm text-ink/65">
                  {protocol.suggestedFit.map((item) => (
                    <li key={item} className="flex gap-2">
                      <span className="mt-1 h-1.5 w-1.5 rounded-full bg-forest-600 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <p className="mt-6 text-sm leading-relaxed text-ink/55">{protocol.positioning}</p>
              <div className="mt-6 flex flex-wrap gap-2">
                {protocol.handleGroup.map((handle) => (
                  <Link key={handle} to={`/shop/${handle}`} className="btn-secondary !px-4 !py-2 !text-xs">
                    View product
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
