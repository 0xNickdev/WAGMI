"use client";

import { cn } from "@/lib/utils";
import type {
  InputHTMLAttributes,
  TextareaHTMLAttributes,
  ReactNode,
  ChangeEvent,
} from "react";

// ── Field wrapper ──────────────────────────────────────────────────────────────
interface FieldProps {
  label: string;
  hint?: string;
  error?: string;
  children: ReactNode;
  required?: boolean;
}

export function Field({ label, hint, error, children, required }: FieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-text">
        {label}
        {required && <span className="text-gold ml-0.5">*</span>}
      </label>
      {children}
      {hint && !error && <p className="text-xs text-faint">{hint}</p>}
      {error && <p className="text-xs text-down">{error}</p>}
    </div>
  );
}

// ── TextField ──────────────────────────────────────────────────────────────────
interface TextFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "prefix"> {
  error?: boolean;
  suffix?: ReactNode;
  prefix?: ReactNode;
}

export function TextField({ error, suffix, prefix, className, ...props }: TextFieldProps) {
  return (
    <div
      className={cn(
        "flex items-center h-11 rounded-xl border bg-surface-2 transition-colors",
        error ? "border-down/60 focus-within:ring-2 focus-within:ring-down/30" : "border-border-strong focus-within:ring-2 focus-within:ring-gold/50",
        className,
      )}
    >
      {prefix && <span className="pl-3 text-faint text-sm shrink-0">{prefix}</span>}
      <input
        className="flex-1 bg-transparent px-3 py-2 text-sm text-text placeholder:text-faint outline-none min-w-0"
        {...props}
      />
      {suffix && <span className="pr-3 text-faint text-sm shrink-0">{suffix}</span>}
    </div>
  );
}

// ── TextArea ───────────────────────────────────────────────────────────────────
interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
}

export function TextArea({ error, className, ...props }: TextAreaProps) {
  return (
    <textarea
      className={cn(
        "w-full rounded-xl border bg-surface-2 px-3 py-2.5 text-sm text-text placeholder:text-faint outline-none resize-none transition-colors",
        error ? "border-down/60 focus-visible:ring-2 focus-visible:ring-down/30" : "border-border-strong focus-visible:ring-2 focus-visible:ring-gold/50",
        className,
      )}
      {...props}
    />
  );
}

// ── Slider ─────────────────────────────────────────────────────────────────────
interface SliderProps {
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  step?: number;
  className?: string;
  accentColor?: string;
}

export function Slider({
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  className,
  accentColor = "#10b981",
}: SliderProps) {
  const pct = ((value - min) / (max - min)) * 100;

  return (
    <div className={cn("relative flex items-center", className)}>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e: ChangeEvent<HTMLInputElement>) => onChange(parseFloat(e.target.value))}
        className="w-full h-1.5 appearance-none rounded-full outline-none cursor-pointer"
        style={{
          background: `linear-gradient(to right, ${accentColor} ${pct}%, var(--surface-2) ${pct}%)`,
        }}
      />
      <style jsx>{`
        input[type='range']::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: ${accentColor};
          border: 2px solid var(--bg);
          box-shadow: 0 0 0 1px ${accentColor}44, 0 2px 8px -2px ${accentColor}88;
          cursor: pointer;
        }
        input[type='range']::-moz-range-thumb {
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: ${accentColor};
          border: 2px solid var(--bg);
          box-shadow: 0 0 0 1px ${accentColor}44, 0 2px 8px -2px ${accentColor}88;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
}

// ── Toggle ─────────────────────────────────────────────────────────────────────
interface ToggleProps {
  checked: boolean;
  onChange: (v: boolean) => void;
  label?: string;
  description?: string;
}

export function Toggle({ checked, onChange, label, description }: ToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="flex items-center gap-3 text-left group"
    >
      <div
        className={cn(
          "relative w-11 h-6 rounded-full transition-colors duration-200 shrink-0",
          checked ? "bg-gold" : "bg-surface-2 border border-border-strong",
        )}
      >
        <div
          className={cn(
            "absolute top-0.5 size-5 rounded-full bg-bg transition-transform duration-200 shadow-sm",
            checked ? "translate-x-5" : "translate-x-0.5",
          )}
        />
      </div>
      {(label || description) && (
        <div>
          {label && <div className="text-sm font-medium text-text">{label}</div>}
          {description && <div className="text-xs text-faint mt-0.5">{description}</div>}
        </div>
      )}
    </button>
  );
}

// ── Segmented Control ──────────────────────────────────────────────────────────
interface SegmentedOption<T extends string> {
  value: T;
  label: string;
}

interface SegmentedProps<T extends string> {
  options: SegmentedOption<T>[];
  value: T;
  onChange: (v: T) => void;
  className?: string;
}

export function Segmented<T extends string>({
  options,
  value,
  onChange,
  className,
}: SegmentedProps<T>) {
  return (
    <div
      className={cn(
        "inline-flex w-full rounded-xl p-1 bg-surface-2 border border-border-strong gap-1",
        className,
      )}
    >
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className={cn(
            "flex-1 rounded-lg py-2 px-3 text-sm font-medium transition-all duration-200",
            value === opt.value
              ? "bg-gold text-black shadow-[0_2px_8px_-2px_rgba(16,185,129,0.5)]"
              : "text-muted hover:text-text",
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
