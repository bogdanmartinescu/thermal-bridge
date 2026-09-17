import { OsDownloads } from "@/components/OsDownloads";
import downloadsData from "@/data/downloads.json";
import Link from "next/link";

export default function HomePage() {
  return (
    <>
      {/* ─── Hero ─────────────────────────────────────────────── */}
      <section className="bg-ink-950 pb-20 pt-20 text-center">
        <div className="mx-auto max-w-3xl px-6">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo.png"
            alt="ThermalBridge"
            className="mx-auto mb-6 h-20 w-20 rounded-2xl shadow-lg"
          />
          <div className="mb-3 inline-block rounded-full bg-accent-900/60 px-3 py-1 text-xs font-medium text-accent-500">
            Aplicație desktop open-source
          </div>
          <h1 className="mb-4 text-5xl font-bold tracking-tight text-ink-50">
            Thermal<span className="text-accent-500">Bridge</span>
          </h1>
          <p className="mx-auto mb-8 max-w-xl text-lg text-ink-300">
            Editor de etichete termic pentru imprimante. Conectare directă prin USB,
            Bluetooth, Wi-Fi sau coada OS — fără cloud, fără abonament, fără vendor lock-in.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href="#descarcari"
              className="inline-flex items-center gap-2 rounded-xl bg-accent-500 px-6 py-3 font-semibold text-ink-950 hover:bg-accent-600 transition-colors"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              Descarcă
            </Link>
            <Link
              href="#features"
              className="rounded-xl border border-white/10 px-6 py-3 font-medium text-ink-200 hover:bg-ink-800 transition-colors"
            >
              Află mai mult
            </Link>
          </div>
          <p className="mt-6 text-sm text-ink-500">macOS · Windows · Linux</p>
        </div>

        {/* ── Screenshot ── */}
        {/* To add a real screenshot: place screenshot.png in apps/web/public/
            and replace the placeholder div below with:
            <img src="/screenshot.png" alt="ThermalBridge — editor de etichete"
                 className="mx-auto mt-14 w-full max-w-5xl rounded-2xl border border-white/8 shadow-2xl" /> */}
        <div className="mx-auto mt-14 w-full max-w-5xl px-6">
          <div className="flex h-80 w-full items-center justify-center rounded-2xl border border-white/8 bg-ink-900/60 md:h-[28rem]">
            <div className="text-center">
              <svg className="mx-auto mb-3 text-ink-700" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
              <p className="text-sm text-ink-600">Screenshot aplicație — în curând</p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Features ─────────────────────────────────────────── */}
      <section id="features" className="border-t border-white/5 bg-ink-900 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-2 text-xs font-semibold uppercase tracking-widest text-accent-500">
            Ce include
          </div>
          <h2 className="mb-3 text-3xl font-bold text-ink-50">
            Tot ce ai nevoie pentru tipărire etichete
          </h2>
          <p className="mb-12 max-w-xl text-ink-400">
            O singură aplicație pentru design, gestionare și trimitere — fără drivere
            suplimentare, fără cont SaaS.
          </p>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="rounded-2xl border border-white/5 bg-ink-800/40 p-6"
              >
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-accent-900/60 text-accent-500">
                  <f.Icon />
                </div>
                <h3 className="mb-2 font-semibold text-ink-100">{f.title}</h3>
                <p className="text-sm text-ink-400 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Printers ─────────────────────────────────────────── */}
      <section id="imprimante" className="border-t border-white/5 bg-ink-950 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-2 text-xs font-semibold uppercase tracking-widest text-accent-500">
            Compatibilitate
          </div>
          <h2 className="mb-3 text-3xl font-bold text-ink-50">
            Imprimante suportate
          </h2>
          <p className="mb-10 max-w-xl text-ink-400">
            Funcționează nativ cu imprimante termice și inkjet, cu toate protocoalele și
            transporturile principale.
          </p>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-white/10 text-left text-xs uppercase tracking-wider text-ink-500">
                  <th className="pb-3 pr-6">Imprimantă</th>
                  <th className="pb-3 pr-6">Status</th>
                  <th className="pb-3 pr-6">Rezoluție</th>
                  <th className="pb-3 pr-6">Protocol</th>
                  <th className="pb-3">Conectivitate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-ink-300">
                {PRINTERS_TABLE.map((p) => (
                  <tr key={p.name} className="hover:bg-white/2">
                    <td className="py-3 pr-6 font-medium text-ink-100">{p.name}</td>
                    <td className="py-3 pr-6">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          p.status === "Disponibil"
                            ? "bg-success/10 text-success"
                            : "bg-ink-700 text-ink-400"
                        }`}
                      >
                        {p.status === "Disponibil" ? "✓ " : ""}
                        {p.status}
                      </span>
                    </td>
                    <td className="py-3 pr-6">{p.dpi}</td>
                    <td className="py-3 pr-6">{p.protocol}</td>
                    <td className="py-3 text-ink-400">{p.connectivity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Transport table */}
          <div className="mt-14">
            <div className="mb-2 text-xs font-semibold uppercase tracking-widest text-accent-500">
              Transporturi
            </div>
            <h3 className="mb-3 text-2xl font-bold text-ink-50">
              Șase moduri de a ajunge la imprimantă
            </h3>
            <p className="mb-8 max-w-xl text-ink-400">
              Conexiunile persistă între sesiuni. Un singur design, orice imprimantă
              configurată, un singur click.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="border-b border-white/10 text-left text-xs uppercase tracking-wider text-ink-500">
                    <th className="pb-3 pr-6">Transport</th>
                    <th className="pb-3">Descriere</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-ink-300">
                  {TRANSPORTS.map((t) => (
                    <tr key={t.name} className="hover:bg-white/2">
                      <td className="py-3 pr-6 font-medium text-ink-100 whitespace-nowrap">{t.name}</td>
                      <td className="py-3 text-ink-400">{t.desc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Downloads ─────────────────────────────────────────── */}
      <section id="descarcari" className="border-t border-white/5 bg-ink-900 py-20">
        <div className="mx-auto max-w-3xl px-6">
          <div className="mb-2 text-xs font-semibold uppercase tracking-widest text-accent-500">
            Începe acum
          </div>
          <h2 className="mb-3 text-3xl font-bold text-ink-50">
            Descarcă ThermalBridge
          </h2>
          <p className="text-ink-400">
            Gratuit. Rulează nativ pe macOS, Windows și Linux.
          </p>
          <OsDownloads downloads={downloadsData} />
        </div>
      </section>
    </>
  );
}

/* ─── Static data ──────────────────────────────────────────────────────────── */

const FEATURES = [
  {
    title: "Editor de etichete",
    desc: "Canvas drag-and-drop cu text, coduri de bare 1D, QR, imagini, forme, câmpuri tabel și iconuri. Inspector complet.",
    Icon: () => (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
        <rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18M9 21V9" />
      </svg>
    ),
  },
  {
    title: "Bibliotecă de șabloane",
    desc: "Salvează design-uri reutilizabile ca șabloane. Sincronizare cross-device prin Dropbox sau orice folder partajat.",
    Icon: () => (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
        <rect x="2" y="3" width="20" height="14" rx="2" /><path d="M8 21h8M12 17v4" />
      </svg>
    ),
  },
  {
    title: "Istoric de tipărire",
    desc: "Jurnal per job cu reimprimare cu un click. Fiecare etichetă tipărită este stocată cu bitmap-ul ei.",
    Icon: () => (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
        <path d="M12 8v4l3 3" /><circle cx="12" cy="12" r="9" />
      </svg>
    ),
  },
  {
    title: "AWB & etichete transport",
    desc: "Pagină de test și AWB demo pentru fluxuri de curierat (Cargus, Fan Courier și alții). Redare PDF direct la capul de imprimare.",
    Icon: () => (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" />
      </svg>
    ),
  },
  {
    title: "Import PDF & imagini",
    desc: "Redă orice pagină PDF sau imagine raster (PNG, JPEG, WebP, SVG) direct la capul de imprimare. Redimensionare, decupare, rotire.",
    Icon: () => (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
        <rect x="2" y="2" width="20" height="20" rx="2" /><path d="M7 2v20M17 2v20M2 12h20M2 7h5M2 17h5M17 7h5M17 17h5" />
      </svg>
    ),
  },
  {
    title: "Interfață multilingvă",
    desc: "Română și engleză cu un strat i18n ușor de extins. Urmează automat limba sistemului de operare.",
    Icon: () => (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
        <circle cx="12" cy="12" r="10" /><path d="M12 8v4M12 16h.01" />
      </svg>
    ),
  },
];

const PRINTERS_TABLE = [
  { name: "Marklife X4", status: "Disponibil", dpi: "203 DPI", protocol: "TSPL/TSC", connectivity: "USB · OS Queue · TCP/IP · BLE · SPP" },
  { name: "Phomemo M110 / M120 / M220", status: "Disponibil", dpi: "203 DPI", protocol: "ESC/POS raster", connectivity: "Bluetooth BLE (GATT)" },
  { name: "Canon inkjet (PIXMA / TS / G / TR)", status: "Disponibil", dpi: "300 DPI", protocol: "PNG color via OS queue", connectivity: "USB · Wi-Fi (AirPrint / CUPS)" },
  { name: "Generic TSPL 203 DPI", status: "Disponibil", dpi: "203 DPI", protocol: "TSPL/TSC", connectivity: "USB · OS Queue · TCP/IP" },
  { name: "Marklife D210", status: "Planificat", dpi: "203 DPI", protocol: "ESC/POS", connectivity: "USB · OS Queue · Bluetooth SPP" },
  { name: "Marklife P50", status: "Planificat", dpi: "203 DPI", protocol: "TBD", connectivity: "USB · Bluetooth" },
];

const TRANSPORTS = [
  { name: "USB (direct)", desc: "libUSB nativ — ocolește coada OS pentru latență minimă la joburi RAW." },
  { name: "Coadă OS", desc: "Trimite joburi prin CUPS (macOS/Linux) sau Windows Spooler; funcționează cu orice coadă recunoscută de OS." },
  { name: "TCP / IP", desc: "Socket TCP raw către o imprimantă conectată la rețea sau un print server (IP:port configurabil)." },
  { name: "Bluetooth BLE", desc: "GATT Bluetooth Low Energy — familia Phomemo M110 și Marklife X4 mod BLE; fără asociere necesară." },
  { name: "Bluetooth SPP", desc: "Serial Port Profile clasic Bluetooth — dispozitive Marklife mai vechi (D210, X4 fallback); necesită asociere OS." },
  { name: "Serial (COM/ttyUSB)", desc: "RS-232 / USB-CDC serial — pentru imprimante expuse ca dispozitive COM sau ttyUSB." },
];
