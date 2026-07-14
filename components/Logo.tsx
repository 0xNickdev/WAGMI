/* GreenMoon "Moonbow" mark: the crescent moon doubles as Robin Hood's
   drawn bow, arrow flying up-and-right like a chart. */
export function Logo({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" aria-hidden>
      <defs>
        <linearGradient id="gm-moon" x1="8" y1="54" x2="40" y2="10" gradientUnits="userSpaceOnUse">
          <stop stopColor="#047857" />
          <stop offset="0.55" stopColor="#10b981" />
          <stop offset="1" stopColor="#34d399" />
        </linearGradient>
        <linearGradient id="gm-arrow" x1="14" y1="42" x2="56" y2="22" gradientUnits="userSpaceOnUse">
          <stop stopColor="#10b981" />
          <stop offset="1" stopColor="#6ee7b7" />
        </linearGradient>
      </defs>

      {/* Matte tile */}
      <rect x="1" y="1" width="62" height="62" rx="16" fill="#0C1310" />
      <rect x="1.5" y="1.5" width="61" height="61" rx="15.5" stroke="#34d399" strokeOpacity="0.22" />

      <g transform="rotate(-45 32 32)">
        {/* Crescent moon = bow limb */}
        <path
          d="M24 9 Q2 32 24 55 Q12.5 32 24 9 Z"
          fill="url(#gm-moon)"
        />
        {/* Bowstring */}
        <path d="M24 10 L24 54" stroke="#34d399" strokeOpacity="0.55" strokeWidth="1.6" strokeLinecap="round" />
        {/* Arrow shaft */}
        <path d="M15 32 L48 32" stroke="url(#gm-arrow)" strokeWidth="3.4" strokeLinecap="round" />
        {/* Arrowhead */}
        <path d="M46 25.8 L57 32 L46 38.2 L49.5 32 Z" fill="#6ee7b7" />
        {/* Fletching */}
        <path d="M15.5 32 L9.5 26.5 M15.5 32 L9.5 37.5" stroke="#10b981" strokeWidth="2.6" strokeLinecap="round" />
      </g>

      {/* Star accent */}
      <path d="M15 10 l1.2 3 3 1.2 -3 1.2 -1.2 3 -1.2 -3 -3 -1.2 3 -1.2 Z" fill="#6ee7b7" fillOpacity="0.85" />
    </svg>
  );
}
