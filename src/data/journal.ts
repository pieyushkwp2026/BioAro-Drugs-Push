import journalBioactives from "../assets/journal/journal-bioactives.png";
import journalMorningLongevityStack from "../assets/journal/journal-morning-longevity-stack.png";
import journalProtocolPages from "../assets/journal/journal-protocol-pages.png";
import journalWorkdayFocus from "../assets/journal/journal-workday-focus.png";
import journalSleepCategory from "../assets/journal/journal-sleep-category.png";
import journalQualityDocumentation from "../assets/journal/journal-quality-documentation.png";

export interface JournalArticle {
  cat: string;
  title: string;
  excerpt: string;
  readTime: string;
  img: string;
  alt: string;
}

export const JOURNAL_ARTICLES: JournalArticle[] = [
  {
    cat: "Foundations",
    title: "What are bioactives?",
    excerpt: "A plain-language starting point for understanding how BioAro frames modern wellness products.",
    readTime: "6 min read",
    img: journalBioactives,
    alt: "Bioactive supplement bottles arranged on a stone pedestal with subtle molecular details",
  },
  {
    cat: "Protocols",
    title: "The Morning Longevity Stack",
    excerpt: "A look at how protocol-led storytelling helps customers understand what belongs together.",
    readTime: "8 min read",
    img: journalMorningLongevityStack,
    alt: "Soft scientific longevity visual with DNA-inspired forms and wellness icon",
  },
  {
    cat: "Recovery",
    title: "Why protocol pages matter",
    excerpt: "How a recovery routine becomes easier to follow when timing, purpose, and pairing are made explicit.",
    readTime: "10 min read",
    img: journalProtocolPages,
    alt: "Athletic runner in motion representing recovery and protocol-led routines",
  },
  {
    cat: "Focus",
    title: "Building a workday routine",
    excerpt: "Using product detail pages and FAQs to make focus-oriented product choices more grounded.",
    readTime: "7 min read",
    img: journalWorkdayFocus,
    alt: "Abstract focus visual with neural forms in soft green and ivory tones",
  },
  {
    cat: "Sleep",
    title: "Planning the next category",
    excerpt: "How the sleep pillar will complete the broader Living 2.0 system over time.",
    readTime: "9 min read",
    img: journalSleepCategory,
    alt: "Calm sleep editorial image with soft moonlight and restorative wellness mood",
  },
  {
    cat: "Quality",
    title: "Why documentation deserves a page",
    excerpt: "Trust grows when quality information has a clear destination in the customer journey.",
    readTime: "5 min read",
    img: journalQualityDocumentation,
    alt: "Supplement quality and documentation visual with product and science-backed details",
  },
];
