"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart";

export function Nav() {
  const { itemCount } = useCart();
  return (
    <nav className="sticky top-0 z-50 border-b border-white/5 bg-ink-950/90 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
        <Link href="/" className="flex items-center gap-2 font-semibold text-ink-50">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="ThermalBridge logo" className="h-7 w-7 rounded-lg" />
          ThermalBridge
        </Link>
        <ul className="flex items-center gap-5 text-sm text-ink-300">
          <li><Link href="/#features" className="hover:text-ink-50 transition-colors">Funcții</Link></li>
          <li><Link href="/#imprimante" className="hover:text-ink-50 transition-colors">Imprimante</Link></li>
          <li><Link href="/#descarcari" className="hover:text-ink-50 transition-colors">Descărcări</Link></li>
          <li><Link href="/imprimante" className="hover:text-ink-50 transition-colors">Magazin</Link></li>
          <li>
            <Link
              href="/cos"
              className="flex items-center gap-1.5 rounded-lg bg-ink-800 px-3 py-1.5 text-ink-100 hover:bg-ink-700 transition-colors"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 001.97-1.67L23 6H6"/>
              </svg>
              Coș
              {itemCount > 0 && (
                <span className="min-w-[1.1rem] rounded-full bg-accent-500 px-1 text-center text-xs font-bold text-ink-950">
                  {itemCount}
                </span>
              )}
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}
