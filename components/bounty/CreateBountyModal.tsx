"use client";

import { useState } from "react";
import { Modal } from "./Modal";
import { XVerifyModal } from "./XVerifyModal";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { Plus, X as XIcon, UploadCloud, Lock, ShieldCheck, Loader2, PartyPopper, Trophy } from "lucide-react";

const inputCls =
  "w-full rounded-xl bg-surface-2 border border-border-strong px-3 py-2.5 text-sm outline-none focus-visible:ring-2 focus-visible:ring-gold/50 placeholder:text-faint";

const DURATIONS = ["3 days", "7 days", "14 days", "30 days"];

export function CreateBountyModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [step, setStep] = useState(0); // 0 details, 1 rewards
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [deliverables, setDeliverables] = useState<string[]>([""]);
  const [amount, setAmount] = useState("");
  const [winners, setWinners] = useState(1);
  const [duration, setDuration] = useState("7 days");
  const [confirm1, setConfirm1] = useState(false);
  const [confirm2, setConfirm2] = useState(false);
  const [verifyOpen, setVerifyOpen] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [published, setPublished] = useState(false);

  const reset = () => {
    setStep(0); setTitle(""); setSummary(""); setDeliverables([""]); setAmount("");
    setWinners(1); setDuration("7 days"); setConfirm1(false); setConfirm2(false);
    setPublishing(false); setPublished(false);
  };
  const close = () => { onClose(); setTimeout(reset, 200); };

  const detailsValid = title.trim().length > 2 && summary.trim().length > 8 && deliverables.some((d) => d.trim());
  const rewardsValid = Number(amount) > 0 && confirm1 && confirm2;
  const usd = (Number(amount) || 0) * 620;

  const publish = () => setVerifyOpen(true);
  const onVerified = () => {
    setVerifyOpen(false);
    setPublishing(true);
    setTimeout(() => { setPublishing(false); setPublished(true); }, 1500);
  };

  return (
    <>
      <Modal open={open && !published} onClose={close} className="max-w-xl">
        {/* Header / stepper */}
        <div className="px-5 pt-5 pb-3 border-b border-border">
          <div className="text-xs text-faint">Post a bounty</div>
          <div className="mt-2 flex gap-2">
            {["Details", "Rewards"].map((s, i) => (
              <div key={s} className="flex items-center gap-2">
                <span
                  className={cn(
                    "grid place-items-center size-6 rounded-full text-xs font-semibold",
                    i === step ? "bg-gold text-black" : i < step ? "bg-up/20 text-up" : "bg-surface-2 text-faint",
                  )}
                >
                  {i + 1}
                </span>
                <span className={cn("text-sm font-medium", i === step ? "text-text" : "text-faint")}>{s}</span>
                {i === 0 && <span className="w-8 h-px bg-border-strong" />}
              </div>
            ))}
          </div>
        </div>

        <div className="p-5 max-h-[68vh] overflow-y-auto no-scrollbar">
          {step === 0 ? (
            <div className="space-y-4">
              <p className="text-sm text-muted">
                Describe what you want done in real life. Next, you&apos;ll set how much you pay winners and the proof you require.
              </p>
              <Field label="Title" hint={`${title.length}/50`}>
                <input maxLength={50} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Shave WAGMI into your head" className={inputCls} />
              </Field>
              <Field label="Summary">
                <textarea value={summary} onChange={(e) => setSummary(e.target.value)} placeholder="Describe the task, the vibe, and what success looks like…" className={cn(inputCls, "min-h-24 resize-y")} />
              </Field>
              <Field label="Attach reference files">
                <div className="rounded-xl border border-dashed border-border-strong p-6 text-center">
                  <UploadCloud size={22} className="mx-auto text-faint" />
                  <p className="mt-2 text-sm text-muted">Drop reference images, mockups or short clips</p>
                  <p className="text-xs text-faint">PNG, JPG, MP4 · what good looks like</p>
                  <button className="mt-3 text-sm font-medium text-gold hover:underline">Choose files</button>
                </div>
              </Field>
              <Field label="Deliverables" hint="What proof submitters must provide">
                <div className="space-y-2">
                  {deliverables.map((d, i) => (
                    <div key={i} className="flex gap-2">
                      <input
                        value={d}
                        onChange={(e) => setDeliverables((p) => p.map((x, j) => (j === i ? e.target.value : x)))}
                        placeholder={i === 0 ? "e.g. 10s video walking in public" : "Add deliverable"}
                        className={inputCls}
                      />
                      {deliverables.length > 1 && (
                        <button onClick={() => setDeliverables((p) => p.filter((_, j) => j !== i))} className="grid place-items-center size-10 rounded-xl bg-surface-2 text-faint hover:text-down shrink-0">
                          <XIcon size={16} />
                        </button>
                      )}
                    </div>
                  ))}
                  <button onClick={() => setDeliverables((p) => [...p, ""])} className="inline-flex items-center gap-1.5 text-sm font-medium text-gold hover:gap-2.5 transition-all">
                    <Plus size={15} /> Add deliverable
                  </button>
                </div>
              </Field>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-muted">
                Choose who you pay and how much. Funds lock in escrow on publish and release to winners you approve.
              </p>
              <Field label="Reward">
                <div className="flex gap-2">
                  <div className="flex items-center gap-2 rounded-xl bg-surface-2 border border-border-strong px-3 shrink-0">
                    <span className="size-5 rounded-full bg-gradient-to-br from-gold-bright to-gold" />
                    <span className="text-sm font-semibold">BNB</span>
                  </div>
                  <input type="number" min={0} step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0.00" className={cn(inputCls, "tabular")} />
                </div>
                <div className="mt-1 text-xs text-faint tabular">≈ ${usd.toLocaleString("en-US", { maximumFractionDigits: 2 })} · 12.48 BNB available</div>
              </Field>
              <Field label="Number of winners">
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 5].map((n) => (
                    <button key={n} onClick={() => setWinners(n)} className={cn("flex-1 h-10 rounded-xl text-sm font-semibold border transition-colors inline-flex items-center justify-center gap-1", winners === n ? "border-gold/50 bg-gold/10 text-gold" : "border-border-strong text-muted hover:border-gold/30")}>
                      <Trophy size={13} /> {n}
                    </button>
                  ))}
                </div>
              </Field>
              <Field label="Duration">
                <div className="grid grid-cols-4 gap-2">
                  {DURATIONS.map((d) => (
                    <button key={d} onClick={() => setDuration(d)} className={cn("h-10 rounded-xl text-sm font-medium border transition-colors", duration === d ? "border-gold/50 bg-gold/10 text-gold" : "border-border-strong text-muted hover:border-gold/30")}>
                      {d.replace(" days", "d")}
                    </button>
                  ))}
                </div>
              </Field>

              <div className="rounded-xl border border-gold/20 bg-gold/5 p-3 flex gap-2.5">
                <Lock size={16} className="text-gold mt-0.5 shrink-0" />
                <p className="text-xs text-muted leading-relaxed">
                  These funds lock in <span className="text-text font-medium">escrow</span> once published. You can&apos;t withdraw while the bounty is live; rewards release only to submissions you approve.
                </p>
              </div>

              <div className="space-y-2.5">
                <Check checked={confirm1} onChange={setConfirm1} label="This bounty does not request anything illegal, exploitative, or against the WAGMII Terms." />
                <Check checked={confirm2} onChange={setConfirm2} label="I've reviewed the title, summary and deliverables and confirm they're clear and accurate." />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-border flex items-center justify-between gap-3">
          {step === 0 ? <span /> : <Button variant="ghost" onClick={() => setStep(0)}>Back</Button>}
          {step === 0 ? (
            <Button disabled={!detailsValid} onClick={() => setStep(1)}>Save & continue</Button>
          ) : (
            <Button disabled={!rewardsValid || publishing} onClick={publish}>
              {publishing ? <Loader2 size={16} className="animate-spin" /> : <ShieldCheck size={16} />}
              {publishing ? "Publishing…" : "Verify with X & publish"}
            </Button>
          )}
        </div>
      </Modal>

      {published && (
        <Modal open onClose={close} className="max-w-md">
          <div className="p-8 text-center">
            <div className="mx-auto grid place-items-center size-16 rounded-full bg-gold/15 mb-4">
              <PartyPopper size={32} className="text-gold" />
            </div>
            <h2 className="text-xl font-bold">Bounty published! 🎉</h2>
            <p className="mt-2 text-sm text-muted">
              <span className="text-text font-medium">{title || "Your bounty"}</span> is live with {amount || "0"} BNB locked in escrow. It now appears in the WAGMI Bounty feed.
            </p>
            <Button onClick={close} className="mt-5 w-full" size="lg">View feed</Button>
          </div>
        </Modal>
      )}

      <XVerifyModal open={verifyOpen} onClose={() => setVerifyOpen(false)} onVerified={onVerified} purpose="verify before publishing your bounty" />
    </>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <label className="text-sm font-medium">{label}</label>
        {hint && <span className="text-xs text-faint tabular">{hint}</span>}
      </div>
      {children}
    </div>
  );
}

function Check({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button onClick={() => onChange(!checked)} className="flex items-start gap-2.5 text-left w-full">
      <span className={cn("mt-0.5 grid place-items-center size-5 rounded-md border shrink-0 transition-colors", checked ? "bg-gold border-gold text-black" : "border-border-strong")}>
        {checked && <ShieldCheck size={13} />}
      </span>
      <span className="text-xs text-muted leading-relaxed">{label}</span>
    </button>
  );
}
