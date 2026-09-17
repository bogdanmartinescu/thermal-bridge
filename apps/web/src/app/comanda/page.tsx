"use client";

import { useCart } from "@/lib/cart";
import { formatRON } from "@/lib/money";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { OrderInput } from "@/lib/order-schema";

const JUDETE = [
  "Alba", "Arad", "Argeș", "Bacău", "Bihor", "Bistrița-Năsăud", "Botoșani",
  "Brăila", "Brașov", "București", "Buzău", "Călărași", "Caraș-Severin", "Cluj",
  "Constanța", "Covasna", "Dâmbovița", "Dolj", "Galați", "Giurgiu", "Gorj",
  "Harghita", "Hunedoara", "Ialomița", "Iași", "Ilfov", "Maramureș", "Mehedinți",
  "Mureș", "Neamț", "Olt", "Prahova", "Sălaj", "Satu Mare", "Sibiu", "Suceava",
  "Teleorman", "Timiș", "Tulcea", "Vâlcea", "Vaslui", "Vrancea",
];

export default function ComandaPage() {
  const { lines, totalBaniValue, clear } = useCart();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    judet: "",
    localitate: "",
    adresa: "",
    codPostal: "",
    notes: "",
  });

  function update(field: keyof typeof form, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setServerError(null);

    if (lines.length === 0) {
      setServerError("Coșul este gol. Adaugă produse înainte de a comanda.");
      return;
    }

    const body: OrderInput = {
      items: lines.map((l) => ({
        slug: l.slug,
        qty: l.qty,
        unitPriceBani: l.unitPriceBani,
      })),
      customer: {
        name: form.name,
        phone: form.phone,
        email: form.email,
        judet: form.judet,
        localitate: form.localitate,
        adresa: form.adresa,
        codPostal: form.codPostal,
        notes: form.notes || undefined,
      },
    };

    setSubmitting(true);
    try {
      const res = await fetch("/api/comanda", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const data = (await res.json()) as { error?: string };
        setServerError(data.error ?? "Eroare la server. Încearcă din nou.");
        return;
      }

      const data = (await res.json()) as { ref: string };
      clear();
      router.push(`/comanda/confirmare?ref=${encodeURIComponent(data.ref)}`);
    } catch {
      setServerError("Eroare de rețea. Verifică conexiunea și încearcă din nou.");
    } finally {
      setSubmitting(false);
    }
  }

  if (lines.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-24 text-center">
        <h1 className="mb-3 text-2xl font-bold text-ink-50">Coșul este gol</h1>
        <p className="text-ink-400">
          <a href="/imprimante" className="text-accent-500 hover:underline">
            Adaugă produse
          </a>{" "}
          pentru a continua cu comanda.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <h1 className="mb-8 text-3xl font-bold text-ink-50">
        Finalizare comandă
      </h1>

      <form onSubmit={(e) => void handleSubmit(e)} className="grid gap-8 lg:grid-cols-[1fr_320px]">
        {/* ─── Customer form ─── */}
        <div className="flex flex-col gap-6">
          <fieldset className="rounded-2xl border border-white/8 bg-ink-800/40 p-6">
            <legend className="px-1 text-sm font-semibold text-ink-300">
              Date personale
            </legend>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <Field label="Nume și prenume *">
                <input
                  required
                  minLength={2}
                  value={form.name}
                  onChange={(e) => update("name", e.target.value)}
                  placeholder="Ion Popescu"
                  className={inputClass}
                />
              </Field>
              <Field label="Telefon *">
                <input
                  required
                  type="tel"
                  value={form.phone}
                  onChange={(e) => update("phone", e.target.value)}
                  placeholder="07xx xxx xxx"
                  className={inputClass}
                />
              </Field>
              <Field label="Email *" className="sm:col-span-2">
                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={(e) => update("email", e.target.value)}
                  placeholder="ion@exemplu.ro"
                  className={inputClass}
                />
              </Field>
            </div>
          </fieldset>

          <fieldset className="rounded-2xl border border-white/8 bg-ink-800/40 p-6">
            <legend className="px-1 text-sm font-semibold text-ink-300">
              Adresă de livrare
            </legend>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <Field label="Județ *">
                <select
                  required
                  value={form.judet}
                  onChange={(e) => update("judet", e.target.value)}
                  className={inputClass}
                >
                  <option value="">Selectează județul</option>
                  {JUDETE.map((j) => (
                    <option key={j} value={j}>{j}</option>
                  ))}
                </select>
              </Field>
              <Field label="Localitate *">
                <input
                  required
                  minLength={2}
                  value={form.localitate}
                  onChange={(e) => update("localitate", e.target.value)}
                  placeholder="Oraș / comună"
                  className={inputClass}
                />
              </Field>
              <Field label="Adresă *" className="sm:col-span-2">
                <input
                  required
                  minLength={5}
                  value={form.adresa}
                  onChange={(e) => update("adresa", e.target.value)}
                  placeholder="Str. Exemplu nr. 1, ap. 2"
                  className={inputClass}
                />
              </Field>
              <Field label="Cod poștal *">
                <input
                  required
                  pattern="\d{6}"
                  title="6 cifre"
                  value={form.codPostal}
                  onChange={(e) => update("codPostal", e.target.value)}
                  placeholder="123456"
                  className={inputClass}
                />
              </Field>
              <Field label="Observații (opțional)">
                <textarea
                  value={form.notes}
                  onChange={(e) => update("notes", e.target.value)}
                  rows={2}
                  maxLength={500}
                  placeholder="Orice detalii suplimentare pentru curier"
                  className={inputClass}
                />
              </Field>
            </div>
          </fieldset>
        </div>

        {/* ─── Order summary ─── */}
        <div className="flex flex-col gap-4">
          <div className="sticky top-20 rounded-2xl border border-white/8 bg-ink-800/40 p-5">
            <h2 className="mb-4 font-semibold text-ink-200">Sumar comandă</h2>

            <div className="space-y-2 text-sm">
              {lines.map((l) => (
                <div key={l.slug} className="flex justify-between gap-2">
                  <span className="truncate text-ink-400">
                    {l.name} × {l.qty}
                  </span>
                  <span className="shrink-0 font-medium text-ink-200">
                    {formatRON(l.unitPriceBani * l.qty)}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-4 border-t border-white/8 pt-4">
              <div className="flex justify-between text-sm text-ink-400">
                <span>Transport</span>
                <span className="text-success">Gratuit</span>
              </div>
              <div className="flex justify-between text-sm text-ink-400 mt-1">
                <span>Plată</span>
                <span>La livrare</span>
              </div>
              <div className="mt-3 flex justify-between text-lg font-bold text-ink-50">
                <span>Total</span>
                <span>{formatRON(totalBaniValue)}</span>
              </div>
              <p className="mt-1 text-xs text-ink-500">TVA inclus.</p>
            </div>

            {serverError && (
              <p className="mt-4 rounded-lg bg-red-900/30 px-3 py-2 text-sm text-red-400">
                {serverError}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="mt-4 w-full rounded-xl bg-accent-500 py-3 font-semibold text-ink-950 hover:bg-accent-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? "Se procesează…" : "Plasează comanda (ramburs)"}
            </button>

            <p className="mt-3 text-center text-xs text-ink-500">
              Prin plasarea comenzii ești de acord cu{" "}
              <a href="/termeni" className="underline hover:text-ink-300">
                Termenii și condițiile
              </a>
              .
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}

function Field({
  label,
  children,
  className = "",
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={`flex flex-col gap-1.5 ${className}`}>
      <span className="text-xs font-medium text-ink-400">{label}</span>
      {children}
    </label>
  );
}

const inputClass =
  "rounded-lg border border-white/10 bg-ink-900 px-3 py-2 text-sm text-ink-100 placeholder:text-ink-600 focus:border-accent-500/60 focus:outline-none focus:ring-1 focus:ring-accent-500/30 transition-colors w-full";
