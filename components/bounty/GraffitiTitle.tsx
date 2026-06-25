export function GraffitiTitle() {
  return (
    <div className="relative inline-block select-none">
      <h1
        className="text-5xl sm:text-7xl font-black tracking-tight -rotate-2 [transform:skewX(-6deg)]"
        style={{
          fontFamily: "var(--font-sans)",
          background: "linear-gradient(135deg,#ffd34e,#f0b90b 40%,#ff9d2e 75%,#ff5470)",
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          color: "transparent",
          WebkitTextStroke: "1px rgba(0,0,0,0.35)",
          filter: "drop-shadow(0 4px 0 rgba(0,0,0,0.45)) drop-shadow(0 0 28px rgba(240,185,11,0.45))",
        }}
      >
        WAGMI&nbsp;BOUNTY
      </h1>
      <span
        aria-hidden
        className="absolute -top-3 -right-4 text-xs font-bold uppercase tracking-widest text-black bg-gold rounded px-2 py-0.5 rotate-6 shadow-lg"
      >
        beta
      </span>
    </div>
  );
}
