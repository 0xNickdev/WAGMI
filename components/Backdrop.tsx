import type { CSSProperties } from "react";

const blob = (color: string) => ({ "--aurora-color": color }) as CSSProperties;

export function Backdrop() {
  return (
    <div aria-hidden className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      <div className="absolute -top-48 left-1/2 -translate-x-1/2 w-[72rem] h-[38rem]">
        <div className="aurora-blob aurora-a" style={blob("rgba(214, 255, 84, 0.07)")} />
      </div>
      <div className="absolute top-1/3 -left-64 w-[44rem] h-[44rem]">
        <div className="aurora-blob aurora-b" style={blob("rgba(0, 200, 5, 0.05)")} />
      </div>
      <div className="absolute -bottom-72 right-[-14rem] w-[50rem] h-[50rem]">
        <div className="aurora-blob aurora-c" style={blob("rgba(157, 199, 44, 0.06)")} />
      </div>
      <div className="noise-overlay absolute inset-0" />
    </div>
  );
}
