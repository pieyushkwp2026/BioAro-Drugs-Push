"use client";

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
    <div className="relative mx-auto aspect-square w-full max-w-[720px] select-none">
      {/* atmosphere */}
      <div className="absolute left-1/2 top-[46%] h-[78%] w-[78%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(0,183,255,0.16),rgba(0,183,255,0.05)_42%,transparent_70%)] blur-2xl" />
      <div className="absolute left-[4%] top-[24%] h-64 w-64 rounded-full bg-[radial-gradient(circle,rgba(47,211,255,0.1),transparent_65%)] blur-3xl" />
      <div className="absolute right-[2%] top-[20%] h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(0,183,255,0.1),transparent_65%)] blur-3xl" />

      <svg
        aria-hidden="true"
        viewBox="0 0 640 640"
        className="absolute inset-0 h-full w-full"
      >
        <defs>
          <radialGradient id={`${uid}-core`} cx="50%" cy="42%" r="60%">
            <stop offset="0%" stopColor="#B8EEFF" />
            <stop offset="26%" stopColor="#3FC6FF" />
            <stop offset="58%" stopColor="#0B5E8F" />
            <stop offset="100%" stopColor="#0A1A2E" />
          </radialGradient>
          <radialGradient id={`${uid}-coreGlow`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(0,183,255,0.4)" />
            <stop offset="55%" stopColor="rgba(0,183,255,0.12)" />
            <stop offset="100%" stopColor="rgba(0,183,255,0)" />
          </radialGradient>
          <linearGradient id={`${uid}-strand`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(117,227,255,0)" />
            <stop offset="22%" stopColor="rgba(117,227,255,0.9)" />
            <stop offset="78%" stopColor="rgba(0,183,255,0.75)" />
            <stop offset="100%" stopColor="rgba(0,183,255,0)" />
          </linearGradient>
          <linearGradient id={`${uid}-strandDim`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(117,227,255,0)" />
            <stop offset="24%" stopColor="rgba(92,206,255,0.4)" />
            <stop offset="76%" stopColor="rgba(0,183,255,0.32)" />
            <stop offset="100%" stopColor="rgba(0,183,255,0)" />
          </linearGradient>
          <linearGradient id={`${uid}-ribbon`} x1="0%" y1="50%" x2="100%" y2="50%">
            <stop offset="0%" stopColor="rgba(117,227,255,0.02)" />
            <stop offset="50%" stopColor="rgba(92,206,255,0.7)" />
            <stop offset="100%" stopColor="rgba(117,227,255,0.02)" />
          </linearGradient>
          <linearGradient id={`${uid}-glass`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#16283F" />
            <stop offset="45%" stopColor="#0C1930" />
            <stop offset="100%" stopColor="#050D1A" />
          </linearGradient>
          <linearGradient id={`${uid}-rim`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(117,227,255,0.85)" />
            <stop offset="60%" stopColor="rgba(0,183,255,0.28)" />
            <stop offset="100%" stopColor="rgba(0,183,255,0)" />
          </linearGradient>
          <linearGradient id={`${uid}-capsule`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#5CCEFF" />
            <stop offset="50%" stopColor="#1B84B8" />
            <stop offset="50.2%" stopColor="#10263E" />
            <stop offset="100%" stopColor="#081321" />
          </linearGradient>
          <radialGradient id={`${uid}-liquid`} cx="50%" cy="30%" r="80%">
            <stop offset="0%" stopColor="rgba(117,227,255,0.55)" />
            <stop offset="100%" stopColor="rgba(0,183,255,0.06)" />
          </radialGradient>
          <filter id={`${uid}-blur`} x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="7" />
          </filter>
          <filter id={`${uid}-soft`} x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="2.2" />
          </filter>
        </defs>

        {/* ---- flowing ribbons: helix → core, vessel → core, core → path ---- */}
        <g>
          <path
            d="M168 268 C 220 258, 246 278, 262 296"
            fill="none"
            stroke="rgba(0,183,255,0.35)"
            strokeWidth="9"
            filter={`url(#${uid}-blur)`}
          />
          <path
            d="M168 268 C 220 258, 246 278, 262 296"
            fill="none"
            stroke={`url(#${uid}-ribbon)`}
            strokeWidth="1.6"
            strokeDasharray="7 13"
            className="animate-dashFlow"
          />
          <path
            d="M474 262 C 430 256, 396 276, 380 294"
            fill="none"
            stroke="rgba(0,183,255,0.35)"
            strokeWidth="9"
            filter={`url(#${uid}-blur)`}
          />
          <path
            d="M474 262 C 430 256, 396 276, 380 294"
            fill="none"
            stroke={`url(#${uid}-ribbon)`}
            strokeWidth="1.6"
            strokeDasharray="7 13"
            className="animate-dashFlow"
            style={{ animationDelay: "-3s" }}
          />
          <path
            d="M320 382 C 322 420, 318 448, 320 486"
            fill="none"
            stroke="rgba(0,183,255,0.3)"
            strokeWidth="9"
            filter={`url(#${uid}-blur)`}
          />
          <path
            d="M320 382 C 322 420, 318 448, 320 486"
            fill="none"
            stroke={`url(#${uid}-ribbon)`}
            strokeWidth="1.6"
            strokeDasharray="7 13"
            className="animate-dashFlow"
            style={{ animationDelay: "-6s" }}
          />
        </g>

        {/* ---- orbit rings around the core ---- */}
        <g
          className="animate-orbitSlow"
          style={{ transformOrigin: "320px 306px" }}
        >
          <ellipse
            cx="320"
            cy="306"
            rx="196"
            ry="66"
            fill="none"
            stroke="rgba(92,206,255,0.22)"
            strokeWidth="1"
            transform="rotate(-16 320 306)"
          />
          <circle cx="132" cy="342" r="3.4" fill="#75E3FF" opacity="0.9" />
          <circle cx="508" cy="270" r="2.6" fill="#00B7FF" opacity="0.8" />
        </g>
        <g
          className="animate-orbitSlower"
          style={{ transformOrigin: "320px 306px" }}
        >
          <ellipse
            cx="320"
            cy="306"
            rx="150"
            ry="112"
            fill="none"
            stroke="rgba(92,206,255,0.14)"
            strokeWidth="1"
            transform="rotate(36 320 306)"
          />
          <circle cx="428" cy="392" r="2.6" fill="#5CCEFF" opacity="0.75" />
        </g>

        {/* ---- central intelligence core ---- */}
        <circle cx="320" cy="306" r="150" fill={`url(#${uid}-coreGlow)`} />
        <circle
          cx="320"
          cy="306"
          r="86"
          fill="none"
          stroke="rgba(92,206,255,0.22)"
          strokeWidth="1"
          className="animate-coreBreath"
          style={{ transformOrigin: "320px 306px" }}
        />
        <circle cx="320" cy="306" r="64" fill={`url(#${uid}-core)`} />
        <circle
          cx="320"
          cy="306"
          r="64"
          fill="none"
          stroke="rgba(184,238,255,0.35)"
          strokeWidth="1"
        />
        <ellipse cx="300" cy="278" rx="26" ry="14" fill="rgba(255,255,255,0.24)" filter={`url(#${uid}-soft)`} />

        {/* ---- left: DNA helix ---- */}
        <g filter={`url(#${uid}-soft)`} opacity="0.9">
          <path
            d="M96 128 C 152 164, 152 200, 96 236 C 40 272, 40 308, 96 344 C 152 380, 152 416, 96 452"
            fill="none"
            stroke={`url(#${uid}-strand)`}
            strokeWidth="3.4"
            strokeLinecap="round"
          />
          <path
            d="M160 128 C 104 164, 104 200, 160 236 C 216 272, 216 308, 160 344 C 104 380, 104 416, 160 452"
            fill="none"
            stroke={`url(#${uid}-strandDim)`}
            strokeWidth="3"
            strokeLinecap="round"
          />
        </g>
        <g stroke="rgba(92,206,255,0.4)" strokeWidth="1.6">
          <line x1="112" y1="152" x2="144" y2="152" />
          <line x1="104" y1="182" x2="152" y2="182" />
          <line x1="104" y1="290" x2="152" y2="290" />
          <line x1="112" y1="320" x2="144" y2="320" />
          <line x1="104" y1="398" x2="152" y2="398" />
          <line x1="112" y1="428" x2="144" y2="428" />
        </g>
        <g fill="#75E3FF">
          <circle cx="112" cy="152" r="2.6" opacity="0.9" />
          <circle cx="144" cy="182" r="2.2" opacity="0.7" />
          <circle cx="104" cy="290" r="2.4" opacity="0.85" />
          <circle cx="152" cy="320" r="2" opacity="0.6" />
          <circle cx="144" cy="398" r="2.4" opacity="0.8" />
        </g>

        {/* ---- right: vessel + capsules ---- */}
        <g className="animate-floatSoft" style={{ transformOrigin: "512px 260px" }}>
          {/* soft light behind vessel */}
          <ellipse cx="512" cy="252" rx="86" ry="110" fill="rgba(0,183,255,0.1)" filter={`url(#${uid}-blur)`} />
          {/* cap */}
          <rect x="488" y="126" width="48" height="34" rx="8" fill="#0A1626" />
          <rect x="488" y="126" width="48" height="8" rx="4" fill="rgba(117,227,255,0.22)" />
          {/* neck */}
          <path d="M492 160 L 532 160 L 540 182 L 484 182 Z" fill="#0B1A2E" />
          {/* body */}
          <rect x="462" y="182" width="100" height="160" rx="18" fill={`url(#${uid}-glass)`} />
          {/* rim light */}
          <path
            d="M470 196 C 466 240, 466 292, 470 330"
            fill="none"
            stroke={`url(#${uid}-rim)`}
            strokeWidth="2.6"
            strokeLinecap="round"
          />
          <path
            d="M554 200 C 557 244, 557 288, 554 326"
            fill="none"
            stroke="rgba(92,206,255,0.2)"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
          {/* label band */}
          <rect x="470" y="226" width="84" height="66" rx="8" fill="rgba(10,22,40,0.92)" />
          <line x1="470" y1="226" x2="554" y2="226" stroke="rgba(117,227,255,0.3)" strokeWidth="1" />
          <line x1="470" y1="292" x2="554" y2="292" stroke="rgba(117,227,255,0.16)" strokeWidth="1" />
          <rect x="480" y="242" width="44" height="4" rx="2" fill="rgba(201,213,230,0.5)" />
          <rect x="480" y="254" width="62" height="3" rx="1.5" fill="rgba(146,167,194,0.32)" />
          <rect x="480" y="272" width="30" height="3" rx="1.5" fill="rgba(92,206,255,0.45)" />
          {/* inner liquid glow */}
          <ellipse cx="512" cy="322" rx="38" ry="14" fill={`url(#${uid}-liquid)`} />
        </g>

        {/* capsules drifting near the vessel */}
        <g className="animate-float" style={{ transformOrigin: "436px 392px" }}>
          <rect
            x="412"
            y="380"
            width="48"
            height="20"
            rx="10"
            fill={`url(#${uid}-capsule)`}
            transform="rotate(-24 436 390)"
          />
          <rect
            x="452"
            y="414"
            width="40"
            height="17"
            rx="8.5"
            fill={`url(#${uid}-capsule)`}
            transform="rotate(14 472 422)"
            opacity="0.85"
          />
        </g>

        {/* molecule accents lower-left of core */}
        <g stroke="rgba(92,206,255,0.28)" strokeWidth="1">
          <line x1="212" y1="418" x2="248" y2="400" />
          <line x1="212" y1="418" x2="228" y2="448" />
        </g>
        <g fill="#2FD3FF">
          <circle cx="212" cy="418" r="3.2" opacity="0.7" />
          <circle cx="248" cy="400" r="2.4" opacity="0.55" />
          <circle cx="228" cy="448" r="2" opacity="0.45" />
        </g>
      </svg>

      {/* rising particles */}
      {HERO_PARTICLES.map((particle, index) => (
        <span
          key={index}
          className="animate-riseParticle absolute rounded-full bg-bioaro-soft/70"
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

      {/* refined floating labels */}
      <div className="absolute left-[3%] top-[10%] flex items-center gap-2.5 rounded-full border border-[rgba(92,206,255,0.2)] bg-[rgba(7,19,34,0.78)] px-4 py-2 shadow-ambient backdrop-blur-md">
        <span className="h-1.5 w-1.5 rounded-full bg-bioaro-soft shadow-[0_0_10px_rgba(92,206,255,0.8)]" />
        <span className="text-xs font-medium tracking-wide text-bioaro-text">
          BioAro Labs · Understand
        </span>
      </div>
      <div className="absolute right-[1%] top-[64%] flex items-center gap-2.5 rounded-full border border-[rgba(92,206,255,0.2)] bg-[rgba(7,19,34,0.78)] px-4 py-2 shadow-ambient backdrop-blur-md">
        <span className="h-1.5 w-1.5 rounded-full bg-bioaro-blue shadow-[0_0_10px_rgba(0,183,255,0.8)]" />
        <span className="text-xs font-medium tracking-wide text-bioaro-text">
          BioAro Drugs · Take Action
        </span>
      </div>

      {/* core label */}
      <div className="absolute left-1/2 top-[47.5%] -translate-x-1/2 -translate-y-1/2 text-center">
        <p className="font-display text-lg font-semibold tracking-tight text-white drop-shadow-[0_2px_12px_rgba(3,7,18,0.9)] md:text-xl">
          Living 2.0
        </p>
      </div>

      {/* ecosystem path line */}
      <div className="absolute inset-x-0 bottom-[6%] text-center">
        <p className="text-xs tracking-[0.18em] text-bioaro-muted">
          <span className="text-bioaro-soft">Understand</span>
          <span className="mx-3 text-bioaro-steel">·</span>
          <span className="text-white">Take Action</span>
          <span className="mx-3 text-bioaro-steel">·</span>
          <span className="text-bioaro-soft">Build Better Health</span>
        </p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Offering card scenes                                                */
/* ------------------------------------------------------------------ */

export function LabsSceneVisual() {
  const uid = useId().replace(/[:]/g, "");

  return (
    <div className="relative h-56 w-full overflow-hidden rounded-[18px] bg-[radial-gradient(ellipse_120%_100%_at_18%_0%,rgba(0,183,255,0.2),transparent_55%),linear-gradient(180deg,#0A1830,#050C17)]">
      <svg aria-hidden="true" viewBox="0 0 480 224" className="h-full w-full">
        <defs>
          <linearGradient id={`${uid}-vialGlass`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(117,227,255,0.35)" />
            <stop offset="30%" stopColor="rgba(20,40,66,0.6)" />
            <stop offset="100%" stopColor="rgba(8,17,31,0.9)" />
          </linearGradient>
          <linearGradient id={`${uid}-vialLiquid`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(117,227,255,0.85)" />
            <stop offset="100%" stopColor="rgba(0,183,255,0.15)" />
          </linearGradient>
          <linearGradient id={`${uid}-arc`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(117,227,255,0)" />
            <stop offset="50%" stopColor="rgba(117,227,255,0.8)" />
            <stop offset="100%" stopColor="rgba(117,227,255,0)" />
          </linearGradient>
          <filter id={`${uid}-glow`} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="5" />
          </filter>
        </defs>

        {/* vial */}
        <ellipse cx="96" cy="196" rx="52" ry="9" fill="rgba(0,0,0,0.5)" filter={`url(#${uid}-glow)`} />
        <rect x="72" y="42" width="48" height="14" rx="4" fill="rgba(117,227,255,0.24)" />
        <path
          d="M78 56 L 114 56 L 114 158 C 114 176, 78 176, 78 158 Z"
          fill={`url(#${uid}-vialGlass)`}
        />
        <path
          d="M81 104 L 111 104 L 111 158 C 111 172, 81 172, 81 158 Z"
          fill={`url(#${uid}-vialLiquid)`}
        />
        <line x1="84" y1="62" x2="84" y2="150" stroke="rgba(255,255,255,0.35)" strokeWidth="1.4" />

        {/* helix arcs */}
        <g filter={`url(#${uid}-glow)`} opacity="0.55">
          <path d="M190 64 C 240 30, 300 98, 350 64" fill="none" stroke="rgba(0,183,255,0.7)" strokeWidth="2.6" />
        </g>
        <path d="M190 64 C 240 30, 300 98, 350 64" fill="none" stroke={`url(#${uid}-arc)`} strokeWidth="2" />
        <path d="M190 92 C 240 126, 300 58, 350 92" fill="none" stroke={`url(#${uid}-arc)`} strokeWidth="2" opacity="0.6" />
        <g stroke="rgba(92,206,255,0.35)" strokeWidth="1.2">
          <line x1="226" y1="58" x2="226" y2="98" />
          <line x1="270" y1="76" x2="270" y2="80" />
          <line x1="314" y1="58" x2="314" y2="98" />
        </g>

        {/* biomarker trace */}
        <path
          d="M186 168 L 232 168 L 248 138 L 266 190 L 282 158 L 300 168 L 420 168"
          fill="none"
          stroke="rgba(117,227,255,0.6)"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
        <circle cx="266" cy="190" r="3" fill="#75E3FF" />
        <circle cx="420" cy="168" r="2.4" fill="#2FD3FF" opacity="0.8" />

        {/* particles */}
        <circle cx="380" cy="52" r="2" fill="rgba(117,227,255,0.5)" />
        <circle cx="410" cy="96" r="1.6" fill="rgba(117,227,255,0.35)" />
        <circle cx="160" cy="120" r="1.8" fill="rgba(117,227,255,0.4)" />
      </svg>
    </div>
  );
}

export function DrugsSceneVisual() {
  const uid = useId().replace(/[:]/g, "");

  return (
    <div className="relative h-56 w-full overflow-hidden rounded-[18px] bg-[radial-gradient(ellipse_120%_100%_at_82%_0%,rgba(0,183,255,0.2),transparent_55%),linear-gradient(180deg,#0A1830,#050C17)]">
      <svg aria-hidden="true" viewBox="0 0 480 224" className="h-full w-full">
        <defs>
          <linearGradient id={`${uid}-body`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#17293F" />
            <stop offset="50%" stopColor="#0C1930" />
            <stop offset="100%" stopColor="#050D1A" />
          </linearGradient>
          <linearGradient id={`${uid}-rim`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(117,227,255,0.85)" />
            <stop offset="100%" stopColor="rgba(0,183,255,0)" />
          </linearGradient>
          <linearGradient id={`${uid}-cap`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#5CCEFF" />
            <stop offset="50%" stopColor="#1B84B8" />
            <stop offset="50.2%" stopColor="#10263E" />
            <stop offset="100%" stopColor="#081321" />
          </linearGradient>
          <filter id={`${uid}-glow`} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="5" />
          </filter>
        </defs>

        {/* ground shadow */}
        <ellipse cx="356" cy="200" rx="66" ry="9" fill="rgba(0,0,0,0.55)" filter={`url(#${uid}-glow)`} />

        {/* bottle */}
        <ellipse cx="356" cy="120" rx="62" ry="80" fill="rgba(0,183,255,0.12)" filter={`url(#${uid}-glow)`} />
        <rect x="332" y="24" width="48" height="26" rx="6" fill="#0A1626" />
        <rect x="332" y="24" width="48" height="7" rx="3.5" fill="rgba(117,227,255,0.24)" />
        <path d="M336 50 L 376 50 L 384 68 L 328 68 Z" fill="#0B1A2E" />
        <rect x="310" y="68" width="92" height="130" rx="16" fill={`url(#${uid}-body)`} />
        <path d="M318 82 C 314 118, 314 158, 318 186" fill="none" stroke={`url(#${uid}-rim)`} strokeWidth="2.4" strokeLinecap="round" />
        <rect x="318" y="104" width="76" height="56" rx="7" fill="rgba(10,22,40,0.92)" />
        <line x1="318" y1="104" x2="394" y2="104" stroke="rgba(117,227,255,0.3)" strokeWidth="1" />
        <rect x="327" y="118" width="40" height="4" rx="2" fill="rgba(201,213,230,0.5)" />
        <rect x="327" y="130" width="56" height="3" rx="1.5" fill="rgba(146,167,194,0.32)" />
        <rect x="327" y="144" width="26" height="3" rx="1.5" fill="rgba(92,206,255,0.45)" />

        {/* capsules */}
        <rect x="216" y="150" width="52" height="21" rx="10.5" fill={`url(#${uid}-cap)`} transform="rotate(-18 242 160)" />
        <rect x="188" y="182" width="42" height="18" rx="9" fill={`url(#${uid}-cap)`} transform="rotate(10 209 191)" opacity="0.85" />

        {/* molecule structure */}
        <g stroke="rgba(92,206,255,0.3)" strokeWidth="1.2">
          <line x1="86" y1="76" x2="130" y2="58" />
          <line x1="86" y1="76" x2="104" y2="118" />
          <line x1="104" y1="118" x2="150" y2="104" />
          <line x1="130" y1="58" x2="150" y2="104" />
        </g>
        <g fill="#2FD3FF">
          <circle cx="86" cy="76" r="3.4" opacity="0.75" />
          <circle cx="130" cy="58" r="2.6" opacity="0.6" />
          <circle cx="104" cy="118" r="2.8" opacity="0.65" />
          <circle cx="150" cy="104" r="2.2" opacity="0.5" />
        </g>

        {/* particles */}
        <circle cx="70" cy="170" r="2" fill="rgba(117,227,255,0.45)" />
        <circle cx="146" cy="180" r="1.6" fill="rgba(117,227,255,0.3)" />
        <circle cx="240" cy="70" r="1.8" fill="rgba(117,227,255,0.4)" />
      </svg>
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
