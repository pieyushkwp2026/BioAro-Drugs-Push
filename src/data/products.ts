import creagenRawImg from "../assets/products/creagen-raw-power.jpeg";
import creagenProImg from "../assets/products/creagen-pro-power.png";
import cellomegaPrimaryImg from "../assets/products/cellomega-plus-primary.png";
import longevityPrimaryImg from "../assets/products/longevity-plus-primary.png";
import creagenBrainPrimaryImg from "../assets/products/creagen-brain-boost-primary.png";
import creagenFemmePrimaryImg from "../assets/products/creagen-femme-energy-primary.png";
import glutaraPrimaryImg from "../assets/products/glutara-primary.png";

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
    title: "LONgevity+",
    badge: "NAD+ Booster",
    tagline: "Supports healthy ageing and everyday vitality.",
    description:
      "Daily wellness formula designed to support healthy ageing and cellular energy, featuring NMN, resveratrol, CoQ10, curcumin, vitamin D3, and vitamin B12, helping support everyday vitality and cellular wellbeing.",
    image: { src: longevityPrimaryImg, alt: "BioAro LONgevity+ product and lid" },
    category: "Longevity",
    tags: ["Cellular Energy", "Healthy Aging", "NAD+ Support"],
    bestFor: "Adults focused on long-term vitality, cellular wellness, and proactive healthy aging.",
    dosage: "Recommended daily intake: Take 2 capsules daily with food, or as directed on the product label.",
    servings: "60 vegan capsules · 30 servings",
    supplyLabel: "30-day supply",
    rating: { average: 4.9, count: 1163 },
    benefits: [
      "Contains ingredients selected to support cellular function",
      "Developed to support healthy ageing as part of a healthy lifestyle",
      "Helps protect cells from oxidative stress",
    ],
    whyItems: [
      { icon: "energy", title: "Cellular Energy", description: "Formulated with ingredients selected for cellular energy support." },
      { icon: "aging", title: "Healthy Aging", description: "Developed to support healthy ageing as part of a healthy lifestyle." },
      { icon: "balance", title: "Methylation Balance", description: "Includes vitamin B12, which contributes to normal homocysteine metabolism." },
    ],
    trustNotes: [
      "Third-party tested for purity & potency.",
      "Transparent label, nothing hidden.",
      "Certificates of Analysis available upon request.",
    ],
    warnings: [
      "Consult your healthcare professional before use if you are pregnant, breastfeeding, taking medication or have a medical condition.",
      "Do not exceed the recommended daily intake.",
      "Keep out of reach of young children.",
      "Food supplements should not be used as a substitute for a varied, balanced diet and a healthy lifestyle.",
    ],
    qualityPoints: [
      "Formulated in Canada",
      "Manufactured in a GMP-certified facility",
      "Third-party tested for identity and purity",
      "Transparent ingredient dosages",
      "Vegan capsules",
      "No proprietary blends",
      "UK Food Supplement compliant",
    ],
    responsibleBusiness: {
      name: "BioAro Drugs",
      address: "Vicarage House, 58-60 Kensington Church Street, London, W8 4DB, United Kingdom",
    },
    ingredients: [
      { name: "NMN", amount: "500 mg", purpose: "Supports NAD+ production and cellular energy.", whyIncluded: "The core precursor that helps raise cellular NAD+ levels.", image: nmnImg },
      { name: "Resveratrol", amount: "200 mg", purpose: "Supports healthy aging pathways and longevity.", whyIncluded: "Works alongside NAD+ support to help activate longevity pathways.", image: resveratrolImg },
      { name: "CoQ10", amount: "100 mg", purpose: "Supports cellular energy and heart health.", whyIncluded: "Supports mitochondrial energy output at the cellular level.", image: coq10Img },
      { name: "Curcumin", amount: "100 mg", purpose: "Supports antioxidant defense.", whyIncluded: "Helps protect cells from oxidative stress.", image: curcuminImg },
      { name: "Vitamin B12", amount: "250 µg", purpose: "Contributes to normal energy-yielding metabolism.", whyIncluded: "Vitamin B12 contributes to normal homocysteine metabolism.", image: vitaminB12Img },
      { name: "Vitamin D3", amount: "25 µg / 1,000 IU", purpose: "Contributes to the normal function of the immune system.", whyIncluded: "Rounds out the formula's healthy aging support.", image: vitaminD3Img },
    ],
    otherIngredients: [
      "Microcrystalline Cellulose",
      "Silicon Dioxide",
      "Maize Starch",
      "Hypromellose capsule",
    ],
    supplementFacts: [
      { label: "Recommended daily intake", value: "Take 2 capsules daily with food, or as directed on the product label." },
      { label: "Servings per container", value: "30" },
      { label: "Format", value: "Vegan capsules" },
    ],
    science: [
      { title: "NMN", description: "Supports NAD+ production at the cellular level." },
      { title: "Supports NAD+", description: "Increases cellular NAD+ levels available for energy metabolism." },
      { title: "Cellular Energy", description: "Supports mitochondrial function and repair." },
      { title: "Healthy Aging", description: "Supports everyday vitality and cellular wellbeing." },
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
      { question: "How should I take LONgevity+?", answer: "Take 2 capsules daily with food, or as directed on the product label." },
      { question: "When will I see results?", answer: "Individual experiences vary depending on diet, lifestyle and consistency of use." },
      { question: "Is it suitable for vegetarians?", answer: "Yes, LONgevity+ is formulated in vegan capsules." },
      { question: "Are there any side effects?", answer: "Please follow the recommended intake on the label and consult a healthcare professional before use if you are pregnant, breastfeeding, taking medication or managing a medical condition." },
      { question: "Is it safe to take with other supplements?", answer: "Check with a healthcare professional if you are on medication or combining multiple supplements." },
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
      "CellOmega+ combines algae-derived omega-3s, CoQ10, magnesium bisglycinate, astaxanthin, spermidine, and vitamin E in a daily wellness formula. EPA and DHA contribute to the normal function of the heart. Designed to support heart, brain, and metabolic health as part of a balanced lifestyle.",
    image: { src: cellomegaPrimaryImg, alt: "BioAro CellOmega+ product and lid" },
    category: "Wellness",
    tags: ["Heart Health", "Brain Health", "Cellular Wellness"],
    bestFor: "Adults seeking foundational support for cellular wellness, heart health, brain health, and healthy aging.",
    dosage: "Take 2 capsules daily with food, or as directed on the product label.",
    servings: "60 vegan capsules · 30 servings",
    supplyLabel: "30-day supply",
    rating: { average: 4.8, count: 812 },
    benefits: [
      "EPA and DHA contribute to the normal function of the heart",
      "Magnesium contributes to normal muscle function and normal psychological function",
      "Vitamin E contributes to the protection of cells from oxidative stress",
    ],
    whyItems: [
      { icon: "heart", title: "Heart Health", description: "EPA and DHA contribute to the normal function of the heart." },
      { icon: "brain", title: "Brain Function", description: "Supports cognitive function and mental clarity." },
      { icon: "balance", title: "Cellular Protection", description: "Vitamin E contributes to the protection of cells from oxidative stress." },
    ],
    trustNotes: [
      "Third-party tested for purity & potency.",
      "Transparent label, nothing hidden.",
      "Certificates of Analysis available upon request.",
    ],
    warnings: [
      "Consult your healthcare professional before use if you are pregnant, breastfeeding, taking medication or have a medical condition.",
      "Do not exceed the recommended daily intake.",
      "Keep out of reach of young children.",
      "Food supplements should not be used as a substitute for a varied, balanced diet and a healthy lifestyle.",
    ],
    qualityPoints: [
      "Formulated in Canada",
      "Manufactured in a GMP-certified facility",
      "Third-party tested for identity and purity",
      "Transparent ingredient dosages",
      "Vegan capsules",
      "No proprietary blends",
      "UK Food Supplement compliant",
    ],
    ingredients: [
      { name: "Algae Powder (Omega-3)", amount: "1,000 mg", purpose: "EPA and DHA contribute to the normal function of the heart.", whyIncluded: "A plant-based omega-3 source providing EPA (30%) and DHA (10%).", image: omega3Img },
      { name: "Magnesium Bisglycinate", amount: "170 mg", purpose: "Magnesium contributes to normal muscle function and normal psychological function.", whyIncluded: "A highly bioavailable magnesium form for daily wellness support.", image: magnesiumBisglycinateImg },
      { name: "CoQ10", amount: "50 mg", purpose: "Supports cellular energy and heart health.", whyIncluded: "Supports mitochondrial energy output alongside the omega blend.", image: coq10Img },
      { name: "Astaxanthin", amount: "8 mg", purpose: "Supports antioxidant defense.", whyIncluded: "A potent antioxidant carotenoid that supports cellular wellness.", image: astaxanthinImg },
      { name: "Spermidine Trihydrochloride", amount: "2 mg", purpose: "Supports healthy cellular renewal.", whyIncluded: "Included for its role in supporting cellular renewal processes.", image: spermidineImg },
      { name: "Vitamin E", amount: "6 mg", purpose: "Vitamin E contributes to the protection of cells from oxidative stress.", whyIncluded: "Rounds out the formula's antioxidant support.", image: vitaminEImg },
    ],
    otherIngredients: [
      "Starch",
      "Capsule Shell (Hydroxypropyl/ Methyl Cellulose)",
      "Co-Enzyme Q10",
      "Astaxarthin",
      "Spermidine",
      "Mannesium Bisglycinate",
      "Vitamin E",
      "Anti-Caking Agent (Silicon Dioxide)",
    ],
    supplementFacts: [
      { label: "Recommended daily intake", value: "Take 2 capsules daily with food, or as directed on the product label." },
      { label: "Servings per container", value: "30" },
      { label: "Format", value: "Vegan capsules" },
    ],
    science: [
      { title: "Omega-3 Uptake", description: "Algae-derived EPA and DHA are absorbed to support system-wide wellness." },
      { title: "Supports Circulation", description: "EPA and DHA contribute to the normal function of the heart." },
      { title: "Brain & Heart Function", description: "Supports cognitive clarity and heart health together." },
      { title: "Cellular Protection", description: "Vitamin E contributes to the protection of cells from oxidative stress." },
    ],
    evidencePoints: [
      "Published Omega-3 Research",
      "Third-party tested for purity & potency",
      "cGMP certified manufacturing",
      "Transparent label, nothing hidden",
      "No proprietary blends",
    ],
    efficacyMetric: {
      label: "Published Omega-3 Research",
      unit: "%",
      placeboValue: 20,
      productValue: 75,
      caption: "Based on formulation modeling of algae-derived EPA/DHA absorption.",
    },
    faq: [
      { question: "How should I take CellOmega+?", answer: "Take 2 capsules daily with food, or as directed on the product label." },
      { question: "When will I see results?", answer: "Individual experiences vary depending on diet, lifestyle and consistency of use." },
      { question: "Is it suitable for vegetarians?", answer: "Yes, CellOmega+ uses an algae-derived omega-3 source and vegan capsules." },
      { question: "Are there any side effects?", answer: "Please follow the recommended intake on the label and consult a healthcare professional before use if you are pregnant, breastfeeding, taking medication or managing a medical condition." },
      { question: "Is it safe to take with other supplements?", answer: "Check with a healthcare professional if you are on medication or combining multiple supplements." },
      { question: "What is your return policy?", answer: "See our returns & refunds page for full details." },
    ],
    priceByCountry: { US: 110, CA: 146, GB: 64.99 },
  },
  {
    id: "creagen-brain",
    handle: "creagen-brain-boost",
    title: "Creagen Brain Boost",
    badge: "Cognitive Focus Support",
    tagline: "Nutritional support for training, work and everyday wellbeing.",
    description:
      "CREAGEN Brain Boost combines creatine monohydrate with magnesium glycinate and vitamin B12. Designed for active individuals seeking nutritional support for training, work and everyday wellbeing.",
    image: { src: creagenBrainPrimaryImg, alt: "BioAro Creagen Brain Boost product set" },
    category: "Focus",
    tags: ["Focus", "Mental Clarity", "Recovery"],
    bestFor: "Professionals, students, creators, and active adults seeking nutritional support for training, work and everyday wellbeing.",
    dosage: "Mix 1 sachet with water daily, or as directed on the product label.",
    servings: "20 x 5g sachets · 20 servings",
    supplyLabel: "20-day supply",
    rating: { average: 4.8, count: 642 },
    benefits: [
      "Creatine increases physical performance in successive bursts of short-term, high-intensity exercise",
      "Magnesium contributes to normal muscle function",
      "Vitamin B12 contributes to normal energy-yielding metabolism",
    ],
    whyItems: [
      { icon: "brain", title: "Physical Performance", description: "Creatine increases physical performance in successive bursts of short-term, high-intensity exercise." },
      { icon: "flame", title: "Muscle Function", description: "Magnesium contributes to normal muscle function." },
      { icon: "energy", title: "Energy Metabolism", description: "Vitamin B12 contributes to normal energy-yielding metabolism." },
    ],
    trustNotes: [
      "Third-party tested for purity & potency.",
      "Transparent label, nothing hidden.",
      "Certificates of Analysis available upon request.",
    ],
    warnings: [
      "Consult your healthcare professional before use if you are pregnant, breastfeeding, taking medication or have a medical condition.",
      "Do not exceed the recommended daily intake.",
      "Keep out of reach of young children.",
      "Food supplements should not be used as a substitute for a varied, balanced diet and a healthy lifestyle.",
    ],
    qualityPoints: [
      "Formulated in Canada",
      "Manufactured in a GMP-certified facility",
      "Third-party tested for identity and purity",
      "Transparent ingredient dosages",
      "No proprietary blends",
      "UK Food Supplement compliant",
    ],
    ingredients: [
      { name: "Creatine Monohydrate", amount: "3 g", purpose: "Creatine increases physical performance in successive bursts of short-term, high-intensity exercise.", whyIncluded: "The core active for physical performance support.", image: creatineImg },
      { name: "Magnesium Glycinate", amount: "100 mg", purpose: "Magnesium contributes to normal muscle function.", whyIncluded: "A well-absorbed magnesium form supporting muscle function.", image: magnesiumGlycinateImg },
      { name: "Vitamin B12", amount: "2.4 µg", purpose: "Vitamin B12 contributes to normal energy-yielding metabolism.", whyIncluded: "Supports energy metabolism throughout the day.", image: vitaminB12Img },
    ],
    supplementFacts: [
      { label: "Recommended daily intake", value: "Mix 1 sachet with water daily, or as directed on the product label." },
      { label: "Servings per container", value: "20" },
      { label: "Format", value: "Powder sachets" },
    ],
    science: [
      { title: "Absorb & Circulate", description: "Creatine and cofactors are absorbed to support energy systems." },
      { title: "Physical Performance", description: "Creatine increases physical performance in successive bursts of short-term, high-intensity exercise." },
      { title: "Muscle & Energy Support", description: "Magnesium and B12 contribute to normal muscle function and energy-yielding metabolism." },
    ],
    evidencePoints: [
      "27+ published studies reviewed",
      "Third-party tested for purity & potency",
      "cGMP certified manufacturing",
      "Transparent label, nothing hidden",
      "No proprietary blends",
    ],
    efficacyMetric: {
      label: "Illustration based on published creatine research",
      unit: "%",
      placeboValue: 18,
      productValue: 64,
      caption: "Illustration based on published scientific literature. It does not represent a clinical study conducted on BioAro Creagen Brain Boost.",
    },
    faq: [
      { question: "How should I take Creagen Brain Boost?", answer: "Mix 1 sachet with water daily, or as directed on the product label." },
      { question: "When will I see results?", answer: "Individual experiences vary depending on diet, lifestyle, training and consistency of use." },
      { question: "Is it suitable for vegetarians?", answer: "Yes, this formula is vegetarian-friendly." },
      { question: "Are there any side effects?", answer: "Please follow the recommended intake on the label and consult a healthcare professional before use if you are pregnant, breastfeeding, taking medication or managing a medical condition." },
      { question: "Is it safe to take with other supplements?", answer: "If you are taking medication or combining multiple supplements, seek professional advice before use." },
      { question: "What is your return policy?", answer: "See our returns & refunds page for full details." },
    ],
    priceByCountry: { US: 50, CA: 67, GB: 34.99 },
  },
  {
    id: "creagen-femme",
    handle: "creagen-femme-energy",
    title: "Creagen Femme Energy",
    badge: "Women's Energy Support",
    tagline: "Nutritional support for active women.",
    description:
      "CREAGEN Femme Energy combines creatine monohydrate, ferrous bisglycinate and vitamin B12 to support women's nutritional needs during active lifestyles.",
    category: "Energy",
    tags: ["Women's Energy", "Vitality", "Active Performance"],
    image: { src: creagenFemmePrimaryImg, alt: "BioAro Creagen Femme Energy product and lid" },
    bestFor: "Women looking for nutritional support for active lifestyles, everyday energy and wellbeing.",
    dosage: "Mix 1 sachet with water daily, or as directed on the product label.",
    servings: "20 x 5g sachets · 20 servings",
    supplyLabel: "20-day supply",
    rating: { average: 4.7, count: 398 },
    benefits: [
      "Creatine increases physical performance in successive bursts of short-term, high-intensity exercise",
      "Iron contributes to the reduction of tiredness and fatigue",
      "Iron contributes to normal oxygen transport in the body",
      "Vitamin B12 contributes to normal energy-yielding metabolism",
    ],
    whyItems: [
      { icon: "energy", title: "Active Performance", description: "Creatine increases physical performance in successive bursts of short-term, high-intensity exercise." },
      { icon: "flame", title: "Reduce Fatigue", description: "Iron contributes to the reduction of tiredness and fatigue." },
      { icon: "balance", title: "Energy Metabolism", description: "Vitamin B12 contributes to normal energy-yielding metabolism." },
    ],
    trustNotes: [
      "Third-party tested for purity & potency.",
      "Transparent label, nothing hidden.",
      "Certificates of Analysis available upon request.",
    ],
    warnings: [
      "Consult your healthcare professional before use if you are pregnant, breastfeeding, taking medication or have a medical condition.",
      "Do not exceed the recommended daily intake.",
      "Keep out of reach of young children.",
      "Food supplements should not be used as a substitute for a varied, balanced diet and a healthy lifestyle.",
    ],
    qualityPoints: [
      "Formulated in Canada",
      "Manufactured in a GMP-certified facility",
      "Third-party tested for identity and purity",
      "Transparent ingredient dosages",
      "No proprietary blends",
      "UK Food Supplement compliant",
    ],
    ingredients: [
      { name: "Creatine Monohydrate", amount: "3.5 g", purpose: "Creatine increases physical performance in successive bursts of short-term, high-intensity exercise.", whyIncluded: "The core active supporting active performance.", image: creatineImg },
      { name: "Ferrous Bisglycinate", amount: "8 mg", purpose: "Iron contributes to the reduction of tiredness and fatigue and normal oxygen transport in the body.", whyIncluded: "A gentle iron form included to support energy levels.", image: ferrousBisglycinateImg },
      { name: "Vitamin B12", amount: "200 µg", purpose: "Vitamin B12 contributes to normal energy-yielding metabolism.", whyIncluded: "Supports energy metabolism throughout the day.", image: vitaminB12Img },
    ],
    otherIngredients: [
      "Citric Acid",
      "Sucralose",
    ],
    supplementFacts: [
      { label: "Recommended daily intake", value: "Mix 1 sachet with water daily, or as directed on the product label." },
      { label: "Servings per container", value: "20" },
      { label: "Format", value: "Powder sachets" },
    ],
    science: [
      { title: "Absorb & Circulate", description: "Creatine and iron cofactors are absorbed to support daily nutritional needs." },
      { title: "Support Active Lifestyle", description: "Creatine increases physical performance in successive bursts of short-term, high-intensity exercise." },
      { title: "Energy & Vitality", description: "Iron and B12 contribute to the reduction of tiredness and normal energy-yielding metabolism." },
    ],
    evidencePoints: [
      "27+ published studies reviewed",
      "Third-party tested for purity & potency",
      "cGMP certified manufacturing",
      "Transparent label, nothing hidden",
      "No proprietary blends",
    ],
    efficacyMetric: {
      label: "Illustration based on published research on iron, vitamin B12 and creatine",
      unit: "%",
      placeboValue: 22,
      productValue: 69,
      caption: "Illustration based on published scientific literature. It does not represent a clinical study conducted on BioAro Creagen Femme Energy.",
    },
    faq: [
      { question: "How should I take Creagen Femme Energy?", answer: "Mix 1 sachet with water daily, or as directed on the product label." },
      { question: "When will I see results?", answer: "Individual experiences vary depending on diet, lifestyle and consistency of use." },
      { question: "Is it suitable for vegetarians?", answer: "Yes, this formula is vegetarian-friendly." },
      { question: "Are there any side effects?", answer: "Please follow the recommended intake on the label and consult a healthcare professional before use if you are pregnant, breastfeeding, taking medication or managing a medical condition." },
      { question: "Is it safe to take with other supplements?", answer: "If you are taking medication or other iron-containing products, seek professional advice before use." },
      { question: "What is your return policy?", answer: "See our returns & refunds page for full details." },
    ],
    priceByCountry: { US: 55, CA: 73, GB: 29.99 },
  },
  {
    id: "creagen-raw",
    handle: "creagen-raw-power",
    title: "Creagen Raw Power",
    badge: "Pure 6g Creatine",
    tagline: "Pure creatine to support high-intensity exercise performance.",
    description:
      "CREAGEN Raw Power provides pure creatine monohydrate for athletes and active individuals. Creatine increases physical performance in successive bursts of short-term, high-intensity exercise. Designed for strength training, sprint exercise and high-intensity performance.",
    category: "Performance",
    tags: ["High-Intensity Performance", "Strength", "Pure Creatine"],
    image: { src: creagenRawImg, alt: "BioAro Creagen Raw Power sachet" },
    bestFor: "Active adults, fitness users, athletes, and anyone looking for straightforward creatine support.",
    dosage: "Mix 1 sachet with water daily, before or after training, or as directed on the product label.",
    servings: "20 x 7.5g sachets · 20 servings",
    supplyLabel: "20-day supply",
    rating: { average: 4.8, count: 521 },
    benefits: [
      "Provides 6 g of creatine monohydrate per serving",
      "Supports high-intensity training and repeated exercise efforts",
      "Designed for strength, power and performance-focused routines",
    ],
    whyItems: [
      { icon: "flame", title: "High-Intensity Performance", description: "Supports high-intensity exercise performance." },
      { icon: "energy", title: "Strength Output", description: "Designed for strength and power-focused training." },
      { icon: "shield", title: "Pure Creatine", description: "Provides 6 g of creatine monohydrate per serving." },
    ],
    trustNotes: [
      "Third-party tested for purity & potency.",
      "Transparent label, nothing hidden.",
      "Certificates of Analysis available upon request.",
    ],
    warnings: [
      "Consult your healthcare professional before use if you are pregnant, breastfeeding, taking medication or have a medical condition.",
      "Do not exceed the recommended daily intake.",
      "Keep out of reach of young children.",
      "Drink plenty of water throughout the day when using creatine.",
      "Food supplements should not be used as a substitute for a varied, balanced diet and a healthy lifestyle.",
    ],
    qualityPoints: [
      "Formulated in Canada",
      "Manufactured in a GMP-certified facility",
      "Third-party tested for identity and purity",
      "Transparent ingredient dosages",
      "No proprietary blends",
      "UK Food Supplement compliant",
    ],
    ingredients: [
      { name: "Creatine Monohydrate", amount: "6 g", purpose: "Creatine increases physical performance in successive bursts of short-term, high-intensity exercise.", whyIncluded: "A single-ingredient, straightforward creatine dose.", image: creatineImg },
    ],
    supplementFacts: [
      { label: "Recommended daily intake", value: "Mix 1 sachet with water daily, before or after training, or as directed on the product label." },
      { label: "Servings per container", value: "20" },
      { label: "Format", value: "Powder sachets" },
    ],
    science: [
      { title: "Pure Creatine", description: "6 g of creatine monohydrate per serving." },
      { title: "Fuel Training", description: "Creatine increases physical performance in successive bursts of short-term, high-intensity exercise." },
      { title: "Build Performance", description: "Designed for strength, power and performance-focused routines." },
      { title: "Recover & Repeat", description: "Supports repeated exercise efforts as part of a training routine." },
    ],
    evidencePoints: [
      "Illustration based on published creatine research",
      "Third-party tested for purity & potency",
      "cGMP certified manufacturing",
      "Transparent label, nothing hidden",
      "No proprietary blends",
    ],
    efficacyMetric: {
      label: "Illustration based on published creatine research",
      unit: "%",
      placeboValue: 12,
      productValue: 58,
      caption: "Illustration based on published scientific literature. It does not represent a clinical study conducted on BioAro Creagen Raw Power.",
    },
    faq: [
      { question: "How should I take Creagen Raw Power?", answer: "Mix 1 sachet with water daily, before or after training, or as directed on the product label." },
      { question: "When will I see results?", answer: "Individual experiences vary depending on diet, lifestyle, training and consistency of use." },
      { question: "Is it suitable for vegetarians?", answer: "Yes, this formula is vegetarian-friendly." },
      { question: "Are there any side effects?", answer: "Please follow the recommended intake on the label and stay well hydrated. Consult a healthcare professional before use if you are pregnant, breastfeeding, taking medication or managing a medical condition." },
      { question: "Is it safe to take with other supplements?", answer: "If you are taking medication or combining multiple supplements, seek professional advice before use." },
      { question: "What is your return policy?", answer: "See our returns & refunds page for full details." },
    ],
    priceByCountry: { US: 45, CA: 60, GB: 24.99 },
  },
  {
    id: "creagen-pro",
    handle: "creagen-pro-power",
    title: "Creagen Pro Power",
    badge: "Performance Blend",
    tagline: "High-intensity performance, hydration and endurance support.",
    description:
      "CREAGEN Pro Power combines creatine monohydrate, beta-alanine and essential electrolytes in a performance-focused formula designed for high-intensity training and active lifestyles.",
    image: { src: creagenProImg, alt: "BioAro Creagen Pro Power sachet" },
    category: "Performance",
    tags: ["High-Intensity Performance", "Hydration", "Endurance"],
    bestFor: "Athletes, gym users, active professionals, and performance-focused adults.",
    dosage: "Mix 1 sachet with water daily, during or after training, or as directed on the product label.",
    servings: "20 x 10g sachets · 20 servings",
    supplyLabel: "20-day supply",
    rating: { average: 4.9, count: 734 },
    benefits: [
      "Provides 6 g of creatine monohydrate per serving",
      "Supports hydration through added electrolytes",
      "Designed for high-intensity training and demanding workouts",
    ],
    whyItems: [
      { icon: "flame", title: "Strength & Endurance", description: "Designed for high-intensity training and repeated exercise efforts." },
      { icon: "droplet", title: "Hydration Balance", description: "Helps maintain hydration through added electrolytes." },
      { icon: "shield", title: "Performance Routine", description: "Supports your training routine after demanding workouts." },
    ],
    trustNotes: [
      "Third-party tested for purity & potency.",
      "Transparent label, nothing hidden.",
      "Certificates of Analysis available upon request.",
    ],
    warnings: [
      "Consult your healthcare professional before use if you are pregnant, breastfeeding, taking medication or have a medical condition.",
      "Do not exceed the recommended daily intake.",
      "Keep out of reach of young children.",
      "A temporary tingling sensation from beta-alanine is normal.",
      "Food supplements should not be used as a substitute for a varied, balanced diet and a healthy lifestyle.",
    ],
    qualityPoints: [
      "Formulated in Canada",
      "Manufactured in a GMP-certified facility",
      "Third-party tested for identity and purity",
      "Transparent ingredient dosages",
      "No proprietary blends",
      "UK Food Supplement compliant",
    ],
    ingredients: [
      { name: "Creatine Monohydrate", amount: "6 g", purpose: "Creatine increases physical performance in successive bursts of short-term, high-intensity exercise.", whyIncluded: "The performance foundation of the formula.", image: creatineImg },
      { name: "Beta-Alanine", amount: "1.6 g", purpose: "Supports muscular endurance during high-intensity training.", whyIncluded: "Helps buffer muscle fatigue during intense training.", image: betaAlanineImg },
      { name: "Potassium Chloride", amount: "Part of 300 mg electrolyte blend", purpose: "Supports hydration and electrolyte balance.", whyIncluded: "An electrolyte supporting fluid balance during training.", image: potassiumChlorideImg },
      { name: "Sodium Chloride", amount: "Part of 300 mg electrolyte blend", purpose: "Supports hydration and electrolyte balance.", whyIncluded: "An electrolyte supporting fluid balance during training.", image: sodiumChlorideImg },
      { name: "Magnesium Bisglycinate", amount: "Part of 300 mg electrolyte blend", purpose: "Magnesium contributes to normal muscle function.", whyIncluded: "Rounds out the electrolyte blend for muscle support.", image: magnesiumBisglycinateImg },
    ],
    otherIngredients: [
      "Citric Acid",
      "Natural Flavour",
      "Sucralose",
    ],
    supplementFacts: [
      { label: "Recommended daily intake", value: "Mix 1 sachet with water daily, during or after training, or as directed on the product label." },
      { label: "Servings per container", value: "20" },
      { label: "Format", value: "Powder sachets" },
    ],
    science: [
      { title: "Creatine + Beta-Alanine + Electrolytes", description: "A performance-focused combination for high-intensity training." },
      { title: "High-Intensity Training", description: "Creatine increases physical performance in successive bursts of short-term, high-intensity exercise." },
      { title: "Hydration Support", description: "Electrolytes help maintain hydration during demanding workouts." },
      { title: "Performance-Focused Routine", description: "Supports your training routine as part of an active lifestyle." },
    ],
    evidencePoints: [
      "Illustration based on published creatine and beta-alanine research",
      "Third-party tested for purity & potency",
      "cGMP certified manufacturing",
      "Transparent label, nothing hidden",
      "No proprietary blends",
    ],
    efficacyMetric: {
      label: "Illustration based on published creatine and beta-alanine research",
      unit: "%",
      placeboValue: 14,
      productValue: 61,
      caption: "Illustration based on published scientific literature. It does not represent a clinical study conducted on BioAro Creagen Pro Power.",
    },
    faq: [
      { question: "How should I take Creagen Pro Power?", answer: "Mix 1 sachet with water during or after training, or as directed on the product label." },
      { question: "When will I see results?", answer: "Individual experiences vary depending on diet, lifestyle, training and consistency of use." },
      { question: "Is it suitable for vegetarians?", answer: "Yes, this formula is vegetarian-friendly." },
      { question: "Are there any side effects?", answer: "A mild tingling from beta-alanine is normal and temporary. Please follow the recommended intake on the label and consult a healthcare professional before use if appropriate." },
      { question: "Is it safe to take with other supplements?", answer: "If you are taking medication or combining multiple supplements, seek professional advice before use." },
      { question: "What is your return policy?", answer: "See our returns & refunds page for full details." },
    ],
    priceByCountry: { US: 65, CA: 86, GB: 34.99 },
  },
  {
    id: "glutara",
    handle: "glutara",
    title: "Glutara",
    badge: "Advanced Liposomal Delivery",
    tagline: "Daily antioxidant support with vitamins and clinically selected ingredients.",
    description:
      "Glutara combines liposomal glutathione, vitamin C, hyaluronic acid and B vitamins in a carefully formulated daily wellness supplement with piperine to support ingredient absorption.",
    category: "Wellness",
    tags: ["Antioxidant Support", "Daily Wellness", "Skin Care Routine"],
    image: { src: glutaraPrimaryImg, alt: "BioAro Glutara product container" },
    bestFor: "Adults seeking daily antioxidant support, skin care routine support, and everyday wellness.",
    dosage: "Mix 1 sachet with water daily, or as directed on the product label.",
    servings: "18g sachets · 30 servings",
    supplyLabel: "30-day supply",
    rating: { average: 4.7, count: 289 },
    benefits: [
      "Provides 500 mg liposomal glutathione per serving",
      "Contains vitamin C, which contributes to the protection of cells from oxidative stress",
      "Formulated with liposomal delivery and piperine",
    ],
    whyItems: [
      { icon: "shield", title: "Antioxidant Defense", description: "Contains vitamin C, which contributes to the protection of cells from oxidative stress." },
      { icon: "droplet", title: "Skin Care Routine", description: "Formulated with hyaluronic acid for daily skincare routines." },
      { icon: "sparkle", title: "Cellular Wellness", description: "Liposomal delivery combined with piperine to optimise ingredient delivery." },
    ],
    trustNotes: [
      "Third-party tested for purity & potency.",
      "Transparent label, nothing hidden.",
      "Certificates of Analysis available upon request.",
    ],
    warnings: [
      "Consult your healthcare professional before use if you are pregnant, breastfeeding, taking medication or have a medical condition.",
      "Piperine may interact with certain medications — check with a healthcare professional.",
      "Do not exceed the recommended daily intake.",
      "Keep out of reach of young children.",
      "Food supplements should not be used as a substitute for a varied, balanced diet and a healthy lifestyle.",
    ],
    qualityPoints: [
      "Formulated in Canada",
      "Manufactured in a GMP-certified facility",
      "Third-party tested for identity and purity",
      "Transparent ingredient dosages",
      "No proprietary blends",
      "UK Food Supplement compliant",
    ],
    ingredients: [
      { name: "Liposomal Glutathione", amount: "500 mg", purpose: "Provides 500 mg liposomal glutathione per serving.", whyIncluded: "Delivered via liposomal technology to support ingredient absorption.", image: liposomalGlutathioneImg },
      { name: "Vitamin C", amount: "200 mg", purpose: "Contributes to the protection of cells from oxidative stress. Contributes to normal collagen formation for the normal function of skin.", whyIncluded: "An authorised antioxidant vitamin supporting skin and cellular health.", image: vitaminCImg },
      { name: "Hyaluronic Acid", amount: "150 mg", purpose: "Formulated for daily skincare routines.", whyIncluded: "Included to support daily skincare routine.", image: hyaluronicAcidImg },
      { name: "Vitamin B1", amount: "20 mg", purpose: "Contributes to normal energy-yielding metabolism.", whyIncluded: "A B-vitamin cofactor supporting daily wellness.", image: vitaminB1Img },
      { name: "Vitamin B6", amount: "5 mg", purpose: "Contributes to the normal function of the immune system. Contributes to the reduction of tiredness and fatigue.", whyIncluded: "A B-vitamin cofactor supporting immune function and energy.", image: vitaminB6Img },
      { name: "Piperine", amount: "5 mg", purpose: "Included to support absorption of the other ingredients.", whyIncluded: "Included to optimise ingredient delivery.", image: piperineImg },
    ],
    supplementFacts: [
      { label: "Recommended daily intake", value: "Mix 1 sachet with water daily, or as directed on the product label." },
      { label: "Servings per container", value: "30" },
      { label: "Format", value: "Powder sachets" },
    ],
    science: [
      { title: "Liposomal Delivery", description: "Liposomal technology combined with piperine to support ingredient absorption." },
      { title: "Enhanced Ingredient Uptake", description: "Piperine supports absorption of the core ingredients." },
      { title: "Vitamin C Supports Protection", description: "Vitamin C contributes to the protection of cells from oxidative stress." },
      { title: "Daily Wellness Routine", description: "A daily formula designed to complement a balanced lifestyle." },
    ],
    evidencePoints: [
      "27+ published studies reviewed",
      "Third-party tested for purity & potency",
      "cGMP certified manufacturing",
      "Transparent label, nothing hidden",
      "No proprietary blends",
    ],
    efficacyMetric: {
      label: "",
      unit: "%",
      placeboValue: 0,
      productValue: 0,
      caption: "",
    },
    faq: [
      { question: "How should I take Glutara?", answer: "Mix 1 sachet with water daily, or as directed on the product label." },
      { question: "When will I see results?", answer: "Individual experiences vary depending on diet, lifestyle and consistency of use." },
      { question: "Is it suitable for vegetarians?", answer: "Yes, this formula is vegetarian-friendly." },
      { question: "Are there any side effects?", answer: "Please follow the recommended intake on the label. Consult a healthcare professional before use if you are pregnant, breastfeeding, taking medication or managing a medical condition. Piperine may interact with certain medications." },
      { question: "Is it safe to take with other supplements?", answer: "If you are taking medication or combining multiple supplements, seek professional advice before use." },
      { question: "What is your return policy?", answer: "See our returns & refunds page for full details." },
    ],
    priceByCountry: { US: 70, CA: 93, GB: 45.99 },
  },
];

export function getPreviewProductByHandle(handle: string) {
  return PREVIEW_PRODUCTS.find((product) => product.handle === handle);
}
