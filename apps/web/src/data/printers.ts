export interface Printer {
  slug: string;
  name: string;
  /** TVA included, integer bani (1 RON = 100 bani). e.g. 129900 = 1.299,00 RON */
  priceBani: number;
  /** Physical units on hand. Actual availability is derived: stock - SUM(sold). */
  stock: number;
  dpi: number;
  protocol: string;
  connectivity: readonly string[];
  /** Paths relative to /public — replace placeholders with real product photos */
  images: readonly string[];
  description: string;
  specs: Record<string, string>;
}

/**
 * Static catalog. Update stock when new units arrive.
 * Real availability is computed by stock.ts against D1 — overselling is prevented.
 *
 * ⚠ PLACEHOLDERS: prices, stock counts, and images must be filled in before launch.
 */
export const PRINTERS: readonly Printer[] = [
  {
    slug: "marklife-x4",
    name: "Marklife X4",
    priceBani: 0, // TODO: fill in the actual selling price in bani
    stock: 0, // TODO: fill in actual stock count
    dpi: 203,
    protocol: "TSPL/TSC",
    connectivity: ["USB", "OS Queue", "TCP/IP", "BLE", "Bluetooth SPP"],
    images: ["/placeholder-printer.png"], // TODO: replace with real product images
    description:
      "Imprimantă termică profesională 203 DPI cu suport complet TSPL/TSC. Conectivitate versatilă: USB, rețea, Bluetooth BLE și SPP. Compatibilă nativ cu ThermalBridge fără drivere suplimentare.",
    specs: {
      Rezoluție: "203 DPI",
      Protocol: "TSPL/TSC",
      Conectivitate: "USB · OS Queue · TCP/IP · BLE · SPP",
      "Lățime maximă eticheta": "108 mm",
      "Viteză de tipărire": "până la 127 mm/s",
    },
  },
  {
    slug: "phomemo-m110",
    name: "Phomemo M110",
    priceBani: 0, // TODO: fill in the actual selling price in bani
    stock: 0, // TODO: fill in actual stock count
    dpi: 203,
    protocol: "ESC/POS raster",
    connectivity: ["Bluetooth BLE (GATT)"],
    images: ["/placeholder-printer.png"], // TODO: replace with real product images
    description:
      "Imprimantă termică portabilă Bluetooth BLE 203 DPI. Ideală pentru etichete de produse, AWB-uri și bonuri. Fără fir, compactă, compatibilă direct cu ThermalBridge.",
    specs: {
      Rezoluție: "203 DPI",
      Protocol: "ESC/POS raster",
      Conectivitate: "Bluetooth BLE (GATT)",
      "Lățime maximă eticheta": "57 mm",
      Alimentare: "Acumulator Li-Ion",
    },
  },
  {
    slug: "phomemo-m120",
    name: "Phomemo M120",
    priceBani: 0, // TODO: fill in the actual selling price in bani
    stock: 0, // TODO: fill in actual stock count
    dpi: 203,
    protocol: "ESC/POS raster",
    connectivity: ["Bluetooth BLE (GATT)"],
    images: ["/placeholder-printer.png"], // TODO: replace with real product images
    description:
      "Versiunea extinsă a lui M110 cu suport pentru etichete mai late. 203 DPI, Bluetooth BLE, compatibilă cu ThermalBridge fără configurare suplimentară.",
    specs: {
      Rezoluție: "203 DPI",
      Protocol: "ESC/POS raster",
      Conectivitate: "Bluetooth BLE (GATT)",
      "Lățime maximă eticheta": "72 mm",
      Alimentare: "Acumulator Li-Ion",
    },
  },
  {
    slug: "generic-tspl-203",
    name: "Imprimantă Termică TSPL 203 DPI",
    priceBani: 0, // TODO: fill in the actual selling price in bani
    stock: 0, // TODO: fill in actual stock count
    dpi: 203,
    protocol: "TSPL/TSC",
    connectivity: ["USB", "OS Queue", "TCP/IP"],
    images: ["/placeholder-printer.png"], // TODO: replace with real product images
    description:
      "Imprimantă termică generică 203 DPI cu protocol TSPL/TSC. Potrivită pentru etichete de transport, depozit și retail. Conectare prin USB sau rețea.",
    specs: {
      Rezoluție: "203 DPI",
      Protocol: "TSPL/TSC",
      Conectivitate: "USB · OS Queue · TCP/IP",
      "Lățime maximă eticheta": "108 mm",
      "Viteză de tipărire": "până la 127 mm/s",
    },
  },
] as const;

export function getPrinterBySlug(slug: string): Printer | undefined {
  return PRINTERS.find((p) => p.slug === slug);
}
