"use client";

import { useRef } from "react";
import { Upload, X, Globe, AtSign, Send, MessageSquare } from "lucide-react";
import { Field, TextField, TextArea } from "./FormPrimitives";
import { TokenLogo } from "@/components/ui/TokenLogo";
import { cn } from "@/lib/utils";
import type { WizardState, WizardAction } from "./wizardState";
import { GRADIENTS } from "./wizardState";

interface Props {
  state: WizardState;
  dispatch: (a: WizardAction) => void;
  errors: string[];
}

function set(dispatch: Props["dispatch"], field: keyof WizardState, value: WizardState[keyof WizardState]) {
  dispatch({ type: "SET_FIELD", field, value });
}

export function StepBasicInfo({ state, dispatch, errors }: Props) {
  const fileRef = useRef<HTMLInputElement>(null);

  function handleFile(file: File | null | undefined) {
    if (!file) return;
    if (state.logoPreviewUrl) URL.revokeObjectURL(state.logoPreviewUrl);
    const url = URL.createObjectURL(file);
    dispatch({ type: "SET_LOGO", file, url });
  }

  function clearLogo() {
    if (state.logoPreviewUrl) URL.revokeObjectURL(state.logoPreviewUrl);
    dispatch({ type: "CLEAR_LOGO" });
    if (fileRef.current) fileRef.current.value = "";
  }

  const hasNameError = errors.some((e) => e.includes("name"));
  const hasSymbolError = errors.some((e) => e.includes("symbol"));

  return (
    <div className="flex flex-col gap-6">
      {/* Logo upload */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-text">Token Logo</label>
        <div className="flex items-start gap-4">
          {/* Preview */}
          <div className="relative shrink-0">
            {state.logoPreviewUrl ? (
              <div className="relative size-16 rounded-full overflow-hidden ring-2 ring-border-strong">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={state.logoPreviewUrl}
                  alt="Logo preview"
                  className="size-full object-cover"
                />
                <button
                  type="button"
                  onClick={clearLogo}
                  className="absolute top-0 right-0 size-5 bg-bg rounded-full flex items-center justify-center ring-1 ring-border-strong hover:bg-down/20 transition-colors"
                >
                  <X size={11} className="text-muted" />
                </button>
              </div>
            ) : (
              <TokenLogo
                symbol={state.symbol || "??"}
                gradient={state.gradientSeed}
                size={64}
              />
            )}
          </div>

          {/* Upload area */}
          <div className="flex-1">
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="w-full flex flex-col items-center gap-2 rounded-xl border border-dashed border-border-strong bg-surface-2/50 px-4 py-5 hover:border-gold/40 hover:bg-surface-2 transition-colors group"
            >
              <Upload size={18} className="text-faint group-hover:text-gold transition-colors" />
              <span className="text-xs text-faint">
                Upload PNG / JPG / SVG · Max 1 MB
              </span>
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="image/png,image/jpeg,image/svg+xml,image/webp"
              className="hidden"
              onChange={(e) => handleFile(e.target.files?.[0])}
            />
          </div>
        </div>

        {/* Gradient picker (shown when no logo uploaded) */}
        {!state.logoPreviewUrl && (
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-faint">Pick gradient:</span>
            {GRADIENTS.map((g) => {
              const [c1, c2] = g.split(",");
              return (
                <button
                  key={g}
                  type="button"
                  onClick={() => set(dispatch, "gradientSeed", g)}
                  className={cn(
                    "size-7 rounded-full transition-all duration-150",
                    state.gradientSeed === g
                      ? "ring-2 ring-offset-2 ring-offset-bg ring-gold scale-110"
                      : "hover:scale-105",
                  )}
                  style={{ background: `linear-gradient(135deg, ${c1}, ${c2})` }}
                />
              );
            })}
          </div>
        )}
      </div>

      {/* Name + Symbol row */}
      <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-4">
        <Field label="Token Name" required error={hasNameError ? "Required" : undefined}>
          <TextField
            placeholder="e.g. Wagmii Inu"
            value={state.name}
            onChange={(e) => set(dispatch, "name", e.target.value)}
            error={hasNameError}
            maxLength={40}
          />
        </Field>
        <Field label="Symbol" required error={hasSymbolError ? "Required" : undefined} hint="Max 6 chars">
          <TextField
            placeholder="e.g. WAGMII"
            value={state.symbol}
            onChange={(e) =>
              set(dispatch, "symbol", e.target.value.toUpperCase().slice(0, 6))
            }
            error={hasSymbolError}
            className="sm:w-36"
          />
        </Field>
      </div>

      {/* Description */}
      <Field label="Description" hint="Optional — tell people what makes your token special.">
        <TextArea
          placeholder="What is this token about?"
          value={state.description}
          onChange={(e) => set(dispatch, "description", e.target.value)}
          rows={3}
          maxLength={280}
        />
        <p className="text-xs text-faint text-right -mt-1">
          {state.description.length}/280
        </p>
      </Field>

      {/* Socials */}
      <div className="flex flex-col gap-3">
        <p className="text-sm font-medium text-text">Social Links</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Field label="Website">
            <TextField
              placeholder="https://yourtoken.xyz"
              value={state.website}
              onChange={(e) => set(dispatch, "website", e.target.value)}
              prefix={<Globe size={14} />}
            />
          </Field>
          <Field label="X / Twitter">
            <TextField
              placeholder="@handle"
              value={state.twitter}
              onChange={(e) => set(dispatch, "twitter", e.target.value)}
              prefix={<AtSign size={14} />}
            />
          </Field>
          <Field label="Telegram">
            <TextField
              placeholder="t.me/yourgroup"
              value={state.telegram}
              onChange={(e) => set(dispatch, "telegram", e.target.value)}
              prefix={<Send size={14} />}
            />
          </Field>
          <Field label="Discord (optional)">
            <TextField
              placeholder="discord.gg/invite"
              value={state.discord}
              onChange={(e) => set(dispatch, "discord", e.target.value)}
              prefix={<MessageSquare size={14} />}
            />
          </Field>
        </div>
      </div>
    </div>
  );
}
