import { Activity, Brain, Microscope, ShieldCheck } from "lucide-react";
import { CTASection } from "@/components/offerings/CTASection";
import { Hero } from "@/components/offerings/Hero";
import { LabDirectory } from "@/components/offerings/LabDirectory";
import { LivingFlow } from "@/components/offerings/LivingFlow";
import { OfferingCards } from "@/components/offerings/OfferingCards";
import { ProductCarousel } from "@/components/offerings/ProductCarousel";
import { WhyBioAro } from "@/components/offerings/WhyBioAro";
import { PrimaryButton } from "@/components/ui/Buttons";
import { SectionShell } from "@/components/ui/SectionShell";
import { BIOARO_DRUGS_URL, OFFERINGS_DRUGS_SECTION, OFFERINGS_LABS_SECTION } from "@/data/navigation";

export default function OurOfferingsPage() {
  return (
    <>
      <Hero />
      <OfferingCards />

      <SectionShell
        id="labs-overview"
        label="BioAro Labs"
        title={OFFERINGS_LABS_SECTION.title}
        description={OFFERINGS_LABS_SECTION.description}
        className="bg-section-radial"
      >
        <div className="mb-16 grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {OFFERINGS_LABS_SECTION.capabilityPoints.map((point, index) => {
            const icons = [Microscope, ShieldCheck, Brain, Activity];
            const Icon = icons[index];
            return (
              <div key={point.title} className="border-t border-white/[0.09] pt-6">
                <Icon className="h-5 w-5 text-bioaro-soft" />
                <h3 className="mt-5 text-lg font-semibold text-white">{point.title}</h3>
                <p className="mt-2.5 text-sm leading-7 text-bioaro-muted">{point.description}</p>
              </div>
            );
          })}
        </div>
        <LabDirectory />
      </SectionShell>

      <SectionShell
        id="drugs-overview"
        label="BioAro Drugs"
        title={OFFERINGS_DRUGS_SECTION.title}
        description={OFFERINGS_DRUGS_SECTION.description}
        className="bg-bioaro-bg"
      >
        <div className="mb-8 flex flex-col gap-4 border-b border-white/[0.07] pb-8 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-bioaro-soft/70">
              Drugs destination
            </p>
            <p className="mt-3 text-sm leading-7 text-bioaro-muted md:text-base">
              {OFFERINGS_DRUGS_SECTION.bridge}
            </p>
          </div>
          <PrimaryButton href={BIOARO_DRUGS_URL}>Learn More</PrimaryButton>
        </div>
        <ProductCarousel />
      </SectionShell>

      <WhyBioAro />
      <LivingFlow />
      <CTASection />
    </>
  );
}
