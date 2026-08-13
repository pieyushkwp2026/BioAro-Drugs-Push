import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { FlagAE, FlagCA, FlagGB, FlagUS } from "./Flags";
import { useMarket } from "../../hooks/useMarket";
import { MARKET_ORDER, getMarketConfig } from "../../lib/market/config";
import type { CountryCode } from "../../lib/market/types";

const FLAGS = {
  US: FlagUS,
  CA: FlagCA,
  GB: FlagGB,
  AE: FlagAE,
};

/*
 * `default` is the original trigger, character for character, so the Footer and
 * every non-homepage header keep their exact appearance. `home` matches the
 * redesigned homepage header: 40px to line up with the pills either side of it
 * (the shared 36px trigger sits as a visible 2px inset between them).
 */
const TRIGGER_SKIN = {
  default:
    "h-10 border-line bg-white/70 text-ink hover:bg-white focus-visible:outline-ember focus-visible:outline-offset-2",
  home: "h-10 border-line bg-white/70 text-ink hover:bg-white focus-visible:outline-ember focus-visible:outline-offset-4",
} as const;

export default function RegionSelector({
  variant = "default",
}: {
  variant?: keyof typeof TRIGGER_SKIN;
}) {
  const { market, setMarket } = useMarket();
  const [open, setOpen] = useState(false);
  // In the footer bottom bar there is nothing below the trigger, so a panel that
  // always opened downward hung off the end of the page. Flip it when the space
  // below is too tight, which keeps the header behaviour unchanged.
  const [dropUp, setDropUp] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  // 4 rows at ~44px plus the panel's own padding.
  const PANEL_HEIGHT = 208;

  function toggle() {
    setOpen((wasOpen) => {
      if (!wasOpen) {
        const rect = triggerRef.current?.getBoundingClientRect();
        if (rect) {
          const spaceBelow = window.innerHeight - rect.bottom;
          const spaceAbove = rect.top;
          setDropUp(spaceBelow < PANEL_HEIGHT + 16 && spaceAbove > spaceBelow);
        }
      }
      return !wasOpen;
    });
  }

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) setOpen(false);
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setOpen((wasOpen) => {
        if (wasOpen) triggerRef.current?.focus();
        return false;
      });
    };

    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  const currentMarket = getMarketConfig(market);
  const SelectedFlag = FLAGS[currentMarket.countryCode];

  return (
    <div className="relative" ref={ref}>
      <button
        ref={triggerRef}
        type="button"
        onClick={toggle}
        aria-label="Select region"
        aria-expanded={open}
        aria-haspopup="listbox"
        className={`flex items-center gap-2 rounded-full border px-3 text-[13px] transition-colors focus-visible:outline focus-visible:outline-2 ${TRIGGER_SKIN[variant]}`}
      >
        <SelectedFlag className="h-3.5 w-[22px] shrink-0 overflow-hidden rounded-[2px]" />
        <span>{currentMarket.shortLabel}</span>
        <ChevronDown size={13} strokeWidth={1.6} className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div
          role="listbox"
          aria-label="Select region"
          className={`absolute right-0 z-50 w-56 rounded-[20px] border border-line bg-white p-1.5 text-ink shadow-glass-lg ${
            dropUp ? "bottom-full mb-2" : "top-full mt-2"
          }`}
        >
          {MARKET_ORDER.map((marketCode) => {
            const option = getMarketConfig(marketCode);
            const Flag = FLAGS[option.countryCode as CountryCode];

            return (
              <button
                key={option.code}
                onClick={() => {
                  setMarket(option.code);
                  setOpen(false);
                }}
                className={`flex w-full items-center gap-3 rounded-[14px] px-3 py-2.5 text-left text-sm transition-colors ${
                  market === option.code ? "bg-cream font-bold text-ember" : "text-ink hover:bg-cream"
                }`}
              >
                <Flag className="h-4 w-[26px] shrink-0 overflow-hidden rounded-[2px]" />
                <span className="flex-1">{option.name}</span>
                <span className="text-xs text-ink-400">{option.currency}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
