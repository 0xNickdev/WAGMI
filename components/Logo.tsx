export function Logo({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden>
      <defs>
        <linearGradient id="wagmii-logo" x1="4" y1="4" x2="28" y2="28" gradientUnits="userSpaceOnUse">
          <stop stopColor="#ffd34e" />
          <stop offset="0.5" stopColor="#f0b90b" />
          <stop offset="1" stopColor="#ff9d2e" />
        </linearGradient>
      </defs>
      <rect x="2" y="2" width="28" height="28" rx="9" fill="url(#wagmii-logo)" />
      <path
        d="M8 11.5L11.2 21L14 14.5L16.8 21L20 11.5"
        stroke="#0a0a0a"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="22.5" cy="12" r="1.8" fill="#0a0a0a" />
    </svg>
  );
}
