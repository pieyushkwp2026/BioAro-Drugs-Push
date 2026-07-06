// Emoji flags don't render on Windows — using inline SVGs instead so they show everywhere.
export function FlagUS({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 16" className={className}>
      <rect width="24" height="16" fill="#B22234" />
      {[1, 3, 5, 7, 9, 11, 13].map((y) => <rect key={y} y={y} width="24" height="1.23" fill="#fff" />)}
      <rect width="10" height="8.6" fill="#3C3B6E" />
    </svg>
  );
}
export function FlagGB({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 16" className={className}>
      <rect width="24" height="16" fill="#00247D" />
      <path d="M0,0 L24,16 M24,0 L0,16" stroke="#fff" strokeWidth="3" />
      <path d="M0,0 L24,16 M24,0 L0,16" stroke="#CF142B" strokeWidth="1" />
      <path d="M12,0 V16 M0,8 H24" stroke="#fff" strokeWidth="5" />
      <path d="M12,0 V16 M0,8 H24" stroke="#CF142B" strokeWidth="2.5" />
    </svg>
  );
}
export function FlagCA({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 16" className={className}>
      <rect width="24" height="16" fill="#fff" />
      <rect width="4.5" height="16" fill="#D52B1E" />
      <rect x="19.5" width="4.5" height="16" fill="#D52B1E" />
      <path
        d="M12 3.6 11 6l-1.8-.8.8 2-2.2.2 1.7 1.4-1.3 1.3 1.9.2-.3 2 2.2-1.1 2.2 1.1-.3-2 1.9-.2-1.3-1.3 1.7-1.4-2.2-.2.8-2L13 6l-1-2.4Z"
        fill="#D52B1E"
      />
    </svg>
  );
}
export function FlagEU({ className = "" }: { className?: string }) {
  const pts = Array.from({ length: 12 }, (_, i) => {
    const a = (i / 12) * 2 * Math.PI - Math.PI / 2;
    return [12 + 5.5 * Math.cos(a), 8 + 5.5 * Math.sin(a)];
  });
  return (
    <svg viewBox="0 0 24 16" className={className}>
      <rect width="24" height="16" fill="#003399" />
      {pts.map(([x, y], i) => (
        <text key={i} x={x} y={y + 1.2} fontSize="2.4" fill="#FFCC00" textAnchor="middle">★</text>
      ))}
    </svg>
  );
}
export function FlagAE({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 16" className={className}>
      <rect width="24" height="16" fill="#fff" />
      <rect y="0" width="24" height="5.33" fill="#00732F" />
      <rect y="10.67" width="24" height="5.33" fill="#000" />
      <rect width="7" height="16" fill="#FF0000" />
    </svg>
  );
}
