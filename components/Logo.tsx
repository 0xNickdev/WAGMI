import Image from "next/image";

export function Logo({ size = 32 }: { size?: number }) {
  return (
    <Image
      src="/logo.png"
      alt="Moonshill"
      width={size}
      height={size}
      priority
      className="rounded-[28%] shrink-0"
      style={{ width: size, height: size }}
    />
  );
}
