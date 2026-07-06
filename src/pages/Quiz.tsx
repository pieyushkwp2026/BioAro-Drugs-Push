import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, RotateCcw } from "lucide-react";

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

export default function Quiz() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);

  const select = (option: string) => {
    const next = [...answers, option];
    setAnswers(next);
    setStep(step + 1);
  };

  const restart = () => { setAnswers([]); setStep(0); };
  const done = step >= QUESTIONS.length;
  const result = done ? RESULTS[answers[0]] : null;

  return (
    <div className="pt-32 pb-24 min-h-screen flex items-center">
      <div className="container-bio max-w-2xl mx-auto w-full">
        {!done && (
          <>
            <span className="eyebrow">Wellness quiz · Step {step + 1} of {QUESTIONS.length}</span>
            <div className="h-1 rounded-full bg-ink/10 mt-4 mb-10 overflow-hidden">
              <div className="h-full bg-forest-600 transition-all duration-500" style={{ width: `${((step) / QUESTIONS.length) * 100}%` }} />
            </div>
            <h1 className="text-3xl md:text-4xl mb-8">{QUESTIONS[step].q}</h1>
            <div className="grid sm:grid-cols-2 gap-3">
              {QUESTIONS[step].options.map((opt) => (
                <button key={opt} onClick={() => select(opt)} className="glass-card text-left p-5 text-sm font-medium hover:border-forest-600/40">
                  {opt}
                </button>
              ))}
            </div>
          </>
        )}

        {done && result && (
          <div className="text-center">
            <span className="eyebrow">Your match</span>
            <h1 className="text-4xl mt-3">{result.name}</h1>
            <p className="text-ink/55 mt-4 max-w-md mx-auto leading-relaxed">
              Based on your answers, {result.name} looks like a sensible starting point because it {result.reason}
            </p>
            <p className="text-xs text-ink/40 mt-3 max-w-md mx-auto">
              This quick quiz is meant to guide exploration, not replace personalized medical advice.
            </p>
            <div className="flex flex-wrap justify-center gap-3 mt-8">
              <Link to={`/shop/${result.handle}`} className="btn-primary">View {result.name} <ArrowRight size={15} /></Link>
              <button onClick={restart} className="btn-secondary"><RotateCcw size={15} /> Retake quiz</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
