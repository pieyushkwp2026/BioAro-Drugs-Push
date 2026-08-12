import { ChevronDown } from "lucide-react";
import { useState } from "react";

export interface AccordionItemData {
  title: string;
  body: string;
}

export default function AccordionGroup({ items }: { items: AccordionItemData[] }) {
  const [openItem, setOpenItem] = useState<number>(0);

  return (
    <div className="glass-card divide-y divide-ink/5 overflow-hidden">
      {items.map((item, index) => {
        const isOpen = openItem === index;
        return (
          <div key={item.title} className="px-6">
            <button
              onClick={() => setOpenItem(isOpen ? -1 : index)}
              className="flex w-full items-center justify-between gap-4 py-4 text-left text-sm font-medium"
            >
              <span>{item.title}</span>
              <ChevronDown size={16} className={`shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`} />
            </button>
            {isOpen && <p className="pb-4 text-sm leading-relaxed text-ink/55">{item.body}</p>}
          </div>
        );
      })}
    </div>
  );
}
