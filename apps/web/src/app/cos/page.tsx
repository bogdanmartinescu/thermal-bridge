"use client";

import { useCart } from "@/lib/cart";
import { formatRON } from "@/lib/money";
import Link from "next/link";

export default function CosPage() {
  const { lines, totalBaniValue, setQty, remove } = useCart();

  if (lines.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-24 text-center">
        <div className="mb-6 text-5xl">🛒</div>
        <h1 className="mb-3 text-2xl font-bold text-ink-50">Coșul este gol</h1>
        <p className="mb-8 text-ink-400">
          Adaugă produse din magazin pentru a continua.
        </p>
        <Link
          href="/imprimante"
          className="inline-flex items-center gap-2 rounded-xl bg-accent-500 px-6 py-3 font-semibold text-ink-950 hover:bg-accent-600 transition-colors"
        >
          Vezi imprimantele
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="mb-8 text-3xl font-bold text-ink-50">Coș de cumpărături</h1>

      <div className="flex flex-col gap-4">
        {lines.map((line) => (
          <div
            key={line.slug}
            className="flex items-center gap-4 rounded-2xl border border-white/8 bg-ink-800/40 p-4"
          >
            <div className="min-w-0 flex-1">
              <div className="font-semibold text-ink-100">{line.name}</div>
              <div className="text-sm text-ink-400">
                {formatRON(line.unitPriceBani)} / bucată
              </div>
            </div>

            {/* Qty control */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setQty(line.slug, line.qty - 1)}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 text-ink-300 hover:bg-ink-700 transition-colors"
                aria-label="Scade cantitatea"
              >
                −
              </button>
              <span className="w-8 text-center text-sm font-medium text-ink-100">
                {line.qty}
              </span>
              <button
                type="button"
                onClick={() => setQty(line.slug, line.qty + 1)}
                disabled={line.qty >= line.available}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 text-ink-300 hover:bg-ink-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                aria-label="Crește cantitatea"
              >
                +
              </button>
            </div>

            {/* Line total */}
            <div className="w-24 text-right font-semibold text-ink-100">
              {formatRON(line.unitPriceBani * line.qty)}
            </div>

            {/* Remove */}
            <button
              type="button"
              onClick={() => remove(line.slug)}
              className="ml-1 text-ink-500 hover:text-ink-200 transition-colors"
              aria-label={`Șterge ${line.name}`}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
                <path d="M10 11v6M14 11v6" />
                <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" />
              </svg>
            </button>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="mt-8 rounded-2xl border border-white/8 bg-ink-800/40 p-6">
        <div className="flex items-center justify-between text-sm text-ink-400">
          <span>Subtotal</span>
          <span>{formatRON(totalBaniValue)}</span>
        </div>
        <div className="mt-2 flex items-center justify-between text-sm text-ink-400">
          <span>Transport</span>
          <span className="text-success">Gratuit</span>
        </div>
        <div className="mt-2 flex items-center justify-between text-sm text-ink-400">
          <span>Plată</span>
          <span>La livrare (ramburs)</span>
        </div>
        <div className="mt-4 flex items-center justify-between border-t border-white/8 pt-4 text-lg font-bold text-ink-50">
          <span>Total</span>
          <span>{formatRON(totalBaniValue)}</span>
        </div>
        <p className="mt-2 text-xs text-ink-500">TVA inclus în preț.</p>
      </div>

      <div className="mt-6 flex gap-3">
        <Link
          href="/imprimante"
          className="flex-1 rounded-xl border border-white/10 py-3 text-center font-medium text-ink-200 hover:bg-ink-800 transition-colors"
        >
          Continuă cumpărăturile
        </Link>
        <Link
          href="/comanda"
          className="flex-1 rounded-xl bg-accent-500 py-3 text-center font-semibold text-ink-950 hover:bg-accent-600 transition-colors"
        >
          Plasează comanda
        </Link>
      </div>
    </div>
  );
}
