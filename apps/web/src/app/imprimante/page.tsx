import { PRINTERS } from "@/data/printers";
import { formatRON } from "@/lib/money";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Imprimante termice — Magazin ThermalBridge",
  description:
    "Cumpără imprimante termice compatibile cu ThermalBridge. Plată la livrare. Prețuri includ TVA.",
};

function StockBadge({ stock }: { stock: number }) {
  if (stock === 0) {
    return (
      <span className="rounded-full bg-ink-700 px-2.5 py-0.5 text-xs font-medium text-ink-400">
        Indisponibil
      </span>
    );
  }
  if (stock <= 3) {
    return (
      <span className="rounded-full bg-warn/10 px-2.5 py-0.5 text-xs font-medium text-warn">
        Ultimele {stock} buc.
      </span>
    );
  }
  return (
    <span className="rounded-full bg-success/10 px-2.5 py-0.5 text-xs font-medium text-success">
      În stoc
    </span>
  );
}

export default function ImprimanteListPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <div className="mb-2 text-xs font-semibold uppercase tracking-widest text-accent-500">
        Magazin
      </div>
      <h1 className="mb-3 text-3xl font-bold text-ink-50">
        Imprimante termice
      </h1>
      <p className="mb-12 max-w-xl text-ink-400">
        Imprimante testate și compatibile nativ cu ThermalBridge. Livrare cu plată la
        livrare (ramburs). Prețurile includ TVA.
      </p>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {PRINTERS.map((p) => (
          <Link
            key={p.slug}
            href={`/imprimante/${p.slug}`}
            className="group flex flex-col rounded-2xl border border-white/8 bg-ink-800/40 p-5 hover:bg-ink-800/70 hover:border-white/15 transition-all"
          >
            {/* Image placeholder */}
            <div className="mb-4 flex h-40 items-center justify-center rounded-xl bg-ink-700/40">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={p.images[0] ?? "/placeholder-printer.png"}
                alt={p.name}
                className="h-full w-full rounded-xl object-contain p-4"
              />
            </div>

            <StockBadge stock={p.stock} />

            <h2 className="mt-3 font-semibold text-ink-100 group-hover:text-accent-500 transition-colors">
              {p.name}
            </h2>

            <p className="mt-1 line-clamp-2 text-sm text-ink-400">
              {p.protocol} · {p.dpi} DPI
            </p>

            <div className="mt-auto pt-4">
              {p.priceBani > 0 ? (
                <span className="text-lg font-bold text-ink-50">
                  {formatRON(p.priceBani)}
                </span>
              ) : (
                <span className="text-sm text-ink-500 italic">Preț — în curând</span>
              )}
            </div>
          </Link>
        ))}
      </div>

      <p className="mt-8 text-xs text-ink-500">
        ⚠ Stocul afișat este orientativ. Disponibilitatea exactă este verificată la plasarea comenzii.
      </p>
    </div>
  );
}
