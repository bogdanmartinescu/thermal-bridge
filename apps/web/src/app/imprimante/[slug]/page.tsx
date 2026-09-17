import { PRINTERS, getPrinterBySlug } from "@/data/printers";
import { formatRON } from "@/lib/money";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { AddToCartButton } from "./AddToCartButton";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return PRINTERS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const printer = getPrinterBySlug(slug);
  if (!printer) return {};
  return {
    title: `${printer.name} — Magazin ThermalBridge`,
    description: printer.description,
  };
}

export default async function PrinterDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const printer = getPrinterBySlug(slug);
  if (!printer) notFound();

  const inStock = printer.stock > 0;

  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <div className="grid gap-12 lg:grid-cols-2">
        {/* Image */}
        <div className="flex h-80 items-center justify-center rounded-2xl border border-white/8 bg-ink-800/40 lg:h-auto lg:min-h-80">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={printer.images[0] ?? "/placeholder-printer.png"}
            alt={printer.name}
            className="max-h-72 w-full object-contain p-8"
          />
        </div>

        {/* Details */}
        <div className="flex flex-col gap-4">
          {/* Stock badge */}
          {printer.stock === 0 ? (
            <span className="inline-flex items-center rounded-full bg-ink-700 px-3 py-1 text-xs font-medium text-ink-400 w-fit">
              Indisponibil
            </span>
          ) : printer.stock <= 3 ? (
            <span className="inline-flex items-center rounded-full bg-warn/10 px-3 py-1 text-xs font-medium text-warn w-fit">
              Ultimele {printer.stock} bucăți
            </span>
          ) : (
            <span className="inline-flex items-center rounded-full bg-success/10 px-3 py-1 text-xs font-medium text-success w-fit">
              ✓ În stoc
            </span>
          )}

          <h1 className="text-3xl font-bold text-ink-50">{printer.name}</h1>

          <p className="text-ink-400 leading-relaxed">{printer.description}</p>

          {/* Price */}
          <div className="mt-2">
            {printer.priceBani > 0 ? (
              <>
                <span className="text-3xl font-bold text-ink-50">
                  {formatRON(printer.priceBani)}
                </span>
                <span className="ml-2 text-sm text-ink-500">TVA inclus</span>
              </>
            ) : (
              <span className="text-ink-500 italic">Preț disponibil în curând</span>
            )}
          </div>

          {/* Add to cart */}
          <AddToCartButton
            slug={printer.slug}
            name={printer.name}
            priceBani={printer.priceBani}
            available={printer.stock}
            disabled={!inStock || printer.priceBani === 0}
          />

          {/* Specs */}
          <div className="mt-4 rounded-xl border border-white/8 bg-ink-800/30 p-5">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-ink-400">
              Specificații tehnice
            </h2>
            <dl className="space-y-2 text-sm">
              {Object.entries(printer.specs).map(([key, val]) => (
                <div key={key} className="flex gap-3">
                  <dt className="w-40 shrink-0 text-ink-500">{key}</dt>
                  <dd className="text-ink-200">{val}</dd>
                </div>
              ))}
            </dl>
          </div>

          <p className="text-xs text-ink-500">
            Plată la livrare (ramburs). Drept de retur 14 zile conform legislației UE.
          </p>
        </div>
      </div>
    </div>
  );
}
