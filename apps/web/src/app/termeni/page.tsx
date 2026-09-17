import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Termeni și condiții — ThermalBridge",
};

export default function TermeniPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="mb-2 text-3xl font-bold text-ink-50">
        Termeni și condiții
      </h1>
      <p className="mb-10 text-sm text-ink-500">
        Ultima actualizare: 17 septembrie 2026.{" "}
        <strong className="text-ink-400">
          ⚠ Conținut provizoriu — necesită revizuire juridică înainte de lansare.
        </strong>
      </p>

      <div className="prose prose-sm max-w-none space-y-8 text-ink-300">
        <Section title="1. Date de identificare">
          <p>
            MLB Digital Commerce SRL, cu sediul în Calea Moșilor nr. 88, București,
            înregistrată la Registrul Comerțului cu CUI 50914870 («Vânzătorul»,
            «noi»), operează magazinul online accesibil la{" "}
            <a href="https://thermalbridge.mlb.ro" className="text-accent-500 hover:underline">
              thermalbridge.mlb.ro
            </a>
            .
          </p>
        </Section>

        <Section title="2. Obiectul contractului">
          <p>
            Prezentele termeni reglementează vânzarea de produse fizice (imprimante
            termice) prin intermediul site-ului, în regim de plată la livrare
            (ramburs), exclusiv pe teritoriul României.
          </p>
        </Section>

        <Section title="3. Plasarea comenzii">
          <p>
            O comandă este plasată prin completarea formularului online și apăsarea
            butonului «Plasează comanda». Vânzătorul confirmă recepția comenzii
            prin email. Contractul de vânzare-cumpărare se consideră încheiat la
            momentul confirmării exprese de către Vânzător (telefonic sau prin email).
          </p>
        </Section>

        <Section title="4. Prețuri și plată">
          <p>
            Toate prețurile sunt exprimate în RON și includ TVA. Plata se efectuează
            la livrare, în numerar, către curierul care livrează coletul
            (serviciu «ramburs»). Vânzătorul nu procesează plăți online cu cardul
            la momentul actual.
          </p>
        </Section>

        <Section title="5. Livrare">
          <p>
            Livrarea se efectuează pe teritoriul României, în 1–3 zile lucrătoare de
            la confirmarea comenzii, prin curier. Costurile de transport sunt suportate
            de Vânzător. Dacă coletul nu poate fi livrat din cauze imputabile
            Cumpărătorului (adresă incorectă, persoana absentă etc.), costurile de
            returnare vor fi suportate de Cumpărător.
          </p>
        </Section>

        <Section title="6. Dreptul de retragere (retur)">
          <p>
            În conformitate cu OUG nr. 34/2014 și Directiva UE 2011/83/UE, aveți
            dreptul de a vă retrage din contract în termen de{" "}
            <strong className="text-ink-100">14 zile calendaristice</strong> de la
            data primirii produsului, fără a invoca un motiv. Pentru a exercita
            acest drept, transmiteți o declarație neechivocă la{" "}
            <a href="mailto:hi@mlb.ro" className="text-accent-500 hover:underline">
              hi@mlb.ro
            </a>
            . Produsul trebuie returnat în starea originală, neutilizat și în
            ambalajul original. Costurile directe de returnare sunt suportate de
            Cumpărător. Rambursarea se efectuează în termen de 14 zile de la
            primirea produsului returnat.
          </p>
          <p className="mt-2 text-ink-500 italic">
            [PLACEHOLDER — modelul standard de retragere prevăzut de OUG 34/2014
            trebuie atașat sau furnizat ca link separat. Consultați un avocat.]
          </p>
        </Section>

        <Section title="7. Garanție legală">
          <p>
            Produsele beneficiază de garanție legală de conformitate de{" "}
            <strong className="text-ink-100">2 ani</strong> de la data livrării,
            conform Legii nr. 449/2003 și Directivei UE 2019/771.
          </p>
          <p className="mt-2 text-ink-500 italic">
            [PLACEHOLDER — completați cu condițiile de garanție comercială
            specifice, dacă există.]
          </p>
        </Section>

        <Section title="8. Soluționarea litigiilor">
          <p>
            În cazul unui litigiu, vă rugăm să ne contactați la{" "}
            <a href="mailto:hi@mlb.ro" className="text-accent-500 hover:underline">
              hi@mlb.ro
            </a>{" "}
            pentru soluționare amiabilă. Aveți de asemenea dreptul de a sesiza:
          </p>
          <ul className="ml-4 list-disc space-y-1">
            <li>
              <a
                href="https://anpc.ro"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent-500 hover:underline"
              >
                ANPC (Autoritatea Națională pentru Protecția Consumatorilor)
              </a>
            </li>
            <li>
              <a
                href="https://ec.europa.eu/consumers/odr"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent-500 hover:underline"
              >
                Platforma europeană de soluționare online a litigiilor (SOL/ODR)
              </a>
            </li>
          </ul>
        </Section>

        <Section title="9. Legea aplicabilă">
          <p>
            Prezentul contract este guvernat de legea română. Instanța competentă
            este cea de la sediul Vânzătorului, cu excepția cazului în care
            legislația aplicabilă prevede altfel în favoarea consumatorului.
          </p>
        </Section>

        <p className="rounded-lg border border-warn/30 bg-warn/10 px-4 py-3 text-sm text-warn">
          ⚠ Acest document este un schelet provizoriu. Consultați un avocat specializat
          în dreptul consumatorilor din România înainte de a pune site-ul în producție.
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
