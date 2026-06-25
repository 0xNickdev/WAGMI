import { cn } from "@/lib/utils";

interface Props {
  symbol: string;
  gradient: string; // "color1,color2"
  size?: number;
  className?: string;
}

export function TokenLogo({ symbol, gradient, size = 40, className }: Props) {
  const [c1, c2] = gradient.split(",");
  return (
    <div
      className={cn("relative flex items-center justify-center rounded-full font-bold text-black shrink-0", className)}
      style={{
        width: size,
        height: size,
        fontSize: size * 0.36,
        background: `linear-gradient(135deg, ${c1}, ${c2})`,
        boxShadow: `0 4px 14px -4px ${c1}66`,
      }}
    >
      {symbol.slice(0, 2)}
      <span className="absolute inset-0 rounded-full ring-1 ring-inset ring-white/15" />
    </div>
  );
}
