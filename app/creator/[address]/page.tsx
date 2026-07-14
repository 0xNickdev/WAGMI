import { notFound } from "next/navigation";
import { getTokens } from "@/lib/mock";
import { TokenCard } from "@/components/TokenCard";
import { SectionHeader } from "@/components/SectionHeader";
import { Reveal } from "@/components/ui/Reveal";
import { formatUsd, shortAddr } from "@/lib/utils";
import { UserRound, Rocket } from "lucide-react";

export const metadata = { title: "Creator Profile — GreenMoon" };

import { POOL_FEE, CREATOR_FEE_SHARE } from "@/lib/protocol";

export default async function CreatorPage({
  params,
}: {
  params: Promise<{ address: string }>;
}) {
  const { address } = await params;
  const created = getTokens().filter(
    (t) => t.creator.toLowerCase() === address.toLowerCase(),
  );
  if (created.length === 0) notFound();

  const totalVolume = created.reduce((s, t) => s + t.volume24h, 0);
  const lpFees = totalVolume * POOL_FEE * CREATOR_FEE_SHARE;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10 sm:py-14">
      <Reveal>
        <div className="flex items-center gap-4 mb-8">
          <div className="grid place-items-center size-14 rounded-2xl glass-strong text-gold">
            <UserRound size={26} />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Creator Profile</h1>
            <p className="text-sm font-mono text-muted mt-1">{shortAddr(address)}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-px rounded-2xl overflow-hidden glass mb-12">
          <Stat label="Tokens Created" value={created.length.toString()} />
          <Stat label="Total Volume" value={formatUsd(totalVolume)} />
          <Stat label="LP Fees Earned" value={formatUsd(lpFees)} highlight />
        </div>
      </Reveal>

      <Reveal>
        <SectionHeader
          title="Tokens Created"
          subtitle="Launched by this wallet"
          icon={<Rocket className="text-gold" size={22} />}
        />
      </Reveal>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {created.map((t, i) => (
          <Reveal key={t.address} delay={(i % 4) * 0.07} className="h-full">
            <TokenCard token={t} />
          </Reveal>
        ))}
      </div>
    </div>
  );
}

function Stat({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="bg-bg-elevated/40 p-5">
      <div className={`text-2xl font-bold tabular ${highlight ? "text-gradient-gold" : ""}`}>{value}</div>
      <div className="text-xs text-faint mt-1 uppercase tracking-wider">{label}</div>
    </div>
  );
}
