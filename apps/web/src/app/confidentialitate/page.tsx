import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Politica de confidențialitate — ThermalBridge",
};

export default function ConfidentialitatePage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="mb-2 text-3xl font-bold text-ink-50">
        Politica de confidențialitate
      </h1>
      <p className="mb-10 text-sm text-ink-500">
        Ultima actualizare: 17 septembrie 2026.{" "}
        <strong className="text-ink-400">
          ⚠ Conținut provizoriu — necesită revizuire juridică înainte de lansare.
        </strong>
      </p>

      <div className="space-y-8 text-ink-300">
        <Section title="1. Operatorul de date">
          <p>
            MLB Digital Commerce SRL, Calea Moșilor nr. 88, București, CUI 50914870
            («Operatorul»), prelucrează datele dumneavoastră cu caracter personal în
            calitate de operator, conform Regulamentului (UE) 2016/679 (GDPR).
          </p>
          <p>
            Contact:{" "}
            <a href="mailto:hi@mlb.ro" className="text-accent-500 hover:underline">
              hi@mlb.ro
            </a>
          </p>
        </Section>

        <Section title="2. Ce date colectăm">
          <ul className="ml-4 list-disc space-y-1 text-ink-400">
            <li>
              <strong className="text-ink-300">Date de comandă:</strong> nume,
              telefon, email, adresă de livrare — necesare pentru procesarea
              și livrarea comenzii.
            </li>
            <li>
              <strong className="text-ink-300">Date tehnice:</strong> adresă IP,
              tip browser, pagini accesate — colectate automat prin jurnalele
              serverului (Cloudflare Workers).
            </li>
          </ul>
          <p className="text-ink-500 italic">
            [PLACEHOLDER — completați dacă folosiți cookies analitice sau alte
            instrumente de urmărire.]
          </p>
        </Section>

        <Section title="3. Scopul și temeiul prelucrării">
          <ul className="ml-4 list-disc space-y-1 text-ink-400">
            <li>
              Executarea contractului (art. 6 alin. 1 lit. b GDPR) — procesarea
              și livrarea comenzilor, comunicări legate de comandă.
            </li>
            <li>
              Obligații legale (art. 6 alin. 1 lit. c GDPR) — arhivare
              contabilă, obligații fiscale.
            </li>
          </ul>
        </Section>

        <Section title="4. Destinatarii datelor">
          <p>
            Datele sunt transmise către:
          </p>
          <ul className="ml-4 list-disc space-y-1 text-ink-400">
            <li>Furnizorii de servicii de curierat, în vederea livrării.</li>
            <li>
              Cloudflare, Inc. — infrastructură de hosting (SCC aplicabile,
              conform articolului 46 GDPR).
            </li>
            <li>Autorități publice, la solicitare legală.</li>
          </ul>
          <p className="text-ink-500 italic">
            [PLACEHOLDER — adăugați toți sub-procesatorii relevanți.]
          </p>
        </Section>

        <Section title="5. Durata stocării">
          <p>
            Datele de comandă sunt stocate timp de{" "}
            <strong className="text-ink-100">5 ani</strong> de la încheierea
            exercițiului financiar aferent, conform Legii contabilității nr. 82/1991.
            Ulterior, datele sunt șterse sau anonimizate.
          </p>
        </Section>

        <Section title="6. Drepturile dumneavoastră">
          <p>
            Conform GDPR, aveți dreptul la: acces, rectificare, ștergere («dreptul
            de a fi uitat»), restricționarea prelucrării, portabilitate, opoziție.
            Puteți exercita aceste drepturi la{" "}
            <a href="mailto:hi@mlb.ro" className="text-accent-500 hover:underline">
              hi@mlb.ro
            </a>
            . Aveți de asemenea dreptul de a depune o plângere la{" "}
            <a
              href="https://www.dataprotection.ro"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent-500 hover:underline"
            >
              ANSPDCP (Autoritatea Națională de Supraveghere)
            </a>
            .
          </p>
        </Section>

        <Section title="7. Cookie-uri">
          <p>
            Site-ul folosește cookie-uri strict necesare pentru funcționarea coșului
            de cumpărături (stocare locală în browser). Nu folosim cookie-uri
            analitice sau de marketing fără consimțământul dumneavoastră.
          </p>
          <p className="text-ink-500 italic">
            [PLACEHOLDER — dacă adăugați analitice (ex. Plausible, GA), actualizați
            această secțiune și adăugați un banner de consimțământ GDPR.]
          </p>
        </Section>

        <p className="rounded-lg border border-warn/30 bg-warn/10 px-4 py-3 text-sm text-warn">
          ⚠ Acest document este un schelet provizoriu. Consultați un avocat specializat
          în protecția datelor (DPO) înainte de a pune site-ul în producție.
        </p>
      </div>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h2 className="mb-3 text-lg font-semibold text-ink-100">{title}</h2>
      <div className="space-y-2 text-ink-400 leading-relaxed">{children}</div>
    </section>
  );
}
