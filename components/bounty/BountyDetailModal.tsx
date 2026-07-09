"use client";

import { useState } from "react";
import type { Bounty } from "@/lib/bounties";
import { ethOf, getSubmissions } from "@/lib/bounties";
import { Modal } from "./Modal";
import { XVerifyModal } from "./XVerifyModal";
import { Button } from "@/components/ui/Button";
import { EpochCountdown } from "@/components/EpochCountdown";
import { formatUsd, timeAgo, cn } from "@/lib/utils";
import { Trophy, Users, CheckCircle2, Upload, Loader2, PartyPopper, ListChecks } from "lucide-react";

export function BountyDetailModal({ bounty, onClose }: { bounty: Bounty | null; onClose: () => void }) {
  const [verifyOpen, setVerifyOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [note, setNote] = useState("");

  if (!bounty) return null;
  const [c1, c2] = bounty.gradient.split(",");
  const subs = getSubmissions(bounty.id);

  const startSubmit = () => setVerifyOpen(true);
  const onVerified = () => {
    setVerifyOpen(false);
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
    }, 1400);
  };

  return (
    <>
      <Modal open={!!bounty && !submitted} onClose={onClose} className="max-w-2xl">
        <div
          className="shrink-0 relative h-32 rounded-t-2xl flex items-center justify-center"
          style={{ background: `linear-gradient(135deg, ${c1}33, ${c2}22)` }}
        >
          <span className="text-6xl">{bounty.emoji}</span>
          <span className="absolute top-3 left-3 rounded-full border border-up/30 bg-up/15 text-up px-2.5 py-0.5 text-xs font-semibold capitalize">
            {bounty.status}
          </span>
        </div>

        <div className="p-5 flex-1 min-h-0 overflow-y-auto no-scrollbar">
          <h2 className="text-xl font-bold">{bounty.title}</h2>
          <p className="mt-1.5 text-sm text-muted">{bounty.summary}</p>

          <div className="mt-4 grid grid-cols-3 gap-3">
            <div className="glass rounded-xl p-3">
              <div className="text-[11px] text-faint uppercase tracking-wider">Reward</div>
              <div className="text-lg font-bold tabular text-gradient-gold">{formatUsd(bounty.rewardUsd)}</div>
              <div className="text-[11px] text-faint tabular">{ethOf(bounty.rewardUsd).toFixed(3)} ETH</div>
            </div>
            <div className="glass rounded-xl p-3">
              <div className="text-[11px] text-faint uppercase tracking-wider">Winners</div>
              <div className="text-lg font-bold tabular inline-flex items-center gap-1">
                <Trophy size={15} className="text-gold" /> {bounty.winners}
              </div>
            </div>
            <div className="glass rounded-xl p-3">
              <div className="text-[11px] text-faint uppercase tracking-wider">Submissions</div>
              <div className="text-lg font-bold tabular inline-flex items-center gap-1">
                <Users size={15} className="text-cyan" /> {bounty.submissions}
              </div>
            </div>
          </div>

          <div className="mt-4 glass rounded-xl p-3 flex items-center justify-between">
            <span className="text-sm text-muted">Ends in</span>
            <EpochCountdown target={bounty.expiresAt} size="sm" />
          </div>

          <div className="mt-5">
            <h3 className="flex items-center gap-1.5 text-sm font-semibold mb-2">
              <ListChecks size={15} className="text-gold" /> Deliverables
            </h3>
            <ul className="space-y-1.5">
              {bounty.deliverables.map((d, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-muted">
                  <CheckCircle2 size={15} className="text-up mt-0.5 shrink-0" />
                  {d}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-5">
            <h3 className="text-sm font-semibold mb-2">Recent submissions</h3>
            <div className="space-y-2">
              {subs.map((s) => {
                const [a, b] = s.avatar.split(",");
                return (
                  <div key={s.id} className="flex items-center gap-2.5 glass rounded-xl p-2.5">
                    <span className="size-7 rounded-full shrink-0" style={{ background: `linear-gradient(135deg, ${a}, ${b})` }} />
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-medium truncate">@{s.handle}</div>
                      <div className="text-xs text-faint truncate">{s.note}</div>
                    </div>
                    <span
                      className={cn(
                        "text-[11px] font-semibold rounded-full px-2 py-0.5 shrink-0 capitalize",
                        s.status === "won" ? "bg-gold/15 text-gold" : s.status === "rejected" ? "bg-down/15 text-down" : "bg-surface-2 text-muted",
                      )}
                    >
                      {s.status}
                    </span>
                    <span className="text-[11px] text-faint shrink-0">{timeAgo(s.ts)}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Submit proof */}
          {bounty.status === "live" && (
            <div className="mt-5 border-t border-border pt-5">
              <h3 className="flex items-center gap-1.5 text-sm font-semibold mb-2">
                <Upload size={15} className="text-gold" /> Submit your proof
              </h3>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Add a note and your proof links (X post, video, photos)…"
                className="w-full min-h-20 rounded-xl bg-surface-2 border border-border-strong px-3 py-2.5 text-sm outline-none focus-visible:ring-2 focus-visible:ring-gold/50 resize-y"
              />
              <div className="mt-2 rounded-xl border border-dashed border-border-strong p-4 text-center text-xs text-faint">
                Drop screenshots / video here, or click to attach proof files
              </div>
              <Button onClick={startSubmit} disabled={submitting} className="mt-3 w-full" size="lg">
                {submitting ? <Loader2 size={18} className="animate-spin" /> : <Upload size={18} />}
                {submitting ? "Submitting…" : "Verify with X & submit"}
              </Button>
              <p className="mt-2 text-center text-[11px] text-faint">
                Submitting opens X to verify your account before your proof is accepted.
              </p>
            </div>
          )}
        </div>
      </Modal>

      {/* Success */}
      {submitted && (
        <Modal open onClose={onClose} className="max-w-md">
          <div className="p-8 text-center">
            <div className="mx-auto grid place-items-center size-16 rounded-full bg-up/15 mb-4">
              <PartyPopper size={32} className="text-up" />
            </div>
            <h2 className="text-xl font-bold">Proof submitted!</h2>
            <p className="mt-2 text-sm text-muted">
              Your submission for <span className="text-text font-medium">{bounty.title}</span> is in. The creator will review it — if you win, {formatUsd(bounty.rewardUsd / bounty.winners)} lands in your wallet.
            </p>
            <Button onClick={onClose} className="mt-5 w-full" size="lg">Done</Button>
          </div>
        </Modal>
      )}

      <XVerifyModal open={verifyOpen} onClose={() => setVerifyOpen(false)} onVerified={onVerified} purpose="verify before submitting your proof" />
    </>
  );
}
