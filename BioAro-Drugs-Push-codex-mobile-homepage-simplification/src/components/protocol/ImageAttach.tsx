import { useRef, useState } from "react";
import { Plus, X } from "lucide-react";
import { AI_SECTION } from "../../data/homepage";
import type { ImageIntent } from "../../lib/assistant/turns";

/*
 * Attaching a photo.
 *
 * ---------------------------------------------------------------------------
 * THE FILE DOES NOT GO ANYWHERE
 *
 * `URL.createObjectURL` and nothing else: no fetch, no FormData, no storage. The blob
 * lives in this tab until the thread is cleared, and the provider revokes it then. That
 * is not a limitation to apologise for — it is the only reason this control can exist
 * at all today, because a prescription photograph is protected health information and
 * this application has no server, no BAA and nowhere lawful to put one.
 *
 * The intent is asked BEFORE the picker opens, so the privacy line a visitor reads is
 * the one that applies to what they are about to attach. Asking afterwards would show
 * a prescription warning to somebody photographing a vitamin bottle, and — worse —
 * would show nothing to somebody who had already attached a prescription.
 * ---------------------------------------------------------------------------
 */
export default function ImageAttach({
  onAttach,
}: {
  onAttach: (intent: ImageIntent, previewUrl: string, name: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [intent, setIntent] = useState<ImageIntent | null>(null);
  const [open, setOpen] = useState(false);

  const pick = (next: ImageIntent) => {
    setIntent(next);
    setOpen(false);
    /* The picker must be opened from within the click that chose the intent, or Safari
       treats it as untrusted and silently does nothing. */
    inputRef.current?.click();
  };

  return (
    <div className="relative">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file && intent) onAttach(intent, URL.createObjectURL(file), file.name);
          /* Reset so the same file can be chosen twice in a row. */
          event.target.value = "";
        }}
      />

      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-label={AI_SECTION.attachLabel}
        className="flex h-10 w-10 items-center justify-center rounded-full border border-line bg-white text-ink-600 transition-colors hover:border-ember hover:text-ember focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ember"
      >
        {open ? <X size={16} strokeWidth={2.2} /> : <Plus size={17} strokeWidth={2.2} />}
      </button>

      {open && (
        <div className="absolute bottom-12 left-0 z-20 w-[260px] rounded-[18px] border border-line bg-white p-2 shadow-glass-lg">
          {(["label", "prescription"] as const).map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => pick(value)}
              className="block w-full rounded-[12px] px-3 py-2.5 text-left text-[14px] font-bold text-ink transition-colors hover:bg-cream-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ember"
            >
              {value === "label" ? AI_SECTION.attachIntentLabel : AI_SECTION.attachIntentPrescription}
            </button>
          ))}
          <p className="px-3 py-2 text-[11.5px] leading-[1.5] text-ink-400">
            {AI_SECTION.attachPrivacy}
          </p>
        </div>
      )}
    </div>
  );
}
