import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Comandă confirmată — ThermalBridge",
};

interface PageProps {
  searchParams: Promise<{ ref?: string }>;
}

export default async function ConfirmarePage({ searchParams }: PageProps) {
  const { ref } = await searchParams;

  return (
    <div className="mx-auto max-w-xl px-6 py-24 text-center">
      <div className="mb-6 flex h-20 w-20 mx-auto items-center justify-center rounded-full bg-success/10 text-5xl">
        ✓
      </div>
      <h1 className="mb-3 text-3xl font-bold text-ink-50">
        Comandă plasată!
      </h1>

      {ref && (
        <p className="mb-6 text-ink-400">
          Numărul tău de referință este{" "}
          <span className="font-mono font-semibold text-accent-500">{ref}</span>.
          Reține-l pentru urmărirea comenzii.
        </p>
      )}

      <div className="mb-8 rounded-2xl border border-white/8 bg-ink-800/40 p-6 text-left text-sm text-ink-400 space-y-2">
        <p>📦 Vei fi contactat telefonic pentru confirmarea adresei de livrare.</p>
        <p>🚚 Livrare prin curier în 1–3 zile lucrătoare.</p>
        <p>💵 Plata se face la livrare (ramburs), în numerar sau cu cardul (dacă curierul permite).</p>
        <p>↩️ Drept de retur 14 zile de la primire, conform legislației UE.</p>
      </div>

      <p className="mb-4 text-sm text-ink-500">
        O confirmare a fost trimisă la adresa ta de email.
        Dacă ai întrebări, ne poți contacta la{" "}
        <a href="mailto:hi@mlb.ro" className="text-accent-500 hover:underline">
          hi@mlb.ro
        </a>
        .
      </p>

      <Link
        href="/"
        className="inline-flex items-center gap-2 rounded-xl bg-ink-800 px-6 py-3 font-medium text-ink-200 hover:bg-ink-700 transition-colors"
      >
        Înapoi la pagina principală
      </Link>
    </div>
  );
}
