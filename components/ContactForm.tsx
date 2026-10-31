"use client";

import { AnimatePresence, m } from "framer-motion";
import { useId, useState, type FormEvent } from "react";
import { contact, contactNeeds } from "@/data/portfolio";
import { cn, easeOutExpo } from "@/lib/site";
import { AlertCircle, ArrowRight, Check } from "./ui/Icons";
import { MagneticButton } from "./ui/MagneticButton";

const FORMSPREE_ID = process.env.NEXT_PUBLIC_FORMSPREE_ID;

type Status = "idle" | "sending" | "sent" | "error";
type Errors = Partial<Record<"name" | "email" | "message", string>>;

const inputClass =
  "w-full rounded-[10px] border bg-raised px-3.5 text-base text-fg placeholder:text-subtle transition-colors duration-200 hover:border-dim focus-visible:border-fg";

function validate(data: FormData): Errors {
  const errors: Errors = {};
  const name = String(data.get("name") ?? "").trim();
  const email = String(data.get("email") ?? "").trim();
  const message = String(data.get("message") ?? "").trim();
  if (!name) errors.name = "Please enter your name.";
  if (!email) errors.email = "Please enter your email so I can reply.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = "That email doesn't look right — check for typos.";
  if (message.length < 10) errors.message = "Tell me a little about the project (at least 10 characters).";
  return errors;
}

export function ContactForm() {
  const uid = useId();
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Errors>({});
  const [need, setNeed] = useState(contactNeeds[0]);
  const [serverError, setServerError] = useState("");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const found = validate(data);
    setErrors(found);
    if (Object.keys(found).length) {
      const first = Object.keys(found)[0];
      form.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }
    if (data.get("_gotcha")) return; // bot filled the hidden field

    if (!FORMSPREE_ID) {
      setStatus("error");
      setServerError(
        contact.email
          ? `The form isn't connected yet. Please email me directly at ${contact.email}.`
          : "The form isn't connected yet — add NEXT_PUBLIC_FORMSPREE_ID to your environment variables.",
      );
      return;
    }

    setStatus("sending");
    setServerError("");
    try {
      const res = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" },
      });
      if (!res.ok) throw new Error(String(res.status));
      setStatus("sent");
      form.reset();
      setNeed(contactNeeds[0]);
    } catch {
      setStatus("error");
      setServerError(
        contact.email
          ? `Something went wrong sending your message. Please try again, or email me at ${contact.email}.`
          : "Something went wrong sending your message. Please try again in a moment.",
      );
    }
  }

  const fieldError = (key: keyof Errors) =>
    errors[key] ? (
      <p id={`${uid}-${key}-err`} className="flex items-center gap-1.5 text-sm text-fg">
        <AlertCircle size={15} />
        {errors[key]}
      </p>
    ) : null;

  const describedBy = (key: keyof Errors) => (errors[key] ? `${uid}-${key}-err` : undefined);
  const border = (key: keyof Errors) => (errors[key] ? "border-fg" : "border-line-4");

  return (
    <div className="relative min-w-0 flex-[999_1_520px] rounded-2xl border border-line-2 bg-surface p-5 sm:p-8">
      <AnimatePresence mode="wait" initial={false}>
        {status === "sent" ? (
          <m.div
            key="sent"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: easeOutExpo }}
            className="flex min-h-[360px] flex-col items-start justify-center gap-5"
            role="status"
          >
            <span className="grid size-14 place-items-center rounded-full bg-fg text-ink">
              <Check size={26} />
            </span>
            <h3 className="text-3xl font-medium tracking-tight">Message sent.</h3>
            <p className="max-w-md text-muted">Thanks for reaching out — I&apos;ll get back to you within a day.</p>
            <button
              type="button"
              onClick={() => setStatus("idle")}
              className="min-h-11 font-mono text-xs text-muted underline underline-offset-4 hover:text-fg"
            >
              Send another message
            </button>
          </m.div>
        ) : (
          <m.form
            key="form"
            noValidate
            onSubmit={onSubmit}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col gap-5"
            aria-label="Contact form"
          >
            <div className="flex flex-wrap gap-5">
              <div className="flex flex-[1_1_220px] flex-col gap-2">
                <label htmlFor={`${uid}-name`} className="text-sm text-fg-2">
                  Name
                </label>
                <input
                  id={`${uid}-name`}
                  name="name"
                  type="text"
                  autoComplete="name"
                  placeholder="Your name"
                  aria-invalid={Boolean(errors.name)}
                  aria-describedby={describedBy("name")}
                  className={cn(inputClass, "min-h-12", border("name"))}
                />
                {fieldError("name")}
              </div>
              <div className="flex flex-[1_1_220px] flex-col gap-2">
                <label htmlFor={`${uid}-email`} className="text-sm text-fg-2">
                  Email
                </label>
                <input
                  id={`${uid}-email`}
                  name="email"
                  type="email"
                  autoComplete="email"
                  inputMode="email"
                  placeholder="you@company.com"
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={describedBy("email")}
                  className={cn(inputClass, "min-h-12", border("email"))}
                />
                {fieldError("email")}
              </div>
            </div>

            <fieldset>
              <legend className="mb-2.5 text-sm text-fg-2">What do you need?</legend>
              <div className="flex flex-wrap gap-2">
                {contactNeeds.map((n) => (
                  <label
                    key={n}
                    className={cn(
                      "relative inline-flex min-h-11 cursor-pointer items-center rounded-full border px-4 font-mono text-xs transition-colors duration-300 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-fg",
                      need === n ? "border-fg bg-fg text-ink" : "border-line-3 text-muted hover:border-dim hover:text-fg",
                    )}
                  >
                    <input
                      type="radio"
                      name="need"
                      value={n}
                      checked={need === n}
                      onChange={() => setNeed(n)}
                      className="sr-only"
                    />
                    {n}
                  </label>
                ))}
              </div>
            </fieldset>

            <div className="flex flex-col gap-2">
              <label htmlFor={`${uid}-message`} className="text-sm text-fg-2">
                Project details
              </label>
              <textarea
                id={`${uid}-message`}
                name="message"
                rows={5}
                placeholder="What are you building, and by when?"
                aria-invalid={Boolean(errors.message)}
                aria-describedby={describedBy("message")}
                className={cn(inputClass, "resize-y py-3", border("message"))}
              />
              {fieldError("message")}
            </div>

            {/* Honeypot for spam bots — hidden from people and screen readers */}
            <input type="text" name="_gotcha" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />

            <div className="flex flex-wrap items-center justify-between gap-4">
              <p className="font-mono text-xs text-subtle">Sent securely via Formspree · no spam, ever</p>
              <MagneticButton type="submit" disabled={status === "sending"} className="font-semibold disabled:opacity-70">
                {status === "sending" ? "Sending…" : "Send message"}
                <ArrowRight className="transition-[translate] duration-500 ease-out-expo group-hover:translate-x-1" />
              </MagneticButton>
            </div>

            <div aria-live="polite" className="min-h-0">
              {status === "error" && serverError && (
                <p className="flex items-start gap-2 rounded-[10px] border border-line-4 bg-raised p-3.5 text-sm text-fg">
                  <AlertCircle size={16} className="mt-0.5 shrink-0" />
                  {serverError}
                </p>
              )}
            </div>
          </m.form>
        )}
      </AnimatePresence>
    </div>
  );
}
