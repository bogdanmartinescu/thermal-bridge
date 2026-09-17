import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-white/5 bg-ink-950 text-ink-400">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="flex flex-col gap-8 md:flex-row md:justify-between">
          {/* Brand */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2 font-semibold text-ink-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo.png" alt="ThermalBridge" className="h-7 w-7 rounded-lg" />
              ThermalBridge
            </div>
            <address className="not-italic text-sm leading-relaxed">
              <strong className="text-ink-300">MLB Digital Commerce SRL</strong>
              <br />
              CUI: 50914870
              <br />
              Calea Moșilor nr. 88, București
              <br />
              <a href="mailto:hi@mlb.ro" className="hover:text-ink-200 transition-colors">
                hi@mlb.ro
              </a>{" "}
              ·{" "}
              <a
                href="https://www.mlb.ro"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-ink-200 transition-colors"
              >
                www.mlb.ro
              </a>
            </address>
          </div>

          {/* Links */}
          <div className="grid grid-cols-2 gap-6 text-sm sm:grid-cols-3">
            <div className="flex flex-col gap-2">
              <span className="font-medium text-ink-300">Aplicație</span>
              <Link href="/#features" className="hover:text-ink-200 transition-colors">Funcții</Link>
              <Link href="/#imprimante" className="hover:text-ink-200 transition-colors">Imprimante compatibile</Link>
              <Link href="/#descarcari" className="hover:text-ink-200 transition-colors">Descărcări</Link>
            </div>
            <div className="flex flex-col gap-2">
              <span className="font-medium text-ink-300">Magazin</span>
              <Link href="/imprimante" className="hover:text-ink-200 transition-colors">Imprimante termice</Link>
              <Link href="/cos" className="hover:text-ink-200 transition-colors">Coș de cumpărături</Link>
            </div>
            <div className="flex flex-col gap-2">
              <span className="font-medium text-ink-300">Legal</span>
              <Link href="/termeni" className="hover:text-ink-200 transition-colors">Termeni și condiții</Link>
              <Link href="/confidentialitate" className="hover:text-ink-200 transition-colors">Confidențialitate</Link>
              <a
                href="https://anpc.ro"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-ink-200 transition-colors"
              >
                ANPC
              </a>
              <a
                href="https://ec.europa.eu/consumers/odr"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-ink-200 transition-colors"
              >
                SOL (UE)
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-white/5 pt-6 text-xs text-ink-500">
          <p>
            Proprietar — toate drepturile rezervate. Neautorizat pentru distribuție fără acord scris.
          </p>
        </div>
      </div>
    </footer>
  );
}
