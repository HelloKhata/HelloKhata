"use client";

import { useId } from "react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/lib/cn";
import type { ApiResult } from "@/lib/api";
import { useI18n } from "@/i18n/client";

const inputBase =
  "block w-full rounded-xl border bg-white px-4 text-ink transition-[border-color,box-shadow] placeholder:text-muted/70 focus:outline-none focus:ring-4";

export function Field({
  label,
  error,
  hint,
  optional,
  textarea,
  ...props
}: {
  label: string;
  error?: string;
  hint?: string;
  optional?: boolean;
  textarea?: boolean;
} & React.InputHTMLAttributes<HTMLInputElement> &
  React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const { t } = useI18n();
  const id = useId();
  const describedBy = [hint && `${id}-hint`, error && `${id}-err`].filter(Boolean).join(" ") || undefined;
  const cls = cn(inputBase, textarea ? "min-h-32 py-3" : "h-12", error ? "border-vermilion focus:ring-vermilion/15" : "border-ink/15 focus:border-leaf-deep focus:ring-leaf/15");
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 flex items-baseline justify-between gap-2 text-sm font-semibold text-ink">
        {label}
        {optional && <span className="text-xs font-normal text-muted">{t.common.optional}</span>}
      </label>
      {textarea ? (
        <textarea id={id} aria-invalid={!!error} aria-describedby={describedBy} className={cls} {...(props as React.TextareaHTMLAttributes<HTMLTextAreaElement>)} />
      ) : (
        <input id={id} aria-invalid={!!error} aria-describedby={describedBy} className={cls} {...(props as React.InputHTMLAttributes<HTMLInputElement>)} />
      )}
      {hint && !error && (
        <p id={`${id}-hint`} className="mt-1.5 text-xs text-muted">
          {hint}
        </p>
      )}
      <AnimatePresence>
        {error && (
          <motion.p id={`${id}-err`} initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-1.5 text-sm text-vermilion">
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

export function SelectField({ label, error, options, ...props }: { label: string; error?: string; options: { value: string; label: string }[] } & React.SelectHTMLAttributes<HTMLSelectElement>) {
  const id = useId();
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-semibold text-ink">
        {label}
      </label>
      <select
        id={id}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-err` : undefined}
        className={cn(inputBase, "h-12 appearance-none bg-[url('data:image/svg+xml,%3Csvg%20xmlns=%22http://www.w3.org/2000/svg%22%20viewBox=%220%200%2012%2012%22%3E%3Cpath%20d=%22M2.5%204.5l3.5%203.5%203.5-3.5%22%20fill=%22none%22%20stroke=%22%235C665F%22%20stroke-width=%221.6%22/%3E%3C/svg%3E')] bg-[length:12px] bg-[right_1rem_center] bg-no-repeat pr-10", error ? "border-vermilion" : "border-ink/15 focus:border-leaf-deep focus:ring-leaf/15")}
        {...props}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      {error && (
        <p id={`${id}-err`} className="mt-1.5 text-sm text-vermilion">
          {error}
        </p>
      )}
    </div>
  );
}

/** Honest submission outcome. "not-connected" is the default until the API is configured. */
export function SubmitStatus({ result, successText }: { result: ApiResult | null; successText?: string }) {
  const { t } = useI18n();
  if (!result) return null;
  const tone = result.status === "ok" ? "ok" : result.status === "not-connected" ? "info" : "error";
  const title = tone === "ok" ? successText : tone === "info" ? t.forms.notConnected.title : t.forms.error.title;
  const body = tone === "info" ? t.forms.notConnected.body : tone === "error" ? t.forms.error.body : undefined;
  return (
    <motion.div
      role={tone === "error" ? "alert" : "status"}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "rounded-2xl px-5 py-4 text-sm",
        tone === "ok" && "bg-leaf-soft text-leaf-ink",
        tone === "info" && "bg-marigold-soft text-[#5c3f05]",
        tone === "error" && "bg-vermilion-soft text-[#7a2a1a]",
      )}
    >
      <p className="font-semibold">{title}</p>
      {body && <p className="mt-1">{body}</p>}
    </motion.div>
  );
}
