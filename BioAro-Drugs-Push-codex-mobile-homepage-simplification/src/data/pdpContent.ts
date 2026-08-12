export interface ComparisonRow {
  label: string;
  bioaro: string;
  typical: string;
}

export const COMPARISON_ROWS: ComparisonRow[] = [
  { label: "Clinically dosed", bioaro: "Clinically dosed", typical: "Proprietary blends" },
  { label: "Transparent labels", bioaro: "Transparent labels", typical: "Hidden doses" },
  { label: "Third-party tested", bioaro: "Third-party tested", typical: "Rarely verified" },
  { label: "Evidence-backed", bioaro: "Evidence-backed", typical: "Marketing-led" },
  { label: "Targeted outcomes", bioaro: "Targeted outcomes", typical: "Generic vitamins" },
];

export interface Testimonial {
  initials: string;
  name: string;
  location: string;
  quote: string;
}

export const TESTIMONIALS: Testimonial[] = [
  { initials: "RS", name: "Rohan S.", location: "Bengaluru, India", quote: "I've been building this into my daily routine for a few weeks and it's an easy habit to stick with." },
  { initials: "AM", name: "Ananya M.", location: "Mumbai, India", quote: "Simple to take and it's become part of my daily routine without any hassle." },
  { initials: "KP", name: "Karan P.", location: "Pune, India", quote: "Straightforward dosing and a label I can actually understand. That matters to me." },
];

export const FEATURED_TESTIMONIAL: Testimonial = {
  initials: "VA",
  name: "Vikram A.",
  location: "Entrepreneur · 3 months",
  quote: "Helps me stay consistent with a routine that actually fits my day.",
};
