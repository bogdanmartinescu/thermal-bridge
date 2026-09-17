"use client";

import { useCart } from "@/lib/cart";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface Props {
  slug: string;
  name: string;
  priceBani: number;
  available: number;
  disabled: boolean;
}

export function AddToCartButton({ slug, name, priceBani, available, disabled }: Props) {
  const { add } = useCart();
  const router = useRouter();
  const [added, setAdded] = useState(false);

  function handleAdd() {
    add({ slug, name, unitPriceBani: priceBani, available });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  if (disabled) {
    return (
      <button
        type="button"
        disabled
        className="mt-2 w-full rounded-xl bg-ink-700 py-3 text-center font-semibold text-ink-500 cursor-not-allowed"
      >
        {available === 0 ? "Indisponibil" : "Preț indisponibil"}
      </button>
    );
  }

  return (
    <div className="mt-2 flex gap-3">
      <button
        type="button"
        onClick={handleAdd}
        className="flex-1 rounded-xl bg-accent-500 py-3 font-semibold text-ink-950 hover:bg-accent-600 transition-colors"
      >
        {added ? "✓ Adăugat în coș!" : "Adaugă în coș"}
      </button>
      <button
        type="button"
        onClick={() => {
          add({ slug, name, unitPriceBani: priceBani, available });
          router.push("/cos");
        }}
        className="rounded-xl border border-white/10 px-4 font-medium text-ink-200 hover:bg-ink-800 transition-colors"
      >
        Comandă acum
      </button>
    </div>
  );
}
