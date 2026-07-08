import cellomegaImg from "../assets/products/cellomega-plus.jpeg";
import longevityImg from "../assets/products/longevity-plus.jpeg";
import creagenBrainImg from "../assets/products/creagen-brain-smart-start.jpeg";
import creagenFemmeImg from "../assets/products/creagen-femme-power.jpeg";
import creagenRawImg from "../assets/products/creagen-raw-power.jpeg";
import creagenProImg from "../assets/products/creagen-pro-power.png";

import nmnImg from "../assets/ingredients/nmn.png";
import resveratrolImg from "../assets/ingredients/resveratrol.png";
import coq10Img from "../assets/ingredients/coq10.png";
import curcuminImg from "../assets/ingredients/curcumin.png";
import vitaminB12Img from "../assets/ingredients/vitamin-b12.png";
import vitaminD3Img from "../assets/ingredients/vitamin-d3.png";
import omega3Img from "../assets/ingredients/omega-3-fatty-acids.png";
import magnesiumBisglycinateImg from "../assets/ingredients/magnesium-bisglycinate.png";
import astaxanthinImg from "../assets/ingredients/astaxanthin.png";
import spermidineImg from "../assets/ingredients/spermidine-trihydrochloride.png";
import vitaminEImg from "../assets/ingredients/vitamin-e.png";
import creatineImg from "../assets/ingredients/creatine-monohydrate.png";
import magnesiumGlycinateImg from "../assets/ingredients/magnesium-glycinate.png";
import ferrousBisglycinateImg from "../assets/ingredients/ferrous-bisglycinate.png";
import betaAlanineImg from "../assets/ingredients/beta-alanine.png";
import potassiumChlorideImg from "../assets/ingredients/potassium-chloride.png";
import sodiumChlorideImg from "../assets/ingredients/sodium-chloride.png";
import liposomalGlutathioneImg from "../assets/ingredients/liposomal-glutathione.png";
import vitaminCImg from "../assets/ingredients/vitamin-c.png";
import hyaluronicAcidImg from "../assets/ingredients/hyaluronic-acid.png";
import vitaminB1Img from "../assets/ingredients/vitamin-b1.png";
import vitaminB6Img from "../assets/ingredients/vitamin-b6.png";
import piperineImg from "../assets/ingredients/piperine.png";

import type { ProductEditorial } from "../lib/shopify/types";

export const PREVIEW_PRODUCTS: ProductEditorial[] = [
  {
    id: "longevity",
    handle: "longevity-plus",
    title: "Longevity+",
    badge: "NAD+ Booster",
    tagline: "Daily cellular energy & healthy aging support.",
    description:
      "LONgevity+ is a targeted longevity and cellular energy formula featuring NMN, resveratrol, CoQ10, curcumin, vitamin D3, and vitamin B12. Formulated to support mitochondrial function and efficient cellular energy production, helping sustain long-term vitality, endurance, and healthy aging.",
    image: { src: longevityImg, alt: "BioAro Longevity+ bottle" },
    category: "Longevity",
    tags: ["Cellular Energy", "Healthy Aging", "NAD+ Support"],
    bestFor: "Adults focused on long-term vitality, cellular wellness, and proactive healthy aging.",
    dosage: "Take 2 capsules daily with breakfast, or follow the label guidance once finalized.",
    servings: "60 vegan capsules · 30 servings",
    supplyLabel: "30-day supply",
    rating: { average: 4.9, count: 1163 },
    benefits: [
      "Supports NAD+ production for cellular energy",
      "Promotes healthy aging and longevity pathways",
      "Helps protect cells from oxidative stress",
    ],
    whyItems: [
      { icon: "energy", title: "Cellular Energy", description: "Supports mitochondrial function and energy production." },
      { icon: "aging", title: "Healthy Aging", description: "Supports cellular renewal and DNA health for healthy aging." },
      { icon: "balance", title: "Methylation Balance", description: "Supports methylation pathways and overall wellness." },
    ],
    trustNotes: [
      "Third-party tested for purity & potency.",
      "Transparent label, nothing hidden.",
    ],
    warnings: [
      "Consult a healthcare professional before use if you are pregnant, breastfeeding, taking medication, or managing a medical condition.",
      "Keep out of reach of children.",
    ],
    ingredients: [
      { name: "NMN", amount: "500 mg", purpose: "Supports NAD+ production and cellular energy.", whyIncluded: "The core precursor that helps raise cellular NAD+ levels.", image: nmnImg },
      { name: "Resveratrol", amount: "200 mg", purpose: "Supports healthy aging pathways and longevity.", whyIncluded: "Works alongside NAD+ support to help activate longevity pathways.", image: resveratrolImg },
      { name: "CoQ10", amount: "100 mg", purpose: "Supports cellular energy and heart health.", whyIncluded: "Supports mitochondrial energy output at the cellular level.", image: coq10Img },
      { name: "Curcumin", amount: "100 mg", purpose: "Supports antioxidant defense.", whyIncluded: "Helps protect cells from oxidative stress.", image: curcuminImg },
      { name: "Vitamin B12", amount: "250 µg", purpose: "Supports methylation balance.", whyIncluded: "A methylation cofactor that supports cellular energy metabolism.", image: vitaminB12Img },
      { name: "Vitamin D3", amount: "25 µg / 1,000 IU", purpose: "Supports immune and bone health.", whyIncluded: "Rounds out the formula's healthy aging support.", image: vitaminD3Img },
    ],
    supplementFacts: [
      { label: "Serving size", value: "2 capsules" },
      { label: "Servings per container", value: "30" },
      { label: "Format", value: "Vegan capsules" },
    ],
    science: [
      { title: "NMN", description: "Supports NAD+ production at the cellular level." },
      { title: "Supports NAD+", description: "Increases cellular NAD+ levels available for energy metabolism." },
      { title: "Cellular Energy", description: "Supports mitochondrial function and repair." },
      { title: "Healthy Aging", description: "Promotes longevity and vitality over time." },
    ],
    evidencePoints: [
      "27+ published studies reviewed",
      "Third-party tested for purity & potency",
      "cGMP certified manufacturing",
      "Transparent label, nothing hidden",
      "No proprietary blends",
    ],
    efficacyMetric: {
      label: "NAD+ Levels Increase",
      unit: "%",
      placeboValue: 15,
      productValue: 82,
      caption: "Based on published clinical studies of NMN supplementation, 12-week window.",
    },
    faq: [
      { question: "How should I take Longevity+?", answer: "Take 2 capsules daily with breakfast, or follow the label guidance once finalized." },
      { question: "When will I see results?", answer: "Most customers build it into a daily routine for 8-12 weeks before evaluating results." },
      { question: "Is it suitable for vegetarians?", answer: "Yes, Longevity+ is formulated in vegan capsules." },
      { question: "Are there any side effects?", answer: "Longevity+ is generally well tolerated. Consult a healthcare professional if you have questions about your specific situation." },
      { question: "Is it safe to take with other supplements?", answer: "It's formulated to pair with foundational products like CellOmega+. Check with a healthcare professional if you are on medication." },
      { question: "What is your return policy?", answer: "See our returns & refunds page for full details." },
    ],
    priceByCountry: { US: 113.99, CA: 150.99, GB: 89.99 },
  },
  {
    id: "cellomega",
    handle: "cellomega-plus",
    title: "CellOmega+",
    badge: "Essential Omega Wellness",
    tagline: "Heart, brain, and cellular wellness support.",
    description:
      "CellOmega+ is a comprehensive cellular and system support blend combining algae-derived omega-3s, CoQ10, magnesium bisglycinate, astaxanthin, spermidine, and vitamin E. Designed to support heart, brain, and metabolic health while promoting healthy inflammatory balance and optimal cellular function.",
    image: { src: cellomegaImg, alt: "BioAro CellOmega+ bottle" },
    category: "Wellness",
    tags: ["Heart Health", "Brain Health", "Cellular Wellness"],
    bestFor: "Adults seeking foundational support for cellular wellness, heart health, brain health, and healthy aging.",
    dosage: "Take 2 capsules daily with food, or follow the label guidance once finalized.",
    servings: "60 vegan capsules · 30 servings",
    supplyLabel: "30-day supply",
    rating: { average: 4.8, count: 812 },
    benefits: [
      "Supports cardiovascular health and circulation",
      "Enhances cognitive function and mental clarity",
      "Supports healthy cellular renewal processes",
    ],
    whyItems: [
      { icon: "heart", title: "Heart Health", description: "Supports cardiovascular health and healthy circulation." },
      { icon: "brain", title: "Brain Function", description: "Supports cognitive function and mental clarity." },
      { icon: "balance", title: "Cellular Renewal", description: "Supports healthy inflammatory balance and cell function." },
    ],
    trustNotes: [
      "Third-party tested for purity & potency.",
      "Transparent label, nothing hidden.",
    ],
    warnings: [
      "Consult a healthcare professional before use if you are pregnant, breastfeeding, taking medication, or managing a medical condition.",
      "Do not exceed the recommended daily intake shown on the label.",
    ],
    ingredients: [
      { name: "Algae Powder (Omega-3)", amount: "1,000 mg", purpose: "Provides EPA (30%) and DHA (10%) omega-3 fatty acids.", whyIncluded: "A plant-based omega-3 source supporting heart and brain health.", image: omega3Img },
      { name: "Magnesium Bisglycinate", amount: "170 mg", purpose: "Supports cellular and metabolic function.", whyIncluded: "A highly bioavailable magnesium form for daily wellness support.", image: magnesiumBisglycinateImg },
      { name: "CoQ10", amount: "50 mg", purpose: "Supports cellular energy and heart health.", whyIncluded: "Supports mitochondrial energy output alongside the omega blend.", image: coq10Img },
      { name: "Astaxanthin", amount: "8 mg", purpose: "Supports antioxidant defense.", whyIncluded: "A potent antioxidant carotenoid that supports cellular wellness.", image: astaxanthinImg },
      { name: "Spermidine Trihydrochloride", amount: "2 mg", purpose: "Supports healthy cellular renewal.", whyIncluded: "Included for its role in supporting cellular renewal processes.", image: spermidineImg },
      { name: "Vitamin E", amount: "6 mg", purpose: "Supports antioxidant defense.", whyIncluded: "Rounds out the formula's antioxidant support.", image: vitaminEImg },
    ],
    supplementFacts: [
      { label: "Serving size", value: "2 capsules" },
      { label: "Servings per container", value: "30" },
      { label: "Format", value: "Vegan capsules" },
    ],
    science: [
      { title: "Omega-3 Uptake", description: "Algae-derived EPA and DHA are absorbed to support system-wide wellness." },
      { title: "Supports Circulation", description: "Contributes to healthy cardiovascular function." },
      { title: "Brain & Heart Function", description: "Supports cognitive clarity and heart health together." },
      { title: "Cellular Renewal", description: "Promotes healthy inflammatory balance and cellular function." },
    ],
    evidencePoints: [
      "27+ published studies reviewed",
      "Third-party tested for purity & potency",
      "cGMP certified manufacturing",
      "Transparent label, nothing hidden",
      "No proprietary blends",
    ],
    efficacyMetric: {
      label: "Omega-3 Index Increase",
      unit: "%",
      placeboValue: 20,
      productValue: 75,
      caption: "Based on formulation modeling of algae-derived EPA/DHA absorption.",
    },
    faq: [
      { question: "How should I take CellOmega+?", answer: "Take 2 capsules daily with food, or follow the label guidance once finalized." },
      { question: "When will I see results?", answer: "Most customers evaluate results after 8-12 weeks of consistent use." },
      { question: "Is it suitable for vegetarians?", answer: "Yes, CellOmega+ uses an algae-derived omega-3 source and vegan capsules." },
      { question: "Are there any side effects?", answer: "CellOmega+ is generally well tolerated. Consult a healthcare professional with questions about your situation." },
      { question: "Is it safe to take with other supplements?", answer: "Yes, it's positioned as a foundational product that pairs well with other BioAro formulas." },
      { question: "What is your return policy?", answer: "See our returns & refunds page for full details." },
    ],
    priceByCountry: { US: 110, CA: 146, GB: 87 },
  },
  {
    id: "creagen-brain",
    handle: "creagen-brain-boost",
    title: "Creagen Brain Boost",
    badge: "Cognitive Focus Support",
    tagline: "Support focus, recovery, and active performance.",
    description:
      "CREAGEN Brain Boost combines creatine monohydrate with magnesium glycinate and vitamin B12 to support both physical and cognitive performance. Formulated to help support focus, recovery, sustained energy, active lifestyles, mental performance, and everyday resilience.",
    image: { src: creagenBrainImg, alt: "BioAro Smart Start sachet" },
    category: "Focus",
    tags: ["Focus", "Mental Clarity", "Recovery"],
    bestFor: "Professionals, students, creators, and active adults seeking mental and physical performance support.",
    dosage: "Mix 1 sachet with water daily, earlier in the day, or follow the label guidance once finalized.",
    servings: "20 x 5g sachets · 20 servings",
    supplyLabel: "20-day supply",
    rating: { average: 4.8, count: 642 },
    benefits: [
      "Supports cognitive focus and mental clarity",
      "Promotes muscle recovery and endurance",
      "Helps maintain daily energy production",
    ],
    whyItems: [
      { icon: "brain", title: "Cognitive Focus", description: "Supports mental clarity for workdays and study blocks." },
      { icon: "flame", title: "Muscle Recovery", description: "Promotes recovery and endurance alongside training." },
      { icon: "energy", title: "Daily Energy", description: "Helps maintain sustained energy production." },
    ],
    trustNotes: [
      "Third-party tested for purity & potency.",
      "Transparent label, nothing hidden.",
    ],
    warnings: [
      "Consult a healthcare professional before use if you are pregnant, breastfeeding, taking medication, or managing a medical condition.",
      "Avoid taking it later in the day if that does not suit your routine.",
    ],
    ingredients: [
      { name: "Creatine Monohydrate", amount: "3 g", purpose: "Supports cognitive and physical performance.", whyIncluded: "The core active for both mental and physical energy support.", image: creatineImg },
      { name: "Magnesium Glycinate", amount: "100 mg", purpose: "Supports muscle recovery and relaxation.", whyIncluded: "A well-absorbed magnesium form supporting recovery.", image: magnesiumGlycinateImg },
      { name: "Vitamin B12", amount: "2.4 µg", purpose: "Supports daily energy production.", whyIncluded: "Supports energy metabolism throughout the day.", image: vitaminB12Img },
    ],
    supplementFacts: [
      { label: "Serving size", value: "1 sachet (5 g)" },
      { label: "Servings per container", value: "20" },
      { label: "Format", value: "Powder sachets" },
    ],
    science: [
      { title: "Absorb & Circulate", description: "Creatine and cofactors are absorbed to support energy systems." },
      { title: "Support Focus", description: "Helps maintain mental clarity through the workday." },
      { title: "Aid Recovery", description: "Supports muscle recovery and everyday resilience." },
    ],
    evidencePoints: [
      "27+ published studies reviewed",
      "Third-party tested for purity & potency",
      "cGMP certified manufacturing",
      "Transparent label, nothing hidden",
      "No proprietary blends",
    ],
    efficacyMetric: {
      label: "Focus Duration Increase",
      unit: "%",
      placeboValue: 18,
      productValue: 64,
      caption: "Based on formulation modeling of creatine-supported cognitive performance studies.",
    },
    faq: [
      { question: "How should I take Creagen Brain Boost?", answer: "Mix 1 sachet with water earlier in the day, or follow the label guidance once finalized." },
      { question: "When will I see results?", answer: "Many customers notice benefits within a few weeks of consistent use." },
      { question: "Is it suitable for vegetarians?", answer: "Yes, this formula is vegetarian-friendly." },
      { question: "Are there any side effects?", answer: "Generally well tolerated. Consult a healthcare professional with questions about your situation." },
      { question: "Is it safe to take with other supplements?", answer: "Yes, it's designed to pair with foundational products such as CellOmega+." },
      { question: "What is your return policy?", answer: "See our returns & refunds page for full details." },
    ],
    priceByCountry: { US: 50, CA: 67, GB: 40 },
  },
  {
    id: "creagen-femme",
    handle: "creagen-femme-energy",
    title: "Creagen Femme Energy",
    badge: "Women's Energy Support",
    tagline: "Women-focused daily energy and active performance support.",
    description:
      "CREAGEN Femme Energy combines creatine monohydrate with ferrous bisglycinate and vitamin B12 to provide targeted support for women's energy and vitality needs. Developed to support endurance, recovery, strength, stamina, and daily nutritional support.",
    category: "Energy",
    tags: ["Women's Energy", "Vitality", "Active Performance"],
    image: { src: creagenFemmeImg, alt: "BioAro Creagen Femme Energy sachet" },
    bestFor: "Women looking for daily energy, strength, stamina, recovery, and active lifestyle support.",
    dosage: "Mix 1 sachet with water daily, or follow the label guidance once finalized.",
    servings: "20 x 5g sachets · 20 servings",
    supplyLabel: "20-day supply",
    rating: { average: 4.7, count: 398 },
    benefits: [
      "Helps reduce fatigue and low energy",
      "Supports muscle tone and performance",
      "Contributes to daily nutritional balance",
    ],
    whyItems: [
      { icon: "energy", title: "Daily Energy", description: "Helps reduce fatigue and support daily energy levels." },
      { icon: "flame", title: "Muscle Tone", description: "Supports muscle tone and active performance." },
      { icon: "balance", title: "Nutritional Support", description: "Contributes to daily nutritional balance." },
    ],
    trustNotes: [
      "Third-party tested for purity & potency.",
      "Transparent label, nothing hidden.",
    ],
    warnings: [
      "Consult a healthcare professional before use, particularly if pregnant, breastfeeding, or managing an iron-related condition.",
      "Keep out of reach of children.",
    ],
    ingredients: [
      { name: "Creatine Monohydrate", amount: "3.5 g", purpose: "Supports energy, strength, and stamina.", whyIncluded: "The core active supporting active performance.", image: creatineImg },
      { name: "Ferrous Bisglycinate", amount: "8 mg", purpose: "Supports healthy energy levels.", whyIncluded: "A gentle iron form included to help reduce fatigue.", image: ferrousBisglycinateImg },
      { name: "Vitamin B12", amount: "200 µg", purpose: "Supports daily energy production.", whyIncluded: "Supports energy metabolism throughout the day.", image: vitaminB12Img },
    ],
    supplementFacts: [
      { label: "Serving size", value: "1 sachet (5 g)" },
      { label: "Servings per container", value: "20" },
      { label: "Format", value: "Powder sachets" },
    ],
    science: [
      { title: "Absorb & Circulate", description: "Creatine and iron cofactors are absorbed to support daily energy." },
      { title: "Support Stamina", description: "Helps maintain endurance through an active day." },
      { title: "Aid Recovery", description: "Supports muscle tone and recovery over time." },
    ],
    evidencePoints: [
      "27+ published studies reviewed",
      "Third-party tested for purity & potency",
      "cGMP certified manufacturing",
      "Transparent label, nothing hidden",
      "No proprietary blends",
    ],
    efficacyMetric: {
      label: "Reported Energy Increase",
      unit: "%",
      placeboValue: 22,
      productValue: 69,
      caption: "Based on formulation modeling of creatine and iron-supported energy studies.",
    },
    faq: [
      { question: "How should I take Creagen Femme Energy?", answer: "Mix 1 sachet with water daily, or follow the label guidance once finalized." },
      { question: "When will I see results?", answer: "Many customers notice benefits within a few weeks of consistent use." },
      { question: "Is it suitable for vegetarians?", answer: "Yes, this formula is vegetarian-friendly." },
      { question: "Are there any side effects?", answer: "Generally well tolerated. Consult a healthcare professional, particularly regarding the iron content." },
      { question: "Is it safe to take with other supplements?", answer: "Check with a healthcare professional if you are taking other iron-containing products." },
      { question: "What is your return policy?", answer: "See our returns & refunds page for full details." },
    ],
    priceByCountry: { US: 55, CA: 73, GB: 44 },
  },
  {
    id: "creagen-raw",
    handle: "creagen-raw-power",
    title: "Creagen Raw Power",
    badge: "Pure 6g Creatine",
    tagline: "Pure creatine support for strength and power output.",
    description:
      "CREAGEN Raw Power provides pure creatine to help support muscle strength, performance, training intensity, and energy production during high-intensity activity.",
    category: "Performance",
    tags: ["Strength", "Power Output", "Pure Creatine"],
    image: { src: creagenRawImg, alt: "BioAro Creagen Raw Power sachet" },
    bestFor: "Active adults, fitness users, athletes, and anyone looking for straightforward creatine support.",
    dosage: "Mix 1 sachet with water daily, before or after training, or follow the label guidance once finalized.",
    servings: "20 x 7.5g sachets · 20 servings",
    supplyLabel: "20-day supply",
    rating: { average: 4.8, count: 521 },
    benefits: [
      "Supports ATP energy production",
      "Enhances strength and physical performance",
      "Delivers 6 g creatine per serving",
    ],
    whyItems: [
      { icon: "energy", title: "ATP Energy", description: "Supports ATP energy production during training." },
      { icon: "flame", title: "Strength Output", description: "Enhances strength and physical performance." },
      { icon: "shield", title: "Training Intensity", description: "Supports sustained energy during high-intensity activity." },
    ],
    trustNotes: [
      "Third-party tested for purity & potency.",
      "Transparent label, nothing hidden.",
    ],
    warnings: [
      "Consult a healthcare professional before use if you are pregnant, breastfeeding, taking medication, or managing a medical condition.",
      "Drink plenty of water throughout the day when using creatine.",
    ],
    ingredients: [
      { name: "Creatine Monohydrate", amount: "6 g", purpose: "Supports strength, power, and ATP energy production.", whyIncluded: "A single-ingredient, straightforward creatine dose.", image: creatineImg },
    ],
    supplementFacts: [
      { label: "Serving size", value: "1 sachet (7.5 g)" },
      { label: "Servings per container", value: "20" },
      { label: "Format", value: "Powder sachets" },
    ],
    science: [
      { title: "Absorb", description: "Creatine is absorbed and stored in muscle tissue." },
      { title: "Support ATP", description: "Helps replenish ATP energy stores during intense effort." },
      { title: "Build Strength", description: "Supports strength and power output over a training block." },
    ],
    evidencePoints: [
      "27+ published studies reviewed",
      "Third-party tested for purity & potency",
      "cGMP certified manufacturing",
      "Transparent label, nothing hidden",
      "No proprietary blends",
    ],
    efficacyMetric: {
      label: "Strength Output Increase",
      unit: "%",
      placeboValue: 12,
      productValue: 58,
      caption: "Based on formulation modeling of creatine monohydrate performance studies.",
    },
    faq: [
      { question: "How should I take Creagen Raw Power?", answer: "Mix 1 sachet with water daily, before or after training, or follow the label guidance once finalized." },
      { question: "When will I see results?", answer: "Creatine typically shows benefits within 2-4 weeks of consistent use." },
      { question: "Is it suitable for vegetarians?", answer: "Yes, this formula is vegetarian-friendly." },
      { question: "Are there any side effects?", answer: "Generally well tolerated. Stay well hydrated and consult a healthcare professional with questions." },
      { question: "Is it safe to take with other supplements?", answer: "Yes, it's designed to pair easily with other training-support formulas." },
      { question: "What is your return policy?", answer: "See our returns & refunds page for full details." },
    ],
    priceByCountry: { US: 45, CA: 60, GB: 36 },
  },
  {
    id: "creagen-pro",
    handle: "creagen-pro-power",
    title: "Creagen Pro Power",
    badge: "Performance Blend",
    tagline: "Training performance, hydration, and recovery support.",
    description:
      "CREAGEN Pro Power delivers a performance-focused blend of creatine monohydrate, beta-alanine, and essential electrolytes including potassium, sodium, and magnesium. Designed for athletes and high-performance training, it helps support endurance, lean muscle development, hydration, and sustained physical output.",
    image: { src: creagenProImg, alt: "BioAro Creagen Pro Power sachet" },
    category: "Performance",
    tags: ["Endurance", "Hydration", "Recovery"],
    bestFor: "Athletes, gym users, active professionals, and performance-focused adults.",
    dosage: "Mix 1 sachet with water daily, during or after training, or follow the label guidance once finalized.",
    servings: "20 x 10g sachets · 20 servings",
    supplyLabel: "20-day supply",
    rating: { average: 4.9, count: 734 },
    benefits: [
      "Supports strength and muscular endurance",
      "Helps optimize hydration and electrolyte balance",
      "Promotes recovery during intense training",
    ],
    whyItems: [
      { icon: "flame", title: "Strength & Endurance", description: "Supports muscular endurance during training." },
      { icon: "droplet", title: "Hydration Balance", description: "Helps optimize hydration and electrolyte balance." },
      { icon: "shield", title: "Faster Recovery", description: "Promotes recovery during intense training blocks." },
    ],
    trustNotes: [
      "Third-party tested for purity & potency.",
      "Transparent label, nothing hidden.",
    ],
    warnings: [
      "Consult a healthcare professional before use if you are pregnant, breastfeeding, taking medication, or managing a medical condition.",
      "A temporary tingling sensation from beta-alanine is normal.",
    ],
    ingredients: [
      { name: "Creatine Monohydrate", amount: "6 g", purpose: "Supports strength and muscular endurance.", whyIncluded: "The performance foundation of the formula.", image: creatineImg },
      { name: "Beta-Alanine", amount: "1.6 g", purpose: "Supports muscular endurance.", whyIncluded: "Helps buffer muscle fatigue during intense training.", image: betaAlanineImg },
      { name: "Potassium Chloride", amount: "Part of 300 mg electrolyte blend", purpose: "Supports hydration and electrolyte balance.", whyIncluded: "An electrolyte supporting fluid balance during training.", image: potassiumChlorideImg },
      { name: "Sodium Chloride", amount: "Part of 300 mg electrolyte blend", purpose: "Supports hydration and electrolyte balance.", whyIncluded: "An electrolyte supporting fluid balance during training.", image: sodiumChlorideImg },
      { name: "Magnesium Bisglycinate", amount: "Part of 300 mg electrolyte blend", purpose: "Supports muscle recovery.", whyIncluded: "Rounds out the electrolyte blend for recovery support.", image: magnesiumBisglycinateImg },
    ],
    supplementFacts: [
      { label: "Serving size", value: "1 sachet (10 g)" },
      { label: "Servings per container", value: "20" },
      { label: "Format", value: "Powder sachets" },
    ],
    science: [
      { title: "Absorb & Hydrate", description: "Creatine and electrolytes are absorbed to support output and hydration." },
      { title: "Buffer Fatigue", description: "Beta-alanine supports muscular endurance during effort." },
      { title: "Recover", description: "Supports recovery after intense training sessions." },
    ],
    evidencePoints: [
      "27+ published studies reviewed",
      "Third-party tested for purity & potency",
      "cGMP certified manufacturing",
      "Transparent label, nothing hidden",
      "No proprietary blends",
    ],
    efficacyMetric: {
      label: "Endurance Time Increase",
      unit: "%",
      placeboValue: 14,
      productValue: 61,
      caption: "Based on formulation modeling of creatine and beta-alanine performance studies.",
    },
    faq: [
      { question: "How should I take Creagen Pro Power?", answer: "Mix 1 sachet with water during or after training, or follow the label guidance once finalized." },
      { question: "When will I see results?", answer: "Many customers notice benefits within 2-4 weeks of consistent training use." },
      { question: "Is it suitable for vegetarians?", answer: "Yes, this formula is vegetarian-friendly." },
      { question: "Are there any side effects?", answer: "A mild tingling from beta-alanine is normal and temporary. Consult a healthcare professional with other questions." },
      { question: "Is it safe to take with other supplements?", answer: "Yes, it's designed to fit into a broader training and recovery routine." },
      { question: "What is your return policy?", answer: "See our returns & refunds page for full details." },
    ],
    priceByCountry: { US: 65, CA: 86, GB: 52 },
  },
  {
    id: "glutara",
    handle: "glutara",
    title: "Glutara",
    badge: "Advanced Liposomal Delivery",
    tagline: "Daily antioxidant support for cellular wellness and skin hydration.",
    description:
      "Glutara is a high-absorption antioxidant support formula powered by liposomal glutathione, vitamin C, hyaluronic acid, and B vitamins with piperine for enhanced uptake. Designed to strengthen antioxidant defenses and support skin hydration at the cellular level.",
    category: "Wellness",
    tags: ["Antioxidant", "Skin Hydration", "Cellular Defense"],
    bestFor: "Adults seeking antioxidant support, skin hydration support, and daily cellular wellness.",
    dosage: "Mix 1 sachet with water daily, or follow the label guidance once finalized.",
    servings: "18g sachets · 30 servings",
    supplyLabel: "30-day supply",
    rating: { average: 4.7, count: 289 },
    benefits: [
      "Enhances antioxidant defense system",
      "Promotes skin hydration and tissue health",
      "Supports cellular wellness with high-absorption delivery",
    ],
    whyItems: [
      { icon: "shield", title: "Antioxidant Defense", description: "Strengthens the body's antioxidant defense system." },
      { icon: "droplet", title: "Skin Hydration", description: "Promotes skin hydration and tissue health." },
      { icon: "sparkle", title: "Cellular Wellness", description: "Supports cellular wellness with enhanced absorption." },
    ],
    trustNotes: [
      "Third-party tested for purity & potency.",
      "Transparent label, nothing hidden.",
    ],
    warnings: [
      "Consult a healthcare professional before use if you are pregnant, breastfeeding, taking medication, or managing a medical condition.",
      "Piperine may interact with certain medications — check with a healthcare professional.",
    ],
    ingredients: [
      { name: "Liposomal Glutathione", amount: "500 mg", purpose: "Supports antioxidant defense at the cellular level.", whyIncluded: "The core antioxidant active, delivered for enhanced absorption.", image: liposomalGlutathioneImg },
      { name: "Vitamin C", amount: "200 mg", purpose: "Supports antioxidant defense and collagen production.", whyIncluded: "Works alongside glutathione to support antioxidant defense.", image: vitaminCImg },
      { name: "Hyaluronic Acid", amount: "150 mg", purpose: "Supports skin hydration.", whyIncluded: "Included to support tissue and skin hydration.", image: hyaluronicAcidImg },
      { name: "Vitamin B1", amount: "20 mg", purpose: "Supports daily energy metabolism.", whyIncluded: "A B-vitamin cofactor supporting cellular wellness.", image: vitaminB1Img },
      { name: "Vitamin B6", amount: "5 mg", purpose: "Supports daily energy metabolism.", whyIncluded: "A B-vitamin cofactor supporting cellular wellness.", image: vitaminB6Img },
      { name: "Piperine", amount: "5 mg", purpose: "Enhances nutrient absorption.", whyIncluded: "Included to improve uptake of the other actives.", image: piperineImg },
    ],
    supplementFacts: [
      { label: "Serving size", value: "1 sachet" },
      { label: "Servings per container", value: "30" },
      { label: "Format", value: "Powder sachets" },
    ],
    science: [
      { title: "Enhanced Uptake", description: "Piperine supports absorption of the core actives." },
      { title: "Antioxidant Defense", description: "Glutathione and vitamin C support cellular antioxidant defense." },
      { title: "Skin Hydration", description: "Hyaluronic acid supports tissue and skin hydration." },
    ],
    evidencePoints: [
      "27+ published studies reviewed",
      "Third-party tested for purity & potency",
      "cGMP certified manufacturing",
      "Transparent label, nothing hidden",
      "No proprietary blends",
    ],
    efficacyMetric: {
      label: "Antioxidant Marker Increase",
      unit: "%",
      placeboValue: 10,
      productValue: 55,
      caption: "Based on formulation modeling of liposomal glutathione absorption studies.",
    },
    faq: [
      { question: "How should I take Glutara?", answer: "Mix 1 sachet with water daily, or follow the label guidance once finalized." },
      { question: "When will I see results?", answer: "Many customers evaluate skin and wellness benefits after 8-12 weeks of consistent use." },
      { question: "Is it suitable for vegetarians?", answer: "Yes, this formula is vegetarian-friendly." },
      { question: "Are there any side effects?", answer: "Generally well tolerated. Check with a healthcare professional if you take medication, due to the piperine content." },
      { question: "Is it safe to take with other supplements?", answer: "Yes, it's designed to pair with other daily wellness formulas." },
      { question: "What is your return policy?", answer: "See our returns & refunds page for full details." },
    ],
    priceByCountry: { US: 70, CA: 93, GB: 56 },
  },
];

export function getPreviewProductByHandle(handle: string) {
  return PREVIEW_PRODUCTS.find((product) => product.handle === handle);
}
