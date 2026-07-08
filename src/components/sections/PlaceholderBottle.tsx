interface PlaceholderBottleProps {
  initials: string;
  accent?: string;
  className?: string;
}

export default function PlaceholderBottle({ initials, accent = "#B08A4E", className }: PlaceholderBottleProps) {
  return (
    <svg viewBox="0 0 200 220" className={className} role="img" aria-label={`${initials} bottle placeholder`}>
      <ellipse cx="100" cy="205" rx="62" ry="10" fill="#1B1A17" opacity="0.08" />
      <rect x="82" y="10" width="36" height="18" rx="4" fill="#2F4F3E" />
      <rect x="86" y="4" width="28" height="10" rx="3" fill="#1F3C2D" />
      <rect x="56" y="28" width="88" height="168" rx="20" fill="#1B1A17" />
      <rect x="56" y="28" width="88" height="168" rx="20" fill="url(#bottleSheen)" opacity="0.5" />
      <rect x="60" y="92" width="80" height="46" rx="3" fill={accent} opacity="0.92" />
      <text x="100" y="120" textAnchor="middle" fontFamily="'Cormorant Garamond', serif" fontSize="26" fill="#1B1A17" fontWeight="600">
        {initials}
      </text>
      <rect x="66" y="150" width="68" height="3" rx="1.5" fill="#F8F6F4" opacity="0.35" />
      <rect x="66" y="158" width="46" height="3" rx="1.5" fill="#F8F6F4" opacity="0.25" />
      <defs>
        <linearGradient id="bottleSheen" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#FFFFFF" stopOpacity="0.12" />
          <stop offset="0.5" stopColor="#FFFFFF" stopOpacity="0" />
          <stop offset="1" stopColor="#FFFFFF" stopOpacity="0.05" />
        </linearGradient>
      </defs>
    </svg>
  );
}
