"use client";

import { useState } from "react";
import { useI18n } from "@/i18n/client";
import { submitContact, type ApiResult } from "@/lib/api";
import { isBdPhone, isEmail, normaliseDigits } from "@/lib/validate";
import { fmtNumber, interpolate } from "@/lib/format";
import { buttonClass } from "@/components/ui/Button";
import { Field, SelectField, SubmitStatus } from "./Field";

type Values = { name: string; phone: string; email: string; business: string; topic: string; message: string };
type Errors = Partial<Record<keyof Values, string>>;

export function ContactForm() {
  const { t, locale } = useI18n();
  const f = t.contact.form;
  const v = t.forms.validation;
  const [values, setValues] = useState<Values>({ name: "", phone: "", email: "", business: "", topic: "start", message: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<ApiResult | null>(null);

  const validate = (vals: Values): Errors => {
    const e: Errors = {};
    if (!vals.name.trim()) e.name = v.required;
    if (!vals.phone.trim()) e.phone = v.required;
    else if (!isBdPhone(vals.phone)) e.phone = v.phone;
    if (vals.email.trim() && !isEmail(vals.email)) e.email = v.email;
    if (!vals.message.trim()) e.message = v.required;
    else if (vals.message.trim().length < 10) e.message = interpolate(v.minLength, { n: fmtNumber(10, locale) });
    return e;
  };

  const set = (k: keyof Values) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const next = { ...values, [k]: e.target.value };
    setValues(next);
    if (errors[k]) setErrors(validate(next));
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const errs = validate(values);
    setErrors(errs);
    setResult(null);
    if (Object.keys(errs).length) {
      const first = e.currentTarget.querySelector<HTMLElement>("[aria-invalid=true]");
      first?.focus();
      return;
    }
    setBusy(true);
    const res = await submitContact({ ...values, phone: normaliseDigits(values.phone), locale });
    setBusy(false);
    setResult(res);
  };

  return (
    <form noValidate onSubmit={onSubmit} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label={f.name} name="name" autoComplete="name" value={values.name} onChange={set("name")} error={errors.name} required />
        <Field label={f.phone} name="phone" type="tel" inputMode="tel" autoComplete="tel" placeholder="01XXXXXXXXX" value={values.phone} onChange={set("phone")} error={errors.phone} required />
        <Field label={f.email} name="email" type="email" autoComplete="email" value={values.email} onChange={set("email")} error={errors.email} optional />
        <Field label={f.business} name="business" autoComplete="organization" value={values.business} onChange={set("business")} optional />
      </div>
      <SelectField
        label={f.topic}
        name="topic"
        value={values.topic}
        onChange={set("topic")}
        options={(Object.keys(f.topics) as (keyof typeof f.topics)[]).map((k) => ({ value: k, label: f.topics[k] }))}
      />
      <Field label={f.message} name="message" textarea value={values.message} onChange={set("message")} error={errors.message} required />
      {Object.keys(errors).length > 0 && (
        <p role="alert" className="text-sm font-semibold text-vermilion">
          {v.fixErrors}
        </p>
      )}
      <SubmitStatus result={result} successText={f.success} />
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted">{f.privacy}</p>
        <button type="submit" disabled={busy} className={buttonClass("primary", "lg")}>
          {busy ? f.sending : f.submit}
        </button>
      </div>
    </form>
  );
}
