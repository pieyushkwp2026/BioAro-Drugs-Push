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
import { BIOARO_DRUGS_URL } from "@/data/navigation";

const capabilityPoints = [
  {
    title: "50+ Tests",
    icon: Microscope,
    description: "Structured diagnostic breadth across wellness and biomarker discovery.",
  },
  {
    title: "Clinical Grade",
    icon: ShieldCheck,
    description: "Premium testing workflows framed for precision-health interpretation.",
  },
  {
    title: "Advanced Technology",
    icon: Brain,
    description: "Modern testing modalities supporting deeper biological visibility.",
  },
  {
    title: "Actionable Insights",
    icon: Activity,
    description: "Results designed to guide informed next-step health decisions.",
  },
];

export default function OurOfferingsPage() {
  return (
    <>
      <Hero />
      <OfferingCards />

      <SectionShell
        id="labs-overview"
        label="BioAro Labs"
        title="Advanced diagnostics for personalized health intelligence."
        description="Understanding your body is the first step toward improving it. BioAro Labs offers a comprehensive portfolio of advanced diagnostic and wellness tests designed to provide deeper insight into your biology."
        className="bg-section-radial"
      >
        <div className="mb-16 grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {capabilityPoints.map((point) => (
            <div key={point.title} className="border-t border-white/[0.09] pt-6">
              <point.icon className="h-5 w-5 text-bioaro-soft" />
              <h3 className="mt-5 text-lg font-semibold text-white">{point.title}</h3>
              <p className="mt-2.5 text-sm leading-7 text-bioaro-muted">{point.description}</p>
            </div>
          ))}
        </div>
        <LabDirectory />
      </SectionShell>

      <SectionShell
        id="drugs-overview"
        label="BioAro Drugs"
        title="Science-backed wellness formulas for everyday performance."
        description="Targeted bioactive wellness products developed to support longevity, energy, recovery, focus, sleep, antioxidant protection, and cellular health — designed to help you build better daily health through evidence-informed nutrition."
        className="bg-bioaro-bg"
      >
        <div className="mb-8 flex flex-col gap-4 border-b border-white/[0.07] pb-8 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-bioaro-soft/70">
              Drugs destination
            </p>
            <p className="mt-3 text-sm leading-7 text-bioaro-muted md:text-base">
              Explore the full BioAro Drugs page for a clearer view of the product lane, scientific
              positioning, and category-level storytelling.
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
