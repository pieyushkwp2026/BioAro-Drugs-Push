"use client";

import Image from "next/image";
import { useId } from "react";

/* ------------------------------------------------------------------ */
/* Hero — ecosystem sculpture                                          */
/* ------------------------------------------------------------------ */

const HERO_PARTICLES = [
  { left: "16%", top: "72%", size: 3, delay: "0s", duration: "12s" },
  { left: "26%", top: "58%", size: 2, delay: "2.4s", duration: "10s" },
  { left: "44%", top: "80%", size: 2, delay: "1.2s", duration: "13s" },
  { left: "58%", top: "70%", size: 3, delay: "4s", duration: "11s" },
  { left: "72%", top: "62%", size: 2, delay: "0.8s", duration: "12s" },
  { left: "84%", top: "74%", size: 2, delay: "3.2s", duration: "10s" },
  { left: "36%", top: "40%", size: 2, delay: "5s", duration: "14s" },
  { left: "66%", top: "34%", size: 2, delay: "6.2s", duration: "12s" },
];

export function HeroEcosystemVisual() {
  const uid = useId().replace(/[:]/g, "");

  return (
    <div className="relative mx-auto w-full max-w-[1120px] select-none">
      <div className="relative aspect-[1.5] w-full">
        <div className="absolute inset-x-7 bottom-5 top-8 rounded-[44px] border border-white/[0.06] bg-[radial-gradient(ellipse_100%_72%_at_50%_36%,rgba(0,183,255,0.16),rgba(0,183,255,0.04)_30%,transparent_72%),linear-gradient(180deg,#06111F,#03070D)] shadow-[0_42px_120px_rgba(0,0,0,0.5)]" />
        <div className="absolute left-[11%] top-[13%] h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(47,211,255,0.1),transparent_65%)] blur-3xl" />
        <div className="absolute right-[3%] top-[14%] h-[26rem] w-[26rem] rounded-full bg-[radial-gradient(circle,rgba(0,183,255,0.08),transparent_68%)] blur-3xl" />
        <div className="absolute left-[28%] top-[32%] h-[30rem] w-[30rem] rounded-full bg-[radial-gradient(circle,rgba(0,183,255,0.18),rgba(0,183,255,0.04)_34%,transparent_70%)] blur-3xl" />

        <svg aria-hidden="true" viewBox="0 0 960 760" className="absolute inset-0 h-full w-full">
        <defs>
          <radialGradient id={`${uid}-core`} cx="50%" cy="42%" r="60%">
            <stop offset="0%" stopColor="#F4FCFF" />
            <stop offset="22%" stopColor="#79DFFF" />
            <stop offset="52%" stopColor="#1A7FB5" />
            <stop offset="100%" stopColor="#06101F" />
          </radialGradient>
          <radialGradient id={`${uid}-coreGlow`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(117,227,255,0.44)" />
            <stop offset="54%" stopColor="rgba(0,183,255,0.16)" />
            <stop offset="100%" stopColor="rgba(0,183,255,0)" />
          </radialGradient>
          <linearGradient id={`${uid}-orbit`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(117,227,255,0.02)" />
            <stop offset="46%" stopColor="rgba(92,206,255,0.7)" />
            <stop offset="100%" stopColor="rgba(117,227,255,0.02)" />
          </linearGradient>
          <linearGradient id={`${uid}-helix`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(117,227,255,0)" />
            <stop offset="18%" stopColor="rgba(117,227,255,0.9)" />
            <stop offset="82%" stopColor="rgba(0,183,255,0.72)" />
            <stop offset="100%" stopColor="rgba(0,183,255,0)" />
          </linearGradient>
          <linearGradient id={`${uid}-helixDim`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(117,227,255,0)" />
            <stop offset="18%" stopColor="rgba(117,227,255,0.36)" />
            <stop offset="82%" stopColor="rgba(0,183,255,0.28)" />
            <stop offset="100%" stopColor="rgba(0,183,255,0)" />
          </linearGradient>
          <linearGradient id={`${uid}-glass`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#162A43" />
            <stop offset="45%" stopColor="#0B172C" />
            <stop offset="100%" stopColor="#050B15" />
          </linearGradient>
          <linearGradient id={`${uid}-capsule`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#72DAFF" />
            <stop offset="48%" stopColor="#1B86BC" />
            <stop offset="50%" stopColor="#10253D" />
            <stop offset="100%" stopColor="#08111F" />
          </linearGradient>
          <linearGradient id={`${uid}-bottle`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1B2D43" />
            <stop offset="48%" stopColor="#0C1728" />
            <stop offset="100%" stopColor="#04070D" />
          </linearGradient>
          <linearGradient id={`${uid}-rim`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(117,227,255,0.85)" />
            <stop offset="60%" stopColor="rgba(0,183,255,0.28)" />
            <stop offset="100%" stopColor="rgba(0,183,255,0)" />
          </linearGradient>
          <filter id={`${uid}-blur`} x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="7" />
          </filter>
          <filter id={`${uid}-soft`} x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="2.2" />
          </filter>
        </defs>

        <g className="animate-orbitSlow" style={{ transformOrigin: "490px 344px" }}>
          <ellipse
            cx="490"
            cy="344"
            rx="300"
            ry="108"
            fill="none"
            stroke={`url(#${uid}-orbit)`}
            strokeWidth="1.4"
            transform="rotate(-10 490 344)"
          />
          <ellipse
            cx="490"
            cy="344"
            rx="240"
            ry="176"
            fill="none"
            stroke="rgba(92,206,255,0.12)"
            strokeWidth="1"
            transform="rotate(24 490 344)"
          />
        </g>

        <g className="animate-orbitSlower" style={{ transformOrigin: "490px 344px" }}>
          <ellipse
            cx="490"
            cy="344"
            rx="360"
            ry="128"
            fill="none"
            stroke="rgba(92,206,255,0.1)"
            strokeWidth="1"
            transform="rotate(14 490 344)"
          />
          <circle cx="258" cy="256" r="2.6" fill="#75E3FF" opacity="0.85" />
          <circle cx="662" cy="196" r="2.8" fill="#B8EEFF" opacity="0.95" />
          <circle cx="778" cy="360" r="2.2" fill="#2FD3FF" opacity="0.7" />
        </g>

        <circle cx="490" cy="344" r="176" fill={`url(#${uid}-coreGlow)`} />
        <circle cx="490" cy="344" r="76" fill="none" stroke="rgba(117,227,255,0.24)" strokeWidth="1.2" />
        <circle cx="490" cy="344" r="50" fill={`url(#${uid}-core)`} />
        <circle cx="490" cy="344" r="50" fill="none" stroke="rgba(220,247,255,0.32)" strokeWidth="1" />
        <path
          d="M490 138 L 490 542"
          fill="none"
          stroke="rgba(117,227,255,0.14)"
          strokeWidth="1"
        />
        <path
          d="M286 344 L 694 344"
          fill="none"
          stroke="rgba(117,227,255,0.1)"
          strokeWidth="1"
        />
        <circle cx="490" cy="344" r="6" fill="#D9F7FF" opacity="0.9" filter={`url(#${uid}-soft)`} />
        <ellipse cx="490" cy="344" rx="30" ry="10" fill="rgba(255,255,255,0.2)" filter={`url(#${uid}-soft)`} />
        <path
          d="M478 336 C 484 331, 496 331, 502 336"
          fill="none"
          stroke="rgba(255,255,255,0.42)"
          strokeWidth="1.1"
        />

        <g filter={`url(#${uid}-soft)`} opacity="0.95">
          <path
            d="M108 124 C 176 162, 176 208, 108 246 C 40 284, 40 330, 108 368 C 176 406, 176 452, 108 490"
            fill="none"
            stroke={`url(#${uid}-helix)`}
            strokeWidth="3.6"
            strokeLinecap="round"
          />
          <path
            d="M196 124 C 128 162, 128 208, 196 246 C 264 284, 264 330, 196 368 C 128 406, 128 452, 196 490"
            fill="none"
            stroke={`url(#${uid}-helixDim)`}
            strokeWidth="2.8"
            strokeLinecap="round"
          />
        </g>
        <g stroke="rgba(117,227,255,0.42)" strokeWidth="1.5">
          <line x1="120" y1="146" x2="156" y2="146" />
          <line x1="112" y1="194" x2="164" y2="194" />
          <line x1="112" y1="298" x2="164" y2="298" />
          <line x1="120" y1="350" x2="156" y2="350" />
          <line x1="112" y1="448" x2="164" y2="448" />
        </g>
        <g fill="#75E3FF">
          <circle cx="120" cy="146" r="2.6" opacity="0.9" />
          <circle cx="164" cy="194" r="2.2" opacity="0.72" />
          <circle cx="112" cy="298" r="2.4" opacity="0.84" />
          <circle cx="156" cy="350" r="2" opacity="0.62" />
          <circle cx="164" cy="448" r="2.2" opacity="0.76" />
        </g>

        <g className="animate-floatSoft" style={{ transformOrigin: "470px 338px" }}>
          <ellipse cx="496" cy="562" rx="186" ry="18" fill="rgba(0,0,0,0.5)" filter={`url(#${uid}-blur)`} />
          <ellipse cx="496" cy="572" rx="160" ry="12" fill="rgba(0,183,255,0.1)" filter={`url(#${uid}-blur)`} />
          <ellipse cx="496" cy="556" rx="116" ry="24" fill="rgba(0,183,255,0.07)" />
        </g>

        <g className="animate-floatSoft" style={{ transformOrigin: "812px 322px" }}>
          <ellipse cx="814" cy="338" rx="70" ry="94" fill="rgba(0,183,255,0.1)" filter={`url(#${uid}-blur)`} />
          <rect x="788" y="188" width="50" height="32" rx="8" fill="#08111D" />
          <rect x="788" y="188" width="50" height="8" rx="4" fill="rgba(117,227,255,0.24)" />
          <path d="M792 220 L 834 220 L 842 236 L 784 236 Z" fill="#0A1526" />
          <rect x="766" y="236" width="96" height="204" rx="18" fill={`url(#${uid}-bottle)`} />
          <path d="M774 252 C 770 302, 770 366, 774 418" fill="none" stroke={`url(#${uid}-rim)`} strokeWidth="2.4" strokeLinecap="round" />
          <rect x="774" y="282" width="80" height="86" rx="7" fill="rgba(8,15,26,0.95)" />
          <line x1="774" y1="282" x2="854" y2="282" stroke="rgba(117,227,255,0.28)" strokeWidth="1" />
          <rect x="784" y="302" width="38" height="4" rx="2" fill="rgba(201,213,230,0.52)" />
          <rect x="784" y="316" width="56" height="3" rx="1.5" fill="rgba(146,167,194,0.32)" />
          <rect x="784" y="334" width="26" height="3" rx="1.5" fill="rgba(92,206,255,0.46)" />
          <circle cx="804" cy="346" r="1.7" fill="rgba(117,227,255,0.7)" />
        </g>

        <g className="animate-float" style={{ transformOrigin: "690px 546px" }}>
          <rect x="654" y="534" width="54" height="20" rx="10" fill={`url(#${uid}-capsule)`} transform="rotate(-18 681 544)" />
          <rect x="706" y="568" width="42" height="18" rx="9" fill={`url(#${uid}-capsule)`} transform="rotate(14 727 577)" opacity="0.88" />
          <rect x="628" y="578" width="28" height="12" rx="6" fill={`url(#${uid}-capsule)`} transform="rotate(8 642 584)" opacity="0.8" />
        </g>

        <g stroke="rgba(92,206,255,0.28)" strokeWidth="1.1">
          <line x1="722" y1="452" x2="742" y2="418" />
          <line x1="742" y1="418" x2="772" y2="434" />
          <line x1="694" y1="492" x2="722" y2="452" />
        </g>
        <g fill="#2FD3FF">
          <circle cx="722" cy="452" r="2.6" opacity="0.7" />
          <circle cx="742" cy="418" r="2.2" opacity="0.5" />
          <circle cx="772" cy="434" r="2" opacity="0.45" />
          <circle cx="694" cy="492" r="2.4" opacity="0.55" />
        </g>

        <g stroke="rgba(92,206,255,0.12)" strokeWidth="1">
          <line x1="268" y1="562" x2="734" y2="562" />
        </g>
        </svg>

        <div className="absolute left-[12%] top-[31%] z-20 hidden w-[160px] rounded-[22px] border border-[rgba(92,206,255,0.22)] bg-[rgba(7,19,34,0.72)] px-4 py-4 shadow-[0_24px_50px_rgba(0,0,0,0.26)] backdrop-blur-md md:block">
          <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-bioaro-soft/90">
            BioAro Labs
          </p>
          <div className="mt-4 space-y-3 text-sm text-bioaro-text">
            <p>Genomics</p>
            <p>Microbiome</p>
            <p>Biomarkers</p>
            <p>AI Analytics</p>
          </div>
        </div>

        <div className="absolute right-[8%] top-[31%] z-20 hidden w-[160px] rounded-[22px] border border-[rgba(92,206,255,0.22)] bg-[rgba(7,19,34,0.72)] px-4 py-4 shadow-[0_24px_50px_rgba(0,0,0,0.26)] backdrop-blur-md md:block">
          <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-bioaro-soft/90">
            BioAro Drugs
          </p>
          <div className="mt-4 space-y-3 text-sm text-bioaro-text">
            <p>Bioactive Wellness</p>
            <p>Targeted Formulas</p>
            <p>Evidence Backed</p>
          </div>
        </div>

        <div className="absolute left-1/2 top-[47%] z-20 -translate-x-1/2 -translate-y-1/2 text-center">
          <p className="font-display text-lg text-white/90 md:text-[1.45rem]">BioAro</p>
          <p className="mt-1 font-display text-[1.55rem] font-semibold tracking-[0.12em] text-white md:text-[2.35rem]">
            Live 2.0
          </p>
          <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.26em] text-bioaro-soft/80">
            Genomic Intelligence
          </p>
        </div>

        <div className="absolute bottom-8 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2 whitespace-nowrap rounded-full border border-[rgba(92,206,255,0.18)] bg-[rgba(7,19,34,0.78)] px-4 py-2 shadow-[0_16px_30px_rgba(0,0,0,0.2)] backdrop-blur-md md:hidden">
          <span className="text-[9px] font-mono uppercase tracking-[0.24em] text-bioaro-soft/90">
            BioAro Labs
          </span>
          <span className="text-white/30">•</span>
          <span className="text-[9px] font-mono uppercase tracking-[0.24em] text-bioaro-soft/90">
            BioAro Drugs
          </span>
        </div>

        {HERO_PARTICLES.map((particle, index) => (
          <span
            key={index}
            className="animate-riseParticle absolute z-10 rounded-full bg-bioaro-soft/70"
            style={{
              left: particle.left,
              top: particle.top,
              width: particle.size,
              height: particle.size,
              animationDelay: particle.delay,
              animationDuration: particle.duration,
            }}
          />
        ))}
      </div>

      <div className="mt-4 flex flex-col items-center px-6 text-center md:mt-5">
        <p className="text-xs tracking-[0.18em] text-bioaro-muted md:text-xs">
          <span className="text-bioaro-soft">Understand</span>
          <span className="mx-3 text-bioaro-steel">·</span>
          <span className="text-white">Take Action</span>
          <span className="mx-3 text-bioaro-steel">·</span>
          <span className="text-bioaro-soft">Live 2.0</span>
        </p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Offering card scenes                                                */
/* ------------------------------------------------------------------ */

export function LabsSceneVisual() {
  return (
    <div className="relative h-56 w-full overflow-hidden rounded-[18px] bg-[linear-gradient(180deg,#071222,#040A12)]">
      <Image
        src="/images/offerings/labs-visual.png"
        alt=""
        aria-hidden="true"
        fill
        sizes="(max-width: 768px) 100vw, 50vw"
        className="object-cover object-center"
      />
    </div>
  );
}

export function DrugsSceneVisual() {
  return (
    <div className="relative h-56 w-full overflow-hidden rounded-[18px] bg-[linear-gradient(180deg,#071222,#040A12)]">
      <Image
        src="/images/offerings/drugs-visual.png"
        alt=""
        aria-hidden="true"
        fill
        sizes="(max-width: 768px) 100vw, 50vw"
        className="object-cover object-center"
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Product vessel renders                                              */
/* ------------------------------------------------------------------ */

export type VesselVariant = "tall" | "wide" | "capsule";

export function ProductVesselVisual({
  variant = "tall",
  accent = 1,
}: {
  variant?: VesselVariant;
  accent?: number;
}) {
  const uid = useId().replace(/[:]/g, "");
  const glow = 0.1 + accent * 0.05;

  return (
    <div
      className="relative h-64 w-full overflow-hidden rounded-[18px]"
      style={{
        background: `radial-gradient(ellipse 130% 90% at 50% -10%, rgba(0,183,255,${glow}), transparent 60%), linear-gradient(180deg, #0A1830 0%, #050C17 100%)`,
      }}
    >
      <svg aria-hidden="true" viewBox="0 0 300 256" className="h-full w-full">
        <defs>
          <linearGradient id={`${uid}-body`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#182B44" />
            <stop offset="48%" stopColor="#0C1930" />
            <stop offset="100%" stopColor="#050D1A" />
          </linearGradient>
          <linearGradient id={`${uid}-rim`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(117,227,255,0.9)" />
            <stop offset="70%" stopColor="rgba(0,183,255,0.2)" />
            <stop offset="100%" stopColor="rgba(0,183,255,0)" />
          </linearGradient>
          <linearGradient id={`${uid}-cap`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#5CCEFF" />
            <stop offset="50%" stopColor="#1B84B8" />
            <stop offset="50.2%" stopColor="#10263E" />
            <stop offset="100%" stopColor="#081321" />
          </linearGradient>
          <filter id={`${uid}-glow`} x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="6" />
          </filter>
        </defs>

        {/* faint molecule field */}
        <g stroke="rgba(92,206,255,0.16)" strokeWidth="1">
          <line x1="46" y1="60" x2="80" y2="44" />
          <line x1="46" y1="60" x2="60" y2="94" />
          <line x1="236" y1="88" x2="262" y2="70" />
        </g>
        <g fill="rgba(47,211,255,0.4)">
          <circle cx="46" cy="60" r="2.6" />
          <circle cx="80" cy="44" r="2" />
          <circle cx="60" cy="94" r="1.8" />
          <circle cx="236" cy="88" r="2.2" />
          <circle cx="262" cy="70" r="1.6" />
        </g>

        {/* ground */}
        <ellipse cx="150" cy="234" rx="72" ry="9" fill="rgba(0,0,0,0.55)" filter={`url(#${uid}-glow)`} />
        <ellipse cx="150" cy="140" rx="70" ry="86" fill={`rgba(0,183,255,${glow})`} filter={`url(#${uid}-glow)`} />

        {variant === "tall" ? (
          <g>
            <rect x="126" y="38" width="48" height="26" rx="6" fill="#0A1626" />
            <rect x="126" y="38" width="48" height="7" rx="3.5" fill="rgba(117,227,255,0.22)" />
            <path d="M130 64 L 170 64 L 178 84 L 122 84 Z" fill="#0B1A2E" />
            <rect x="104" y="84" width="92" height="148" rx="16" fill={`url(#${uid}-body)`} />
            <path d="M112 98 C 108 138, 108 182, 112 220" fill="none" stroke={`url(#${uid}-rim)`} strokeWidth="2.4" strokeLinecap="round" />
            <path d="M188 102 C 191 142, 191 178, 188 216" fill="none" stroke="rgba(92,206,255,0.18)" strokeWidth="1.4" strokeLinecap="round" />
            <rect x="112" y="122" width="76" height="64" rx="7" fill="rgba(10,22,40,0.94)" />
            <line x1="112" y1="122" x2="188" y2="122" stroke="rgba(117,227,255,0.32)" strokeWidth="1" />
            <line x1="112" y1="186" x2="188" y2="186" stroke="rgba(117,227,255,0.14)" strokeWidth="1" />
            <rect x="121" y="138" width="42" height="4.5" rx="2.25" fill="rgba(201,213,230,0.55)" />
            <rect x="121" y="151" width="58" height="3" rx="1.5" fill="rgba(146,167,194,0.32)" />
            <rect x="121" y="168" width="28" height="3.5" rx="1.75" fill="rgba(92,206,255,0.5)" />
          </g>
        ) : null}

        {variant === "wide" ? (
          <g>
            <rect x="112" y="66" width="76" height="24" rx="7" fill="#0A1626" />
            <rect x="112" y="66" width="76" height="7" rx="3.5" fill="rgba(117,227,255,0.22)" />
            <rect x="96" y="90" width="108" height="142" rx="20" fill={`url(#${uid}-body)`} />
            <path d="M105 106 C 100 146, 100 184, 105 218" fill="none" stroke={`url(#${uid}-rim)`} strokeWidth="2.6" strokeLinecap="round" />
            <path d="M195 110 C 199 148, 199 182, 195 214" fill="none" stroke="rgba(92,206,255,0.18)" strokeWidth="1.4" strokeLinecap="round" />
            <rect x="106" y="126" width="88" height="62" rx="7" fill="rgba(10,22,40,0.94)" />
            <line x1="106" y1="126" x2="194" y2="126" stroke="rgba(117,227,255,0.32)" strokeWidth="1" />
            <line x1="106" y1="188" x2="194" y2="188" stroke="rgba(117,227,255,0.14)" strokeWidth="1" />
            <rect x="116" y="142" width="48" height="4.5" rx="2.25" fill="rgba(201,213,230,0.55)" />
            <rect x="116" y="155" width="66" height="3" rx="1.5" fill="rgba(146,167,194,0.32)" />
            <rect x="116" y="171" width="32" height="3.5" rx="1.75" fill="rgba(92,206,255,0.5)" />
          </g>
        ) : null}

        {variant === "capsule" ? (
          <g>
            <rect x="132" y="52" width="44" height="24" rx="6" fill="#0A1626" />
            <rect x="132" y="52" width="44" height="7" rx="3.5" fill="rgba(117,227,255,0.22)" />
            <path d="M136 76 L 172 76 L 179 94 L 129 94 Z" fill="#0B1A2E" />
            <rect x="116" y="94" width="76" height="126" rx="14" fill={`url(#${uid}-body)`} />
            <path d="M123 106 C 119 142, 119 178, 123 210" fill="none" stroke={`url(#${uid}-rim)`} strokeWidth="2.2" strokeLinecap="round" />
            <rect x="123" y="122" width="62" height="54" rx="6" fill="rgba(10,22,40,0.94)" />
            <line x1="123" y1="122" x2="185" y2="122" stroke="rgba(117,227,255,0.32)" strokeWidth="1" />
            <rect x="131" y="136" width="36" height="4" rx="2" fill="rgba(201,213,230,0.55)" />
            <rect x="131" y="148" width="48" height="3" rx="1.5" fill="rgba(146,167,194,0.32)" />
            <rect x="131" y="161" width="24" height="3" rx="1.5" fill="rgba(92,206,255,0.5)" />
            <rect x="58" y="180" width="50" height="20" rx="10" fill={`url(#${uid}-cap)`} transform="rotate(-20 83 190)" />
            <rect x="206" y="196" width="42" height="17" rx="8.5" fill={`url(#${uid}-cap)`} transform="rotate(14 227 204)" opacity="0.9" />
          </g>
        ) : null}
      </svg>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* CTA halo                                                            */
/* ------------------------------------------------------------------ */

export function CTAHalo() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <div
        className="absolute left-1/2 top-1/2 h-[52rem] w-[52rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[rgba(92,206,255,0.08)] animate-orbitSlower"
        style={{
          background:
            "conic-gradient(from 0deg, transparent 0deg, rgba(0,183,255,0.05) 40deg, transparent 90deg, transparent 200deg, rgba(0,183,255,0.04) 250deg, transparent 300deg)",
        }}
      />
      <div className="absolute left-1/2 top-1/2 h-[38rem] w-[38rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[rgba(92,206,255,0.1)] animate-pulseLine" />
      <div className="absolute left-1/2 top-1/2 h-[26rem] w-[26rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[rgba(92,206,255,0.14)]" />
      <div className="absolute left-1/2 top-1/2 h-[30rem] w-[30rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(0,183,255,0.12),transparent_65%)] blur-2xl" />
      {/* helix arc across the halo */}
      <svg
        viewBox="0 0 1200 500"
        className="absolute left-1/2 top-1/2 w-[1200px] max-w-none -translate-x-1/2 -translate-y-1/2 opacity-40"
      >
        <defs>
          <linearGradient id="cta-arc" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(117,227,255,0)" />
            <stop offset="50%" stopColor="rgba(117,227,255,0.5)" />
            <stop offset="100%" stopColor="rgba(117,227,255,0)" />
          </linearGradient>
        </defs>
        <path d="M100 240 C 380 140, 820 340, 1100 250" fill="none" stroke="url(#cta-arc)" strokeWidth="1.6" />
        <path d="M100 280 C 380 380, 820 180, 1100 270" fill="none" stroke="url(#cta-arc)" strokeWidth="1.2" opacity="0.6" />
      </svg>
    </div>
  );
}
