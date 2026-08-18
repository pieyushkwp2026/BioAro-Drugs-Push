# BioAro Drugs AI Model And Partner Services Handoff

**Audience:** AI, backend, product, safety, data, and frontend teams  
**Status:** Implementation handoff  
**Canonical source:** This Markdown file  
**Last reviewed:** 2026-08-18

## 1. Executive Summary

BioAro Drugs AI is a 360-degree everyday-health assistant combining advanced BioAro product knowledge with guidance shaped by clinical experience.

The experience has two layers:

1. **Public exploration:** approved product, ingredient, usage, quality, availability, and educational answers.
2. **Member continuity:** a persistent workspace for goals, protocol building, routine refinement, and conversation history.

The AI may interpret intent, retrieve approved content, ask structured follow-up questions, build a protocol, and identify an approved partner service. It must not diagnose, prescribe, interpret prescriptions, make drug-interaction decisions, or invent product facts.

The partner layer is a controlled commercial recommendation system. The model can identify a relevant category, but a backend policy engine decides whether a partner can be shown.

## 2. Current State Versus Production Target

| Area | Implemented today | Production target |
| --- | --- | --- |
| Public Q&A | Local approved-content retrieval | Server-side retrieval with citations |
| Intent interpretation | Keyword fallback; optional interpretation endpoint seam | Validated model output with goal allowlist |
| Protocol builder | Deterministic rules in buildProtocol | Model-assisted clarification with deterministic policy validation |
| Safety | Client classifier for approved retrieval | Server-side safety classifier and refusal policy |
| Product facts | Local editorial data and Shopify mapping | Versioned approved knowledge index |
| Market | Local market configuration | Server-enforced market and catalogue filters |
| Membership | Demo snapshot or unavailable backend | Verified account entitlement |
| History | Browser localStorage; resumable new records | Authenticated account storage |
| Images | Browser-only object URLs; no upload or interpretation | Explicit attachment service, still no prescription interpretation in V1 |
| Partner services | Partner page exists; no AI recommendation registry | Registry plus deterministic policy endpoint |

## 3. Product Positioning And Boundaries

### Core positioning

**Ask. Build. Evolve.**

- **Ask:** understand BioAro products, ingredients, usage, availability, and approved education.
- **Build:** turn stated goals and routine answers into a structured starting protocol.
- **Evolve:** return to the workspace and refine the routine over time.

### Do not position the product as

- Medical diagnosis or treatment
- A prescribing service
- A prescription or medication interpreter
- A drug interaction checker
- Biomarker or genetic analysis
- A replacement for a doctor, pharmacist, or qualified healthcare professional
- A guarantee of health outcomes

## 4. User Journeys

    Homepage
      -> Public Q&A
      -> Approved answer, safety referral, or protocol handoff

    Homepage goal input
      -> Intent interpretation
      -> Validate approved goals
      -> Protocol Studio
      -> Market AI workspace
      -> Structured protocol
      -> Optional partner policy
      -> Product and partner outputs

### Entry points

- Homepage free-text AI input
- Homepage goal chips and persona cards
- Homepage floating AI control
- Header AI & Protocols link
- Account Open BioAro Drugs AI action for eligible members
- Public membership page
- Direct /:market/ai visits
- Previous chat resume control

### Homepage goal handoff

1. User enters a goal.
2. Frontend calls intent interpretation.
3. Returned goal IDs are filtered against the approved GOALS list.
4. The protocol session stores the original wording and selected goals.
5. The user continues in Protocol Studio.
6. The app routes to /:market/ai?goals=focus,recovery when the full workspace is selected.

## 5. Input Parameters

### 5.1 Intent request

    interface InterpretRequest {
      message: string;
      selectedGoals: GoalId[];
      market: string;
      sessionContext?: Record<string, unknown>;
    }

| Parameter | Importance | Validation |
| --- | --- | --- |
| message | Original user wording; preserves provenance and supports interpretation | Required, trimmed, maximum 200 characters |
| selectedGoals | Prevents the model from discarding an explicit user choice | Array of approved goal IDs |
| market | Controls product, price, availability, and partner eligibility | uk, us, ca, or ae |
| sessionContext | Provides non-clinical continuity | Allowlisted fields only; never raw prescription or clinical records |

### 5.2 Public Q&A request

    interface AskRequest {
      query: string;
      market: string;
      selectedGoals?: GoalId[];
      conversationId?: string | null;
    }

### 5.3 Protocol request

    interface ProtocolRequest {
      market: string;
      goals: GoalId[];
      answers: PartialAnswers;
      clinicalFlag: boolean;
      existingSupplements?: SupplementsAnswer;
      sessionId?: string;
    }

### 5.4 Protocol answer fields

| Field | Accepted values | Why it matters |
| --- | --- | --- |
| energy | steady, dips, crashes | Can add daily foundational support |
| sleep | restful, inconsistent, poor | Can add recovery context and safety messaging; there is no approved sleep formula |
| training | daily, sometimes, rarely | Can add recovery or performance support |
| sex | female, male, prefer-not-to-say | Can route to a gender-specific multivitamin; skip remains valid |
| age | under-30, 30-49, 50-plus | Can add the approved D3/K2 product for 50-plus |
| activity | sedentary, moderate, very-active | Can affect training-related protein routing |
| stress | low, moderate, high | Can add approved stress/adaptogen or magnesium context |
| diet | omnivore, vegetarian, vegan | Selects plant protein versus whey when training is relevant |
| supplements | none, multivitamin, omega-3, protein | Prevents duplicate or overlapping recommendations |

### 5.5 Clinical screener

    interface ClinicalContext {
      clinicalFlag: boolean;
    }

The current question asks whether the user is pregnant or breastfeeding, taking prescription medication, or managing a diagnosed condition. The answer may trigger professional-guidance copy. It must not alter the product list.

### 5.6 Partner context

    interface PartnerContext {
      market: MarketCode;
      goals: GoalId[];
      nonClinicalSignals: string[];
      explicitServiceInterest?: string;
      previousPartnerIds?: string[];
    }

Only non-clinical signals may reach partner eligibility. The backend should derive nonClinicalSignals from an allowlist rather than forwarding the complete conversation.

## 6. Goal Model

    type GoalId =
      | "energy"
      | "longevity"
      | "focus"
      | "recovery"
      | "sleep"
      | "performance"
      | "womens-health";

Rules:

- Unknown goal IDs are rejected.
- Multiple goals are preserved in selection order.
- Duplicate goals are removed.
- The model cannot introduce a product by inventing a goal.
- sleep must be handled honestly because no approved sleep formula is currently available.
- Product visibility is checked against the active market.

## 7. Adaptive Questions

    interface QuestionOption {
      value: string;
      label: string;
    }

    interface ProtocolQuestion {
      id: string;
      field: AnswerField;
      stage: "about" | "clinical" | "precision";
      prompt: string;
      options: QuestionOption[];
      appliesTo?: GoalId[];
    }

A question earns a place only when at least one possible answer changes the protocol items, slot, rationale, or required disclosure. Do not ask a fixed questionnaire when the answer cannot change the result.

precision is reserved for future biomarkers, labs, genetics, or wearables and must not be presented as live capability.

## 8. Product Recommendation Output

    interface ProtocolItem {
      handle: string;
      slot: "Morning" | "Around training" | "Evening";
      reason: string;
    }

    interface Protocol {
      items: ProtocolItem[];
      notes: string[];
    }

### Output importance

- handle: stable product identity; must exist in the approved catalogue.
- slot: makes the output actionable without inventing dosage.
- reason: explains the relationship to the user-stated goal or answer.
- notes: carries honest limitations and safety disclosures.

### Product controls

- The model never owns price, inventory, or availability.
- Handles are validated against Shopify or approved catalogue data.
- Product details are retrieved by handle after model output validation.
- Reasons must be grounded in approved product copy.
- Doses, ingredients, evidence, and claims must come from approved sources.
- Existing supplement overlap can remove a product.
- No unrelated product may be substituted for an unavailable goal.

## 9. Public Q&A API

Current frontend boundary:

    type AskResult =
      | { kind: "answer"; answers: AskAnswer[] }
      | { kind: "needs-quiz" }
      | { kind: "sensitive" }
      | { kind: "no-match" };

    interface AskAnswer {
      question: string;
      answer: string;
      source: {
        kind: "product" | "faq" | "journal";
        label: string;
        href: string;
      };
    }

Production endpoint:

    POST /api/bioaro-ai/ask

Example request:

    {
      "query": "How much NMN is in LONgevity+?",
      "market": "US",
      "selectedGoals": ["longevity"],
      "conversationId": null
    }

Example response:

    {
      "requestId": "req_123",
      "kind": "answer",
      "answers": [{
        "question": "How much NMN is in LONgevity+?",
        "answer": "Approved source text...",
        "source": {
          "kind": "product",
          "label": "LONgevity+",
          "href": "/us/products/longevity-plus"
        }
      }],
      "partnerRecommendations": [],
      "safety": {
        "status": "allowed",
        "clinicalReviewRequired": false,
        "disclaimer": "BioAro Drugs AI provides general product guidance..."
      },
      "provenance": {
        "model": "approved-retrieval-v1",
        "retrievalSources": ["product:longevity-plus:ingredient:nmn"],
        "policyVersion": "ai-policy-v1"
      }
    }

Response states:

- answer: approved content was found.
- needs-quiz: user asked for a personal product choice.
- sensitive: professional guidance is required.
- no-match: no grounded answer was found.
- error: service failure; client may offer retry.

## 10. Intent Interpretation API

    POST /api/bioaro-ai/interpret

    interface InterpretResponse {
      interpretedGoals: GoalId[];
      confidence: number;
      summary: string;
      suggestedNextQuestion?: string;
      builderContext?: { primaryGoals: GoalId[] };
    }

Validation requirements:

- Confidence must be numeric and bounded from 0 to 1.
- interpretedGoals must contain only approved IDs.
- summary must be a plain acknowledgement, not a health claim.
- Raw model text must not be rendered without schema validation.
- Prompt injection must not override system policy or catalogue boundaries.

## 11. Combined AI Response

    interface BioAroAiResponse {
      requestId: string;
      kind: "answer" | "protocol" | "clarification" | "sensitive" | "no-match" | "error";
      summary?: string;
      answers?: AskAnswer[];
      protocol?: Protocol;
      nextQuestion?: ProtocolQuestion;
      partnerRecommendations?: PartnerRecommendation[];
      safety: {
        status: "allowed" | "referral" | "blocked";
        clinicalReviewRequired: boolean;
        disclaimer: string;
      };
      provenance: {
        model: string;
        retrievalSources: string[];
        policyVersion: string;
      };
    }

| Output | Importance |
| --- | --- |
| requestId | Trace support incidents without exposing user content |
| kind | Selects the correct UI state |
| summary | Safe user-facing acknowledgement |
| answers | Grounded, cited information |
| protocol | Structured routine output |
| nextQuestion | Continuation of the builder |
| partnerRecommendations | Optional controlled ecosystem promotion |
| safety | Mandatory safety and disclosure boundary |
| provenance | Auditability and source transparency |

## 12. Partner-Service Promotion

### Registry

    interface PartnerService {
      id: string;
      name: string;
      description: string;
      category:
        | "sports-performance"
        | "healthy-ageing"
        | "testing-and-insights"
        | "professional-support"
        | "other";
      approvedMarkets: MarketCode[];
      approvedGoals: GoalId[];
      approvedAnswerSignals: string[];
      excludedSignals: string[];
      url: string;
      ctaLabel: string;
      disclosure: string;
      status: "active" | "draft" | "paused";
    }

Initial registry records:

- biosports: draft until approved service description, URL, markets, and rules exist.
- biogevity: draft until approved service description, URL, markets, and rules exist.
- bioaro-labs: draft until approved service description, URL, markets, and rules exist.

### Matching policy

Allowed signals:

- Explicit goals
- Training and performance interest
- Healthy-ageing interest
- Interest in evidence or testing
- Explicit service requests
- Approved non-clinical lifestyle answers

Blocked signals:

- Diagnoses or symptoms
- Medication or prescription content
- Pregnancy or breastfeeding
- Clinical flags
- Biomarkers or genetics
- Inferred medical risk
- Protected health information

The final eligibility decision must be made by backend policy, not by model confidence alone.

### Partner output

    interface PartnerRecommendation {
      partnerId: string;
      name: string;
      reason: string;
      ctaLabel: string;
      href: string;
      disclosure: string;
      confidence: number;
      eligibility: {
        market: boolean;
        goal: boolean;
        policy: boolean;
      };
    }

Rules:

- Maximum one or two partner recommendations per response.
- Always label partner content clearly.
- Show partner cards below or beside BioAro product answers, never as the primary medical-looking answer.
- Suppress on sensitive requests, clinical flags, unsupported markets, missing metadata, or missing disclosure.
- Do not imply clinical endorsement, guaranteed results, or required purchase.

### Partner endpoint

    POST /api/bioaro-ai/partner-recommendations

Request:

    {
      "market": "US",
      "goals": ["performance", "recovery"],
      "answers": {
        "training": "daily",
        "activity": "very-active"
      },
      "explicitInterest": null,
      "safetyStatus": "allowed"
    }

Response:

    {
      "recommendations": [],
      "suppressed": [],
      "policyVersion": "partner-policy-v1"
    }

Every displayed recommendation must include:

    Partner service suggested based on your stated interests. BioAro Drugs may have a commercial relationship with this partner.

## 13. Safety Pipeline

    Input
      -> Auth and market validation
      -> Prompt injection check
      -> Sensitive and clinical classifier
      -> Approved retrieval
      -> Protocol engine
      -> Partner eligibility policy
      -> Schema, citation, and disclosure validation
      -> Client response

Production safety must be server-side. The current client denylist is acceptable only for retrieving already-approved copy; it is not sufficient for generated health text.

Partner recommendations must be disabled if safety status is referral, clinicalFlag is true, prescription or medication context exists, partner metadata is missing, market is unsupported, or disclosure is missing.

## 14. Retrieval And Knowledge Model

Approved sources:

- Shopify product data and metafields
- Product ingredients, amounts, supplement facts, warnings, and quality claims
- FAQs and approved journal content
- Market availability and prices
- Partner registry and partner-approved service descriptions

Recommended retrieval document:

    {
      "documentId": "product:longevity-plus:ingredient:nmn",
      "sourceType": "product_ingredient",
      "productHandle": "longevity-plus",
      "market": ["GB", "US", "CA", "AE"],
      "content": "Approved source text...",
      "sourceUrl": "/us/products/longevity-plus",
      "sourceVersion": "shopify_updated_at",
      "allowedUses": ["product_question", "protocol_reason"],
      "blockedUses": ["diagnosis", "treatment", "drug_interaction"],
      "visibility": "published"
    }

Partner documents must be indexed separately from product documents and must include partnerId, commercial status, market restrictions, and disclosure text.

## 15. Image And Attachment Handling

### Current behavior

- User selects label or prescription before choosing a file.
- The file becomes a browser object URL.
- No upload, OCR, or model interpretation occurs.
- Images are excluded from local history.
- The object URL is revoked when the thread is cleared.

### Proposed future boundary

    POST /api/bioaro-ai/attachments

    interface AttachmentRequest {
      intent: "label" | "prescription";
      market: MarketCode;
      conversationId: string;
      contentType: string;
      size: number;
      checksum: string;
    }

    interface AttachmentResponse {
      attachmentId: string;
      intent: "label" | "prescription";
      status: "stored" | "rejected" | "expired";
      expiresAt: string;
      interpretationStatus: "not_requested";
    }

Prescription attachments remain storage/reference-only until a separate approved clinical workflow exists.

## 16. Advanced AI And Membership APIs

Eligibility predicate:

    membership.status == "active"
    AND membership.tierId in ["essential", "plus"]

Proposed endpoints:

    GET  /api/member/snapshot
    POST /api/member/conversations
    GET  /api/member/conversations
    GET  /api/member/conversations/:id
    POST /api/member/conversations/:id/messages
    POST /api/member/protocols
    GET  /api/member/protocols
    POST /api/member/attachments

Every endpoint requires authenticated account ownership and market isolation. A successful checkout must not grant AI access until the backend membership snapshot confirms eligibility.

## 17. Conversation History

Current local shape:

    interface Conversation {
      id: string;
      market: string;
      title: string;
      startedAt: string;
      updatedAt: string;
      turns: Turn[];
      session?: ProtocolSession;
    }

Current turn types:

- ai: assistant text
- you: user text
- ask: structured Q&A question plus result
- image: local attachment reference, stripped before persistence

New records can be resumed with goals and answers. Older records without saved session state restore text safely. Production history must move to authenticated account storage and must not place health or attachment content in URLs, analytics, or unencrypted client storage.

## 18. Shopify And Membership Commerce

    Membership page
      -> Shopify variant and selling plan
      -> First-party checkout
      -> Shopify purchase
      -> Membership success page
      -> Backend membership refresh
      -> Verified entitlement
      -> Advanced AI access

Shopify owns price, currency, selling plan, billing interval, availability, and market eligibility. The AI never controls commerce or entitlement.

## 19. Error And Fallback Matrix

| Failure | User-visible result | System behavior |
| --- | --- | --- |
| Empty input | Ask for a question or goal | Do not call the model |
| Input too long | Shorten the message | Reject before request |
| Unknown goal | Clarification | Do not create a product |
| No retrieval match | No approved answer found | Offer search, quiz, or support |
| Sensitive request | Professional-guidance response | Do not retrieve product advice or partners |
| Invalid model JSON | Temporary error | Log schema failure and use deterministic fallback |
| Unknown product handle | No product shown | Reject output and log grounding failure |
| Unsupported market | Market unavailable | Do not show price or partner CTA |
| Partner metadata missing | No partner card | Suppress recommendation |
| Missing disclosure | No partner card | Reject partner output |
| Membership unavailable | Retry/support gate | Do not unlock workspace |
| Attachment rejected | Explain file limitation | Do not persist or interpret |
| Timeout or rate limit | Retry later | Apply backoff and rate limiting |
| Conversation save failure | Continue current session | Make persistence failure visible to member |

## 20. Observability And Evaluation

Track non-sensitive metrics:

- Intent interpretation success and rejection rate
- Retrieval answer and no-match rate
- Safety referral rate
- Protocol completion and abandonment rate
- Partner recommendation and suppression rate
- Partner CTA clicks and conversion
- Invalid structured-output rate
- Product grounding failures
- Conversation resume success
- Latency and errors by endpoint and market

Do not send raw health answers, prescriptions, medication details, or clinical flags to analytics by default.

Evaluation sets must include:

- Single and multi-goal prompts
- Ambiguous goals
- Product and ingredient-dose questions
- Availability questions
- Recommendation requests
- Sensitive and emergency prompts
- Prompt-injection attempts
- Existing supplement overlap
- Sleep-goal limitations
- Partner matching and suppression cases
- Unsupported markets
- Invalid model output
- Cross-account and cross-market isolation

## 21. Visual References

The handoff should be reviewed alongside these repository visuals:

![Product context](../src/assets/products/creagen-brain-boost-01-hero-1x1.jpg)

![Protocol and training context](../src/assets/home-optimized/routine-training.jpg)

![Evidence and science context](../src/assets/home-optimized/evidence-formulation.jpg)

![BioAro homepage context](../src/assets/home-optimized/hero-runners-sunrise.jpg)

These images are visual references only. They are not model outputs and must not be treated as clinical evidence. The implementation package should also include current screenshots of /us/ai, the Previous chats modal, and /us/membership when the final backend build is reviewed.

## 22. Implementation Checklist

1. Confirm backend hosting, authentication, and account identity binding.
2. Define the approved partner registry.
3. Supply approved BioSports, Biogevity, and BioAro Labs descriptions, URLs, markets, and disclosures.
4. Implement server-side safety and prompt-injection classification.
5. Ingest Shopify and approved editorial content into a versioned retrieval index.
6. Implement /api/bioaro-ai/interpret.
7. Implement /api/bioaro-ai/ask.
8. Implement protocol recommendation and question selection.
9. Implement partner eligibility policy and /api/bioaro-ai/partner-recommendations.
10. Add structured-output, product-handle, source, and disclosure validation.
11. Add membership entitlement checks.
12. Add authenticated conversation and protocol persistence.
13. Add attachment storage boundary without prescription interpretation.
14. Add rate limiting, audit logging, and non-sensitive observability.
15. Connect frontend feature flags and fallback behavior.
16. Run safety, grounding, partner, privacy, and regression evaluations.
17. Launch behind a controlled feature flag.

## 23. Interface Inventory

### Existing frontend contracts

- InterpretRequest
- InterpretResponse
- InterpretResult
- AskResult
- AskAnswer
- ProtocolQuestion
- ProtocolAnswers
- ProtocolItem
- Protocol
- Conversation
- Turn
- MemberRequest
- MemberSnapshot
- MembershipOffer

### Proposed backend contracts

- AskRequest
- ProtocolRequest
- PartnerService
- PartnerContext
- PartnerRecommendation
- BioAroAiResponse
- AttachmentRequest
- AttachmentResponse

### Sensitive/private data

- Clinical flags
- Prescription references
- Medication context
- Account identity
- Member conversations
- Attachment metadata

These fields must never be used for uncontrolled partner promotion or exposed to analytics by default.

## 24. Final Safety Position

BioAro Drugs AI can help users understand approved information, structure goals, assemble a routine, return to previous work, and discover approved BioAro partner services.

It cannot determine what is medically right for a person. Partner promotion is a transparent service-discovery layer governed by approved metadata, market policy, safety state, and commercial disclosure.

The production launch is complete only when every displayed answer, product, price, source, partner, and entitlement is traceable to an approved system of record.

