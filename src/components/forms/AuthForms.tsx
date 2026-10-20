"use client";

import Link from "next/link";
import { useId, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { useI18n } from "@/i18n/client";
import { cn } from "@/lib/cn";
import { fmtNumber, interpolate } from "@/lib/format";
import { signIn, signUp, type ApiResult } from "@/lib/api";
import { isBdPhone, isEmail, normaliseDigits } from "@/lib/validate";
import { categoryAccent, categorySlugs, type CategorySlug } from "@/content/site";
import { buttonClass } from "@/components/ui/Button";
import { Field, SubmitStatus } from "./Field";

function PasswordField({ label, value, onChange, error, hint, autoComplete }: { label: string; value: string; onChange: (v: string) => void; error?: string; hint?: string; autoComplete: string }) {
  const { t } = useI18n();
  const [show, setShow] = useState(false);
  const id = useId();
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-semibold text-ink">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={show ? "text" : "password"}
          value={value}
          autoComplete={autoComplete}
          onChange={(e) => onChange(e.target.value)}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-err` : hint ? `${id}-hint` : undefined}
          className={cn(
            "block h-12 w-full rounded-xl border bg-white pr-24 pl-4 focus:ring-4 focus:outline-none",
            error ? "border-vermilion focus:ring-vermilion/15" : "border-ink/15 focus:border-leaf-deep focus:ring-leaf/15",
          )}
        />
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          aria-pressed={show}
          className="absolute top-1/2 right-2 -translate-y-1/2 rounded-lg px-3 py-1.5 text-xs font-semibold text-leaf-ink hover:bg-leaf-soft"
        >
          {show ? t.auth.signIn.hide : t.auth.signIn.show}
        </button>
      </div>
      {hint && !error && (
        <p id={`${id}-hint`} className="mt-1.5 text-xs text-muted">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-err`} className="mt-1.5 text-sm text-vermilion">
          {error}
        </p>
      )}
    </div>
  );
}

export function SignInForm() {
  const { t, locale } = useI18n();
  const s = t.auth.signIn;
  const v = t.forms.validation;
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ identifier?: string; password?: string }>({});
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<ApiResult | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs: typeof errors = {};
    if (!identifier.trim()) errs.identifier = v.required;
    else if (!isBdPhone(identifier) && !isEmail(identifier)) errs.identifier = v.identifier;
    if (!password) errs.password = v.required;
    setErrors(errs);
    setResult(null);
    if (Object.keys(errs).length) return;
    setBusy(true);
    const res = await signIn({ identifier: normaliseDigits(identifier.trim()), password });
    setBusy(false);
    setResult(res);
    // On { status: "ok" } the real integration would redirect to the app here.
  };

  return (
    <form noValidate onSubmit={onSubmit} className="space-y-5">
      <Field label={s.identifier} value={identifier} onChange={(e) => setIdentifier(e.target.value)} autoComplete="username" inputMode="email" error={errors.identifier} />
      <PasswordField label={s.password} value={password} onChange={setPassword} error={errors.password} autoComplete="current-password" />
      <SubmitStatus result={result} successText={s.success} />
      <button type="submit" disabled={busy} className={buttonClass("primary", "lg", "w-full")}>
        {s.submit}
      </button>
      <p className="text-center text-sm text-muted">
        {s.noAccount}{" "}
        <Link href={`/${locale}/get-started`} className="font-semibold text-leaf-ink underline underline-offset-4">
          {s.create}
        </Link>
      </p>
    </form>
  );
}

type SignUpValues = {
  businessType: CategorySlug | "";
  businessName: string;
  ownerName: string;
  district: string;
  phone: string;
  email: string;
  password: string;
  confirm: string;
  agree: boolean;
};

export function SignUpWizard({ arts }: { arts: Record<CategorySlug, React.ReactNode> }) {
  const { t, locale } = useI18n();
  const su = t.auth.signUp;
  const v = t.forms.validation;
  const params = useSearchParams();
  const plan = params.get("plan");
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  const [values, setValues] = useState<SignUpValues>({ businessType: "", businessName: "", ownerName: "", district: "", phone: "", email: "", password: "", confirm: "", agree: false });
  const [errors, setErrors] = useState<Partial<Record<keyof SignUpValues, string>>>({});
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<ApiResult | null>(null);
  const total = su.steps.length;

  const set = <K extends keyof SignUpValues>(k: K, val: SignUpValues[K]) => setValues((s) => ({ ...s, [k]: val }));

  const validateStep = (i: number) => {
    const e: typeof errors = {};
    if (i === 0 && !values.businessType) e.businessType = v.type;
    if (i === 1) {
      if (!values.businessName.trim()) e.businessName = v.required;
      if (!values.ownerName.trim()) e.ownerName = v.required;
    }
    if (i === 2) {
      if (!values.phone.trim()) e.phone = v.required;
      else if (!isBdPhone(values.phone)) e.phone = v.phone;
      if (values.email.trim() && !isEmail(values.email)) e.email = v.email;
      if (values.password.length < 8) e.password = interpolate(v.minLength, { n: fmtNumber(8, locale) });
      if (values.confirm !== values.password) e.confirm = v.match;
      if (!values.agree) e.agree = v.agree;
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => {
    if (!validateStep(step)) return;
    setDir(1);
    setStep((s) => Math.min(total - 1, s + 1));
  };
  const back = () => {
    setDir(-1);
    setErrors({});
    setStep((s) => Math.max(0, s - 1));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step < total - 1) return next();
    if (!validateStep(step)) return;
    setBusy(true);
    setResult(null);
    const res = await signUp({
      businessType: values.businessType,
      businessName: values.businessName.trim(),
      ownerName: values.ownerName.trim(),
      district: values.district.trim() || undefined,
      phone: normaliseDigits(values.phone),
      email: values.email.trim() || undefined,
      password: values.password,
      locale,
    });
    setBusy(false);
    setResult(res);
  };

  const agreeParts = su.agree.split(/(\{terms\}|\{privacy\})/);

  return (
    <form noValidate onSubmit={onSubmit}>
      {/* Progress */}
      <ol className="mb-8 grid grid-cols-3 gap-2" aria-label={interpolate(su.stepOf, { n: fmtNumber(step + 1, locale), total: fmtNumber(total, locale) })}>
        {su.steps.map((label, i) => (
          <li key={label} aria-current={i === step ? "step" : undefined}>
            <div className="h-1.5 overflow-hidden rounded-full bg-ink/10">
              <motion.div className="h-full bg-leaf-deep" initial={false} animate={{ width: i <= step ? "100%" : "0%" }} transition={{ duration: 0.5 }} />
            </div>
            <p className={cn("mt-2 text-xs font-semibold", i === step ? "text-ink" : "text-muted")}>{label}</p>
          </li>
        ))}
      </ol>

      <div className="relative overflow-hidden">
        <AnimatePresence mode="wait" custom={dir} initial={false}>
          <motion.div key={step} custom={dir} initial={{ opacity: 0, x: dir * 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: dir * -40 }} transition={{ duration: 0.35 }}>
            {step === 0 && (
              <fieldset>
                <legend className="font-display text-2xl">{su.typeTitle}</legend>
                <div role="radiogroup" className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {categorySlugs.map((slug) => {
                    const on = values.businessType === slug;
                    return (
                      <button
                        key={slug}
                        type="button"
                        role="radio"
                        aria-checked={on}
                        onClick={() => set("businessType", slug)}
                        className={cn("rounded-2xl p-2 pb-3 text-left transition-all", on ? "bg-white shadow-[var(--shadow-card)] ring-2" : "bg-white/50 ring-1 ring-ink/10 hover:bg-white")}
                        style={on ? { ["--tw-ring-color" as string]: categoryAccent[slug].tint } : undefined}
                      >
                        <div className="overflow-hidden rounded-xl" style={{ backgroundColor: categoryAccent[slug].soft }}>
                          {arts[slug]}
                        </div>
                        <span className="mt-2 block px-1 text-sm font-semibold">{t.solutions.items[slug].name}</span>
                      </button>
                    );
                  })}
                </div>
                {errors.businessType && (
                  <p role="alert" className="mt-3 text-sm text-vermilion">
                    {errors.businessType}
                  </p>
                )}
              </fieldset>
            )}
            {step === 1 && (
              <div className="space-y-5">
                <Field label={su.businessName} value={values.businessName} onChange={(e) => set("businessName", e.target.value)} autoComplete="organization" error={errors.businessName} />
                <Field label={su.ownerName} value={values.ownerName} onChange={(e) => set("ownerName", e.target.value)} autoComplete="name" error={errors.ownerName} />
                <Field label={su.district} value={values.district} onChange={(e) => set("district", e.target.value)} autoComplete="address-level2" optional />
              </div>
            )}
            {step === 2 && (
              <div className="space-y-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label={su.phone} type="tel" inputMode="tel" placeholder="01XXXXXXXXX" value={values.phone} onChange={(e) => set("phone", e.target.value)} autoComplete="tel" error={errors.phone} />
                  <Field label={su.email} type="email" value={values.email} onChange={(e) => set("email", e.target.value)} autoComplete="email" error={errors.email} optional />
                </div>
                <PasswordField label={su.password} value={values.password} onChange={(val) => set("password", val)} error={errors.password} hint={su.passwordHint} autoComplete="new-password" />
                <PasswordField label={su.confirm} value={values.confirm} onChange={(val) => set("confirm", val)} error={errors.confirm} autoComplete="new-password" />
                <div>
                  <label className="flex items-start gap-3 text-sm">
                    <input type="checkbox" checked={values.agree} onChange={(e) => set("agree", e.target.checked)} aria-invalid={!!errors.agree} className="mt-0.5 size-5 shrink-0 accent-[var(--color-leaf-deep)]" />
                    <span>
                      {agreeParts.map((part, i) =>
                        part === "{terms}" ? (
                          <Link key={i} href={`/${locale}/terms`} target="_blank" className="font-semibold text-leaf-ink underline underline-offset-4">
                            {su.terms}
                          </Link>
                        ) : part === "{privacy}" ? (
                          <Link key={i} href={`/${locale}/privacy`} target="_blank" className="font-semibold text-leaf-ink underline underline-offset-4">
                            {su.privacy}
                          </Link>
                        ) : (
                          <span key={i}>{part}</span>
                        ),
                      )}
                    </span>
                  </label>
                  {errors.agree && <p className="mt-1.5 text-sm text-vermilion">{errors.agree}</p>}
                </div>
                <div className="paper-cream rounded-2xl p-4 text-sm ring-1 ring-ink/10">
                  <p className="font-semibold">{su.summary}</p>
                  <p className="mt-1 text-muted">
                    {values.businessType && t.solutions.items[values.businessType].name} · {values.businessName}
                    {plan && (plan === "starter" || plan === "growth" || plan === "business") && ` · ${t.pricing.plans[plan].name}`}
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="mt-6">
        <SubmitStatus result={result} successText={su.success} />
      </div>

      <div className="mt-8 flex items-center justify-between gap-3">
        {step > 0 ? (
          <button type="button" onClick={back} className={buttonClass("secondary", "lg")}>
            {t.common.back}
          </button>
        ) : (
          <span />
        )}
        <button type="submit" disabled={busy} className={buttonClass("primary", "lg")}>
          {step < total - 1 ? t.common.next : su.submit}
        </button>
      </div>
      <p className="mt-8 text-center text-sm text-muted">
        {su.haveAccount}{" "}
        <Link href={`/${locale}/sign-in`} className="font-semibold text-leaf-ink underline underline-offset-4">
          {su.signIn}
        </Link>
      </p>
    </form>
  );
}
