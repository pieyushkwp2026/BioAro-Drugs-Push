import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { FlagCA, FlagGB, FlagUS } from "./Flags";
import { useMarket } from "../../hooks/useMarket";
import { MARKET_ORDER, getMarketConfig } from "../../lib/market/config";
import type { CountryCode } from "../../lib/market/types";

const FLAGS = {
  US: FlagUS,
  CA: FlagCA,
  GB: FlagGB,
};

export default function RegionSelector() {
  const { country, setCountry } = useMarket();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) setOpen(false);
    };

    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const currentMarket = getMarketConfig(country);
  const SelectedFlag = FLAGS[country];

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((value) => !value)}
        aria-label="Select region"
        className="flex h-9 items-center gap-2 rounded-full border border-[#ddd8c9] bg-white/70 px-3 text-[13px] text-ink transition-colors hover:bg-white"
      >
        <SelectedFlag className="h-3.5 w-5 shrink-0 overflow-hidden rounded-[2px]" />
        <span>{currentMarket.shortLabel}</span>
        <ChevronDown size={13} className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-2 w-56 rounded-[18px] border border-[#e1ddce] bg-[#f7f3ed] p-1.5 shadow-glass-lg">
          {MARKET_ORDER.map((marketCountry) => {
            const market = getMarketConfig(marketCountry);
            const Flag = FLAGS[marketCountry];

            return (
              <button
                key={market.country}
                onClick={() => {
                  setCountry(marketCountry as CountryCode);
                  setOpen(false);
                }}
                className={`flex w-full items-center gap-3 rounded-[14px] px-3 py-2.5 text-left text-sm transition-colors ${
                  country === market.country ? "bg-white" : "hover:bg-white/70"
                }`}
              >
                <Flag className="h-4 w-6 shrink-0 overflow-hidden rounded-[2px]" />
                <span className="flex-1">{market.label}</span>
                <span className="text-xs text-[#8a8678]">{market.currency}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
