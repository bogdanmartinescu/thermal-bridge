import type { Locale } from "./config";

export interface LandingCopy {
  meta: {
    title: string;
    description: string;
    ogTitle: string;
    ogDescription: string;
  };
  nav: {
    features: string;
    printers: string;
    downloads: string;
    shop: string;
    cart: string;
  };
  hero: {
    eyebrow: string;
    h1Lead: string;
    h1Highlight: string;
    lead: string;
    ctaDownload: string;
    ctaLearn: string;
    platforms: string;
    screenshotAlt: string;
  };
  features: {
    label: string;
    heading: string;
    sub: string;
    items: readonly { title: string; desc: string }[];
  };
  printers: {
    label: string;
    heading: string;
    sub: string;
    colPrinter: string;
    colStatus: string;
    colDpi: string;
    colProtocol: string;
    colConnectivity: string;
    available: string;
    planned: string;
    rows: readonly {
      name: string;
      status: "available" | "planned";
      dpi: string;
      protocol: string;
      connectivity: string;
    }[];
  };
  transports: {
    label: string;
    heading: string;
    sub: string;
    colTransport: string;
    colDescription: string;
    rows: readonly { name: string; desc: string }[];
  };
  downloads: {
    label: string;
    heading: string;
    sub: string;
    ctaMac: string;
    ctaWin: string;
    ctaLinux: string;
    comingSoon: string;
    unavailable: string;
    footnote: string;
    githubReleases: string;
  };
  faq: {
    label: string;
    heading: string;
    items: readonly { q: string; a: string }[];
  };
  footer: {
    app: string;
    shop: string;
    legal: string;
    features: string;
    printers: string;
    downloads: string;
    shopPrinters: string;
    cart: string;
    terms: string;
    privacy: string;
    copy: string;
  };
  ids: {
    features: string;
    printers: string;
    downloads: string;
    faq: string;
  };
}

const RO: LandingCopy = {
  meta: {
    title:
      "ThermalBridge — software de etichete termice pentru Marklife, Phomemo și TSPL",
    description:
      "Aplicație desktop gratuită pentru etichete termice și AWB. Tipărește pe Marklife X4, Phomemo M110/M120 și imprimante TSPL prin USB, Bluetooth sau Wi-Fi — fără cloud, fără abonament.",
    ogTitle: "ThermalBridge — software de etichete termice",
    ogDescription:
      "Proiectează și tipărește etichete pe imprimante Marklife, Phomemo și TSPL. macOS, Windows și Linux.",
  },
  nav: {
    features: "Funcții",
    printers: "Imprimante",
    downloads: "Descărcări",
    shop: "Magazin",
    cart: "Coș",
  },
  hero: {
    eyebrow: "Aplicație desktop gratuită · macOS, Windows, Linux",
    h1Lead: "Software de etichete termice pentru",
    h1Highlight: "Marklife, Phomemo și TSPL",
    lead: "ThermalBridge este un editor desktop pentru etichete de produs, AWB și coduri de bare. Conectare directă prin USB, Bluetooth sau Wi-Fi — fără cloud, fără abonament, fără driver de la producător.",
    ctaDownload: "Descarcă gratuit",
    ctaLearn: "Vezi funcțiile",
    platforms: "macOS · Windows · Linux",
    screenshotAlt:
      "ThermalBridge — editor desktop de etichete termice, cu canvas, șabloane și panou de printare",
  },
  features: {
    label: "Funcții",
    heading: "Editor de etichete termice, fără cont și fără cloud",
    sub: "Proiectează, salvează și tipărește etichete pe imprimanta locală. Datele rămân pe calculatorul tău.",
    items: [
      {
        title: "Editor de etichete cu coduri de bare",
        desc: "Canvas drag-and-drop cu text, coduri de bare 1D, QR, imagini, forme și tabele. Inspector complet pentru fiecare element.",
      },
      {
        title: "Șabloane reutilizabile",
        desc: "Salvează design-uri de etichete ca șabloane. Sincronizare între calculatoare prin Dropbox sau orice folder partajat.",
      },
      {
        title: "Istoric de tipărire și reimprimare",
        desc: "Fiecare job păstrează bitmap-ul exact. Reimprimă o etichetă cu un click, fără să redesenezi.",
      },
      {
        title: "AWB și etichete de transport",
        desc: "Import PDF pentru AWB Cargus, Fan Courier și alți curieri. Redare directă la capul de imprimare, la 203 DPI.",
      },
      {
        title: "Import PDF, PNG, JPEG și SVG",
        desc: "Trimite orice pagină PDF sau imagine raster către imprimanta termică. Redimensionare, decupare și rotire pe loc.",
      },
      {
        title: "Funcționează offline",
        desc: "Interfață în română și engleză. Fără cont SaaS, fără coadă în cloud — imprimanta e a ta, datele rămân locale.",
      },
    ],
  },
  printers: {
    label: "Compatibilitate",
    heading: "Imprimante termice suportate",
    sub: "ThermalBridge vorbește TSPL, ESC/POS și coada de printare a sistemului. Fără instalare de driver OEM.",
    colPrinter: "Imprimantă",
    colStatus: "Status",
    colDpi: "Rezoluție",
    colProtocol: "Protocol",
    colConnectivity: "Conectivitate",
    available: "Disponibil",
    planned: "Planificat",
    rows: [
      {
        name: "Marklife X4",
        status: "available",
        dpi: "203 DPI",
        protocol: "TSPL/TSC",
        connectivity: "USB · OS Queue · TCP/IP · BLE · SPP",
      },
      {
        name: "Phomemo M110 / M120 / M220",
        status: "available",
        dpi: "203 DPI",
        protocol: "ESC/POS raster",
        connectivity: "Bluetooth BLE (GATT)",
      },
      {
        name: "Canon inkjet (PIXMA / TS / G / TR)",
        status: "available",
        dpi: "300 DPI",
        protocol: "PNG color via OS queue",
        connectivity: "USB · Wi-Fi (AirPrint / CUPS)",
      },
      {
        name: "Generic TSPL 203 DPI",
        status: "available",
        dpi: "203 DPI",
        protocol: "TSPL/TSC",
        connectivity: "USB · OS Queue · TCP/IP",
      },
      {
        name: "Marklife D210",
        status: "planned",
        dpi: "203 DPI",
        protocol: "ESC/POS",
        connectivity: "USB · OS Queue · Bluetooth SPP",
      },
      {
        name: "Marklife P50",
        status: "planned",
        dpi: "203 DPI",
        protocol: "TBD",
        connectivity: "USB · Bluetooth",
      },
    ],
  },
  transports: {
    label: "Conectare",
    heading: "USB, Bluetooth, Wi-Fi sau coada OS",
    sub: "Conexiunile persistă între sesiuni. Un design, orice imprimantă configurată, un click.",
    colTransport: "Transport",
    colDescription: "Descriere",
    rows: [
      {
        name: "USB (direct)",
        desc: "libUSB nativ — ocolește coada OS pentru latență minimă la joburi RAW.",
      },
      {
        name: "Coadă OS",
        desc: "CUPS pe macOS/Linux sau Windows Spooler; funcționează cu orice imprimantă recunoscută de sistem.",
      },
      {
        name: "TCP / IP",
        desc: "Socket TCP raw către o imprimantă de rețea sau un print server (IP:port configurabil).",
      },
      {
        name: "Bluetooth BLE",
        desc: "GATT — Phomemo M110/M120/M220 și Marklife X4 în mod BLE, fără asociere clasică.",
      },
      {
        name: "Bluetooth SPP",
        desc: "Serial Port Profile — dispozitive Marklife mai vechi (D210, fallback X4); necesită asociere OS.",
      },
      {
        name: "Serial (COM/ttyUSB)",
        desc: "RS-232 / USB-CDC — pentru imprimante expuse ca dispozitive COM sau ttyUSB.",
      },
    ],
  },
  downloads: {
    label: "Descărcare",
    heading: "Descarcă ThermalBridge pentru macOS, Windows sau Linux",
    sub: "Gratuit. Instalezi local, fără cont. Rulează nativ pe Apple Silicon, Windows x64 și Linux x86_64.",
    ctaMac: "Descarcă pentru macOS",
    ctaWin: "Descarcă pentru Windows",
    ctaLinux: "Descarcă pentru Linux",
    comingSoon: "În curând",
    unavailable: "indisponibil",
    footnote:
      "Toate versiunile și checksum-urile sunt pe pagina GitHub Releases. Build-uri nesemnate — code-signing este în curs.",
    githubReleases: "GitHub Releases",
  },
  faq: {
    label: "Întrebări",
    heading: "Întrebări frecvente",
    items: [
      {
        q: "ThermalBridge este gratuit?",
        a: "Da. Aplicația desktop se descarcă gratuit pentru macOS, Windows și Linux. Nu există abonament și nu cere un cont în cloud.",
      },
      {
        q: "Pe ce imprimante termice funcționează?",
        a: "Marklife X4, Phomemo M110, M120 și M220, imprimante generice TSPL 203 DPI și imprimante Canon inkjet prin coada OS. Marklife D210 și P50 sunt planificate.",
      },
      {
        q: "Am nevoie de driver-ul producătorului?",
        a: "Nu pentru fluxul nativ USB/BLE/TSPL. ThermalBridge trimite rasterul direct către imprimantă. Coada OS (CUPS / Windows Spooler) rămâne disponibilă ca alternativă.",
      },
      {
        q: "Pot tipări AWB-uri PDF?",
        a: "Da. Importă pagina PDF și o trimiți la 203 DPI către capul termic — potrivit pentru Cargus, Fan Courier și alți curieri din România.",
      },
    ],
  },
  footer: {
    app: "Aplicație",
    shop: "Magazin",
    legal: "Legal",
    features: "Funcții",
    printers: "Imprimante compatibile",
    downloads: "Descărcări",
    shopPrinters: "Imprimante termice",
    cart: "Coș de cumpărături",
    terms: "Termeni și condiții",
    privacy: "Confidențialitate",
    copy: "Toate drepturile rezervate. Distribuție neautorizată fără acord scris.",
  },
  ids: {
    features: "features",
    printers: "imprimante",
    downloads: "descarcari",
    faq: "intrebari",
  },
};

const EN: LandingCopy = {
  meta: {
    title:
      "ThermalBridge — thermal label software for Marklife, Phomemo & TSPL printers",
    description:
      "Free desktop app for thermal labels and shipping barcodes. Print to Marklife X4, Phomemo M110/M120 and TSPL printers over USB, Bluetooth or Wi-Fi — no cloud, no subscription.",
    ogTitle: "ThermalBridge — thermal label software",
    ogDescription:
      "Design and print labels on Marklife, Phomemo and TSPL printers. Native apps for macOS, Windows and Linux.",
  },
  nav: {
    features: "Features",
    printers: "Printers",
    downloads: "Downloads",
    shop: "Shop",
    cart: "Cart",
  },
  hero: {
    eyebrow: "Free desktop app · macOS, Windows, Linux",
    h1Lead: "Thermal label software for",
    h1Highlight: "Marklife, Phomemo and TSPL",
    lead: "ThermalBridge is a desktop editor for product labels, shipping labels and barcodes. Connect over USB, Bluetooth or Wi-Fi — no cloud account, no subscription, no vendor driver.",
    ctaDownload: "Download free",
    ctaLearn: "See features",
    platforms: "macOS · Windows · Linux",
    screenshotAlt:
      "ThermalBridge desktop thermal label editor, showing the canvas, template tools and print pane",
  },
  features: {
    label: "Features",
    heading: "A thermal label editor that stays on your computer",
    sub: "Design, save and print labels to a local printer. No SaaS account — your files never leave the machine.",
    items: [
      {
        title: "Label editor with barcodes and QR codes",
        desc: "Drag-and-drop canvas with text, 1D barcodes, QR codes, images, shapes and tables. Full inspector for every overlay.",
      },
      {
        title: "Reusable label templates",
        desc: "Save designs as templates. Sync across machines with Dropbox or any shared folder using atomic file writes.",
      },
      {
        title: "Print history and one-click reprint",
        desc: "Every job stores the exact bitmap. Reprint a label later without rebuilding the layout.",
      },
      {
        title: "Shipping labels and AWB PDFs",
        desc: "Import courier PDFs and send them straight to a 203 DPI thermal head — built for shipping-label workflows.",
      },
      {
        title: "PDF, PNG, JPEG and SVG import",
        desc: "Render any PDF page or raster image to the print head. Resize, crop and rotate before you send the job.",
      },
      {
        title: "Works fully offline",
        desc: "English and Romanian UI. No cloud queue and no vendor lock-in — the printer and the files stay yours.",
      },
    ],
  },
  printers: {
    label: "Compatibility",
    heading: "Supported thermal printers",
    sub: "ThermalBridge speaks TSPL, ESC/POS and the OS print queue. No OEM driver installer required.",
    colPrinter: "Printer",
    colStatus: "Status",
    colDpi: "Resolution",
    colProtocol: "Protocol",
    colConnectivity: "Connectivity",
    available: "Available",
    planned: "Planned",
    rows: [
      {
        name: "Marklife X4",
        status: "available",
        dpi: "203 DPI",
        protocol: "TSPL/TSC",
        connectivity: "USB · OS queue · TCP/IP · BLE · SPP",
      },
      {
        name: "Phomemo M110 / M120 / M220",
        status: "available",
        dpi: "203 DPI",
        protocol: "ESC/POS raster",
        connectivity: "Bluetooth BLE (GATT)",
      },
      {
        name: "Canon inkjet (PIXMA / TS / G / TR)",
        status: "available",
        dpi: "300 DPI",
        protocol: "Color PNG via OS queue",
        connectivity: "USB · Wi-Fi (AirPrint / CUPS)",
      },
      {
        name: "Generic TSPL 203 DPI",
        status: "available",
        dpi: "203 DPI",
        protocol: "TSPL/TSC",
        connectivity: "USB · OS queue · TCP/IP",
      },
      {
        name: "Marklife D210",
        status: "planned",
        dpi: "203 DPI",
        protocol: "ESC/POS",
        connectivity: "USB · OS queue · Bluetooth SPP",
      },
      {
        name: "Marklife P50",
        status: "planned",
        dpi: "203 DPI",
        protocol: "TBD",
        connectivity: "USB · Bluetooth",
      },
    ],
  },
  transports: {
    label: "Transports",
    heading: "USB, Bluetooth, Wi-Fi or the OS queue",
    sub: "Printer bindings persist across sessions. One label design, any configured printer, one click.",
    colTransport: "Transport",
    colDescription: "Description",
    rows: [
      {
        name: "USB (direct)",
        desc: "Native libUSB — bypasses the OS print queue for lowest-latency RAW jobs.",
      },
      {
        name: "OS print queue",
        desc: "CUPS on macOS/Linux or the Windows Spooler; works with any queue the OS already recognises.",
      },
      {
        name: "TCP / IP",
        desc: "Raw TCP socket to a network printer or print server (configurable IP:port).",
      },
      {
        name: "Bluetooth BLE",
        desc: "GATT — Phomemo M110/M120/M220 and Marklife X4 BLE mode; no classic pairing required.",
      },
      {
        name: "Bluetooth SPP",
        desc: "Classic Serial Port Profile — older Marklife devices (D210, X4 fallback); requires OS pairing.",
      },
      {
        name: "Serial (COM/ttyUSB)",
        desc: "RS-232 / USB-CDC serial — for printers exposed as COM or ttyUSB devices.",
      },
    ],
  },
  downloads: {
    label: "Get started",
    heading: "Download ThermalBridge for macOS, Windows or Linux",
    sub: "Free. Install locally, no account. Native builds for Apple Silicon, Windows x64 and Linux x86_64.",
    ctaMac: "Download for macOS",
    ctaWin: "Download for Windows",
    ctaLinux: "Download for Linux",
    comingSoon: "Coming soon",
    unavailable: "unavailable",
    footnote:
      "All releases and checksums are on the GitHub Releases page. Unsigned alpha builds — production code-signing is in progress.",
    githubReleases: "GitHub Releases",
  },
  faq: {
    label: "FAQ",
    heading: "Frequently asked questions",
    items: [
      {
        q: "Is ThermalBridge free?",
        a: "Yes. The desktop app is free to download for macOS, Windows and Linux. There is no subscription and no cloud account.",
      },
      {
        q: "Which thermal printers are supported?",
        a: "Marklife X4, Phomemo M110, M120 and M220, generic TSPL 203 DPI printers, and Canon inkjets via the OS queue. Marklife D210 and P50 are planned.",
      },
      {
        q: "Do I need the vendor driver?",
        a: "Not for the native USB/BLE/TSPL path. ThermalBridge sends raster data straight to the printer. The OS queue (CUPS / Windows Spooler) remains available as a fallback.",
      },
      {
        q: "Can I print shipping-label PDFs?",
        a: "Yes. Import a PDF page and send it at 203 DPI to the thermal head — built for courier AWB and shipping-label workflows.",
      },
    ],
  },
  footer: {
    app: "App",
    shop: "Shop",
    legal: "Legal",
    features: "Features",
    printers: "Supported printers",
    downloads: "Downloads",
    shopPrinters: "Thermal printers",
    cart: "Shopping cart",
    terms: "Terms",
    privacy: "Privacy",
    copy: "All rights reserved. Not for distribution without written permission.",
  },
  ids: {
    features: "features",
    printers: "printers",
    downloads: "downloads",
    faq: "faq",
  },
};

export const LANDING: Record<Locale, LandingCopy> = {
  ro: RO,
  en: EN,
};

export function landingCopy(locale: Locale): LandingCopy {
  return LANDING[locale];
}
