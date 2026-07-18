/* Sketch mark, screen-print style: cream crescent-bow with a
   misregistered emerald print layer and an emerald arrow. */
export function Logo({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 256 256" fill="none" aria-hidden>
      <g transform="rotate(-45 128 128)">
        <g transform="translate(7 7)" opacity="0.9">
          <path d="M96 36 Q8 128 96 220 Q50 128 96 36 Z" fill="#1EA366" />
        </g>
        <path d="M96 36 Q8 128 96 220 Q50 128 96 36 Z" fill="#EDE7D6" />
        <line x1="96" y1="40" x2="96" y2="216" stroke="#EDE7D6" strokeWidth="3" strokeLinecap="round" opacity="0.85" />
        <line x1="58" y1="128" x2="188" y2="128" stroke="#1EA366" strokeWidth="11" strokeLinecap="round" />
        <path d="M182 104 L226 128 L182 152 L196 128 Z" fill="#EDE7D6" />
        <path d="M60 128 L38 106 M60 128 L38 150" stroke="#EDE7D6" strokeWidth="9" strokeLinecap="round" />
      </g>
      <path d="M64 44 l2.2 5.4 5.4 2.2 -5.4 2.2 -2.2 5.4 -2.2 -5.4 -5.4 -2.2 5.4 -2.2 Z" fill="#EDE7D6" />
      <circle cx="212" cy="204" r="2.4" fill="#1EA366" />
      <circle cx="38" cy="196" r="1.8" fill="#EDE7D6" opacity="0.6" />
    </svg>
  );
}
