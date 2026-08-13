export type AskSourceKind = "faq" | "product" | "journal";

export interface AskSource {
  kind: AskSourceKind;
  /** What to show as the provenance line, e.g. "FAQ - Safety" or "LONgevity+". */
  label: string;
  /** Market-relative path. The caller applies useMarketHref. */
  href: string;
}

export interface AskAnswer {
  question: string;
  /** Verbatim approved copy. Never generated, never paraphrased. */
  answer: string;
  source: AskSource;
}

export type AskResult =
  /** One or more retrieved answers, best first. */
  | { kind: "answer"; answers: AskAnswer[] }
  /** The question is really "which product should I take" - hand off to the quiz. */
  | { kind: "needs-quiz" }
  /** Medical, clinical or urgent. No answer, no product, refer to a professional. */
  | { kind: "sensitive" }
  /** Nothing scored high enough to be worth showing. */
  | { kind: "no-match" };
