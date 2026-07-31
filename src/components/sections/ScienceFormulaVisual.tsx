import { Shield } from "lucide-react";
import type { ProductScienceStep } from "../../lib/shopify/types";

export interface ScienceFormulaVisualProps {
  backgroundImage: string;
  backgroundImageAlt: string;
  backgroundPosition?: string;
  formulaSteps: ProductScienceStep[];
  eyebrow?: string;
  headline?: string;
  className?: string;
}

const DEFAULT_EYEBROW = "Science behind the formula";
const DEFAULT_HEADLINE = "A synergistic blend of clinically studied ingredients working at the cellular level.";

export default function ScienceFormulaVisual({
  backgroundImage,
  backgroundImageAlt,
  backgroundPosition = "center",
  formulaSteps,
  eyebrow = DEFAULT_EYEBROW,
  headline = DEFAULT_HEADLINE,
  className = "",
}: ScienceFormulaVisualProps) {
  return (
    <section
      className={`relative isolate mt-10 overflow-hidden rounded-[36px] border border-white/28 bg-[#f7f2ea] shadow-[0_32px_90px_rgba(27,26,23,0.14)] lg:min-h-[780px] xl:min-h-[820px] ${className}`.trim()}
    >
      <img
        src={backgroundImage}
        alt={backgroundImageAlt}
        className="h-[360px] w-full object-cover sm:h-[420px] md:h-[500px] lg:absolute lg:inset-0 lg:h-full"
        style={{ objectPosition: backgroundPosition }}
      />

      <div className="relative z-10 px-4 pb-4 pt-4 sm:px-5 sm:pb-5 sm:pt-5 md:px-6 md:pb-6 md:pt-6 lg:absolute lg:inset-0 lg:px-0 lg:pb-0 lg:pt-0">
        <div className="mx-auto w-full rounded-[36px] border border-white/42 bg-[linear-gradient(180deg,rgba(247,242,234,0.78),rgba(243,236,224,0.64))] p-[34px_34px_30px] shadow-[0_20px_62px_rgba(58,44,24,0.10)] backdrop-blur-[18px] sm:p-[36px_38px_32px] md:max-w-[88%] md:p-[38px_40px_34px] lg:absolute lg:bottom-12 lg:left-12 lg:mx-0 lg:w-[74%] lg:max-w-[1180px] lg:p-[38px_42px_34px]">
          <div className="max-w-[760px]">
            <span className="eyebrow mb-[18px] block">{eyebrow}</span>
            <h2 className="mb-[24px] text-[clamp(1.75rem,2vw,2.15rem)] leading-tight md:mb-[26px]">
              {headline}
            </h2>
          </div>

          <div className="grid items-stretch gap-[14px] md:grid-cols-2 lg:gap-[16px] xl:grid-cols-4">
            {formulaSteps.map((step) => (
              <div
                key={step.title}
                className="flex h-full min-h-[176px] flex-col rounded-[22px] border border-white/38 bg-[rgba(255,255,255,0.48)] p-[16px_18px_18px] shadow-[0_7px_18px_rgba(45,34,18,0.04)] md:min-h-[182px] xl:min-h-[188px]"
              >
                <div className="mb-[10px] flex h-9 w-9 items-center justify-center rounded-full bg-white/78 text-forest-600 shadow-[inset_0_1px_0_rgba(255,255,255,0.85)]">
                  <Shield size={16} />
                </div>
                <p className="mb-[10px] text-[15px] font-semibold leading-[1.35] tracking-[-0.01em] text-ink/88 md:text-[16px]">
                  {step.title}
                </p>
                <p className="text-[12.5px] leading-[1.45] font-normal text-ink/68 md:text-[13px]">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
