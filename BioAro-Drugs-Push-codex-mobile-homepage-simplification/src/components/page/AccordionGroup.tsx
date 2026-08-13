import { ChevronDown } from "lucide-react";
import { useState } from "react";

export interface AccordionItemData {
  title: string;
  body: string;
}

export default function AccordionGroup({ items }: { items: AccordionItemData[] }) {
  const [openItem, setOpenItem] = useState<number>(0);

  return (
    <div className="divide-y divide-line overflow-hidden rounded-[24px] border border-line bg-white shadow-glass">
      {items.map((item, index) => {
        const isOpen = openItem === index;
        return (
          <div key={item.title} className="px-7">
            <button
              type="button"
              aria-expanded={isOpen}
              onClick={() => setOpenItem(isOpen ? -1 : index)}
              className="flex w-full items-center justify-between gap-4 rounded-xl py-5 text-left text-[16px] font-bold tracking-[-0.015em] text-ink transition-colors hover:text-ember focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ember"
            >
              <span>{item.title}</span>
              <ChevronDown size={18} strokeWidth={2.2} className={`shrink-0 text-ink-400 transition-transform ${isOpen ? "rotate-180" : ""}`} />
            </button>
            {isOpen && <p className="max-w-[62ch] text-pretty pb-6 text-[15.5px] leading-[1.65] text-ink-600">{item.body}</p>}
          </div>
        );
      })}
    </div>
  );
}
