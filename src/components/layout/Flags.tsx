import type { SVGProps } from "react";

type FlagProps = SVGProps<SVGSVGElement>;

// Emoji flags don't render on Windows — using inline SVGs instead so they show everywhere.
export function FlagUS({ className = "", ...props }: FlagProps) {
  return (
    <svg viewBox="0 0 24 16" className={className} {...props}>
      <rect width="24" height="16" fill="#B22234" />
      {[1, 3, 5, 7, 9, 11, 13].map((y) => <rect key={y} y={y} width="24" height="1.23" fill="#fff" />)}
      <rect width="10" height="8.6" fill="#3C3B6E" />
    </svg>
  );
}
export function FlagGB({ className = "", ...props }: FlagProps) {
  return (
    <svg viewBox="0 0 24 16" className={className} {...props}>
      <rect width="24" height="16" fill="#00247D" />
      <path d="M0,0 L24,16 M24,0 L0,16" stroke="#fff" strokeWidth="3" />
      <path d="M0,0 L24,16 M24,0 L0,16" stroke="#CF142B" strokeWidth="1" />
      <path d="M12,0 V16 M0,8 H24" stroke="#fff" strokeWidth="5" />
      <path d="M12,0 V16 M0,8 H24" stroke="#CF142B" strokeWidth="2.5" />
    </svg>
  );
}
export function FlagCA({ className = "", ...props }: FlagProps) {
  return (
    <svg viewBox="0 0 9600 4800" className={className} {...props}>
      <path
        fill="#f00"
        d="m0 0h2400l99 99h4602l99-99h2400v4800h-2400l-99-99h-4602l-99 99H0z"
      />
      <path
        fill="#fff"
        d="m2400 0h4800v4800h-4800zm2490 4430-45-863a95 95 0 0 1 111-98l859 151-116-320a65 65 0 0 1 20-73l941-762-212-99a65 65 0 0 1-34-79l186-572-542 115a65 65 0 0 1-73-38l-105-247-423 454a65 65 0 0 1-111-57l204-1052-327 189a65 65 0 0 1-91-27l-332-652-332 652a65 65 0 0 1-91 27l-327-189 204 1052a65 65 0 0 1-111 57l-423-454-105 247a65 65 0 0 1-73 38l-542-115 186 572a65 65 0 0 1-34 79l-212 99 941 762a65 65 0 0 1 20 73l-116 320 859-151a95 95 0 0 1 111 98l-45 863z"
      />
    </svg>
  );
}
export function FlagEU({ className = "", ...props }: FlagProps) {
  const pts = Array.from({ length: 12 }, (_, i) => {
    const a = (i / 12) * 2 * Math.PI - Math.PI / 2;
    return [12 + 5.5 * Math.cos(a), 8 + 5.5 * Math.sin(a)];
  });
  return (
    <svg viewBox="0 0 24 16" className={className} {...props}>
      <rect width="24" height="16" fill="#003399" />
      {pts.map(([x, y], i) => (
        <text key={i} x={x} y={y + 1.2} fontSize="2.4" fill="#FFCC00" textAnchor="middle">★</text>
      ))}
    </svg>
  );
}
export function FlagAE({ className = "", ...props }: FlagProps) {
  return (
    <svg viewBox="0 0 24 16" className={className} {...props}>
      <rect width="24" height="16" fill="#fff" />
      <rect y="0" width="24" height="5.33" fill="#00732F" />
      <rect y="10.67" width="24" height="5.33" fill="#000" />
      <rect width="7" height="16" fill="#FF0000" />
    </svg>
  );
}
