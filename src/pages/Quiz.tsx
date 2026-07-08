import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Clock3, RotateCcw, ShieldCheck, Sparkles } from "lucide-react";
import quizHero from "../assets/quiz/wellness-quiz-hero.png";

const QUESTIONS = [
  { q: "What's your main goal right now?", options: ["Live longer", "Think sharper", "Recover faster", "Sleep deeper"] },
  { q: "How would you describe your energy by 3pm?", options: ["Strong all day", "Dips a little", "Crashes hard"] },
  { q: "How's your sleep lately?", options: ["Restful", "Inconsistent", "Poor"] },
  { q: "Do you train or exercise regularly?", options: ["Daily", "A few times a week", "Rarely"] },
];

const RESULTS: Record<string, { name: string; handle: string; reason: string }> = {
  "Live longer": { name: "Longevity+", handle: "longevity-plus", reason: "is positioned as a strong starting point for a longevity-focused daily routine." },
  "Think sharper": { name: "Creagen Brain Boost", handle: "creagen-brain-boost", reason: "fits a workday routine built around concentration and steady daytime output." },
  "Recover faster": { name: "Creagen Pro Power", handle: "creagen-pro-power", reason: "sits at the center of the recovery performance protocol." },
  "Sleep deeper": { name: "CellOmega+", handle: "cellomega-plus", reason: "is a foundational product that can support a broader daily routine while the sleep range grows." },
};

const TRUST_CUES = [
  { Icon: Clock3, title: "Under 2 minutes", body: "A guided routine check-in with no overwhelm." },
  { Icon: ShieldCheck, title: "Science-backed", body: "Built around daily goals, not guesswork." },
  { Icon: Sparkles, title: "Personalized fit", body: "We suggest a clear starting point you can refine." },
];

export default function Quiz() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);

  const select = (option: string) => {
    const next = [...answers, option];
    setAnswers(next);
    setStep(step + 1);
  };

  const restart = () => {
    setAnswers([]);
    setStep(0);
  };

  const done = step >= QUESTIONS.length;
  const result = done ? RESULTS[answers[0]] : null;
  const progress = done ? 100 : ((step + 1) / QUESTIONS.length) * 100;

  return (
    <div className="relative overflow-hidden bg-[#f8f5ef] pb-16 pt-24 sm:pb-20 md:pt-28 lg:pt-32">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[320px] bg-[radial-gradient(circle_at_top,rgba(223,234,223,0.45),transparent_65%)]" />
      <div className="pointer-events-none absolute right-[-120px] top-[320px] h-[280px] w-[280px] rounded-full bg-[radial-gradient(circle,rgba(224,210,185,0.28),transparent_68%)] blur-3xl" />

      <div className="container-bio relative">
        <div className="overflow-hidden rounded-[30px] border border-[#e3dccf] bg-[#fbf8f2] shadow-[0_28px_90px_-56px_rgba(52,42,30,0.38)]">
          <div className="h-[240px] bg-[#f4eee2] sm:h-[320px] lg:h-[520px]">
            <img src={quizHero} alt="BioAro wellness quiz hero" className="h-full w-full object-contain" />
          </div>
        </div>

        <div className="mx-auto mt-8 max-w-[920px] lg:mt-10">
          <div className="rounded-[30px] border border-[rgba(80,70,55,0.12)] bg-[rgba(255,252,247,0.9)] px-5 py-6 shadow-[0_28px_80px_-54px_rgba(45,38,28,0.18)] backdrop-blur-sm sm:px-7 sm:py-8 lg:px-8 lg:py-9">
            {!done && (
              <>
                <div className="flex flex-col items-start gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
                  <span className="text-[10.5px] font-semibold uppercase tracking-[0.14em] text-[#6e665f] sm:text-[11.5px] sm:tracking-[0.18em]">
                    Wellness quiz · Step {step + 1} of {QUESTIONS.length}
                  </span>
                  <span className="rounded-full border border-[#ddd5c8] bg-[#f7f2e9] px-3 py-1 text-[11px] font-medium text-[#5e554f]">
                    Personalized guidance
                  </span>
                </div>

                <div className="mt-4 h-2 overflow-hidden rounded-full bg-[#e8e0d4]">
                  <div
                    className="h-full rounded-full bg-forest-600 transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>

                <h2 className="mt-7 max-w-[18ch] text-[28px] leading-[1.08] text-ink sm:text-[34px] lg:text-[44px]">
                  {QUESTIONS[step].q}
                </h2>
                <p className="mt-3 text-[14px] leading-6 text-[#776f67]">
                  Choose the option that feels closest right now. There&apos;s no perfect answer.
                </p>

                <div className="mt-7 grid gap-3 sm:grid-cols-2">
                  {QUESTIONS[step].options.map((opt) => (
                    <button
                      key={opt}
                      onClick={() => select(opt)}
                      className="group min-h-[76px] rounded-[22px] border border-[#e0d9cc] bg-white px-5 py-4 text-left text-[15px] font-medium text-[#221f1b] shadow-[0_16px_36px_-34px_rgba(45,38,28,0.4)] transition duration-200 hover:-translate-y-0.5 hover:border-forest-600/35 hover:bg-[#fcfaf6] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest-600/30"
                    >
                      <div className="flex items-center justify-between gap-4">
                        <span>{opt}</span>
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#e2ddd2] bg-[#faf7f1] text-[#81776d] transition-colors group-hover:border-forest-600/20 group-hover:text-forest-600">
                          <ArrowRight size={15} />
                        </span>
                      </div>
                    </button>
                  ))}
                </div>

                <p className="mt-5 text-[12.5px] leading-5 text-[#8a8178]">
                  Your recommendation is a starting point for exploration, not medical advice.
                </p>
              </>
            )}

            {done && result && (
              <div className="text-center">
                <span className="eyebrow">Your match</span>
                <h2 className="mt-4 text-[34px] leading-[0.98] text-ink sm:text-[44px] lg:text-[48px]">{result.name}</h2>
                <p className="mx-auto mt-5 max-w-[44ch] text-[15px] leading-7 text-[#3f3a34] sm:text-[16px]">
                  Based on your answers, <span className="font-medium text-ink">{result.name}</span> looks like a sensible
                  starting point because it {result.reason}
                </p>
                <div className="mx-auto mt-7 max-w-[520px] rounded-[24px] border border-[#e2dbce] bg-[#faf7f1] px-5 py-5 text-left">
                  <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-[#7f756d]">Why this fit works</p>
                  <ul className="mt-4 space-y-2 text-[14px] leading-6 text-[#4a433c]">
                    <li>Supports a clearer daily starting point instead of guesswork.</li>
                    <li>Aligns with the goal you prioritized first in the quiz.</li>
                    <li>Can be used as a foundation and refined as your routine evolves.</li>
                  </ul>
                </div>
                <p className="mx-auto mt-4 max-w-[42ch] text-[12.5px] leading-5 text-[#8a8178]">
                  This quick quiz is meant to guide exploration, not replace personalized medical advice.
                </p>
                <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                  <Link to={`/shop/${result.handle}`} className="btn-primary justify-center">
                    View {result.name} <ArrowRight size={15} />
                  </Link>
                  <button onClick={restart} className="btn-secondary justify-center">
                    <RotateCcw size={15} /> Retake quiz
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mx-auto mt-8 max-w-[1240px] lg:mt-10">
          <div className="rounded-[30px] border border-[#e3dccf] bg-[linear-gradient(180deg,rgba(252,249,243,0.94),rgba(247,242,234,0.98))] px-6 py-7 shadow-[0_24px_80px_-58px_rgba(52,42,30,0.35)] sm:px-8 sm:py-8">
            <span className="eyebrow">Guided consultation</span>
            <h2 className="mt-4 max-w-[12ch] text-[31px] leading-[1] text-ink sm:text-[38px] lg:text-[52px]">
              Find your daily BioAro protocol.
            </h2>
            <p className="mt-5 max-w-[48ch] text-[15px] leading-7 text-[#3f3a34] sm:text-[16px]">
              Answer a few guided questions and we&apos;ll help match your goals to a starting stack for energy,
              focus, recovery, sleep, or longevity.
            </p>

            <div className="mt-7 grid gap-3 sm:grid-cols-3">
              {TRUST_CUES.map(({ Icon, title, body }) => (
                <div
                  key={title}
                  className="rounded-[22px] border border-[#e4ddd1] bg-white/70 px-4 py-4 shadow-[0_16px_40px_-34px_rgba(50,42,32,0.34)]"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#edf2ea] text-forest-600">
                    <Icon size={18} />
                  </div>
                  <p className="mt-4 text-[14px] font-semibold text-ink">{title}</p>
                  <p className="mt-1 text-[12.5px] leading-5 text-[#756b62]">{body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
