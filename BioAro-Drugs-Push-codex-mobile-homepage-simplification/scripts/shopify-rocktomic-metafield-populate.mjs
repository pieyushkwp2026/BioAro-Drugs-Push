#!/usr/bin/env node

import process from "node:process";

const GLOBAL_PRIMARY_CTA = {
  headline: "Ready to build your routine?",
  supportingText: "Browse all formulas and explore the BioAro Drugs range.",
  buttonLabel: "Browse all formulas",
  buttonLink: "/uk/shop",
};

const GLOBAL_SECONDARY_CTA = {
  headline: "Want a more personalized approach?",
  supportingText: "Take the BioAro quiz to find the best fit for your routine.",
  buttonLabel: "Take the quiz",
  buttonLink: "/uk/quiz",
};

const PRODUCTS = [
  {
    sku: "ROC2821",
    handle: "bioprotein-pro",
    title: "BioProtein Pro",
    heroEyebrow: "Performance / Protein",
    category: "Performance",
    tagline: "Premium whey isolate for recovery, growth and lean muscle maintenance.",
    description: "Premium whey protein isolate formulated to support muscle recovery, growth and maintenance. Enriched with BCAAs-Leucine, Isoleucine and Valine-while Protease and Papain support protein digestion and absorption.",
    tags: ["Muscle Recovery", "Lean Muscle", "Protein Intake"],
    benefits: ["25g protein per serving", "Supports muscle recovery and maintenance", "Contains BCAA blend", "Protease and Papain for protein digestion", "1g carbohydrate per serving", "<1g sugar"],
    packName: "Vanilla Whey Isolate",
    servingSize: "29g / 1 scoop",
    servingsPerContainer: "16",
    productFormat: "Powder",
    directions: "Mix one scoop with 4-6 oz water, milk or preferred beverage.",
    bestFor: "Athletes and active individuals seeking convenient high-protein recovery support.",
    whyHeadline: "High-quality protein designed around recovery.",
    scienceHeadline: "Whey isolate, amino acids and digestive enzymes in one formula.",
    ingredientsHeadline: "Protein, amino acids and digestive support in one routine.",
    evidenceHeadline: "Backed by formula transparency",
    comparisonHeadline: "BioAro vs typical protein formulas",
    faqHeadline: "BioProtein Pro FAQ",
    supplyLabel: "16 servings",
    warnings: ["Consult a physician if pregnant, breastfeeding, taking medication or if you have a health condition.", "Keep out of reach of children."],
    otherIngredients: ["Whey Protein Isolate", "Natural & Artificial Flavor", "Xanthan Gum", "Sucralose", "Digestive Enzyme Blend", "BCAA Blend"],
    allergenInfo: "Contains milk and soy.",
  },
  {
    sku: "ROC263V",
    handle: "plantcore",
    title: "PlantCore",
    heroEyebrow: "Performance / Plant Protein",
    category: "Performance",
    tagline: "Plant-based protein for everyday recovery and muscle maintenance.",
    description: "Plant-based protein combining organic pea and organic rice proteins to provide a dairy-free protein alternative designed to support muscle maintenance and recovery.",
    tags: ["Plant Protein", "Recovery", "Dairy-Free Nutrition"],
    benefits: ["Protein intake", "Muscle maintenance", "Recovery", "Fibre", "Dairy-free alternative"],
    packName: "Vanilla Plant Protein",
    servingSize: "33.1g / 1 scoop",
    servingsPerContainer: "20",
    productFormat: "Powder",
    directions: "One scoop with 8 oz water or preferred hot/cold recipe.",
    bestFor: "Vegans, vegetarians and people seeking a dairy-free protein option.",
    whyHeadline: "Complete plant-based protein built for active routines.",
    scienceHeadline: "Pea and rice protein in one plant-based blend.",
    ingredientsHeadline: "Complementary plant proteins for everyday recovery.",
    evidenceHeadline: "Backed by a disclosed plant-protein blend",
    comparisonHeadline: "BioAro vs typical plant protein formulas",
    faqHeadline: "PlantCore FAQ",
    supplyLabel: "20 servings",
    warnings: ["Consult doctor if pregnant, nursing, allergic, taking medication or with a medical condition.", "Do not use if opened or tampered.", "Keep away from children.", "Store cool and dry."],
    otherIngredients: ["Organic Pea Protein", "Organic Rice Protein", "Organic Erythritol", "Vanilla Flavor", "Stevia Extract", "Sea Salt", "Sunflower Creamer and associated flavour/texturising ingredients"],
    allergenInfo: "No specific allergen statement supplied in the source PDF.",
  },
  {
    sku: "ROC606",
    handle: "bioignite",
    title: "BioIgnite",
    heroEyebrow: "Performance / Pre-Workout",
    category: "Performance",
    tagline: "Pre-workout energy, endurance, hydration and focus support.",
    description: "Pre-workout formula combining electrolytes, B vitamins, amino acids and performance ingredients including Dicreatine Malate, L-Arginine AKG, Beta-Alanine, Taurine and L-Tyrosine.",
    tags: ["Energy", "Endurance", "Focus", "Pumps"],
    benefits: ["Energy support", "Pumps", "Endurance", "Focus", "Electrolyte support"],
    packName: "Honeydew Watermelon Pre-Workout",
    servingSize: "10g / 1 scoop",
    servingsPerContainer: "30",
    productFormat: "Powder",
    directions: "Begin with 1 scoop. If tolerated, take 1-2 scoops 30 minutes before exercise. Maximum 2 scoops daily.",
    bestFor: "Pre-training energy and performance support.",
    whyHeadline: "Energy, muscular pumps and focus in one pre-workout.",
    scienceHeadline: "Creatine-related actives, caffeine and electrolytes in one formula.",
    ingredientsHeadline: "Disclosed pre-workout actives for training sessions.",
    evidenceHeadline: "Backed by disclosed active ingredient doses",
    comparisonHeadline: "BioAro vs typical pre-workout formulas",
    faqHeadline: "BioIgnite FAQ",
    supplyLabel: "30 servings",
    warnings: ["Do not use if under 18.", "Do not use while pregnant or nursing.", "Contains caffeine.", "Consult a healthcare professional if you have a medical condition or take medication.", "Keep away from children."],
    otherIngredients: [],
    allergenInfo: "No specific allergen statement supplied in the source PDF.",
  },
  {
    sku: "ROC603",
    handle: "musclerecover",
    title: "MuscleRecover",
    heroEyebrow: "Performance / Amino Recovery",
    category: "Performance",
    tagline: "2:1:1 BCAAs with glutamine for workout recovery.",
    description: "BCAA formula providing a 2:1:1 ratio of Leucine, Isoleucine and Valine with L-Glutamine and Vitamin B6.",
    tags: ["BCAA", "Recovery", "Intra-Workout", "Post-Workout"],
    benefits: ["Recovery", "Protein synthesis support", "Amino acid intake"],
    packName: "Fruit Punch BCAA Recovery",
    servingSize: "7.7g / scoop",
    servingsPerContainer: "45",
    productFormat: "Powder",
    directions: "1 scoop with 8-12 fl oz water.",
    bestFor: "Active individuals seeking amino acid support during or around training.",
    whyHeadline: "A recovery blend built around BCAAs, glutamine and B6.",
    scienceHeadline: "2:1:1 BCAAs plus glutamine in a disclosed formula.",
    ingredientsHeadline: "Amino support for recovery-focused routines.",
    evidenceHeadline: "Backed by disclosed amino support ingredients",
    comparisonHeadline: "BioAro vs typical BCAA formulas",
    faqHeadline: "MuscleRecover FAQ",
    supplyLabel: "45 servings",
    warnings: ["Healthy adults only.", "Not for under 18.", "Not for pregnant or nursing individuals.", "Consult a healthcare professional with pre-existing conditions.", "Produced in a facility processing milk, eggs, fish, shellfish, tree nuts, peanuts, soy and wheat."],
    otherIngredients: ["Natural & Artificial Flavor", "Citric Acid", "Silicon Dioxide", "Malic Acid", "Acesulfame Potassium", "Sucralose"],
    allergenInfo: "Produced in a facility processing milk, eggs, fish, shellfish, tree nuts, peanuts, soy and wheat.",
  },
  {
    sku: "ROC017",
    handle: "hydrareload",
    title: "HydraReload",
    heroEyebrow: "Performance / Hydration & Recovery",
    category: "Performance",
    tagline: "Fast-digesting carbohydrates and electrolytes for training recovery.",
    description: "Post-training recovery formula using carbohydrates and an electrolyte blend to replenish energy stores and support hydration.",
    tags: ["Hydration", "Carbohydrates", "Recovery", "Electrolytes"],
    benefits: ["Glycogen replenishment", "Hydration", "Carbohydrate intake", "Electrolytes"],
    packName: "Summer Punch Recovery Carbs + Electrolytes",
    servingSize: "27.3g / scoop",
    servingsPerContainer: "50",
    productFormat: "Powder",
    directions: "Mix one scoop with 8 oz cold water. Best before training or post-workout.",
    bestFor: "Before training or post-workout carbohydrate and electrolyte replenishment.",
    whyHeadline: "Fast carbs and electrolytes for training recovery.",
    scienceHeadline: "Carbohydrate replenishment and electrolytes in one scoop.",
    ingredientsHeadline: "Carbs and electrolytes for post-training routines.",
    evidenceHeadline: "Backed by disclosed carb and electrolyte values",
    comparisonHeadline: "BioAro vs typical hydration and recovery formulas",
    faqHeadline: "HydraReload FAQ",
    supplyLabel: "50 servings",
    warnings: ["Consult a healthcare professional with health conditions, pregnancy, breastfeeding or medication use."],
    otherIngredients: [],
    allergenInfo: "No specific allergen statement supplied in the source PDF.",
  },
  {
    sku: "ROC507W",
    handle: "womens-vitalprime",
    title: "Women's VitalPrime",
    heroEyebrow: "Daily Wellness / Women",
    category: "Wellness",
    tagline: "Daily vitamins, minerals and targeted wellness support for women.",
    description: "Comprehensive women's multivitamin containing essential vitamins, minerals, antioxidants and specialised botanical blends.",
    tags: ["Daily Wellness", "Women", "Energy", "Immune Support"],
    benefits: ["Nutrient support", "Energy", "Immune support", "Female-focused botanical blend"],
    packName: "Women's Multivitamin",
    servingSize: "2 capsules",
    servingsPerContainer: "30",
    productFormat: "Capsules",
    directions: "2 capsules in morning with meal.",
    bestFor: "Women seeking everyday nutritional support.",
    whyHeadline: "Daily nutritional coverage with targeted support blends.",
    scienceHeadline: "Vitamins, minerals and botanical support in one daily formula.",
    ingredientsHeadline: "Targeted wellness support for everyday routines.",
    evidenceHeadline: "Backed by a disclosed multivitamin and botanical formula",
    comparisonHeadline: "BioAro vs typical women's multivitamins",
    faqHeadline: "Women's VitalPrime FAQ",
    supplyLabel: "30-day supply",
    warnings: ["Consult a physician with a medical condition.", "Do not use if pregnant or lactating.", "Keep away from children.", "Store cool and dry."],
    otherIngredients: [],
    allergenInfo: "No specific allergen statement supplied in the source PDF.",
  },
  {
    sku: "ROC018",
    handle: "nitricflow",
    title: "NitricFlow",
    heroEyebrow: "Performance / Pre-Workout",
    category: "Performance",
    tagline: "High-intensity pre-workout for pump, endurance, focus and energy.",
    description: "Stimulant-enhanced formula featuring Citrulline Malate, Beta-Alanine, Betaine, Alpha GPC, Taurine, caffeine and electrolytes.",
    tags: ["Pump", "Energy", "Focus", "Hydration"],
    benefits: ["Pump", "Endurance", "Focus", "Energy", "Hydration"],
    packName: "Georgia Peach Rings Pre-Workout",
    servingSize: "12.5g",
    servingsPerContainer: "25",
    productFormat: "Powder",
    directions: "1 scoop in 8 oz water, 20-30 minutes pre-training. Start with 1/2 serving for tolerance.",
    bestFor: "Healthy adult users seeking a stimulant-based pre-workout.",
    whyHeadline: "Pump, endurance, focus and energy in one formula.",
    scienceHeadline: "Citrulline, beta-alanine, caffeine and hydration support together.",
    ingredientsHeadline: "Disclosed pre-workout actives for high-intensity sessions.",
    evidenceHeadline: "Backed by disclosed active ingredient doses",
    comparisonHeadline: "BioAro vs typical stimulant pre-workouts",
    faqHeadline: "NitricFlow FAQ",
    supplyLabel: "25 servings",
    warnings: ["The source PDF includes warning content but the extracted text is incomplete in the current source. Review the approved label before publishing final medical warnings."],
    otherIngredients: [],
    allergenInfo: "No specific allergen statement supplied in the source PDF.",
  },
  {
    sku: "ROC507",
    handle: "mens-vitalprime",
    title: "Men's VitalPrime",
    heroEyebrow: "Daily Wellness / Men",
    category: "Wellness",
    tagline: "Daily vitamins, minerals and targeted wellness support for men.",
    description: "Complete men's multivitamin delivering essential vitamins, minerals, antioxidants, and specialized botanical blends to support energy production, immune function, cardiovascular health, hormone support, and overall daily wellness.",
    tags: ["Daily Wellness", "Men", "Energy", "Immune Support"],
    benefits: ["Energy production", "Immune support", "Cardiovascular support", "Hormone support"],
    packName: "Men's Multivitamin",
    servingSize: "2 capsules",
    servingsPerContainer: "30",
    productFormat: "Capsules",
    directions: "Follow approved label directions before publishing. Source description available; detailed serving directions were not captured in the extracted PDF pages.",
    bestFor: "Men seeking daily nutritional support and general vitality support.",
    whyHeadline: "Daily vitamins, minerals and targeted support for men.",
    scienceHeadline: "Essential nutrients and botanical support in one daily routine.",
    ingredientsHeadline: "Targeted nutrient support for men's everyday wellness.",
    evidenceHeadline: "Backed by a disclosed multivitamin and botanical formula",
    comparisonHeadline: "BioAro vs typical men's multivitamins",
    faqHeadline: "Men's VitalPrime FAQ",
    supplyLabel: "30-day supply",
    warnings: ["Use the approved label warnings before publishing final medical guidance."],
    otherIngredients: [],
    allergenInfo: "No specific allergen statement supplied in the source PDF.",
  },
  {
    sku: "ROC450",
    handle: "biocollagen",
    title: "BioCollagen",
    heroEyebrow: "Daily Wellness / Collagen",
    category: "Wellness",
    tagline: "Collagen support for skin, joints and connective tissue.",
    description: "Hydrolyzed bovine collagen peptides providing Type I and III collagen to support healthy skin, joints, tendons, ligaments, and connective tissues.",
    tags: ["Collagen", "Mobility", "Recovery", "Healthy Aging"],
    benefits: ["Skin support", "Joint support", "Connective tissue support", "Mobility support"],
    packName: "Grass-Fed Collagen Type 1 & 3",
    servingSize: "Use approved label directions before publishing.",
    servingsPerContainer: "35",
    productFormat: "Powder",
    directions: "Use approved label directions before publishing.",
    bestFor: "Individuals seeking support for mobility, recovery, and healthy aging.",
    whyHeadline: "Type I and III collagen built for everyday support.",
    scienceHeadline: "Collagen peptides designed for skin, joints and connective tissues.",
    ingredientsHeadline: "Collagen support for mobility and recovery routines.",
    evidenceHeadline: "Backed by a disclosed collagen-peptide formula",
    comparisonHeadline: "BioAro vs typical collagen supplements",
    faqHeadline: "BioCollagen FAQ",
    supplyLabel: "35 servings",
    warnings: ["Use the approved label warnings before publishing final medical guidance."],
    otherIngredients: [],
    allergenInfo: "Contains bovine collagen. Confirm final allergen statement from approved label.",
  },
  {
    sku: "ROC914",
    handle: "nitric-roots",
    title: "Nitric Roots",
    heroEyebrow: "Performance / Nitric Oxide Support",
    category: "Performance",
    tagline: "Organic beetroot support for blood flow and endurance routines.",
    description: "Organic beetroot powder naturally rich in dietary nitrates that support nitric oxide production, healthy blood flow, oxygen delivery, and cardiovascular performance.",
    tags: ["Nitric Oxide", "Endurance", "Blood Flow", "Beetroot"],
    benefits: ["Supports nitric oxide production", "Supports blood flow", "Supports oxygen delivery", "Supports cardiovascular performance"],
    packName: "Organic Beetroot",
    servingSize: "2 veggie capsules",
    servingsPerContainer: "30",
    productFormat: "Veggie capsules",
    directions: "2 capsules once daily, ideally 20-30 minutes before meal with 8 oz water.",
    bestFor: "Adults seeking simple daily nitric oxide and endurance support.",
    whyHeadline: "Simple daily beetroot support with disclosed dose.",
    scienceHeadline: "Organic beetroot nitrate support in a capsule format.",
    ingredientsHeadline: "Beetroot support for nitric oxide routines.",
    evidenceHeadline: "Backed by a disclosed organic beetroot dose",
    comparisonHeadline: "BioAro vs typical beetroot supplements",
    faqHeadline: "Nitric Roots FAQ",
    supplyLabel: "30-day supply",
    warnings: ["Pregnancy, nursing, under-18 and medical-condition caution.", "Store cool and dry."],
    otherIngredients: [],
    allergenInfo: "No specific allergen statement supplied in the source PDF.",
  },
  {
    sku: "ROC812",
    handle: "mindsync",
    title: "MindSync",
    heroEyebrow: "Cognitive Wellness",
    category: "Focus",
    tagline: "Multi-ingredient cognitive support for focus, clarity and memory.",
    description: "Cognitive formula combining vitamins, minerals, amino acids, botanical extracts and nootropic ingredients including Bacopa, DMAE, Green Tea Extract, Choline and N-Acetyl L-Tyrosine.",
    tags: ["Focus", "Memory", "Mental Clarity", "Cognitive Support"],
    benefits: ["Focus support", "Memory support", "Multi-ingredient nootropic blend"],
    packName: "MindSync Cognitive Support",
    servingSize: "2 capsules",
    servingsPerContainer: "30",
    productFormat: "Capsules",
    directions: "Take once daily, ideally 20-30 minutes before meal with 8 oz water.",
    bestFor: "Adults seeking daily focus and cognitive support.",
    whyHeadline: "A daily nootropic blend built for focus and memory support.",
    scienceHeadline: "Vitamins, minerals and a disclosed nootropic blend in one routine.",
    ingredientsHeadline: "Cognitive support ingredients for focus-led routines.",
    evidenceHeadline: "Backed by a disclosed total nootropic blend",
    comparisonHeadline: "BioAro vs typical cognitive support formulas",
    faqHeadline: "MindSync FAQ",
    supplyLabel: "30-day supply",
    warnings: ["Consult a physician if under 18, pregnant, nursing, or managing a medical condition.", "Iron overdose warning.", "Keep away from children.", "Use only if safety seal is intact.", "Store cool and dry."],
    otherIngredients: [],
    allergenInfo: "Contains soy and fish.",
  },
  {
    sku: "ROC824",
    handle: "magbalance",
    title: "MagBalance",
    heroEyebrow: "Daily Wellness / Minerals",
    category: "Wellness",
    tagline: "Magnesium glycinate for muscle, nerve and relaxation support.",
    description: "Highly bioavailable magnesium glycinate formula positioned to support muscle and nerve function, relaxation, electrolyte balance, sleep quality and recovery.",
    tags: ["Magnesium", "Relaxation", "Recovery", "Muscle"],
    benefits: ["Glycinate form", "250mg magnesium", "Simple daily routine"],
    packName: "Magnesium Glycinate",
    servingSize: "2 capsules",
    servingsPerContainer: "30",
    productFormat: "Capsules",
    directions: "2 capsules once daily.",
    bestFor: "Adults seeking daily magnesium support.",
    whyHeadline: "A simple magnesium routine built around glycinate form.",
    scienceHeadline: "Disclosed magnesium glycinate support in a daily capsule format.",
    ingredientsHeadline: "Magnesium support for recovery, relaxation and routine use.",
    evidenceHeadline: "Backed by disclosed magnesium content",
    comparisonHeadline: "BioAro vs typical magnesium supplements",
    faqHeadline: "MagBalance FAQ",
    supplyLabel: "30-day supply",
    warnings: ["Pregnancy, nursing, under-18 and medical-condition caution.", "Store cool and dry."],
    otherIngredients: ["Hypromellose", "Magnesium Stearate", "Silicon Dioxide", "Rice Flour"],
    allergenInfo: "No specific allergen statement supplied in the source PDF.",
  },
  {
    sku: "ROC937",
    handle: "vitalgreens",
    title: "VitalGreens",
    heroEyebrow: "Daily Wellness / Greens",
    category: "Wellness",
    tagline: "Organic greens, fruits and probiotics for everyday nutritional support.",
    description: "Superfood blend combining organic greens, antioxidant-rich fruit ingredients, probiotics and plant ingredients for daily nutrition and digestive wellness.",
    tags: ["Greens", "Daily Nutrition", "Digestion", "Antioxidants"],
    benefits: ["Organic greens base", "Fruit and plant blend", "Probiotic ingredient"],
    packName: "Strawberry Watermelon Greens Blend",
    servingSize: "11.4g",
    servingsPerContainer: "30",
    productFormat: "Powder",
    directions: "1 scoop with 8-12 fl oz water.",
    bestFor: "Adults seeking a convenient daily greens formula.",
    whyHeadline: "A greens formula built around everyday nutritional support.",
    scienceHeadline: "Organic greens, fruits and probiotics in one daily blend.",
    ingredientsHeadline: "Greens and probiotic support for everyday routines.",
    evidenceHeadline: "Backed by disclosed greens and probiotic ingredients",
    comparisonHeadline: "BioAro vs typical greens formulas",
    faqHeadline: "VitalGreens FAQ",
    supplyLabel: "30-day supply",
    warnings: ["Healthy adults only.", "Not for under 18.", "Not for pregnant or nursing individuals.", "Consult a healthcare professional if you have a medical condition.", "Facility also processes major allergens."],
    otherIngredients: [],
    allergenInfo: "Contains wheat.",
  },
  {
    sku: "ROC808",
    handle: "joint-flex",
    title: "Joint Flex",
    heroEyebrow: "Mobility / Joint Support",
    category: "Wellness",
    tagline: "Multi-ingredient joint formula for comfort, mobility and flexibility.",
    description: "Joint formula combining Glucosamine, Chondroitin, MSM, Boswellia, Turmeric, Quercetin, Bromelain and Methionine.",
    tags: ["Joints", "Mobility", "Flexibility", "Cartilage"],
    benefits: ["Joint matrix", "Cartilage support", "Mobility-focused formula"],
    packName: "Joint Support Complex",
    servingSize: "3 capsules",
    servingsPerContainer: "20",
    productFormat: "Capsules",
    directions: "3 daily before meal. Artwork also recommends 6 per day for the first 2 weeks as a loading dose; this instruction requires internal review.",
    bestFor: "Active adults seeking ongoing joint and mobility support.",
    whyHeadline: "A mobility-focused formula with disclosed joint support actives.",
    scienceHeadline: "Glucosamine, boswellia and complementary joint-support ingredients together.",
    ingredientsHeadline: "Joint support ingredients for active daily routines.",
    evidenceHeadline: "Backed by disclosed joint support ingredients",
    comparisonHeadline: "BioAro vs typical joint support formulas",
    faqHeadline: "Joint Flex FAQ",
    supplyLabel: "20-day supply",
    warnings: ["Glucosamine is shellfish-derived.", "Contains shellfish.", "Consult a physician if you have a medical condition.", "Review the loading-dose instruction internally before publishing final directions."],
    otherIngredients: [],
    allergenInfo: "Contains shellfish.",
  },
  {
    sku: "ROC503",
    handle: "natural-pct",
    title: "Natural PCT",
    heroEyebrow: "Men's Wellness / Post-Cycle Support",
    category: "Wellness",
    tagline: "Botanical post-cycle nutritional support.",
    description: "Specialised post-cycle formula containing botanical blends intended to support hormonal balance, liver function and overall recovery.",
    tags: ["Post-Cycle", "Recovery", "Male Wellness"],
    benefits: ["Three-blend formula", "Post-cycle routine", "Liver and recovery ingredients"],
    packName: "Post-Cycle Support",
    servingSize: "2 capsules",
    servingsPerContainer: "30",
    productFormat: "Capsules",
    directions: "2 capsules at night for 4-8 weeks. Do not exceed 8 continuous weeks.",
    bestFor: "Individuals seeking nutritional support following periods of intensive supplementation or training.",
    whyHeadline: "A botanical formula built around post-cycle support.",
    scienceHeadline: "Disclosed botanical blend totals for post-cycle routines.",
    ingredientsHeadline: "Botanical support ingredients for recovery-focused routines.",
    evidenceHeadline: "Backed by disclosed blend totals",
    comparisonHeadline: "BioAro vs typical post-cycle support formulas",
    faqHeadline: "Natural PCT FAQ",
    supplyLabel: "30-day supply",
    warnings: ["Consult a licensed physician.", "Do not take with prostate hypertrophy, liver disease, kidney disease or heart disease.", "Keep away from children."],
    otherIngredients: ["Gelatin capsule", "Rice Flour"],
    allergenInfo: "Gelatin capsule means the product is not vegan.",
  },
  {
    sku: "ROC506",
    handle: "ultra-test",
    title: "Ultra Test",
    heroEyebrow: "Men's Wellness",
    category: "Wellness",
    tagline: "Natural testosterone-support formula for male vitality and performance.",
    description: "Men's wellness formula featuring Tribulus, Longjack, Horny Goat Weed, Zinc, Magnesium, Saw Palmetto, Hawthorn and Cissus.",
    tags: ["Men's Wellness", "Vitality", "Performance", "Recovery"],
    benefits: ["Mineral support", "Botanical blend", "Male performance routine"],
    packName: "Natural Testosterone Support",
    servingSize: "3 capsules",
    servingsPerContainer: "30",
    productFormat: "Capsules",
    directions: "3 before bedtime.",
    bestFor: "Men seeking nutritional support for healthy testosterone levels already within the normal range and general vitality.",
    whyHeadline: "A men's wellness formula built around disclosed actives.",
    scienceHeadline: "Minerals and botanicals combined for a nightly routine.",
    ingredientsHeadline: "Men's vitality ingredients in a disclosed formula.",
    evidenceHeadline: "Backed by disclosed active ingredient doses",
    comparisonHeadline: "BioAro vs typical men's vitality formulas",
    faqHeadline: "Ultra Test FAQ",
    supplyLabel: "30-day supply",
    warnings: ["Consult a physician if you have a medical condition.", "Do not use if pregnant or lactating.", "Use only if safety seal is intact.", "Store cool and dry."],
    otherIngredients: [],
    allergenInfo: "No specific allergen statement supplied in the source PDF.",
  },
  {
    sku: "ROC303",
    handle: "digestive-enzyme",
    title: "Digestive Enzyme",
    heroEyebrow: "Digestive Wellness",
    category: "Wellness",
    tagline: "Broad-spectrum enzyme support for everyday digestion.",
    description: "Broad-spectrum digestive enzyme formula containing proteases, lactase, alpha-galactosidase, Bromelain, Papain and beneficial probiotics.",
    tags: ["Digestion", "Enzymes", "Nutrient Absorption", "Digestive Comfort"],
    benefits: ["Broad-spectrum enzymes", "Protein, dairy and carbohydrate digestion", "Probiotic ingredients"],
    packName: "Digestive Enzyme Support",
    servingSize: "1 veggie capsule",
    servingsPerContainer: "60 label servings / ~30 days at suggested use",
    productFormat: "Veggie capsules",
    directions: "1 capsule twice daily, 20-30 minutes before meal.",
    bestFor: "Adults seeking digestive enzyme support with meals.",
    whyHeadline: "A broad-spectrum enzyme routine for everyday digestion.",
    scienceHeadline: "Enzyme activity units and probiotic ingredients in one formula.",
    ingredientsHeadline: "Enzyme support ingredients for digestive comfort routines.",
    evidenceHeadline: "Backed by disclosed enzyme activity units",
    comparisonHeadline: "BioAro vs typical digestive enzyme formulas",
    faqHeadline: "Digestive Enzyme FAQ",
    supplyLabel: "~30-day supply at suggested use",
    warnings: ["Do not exceed dose.", "Consult a physician if under 18, pregnant, nursing, or managing a medical condition.", "Use only if safety seal is intact.", "Store cool and dry."],
    otherIngredients: [],
    allergenInfo: "No specific allergen statement supplied in the source PDF.",
  },
  {
    sku: "ROC831",
    handle: "vitamin-k2-d3",
    title: "Vitamin K2 + D3",
    heroEyebrow: "Bone & Mineral Wellness",
    category: "Wellness",
    tagline: "D3 + K2 with calcium and BioPerine for bone and skeletal support.",
    description: "Synergistic combination of Vitamins D3 and K2 with calcium and BioPerine, positioned to support calcium utilisation, bone strength and muscle function.",
    tags: ["Bone Health", "Vitamin D3", "Vitamin K2", "Calcium"],
    benefits: ["D3 and K2 pairing", "Calcium support", "BioPerine"],
    packName: "Bone Support Complex",
    servingSize: "1 veggie capsule",
    servingsPerContainer: "60 label servings / ~30 days at suggested use",
    productFormat: "Veggie capsules",
    directions: "1 capsule twice daily, 20-30 minutes before meal with 8 oz water.",
    bestFor: "Adults seeking combined D3, K2 and calcium support.",
    whyHeadline: "A simple D3, K2 and calcium routine for daily support.",
    scienceHeadline: "D3, K2, calcium and BioPerine in one routine.",
    ingredientsHeadline: "Bone and mineral support ingredients for everyday use.",
    evidenceHeadline: "Backed by disclosed active ingredient doses",
    comparisonHeadline: "BioAro vs typical bone support formulas",
    faqHeadline: "Vitamin K2 + D3 FAQ",
    supplyLabel: "~30-day supply at suggested use",
    warnings: ["Consult a physician if under 18, pregnant, nursing, or managing a medical condition.", "Use only if safety seal is intact.", "Store cool and dry."],
    otherIngredients: [],
    allergenInfo: "Vegetarian suitability is not explicitly confirmed beyond veggie capsule.",
  },
  {
    sku: "ROC613",
    handle: "energized-aminos",
    title: "Energized Aminos",
    heroEyebrow: "Performance / Amino Energy",
    category: "Performance",
    tagline: "Amino acids plus an energy blend for active days and training.",
    description: "Amino-acid formula designed to support energy and exercise recovery.",
    tags: ["Aminos", "Energy", "Pre-Workout", "Recovery"],
    benefits: ["5g amino blend", "Flexible training timing", "Energy blend"],
    packName: "Peach Mango Amino Blend",
    servingSize: "9g",
    servingsPerContainer: "40",
    productFormat: "Powder",
    directions: "1 scoop with 6-8 oz cold water. Use in the morning, between meals, 20-30 min pre-training, or immediately post-training depending on use.",
    bestFor: "Active users wanting amino acids with stimulant-based energy support.",
    whyHeadline: "An amino and energy blend built for active routines.",
    scienceHeadline: "Amino support and stimulant blend in one flexible formula.",
    ingredientsHeadline: "Amino and energy support ingredients for training days.",
    evidenceHeadline: "Backed by disclosed amino and energy blend totals",
    comparisonHeadline: "BioAro vs typical amino energy formulas",
    faqHeadline: "Energized Aminos FAQ",
    supplyLabel: "40 servings",
    warnings: ["Consult a healthcare professional if pregnant, nursing, under 18, managing a medical condition, or taking prescription or OTC medication.", "Contains stimulant ingredients."],
    otherIngredients: [],
    allergenInfo: "No specific allergen statement supplied in the source PDF.",
  },
  {
    sku: "ROC736",
    handle: "adrenal-support-plus",
    title: "Adrenal Support Plus",
    heroEyebrow: "Daily Wellness / Stress Support",
    category: "Wellness",
    tagline: "Adaptogenic support for resilience, energy and recovery.",
    description: "Adaptogenic wellness formula featuring Cordyceps, Rhodiola, Eleuthero, Chlorella, Burdock and botanical ingredients traditionally used to support the body during periods of physical or mental demand.",
    tags: ["Stress Support", "Adaptogens", "Energy", "Resilience"],
    benefits: ["Stress response", "Energy", "Resilience", "Recovery"],
    packName: "Adaptogenic Wellness Support",
    servingSize: "2 capsules",
    servingsPerContainer: "30",
    productFormat: "Capsules",
    directions: "2 capsules at breakfast or before 2 PM, or as directed by a healthcare professional.",
    bestFor: "Adults seeking daily adaptogenic support during demanding periods.",
    whyHeadline: "Adaptogenic botanical support for demanding days.",
    scienceHeadline: "Cordyceps, Rhodiola and supportive botanicals in one routine.",
    ingredientsHeadline: "Stress-support ingredients for resilience-focused routines.",
    evidenceHeadline: "Backed by disclosed botanical ingredient doses",
    comparisonHeadline: "BioAro vs typical stress support formulas",
    faqHeadline: "Adrenal Support Plus FAQ",
    supplyLabel: "30-day supply",
    warnings: ["Consult a healthcare practitioner if pregnant, nursing, taking medications or with a medical condition.", "Keep away from children.", "Store cool and dry.", "Use only if seal is intact."],
    otherIngredients: ["Plant-source capsule (cellulose, water)"],
    allergenInfo: "No specific allergen statement supplied in the source PDF.",
  },
];

const args = new Set(process.argv.slice(2));
const apply = args.has("--apply");
const shopDomain = process.env.SHOPIFY_ADMIN_SHOP_DOMAIN;
const accessToken = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;
const apiVersion = process.env.SHOPIFY_ADMIN_API_VERSION ?? "2026-07";

if (!shopDomain || !accessToken) {
  throw new Error("SHOPIFY_ADMIN_SHOP_DOMAIN and SHOPIFY_ADMIN_ACCESS_TOKEN are required.");
}

const endpoint = `https://${shopDomain}/admin/api/${apiVersion}/graphql.json`;

async function graphql(query, variables = {}) {
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Access-Token": accessToken,
    },
    body: JSON.stringify({ query, variables }),
  });
  const json = await response.json();
  if (!response.ok || json.errors?.length) {
    throw new Error(JSON.stringify(json.errors ?? json, null, 2));
  }
  return json.data;
}

function assertNoUserErrors(result, key) {
  const errors = result[key]?.userErrors ?? [];
  if (errors.length) {
    throw new Error(`${key}: ${errors.map((error) => error.message).join("; ")}`);
  }
  return result[key];
}

async function productByHandle(handle) {
  const data = await graphql(
    `query ProductByHandle($query: String!) {
      products(first: 2, query: $query) {
        nodes { id handle title status }
      }
    }`,
    { query: `handle:${handle}` },
  );
  return data.products.nodes.find((item) => item.handle === handle) ?? null;
}

async function metaobjectByHandle(type, handle) {
  const data = await graphql(
    `query MetaobjectByHandle($handle: MetaobjectHandleInput!) {
      metaobjectByHandle(handle: $handle) { id type handle }
    }`,
    { handle: { type, handle } },
  );
  return data.metaobjectByHandle ?? null;
}

async function metaobjectDefinitions() {
  const data = await graphql(`query MetaobjectDefinitions {
    metaobjectDefinitions(first: 100) {
      nodes { id type name }
    }
  }`);
  return data.metaobjectDefinitions.nodes;
}

async function metafieldDefinitions() {
  const data = await graphql(`query MetafieldDefinitions {
    metafieldDefinitions(first: 250, ownerType: PRODUCT) {
      nodes { namespace key type { name } }
    }
  }`);
  return data.metafieldDefinitions.nodes.filter((definition) => definition.namespace === "custom");
}

async function createMetaobject(type, handle, fields) {
  const result = await graphql(
    `mutation MetaobjectCreate($metaobject: MetaobjectCreateInput!) {
      metaobjectCreate(metaobject: $metaobject) {
        metaobject { id type handle }
        userErrors { field message }
      }
    }`,
    {
      metaobject: {
        type,
        handle,
        fields,
      },
    },
  );
  return assertNoUserErrors(result, "metaobjectCreate").metaobject;
}

async function ensureBottomCta(type, handle, cta) {
  const existing = await metaobjectByHandle(type, handle);
  if (existing) return existing.id;
  const created = await createMetaobject(type, handle, [
    { key: "headline", value: cta.headline },
    { key: "supporting_text", value: cta.supportingText },
    { key: "button_label", value: cta.buttonLabel },
    { key: "button_link", value: cta.buttonLink },
  ]);
  return created.id;
}

function formatValueForType(value, type) {
  if (value == null) return "";
  if (type === "single_line_text_field") {
    if (Array.isArray(value)) return value.join("; ");
    return String(value).replace(/\s*\n+\s*/g, "; ");
  }
  if (type === "multi_line_text_field") {
    if (Array.isArray(value)) return value.join("\n");
    return String(value);
  }
  return String(value);
}

function metafieldsFor(product, primaryCtaId, secondaryCtaId, metafieldTypes) {
  const otherIngredients = product.otherIngredients.length ? product.otherIngredients.join("\n") : "";
  return [
    ["hero_eyebrow", product.heroEyebrow, "single_line_text_field"],
    ["category", product.category, "single_line_text_field"],
    ["pdp_subtitle", product.tagline, "single_line_text_field"],
    ["short_description", product.description, "multi_line_text_field"],
    ["hero_tags", product.tags, "single_line_text_field"],
    ["hero_bullets", product.benefits, "multi_line_text_field"],
    ["pack_name", product.packName, "single_line_text_field"],
    ["supply_label", product.supplyLabel, "single_line_text_field"],
    ["serving_size", product.servingSize, "single_line_text_field"],
    ["servings_per_container", product.servingsPerContainer, "single_line_text_field"],
    ["product_format", product.productFormat, "single_line_text_field"],
    ["directions", product.directions, "multi_line_text_field"],
    ["warnings_headline", "Warnings", "single_line_text_field"],
    ["warnings", product.warnings, "multi_line_text_field"],
    ["allergen_info", product.allergenInfo, "multi_line_text_field"],
    ["other_ingredients", otherIngredients, "multi_line_text_field"],
    ["best_for_label", "Best for", "single_line_text_field"],
    ["best_for_description", product.bestFor, "multi_line_text_field"],
    ["why_formula_eyebrow", `Why ${product.title}?`, "single_line_text_field"],
    ["why_formula_headline", product.whyHeadline, "single_line_text_field"],
    ["why_formula_body", product.bestFor, "multi_line_text_field"],
    ["science_eyebrow", "Behind the formula", "single_line_text_field"],
    ["science_headline", product.scienceHeadline, "single_line_text_field"],
    ["ingredients_eyebrow", "Key ingredients", "single_line_text_field"],
    ["ingredients_headline", product.ingredientsHeadline, "single_line_text_field"],
    ["supplement_facts_headline", "Supplement facts", "single_line_text_field"],
    ["evidence_headline", product.evidenceHeadline, "single_line_text_field"],
    ["comparison_headline", product.comparisonHeadline, "single_line_text_field"],
    ["comparison_bioaro_label", product.title, "single_line_text_field"],
    ["comparison_typical_label", "Typical supplement", "single_line_text_field"],
    ["quality_headline", "Quality & Purity", "single_line_text_field"],
    ["faq_eyebrow", "FAQ", "single_line_text_field"],
    ["faq_headline", product.faqHeadline, "single_line_text_field"],
    ["bottom_cta_primary", primaryCtaId, "metaobject_reference"],
    ["bottom_cta_secondary", secondaryCtaId, "metaobject_reference"],
  ].filter(([, value]) => Boolean(value)).map(([key, value, fallbackType]) => {
    const type = metafieldTypes.get(key) ?? fallbackType;
    return {
    namespace: "custom",
    key,
    type,
    value: formatValueForType(value, type),
  };
  });
}

async function resolveBottomCtaType() {
  const definitions = await metaobjectDefinitions();
  const match = definitions.find((definition) => definition.type.endsWith("--bioaro_bottom_cta"));
  if (!match) {
    throw new Error("Could not find the BioAro bottom CTA metaobject definition in Shopify.");
  }
  return match.type;
}

async function updateProduct(product, primaryCtaId, secondaryCtaId, metafieldTypes) {
  const existing = await productByHandle(product.handle);
  if (!existing) {
    throw new Error(`Product ${product.handle} does not exist in Shopify.`);
  }

  const result = await graphql(
    `mutation ProductUpdate($product: ProductUpdateInput!) {
      productUpdate(product: $product) {
        product { id handle title status }
        userErrors { field message }
      }
    }`,
    {
      product: {
        id: existing.id,
        title: product.title,
        descriptionHtml: product.description,
        metafields: metafieldsFor(product, primaryCtaId, secondaryCtaId, metafieldTypes),
      },
    },
  );

  return assertNoUserErrors(result, "productUpdate").product;
}

async function main() {
  const bottomCtaType = await resolveBottomCtaType();
  const metafieldTypes = new Map((await metafieldDefinitions()).map((definition) => [definition.key, definition.type.name]));
  const primaryCtaId = await ensureBottomCta(bottomCtaType, "global-primary-cta", GLOBAL_PRIMARY_CTA);
  const secondaryCtaId = await ensureBottomCta(bottomCtaType, "global-secondary-cta", GLOBAL_SECONDARY_CTA);

  const results = [];
  for (const product of PRODUCTS) {
    if (!apply) {
      results.push({
        handle: product.handle,
        action: "would_populate_scalar_metafields",
        fieldCount: metafieldsFor(product, primaryCtaId, secondaryCtaId, metafieldTypes).length,
      });
      continue;
    }
    const updated = await updateProduct(product, primaryCtaId, secondaryCtaId, metafieldTypes);
    results.push({
      handle: product.handle,
      action: "populated_scalar_metafields",
      title: updated.title,
      status: updated.status,
      fieldCount: metafieldsFor(product, primaryCtaId, secondaryCtaId, metafieldTypes).length,
    });
  }

  console.log(JSON.stringify({
    shopDomain,
    apiVersion,
    apply,
    updatedCount: results.filter((item) => item.action === "populated_scalar_metafields").length,
    results,
  }, null, 2));
}

main().catch((error) => {
  console.error(error instanceof Error ? error.stack : error);
  process.exitCode = 1;
});
