import type { NextConfig } from "next";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

// Only init the Cloudflare dev shim when running `next dev`.
// Skipped during `next build` (the opennextjs-cloudflare CLI handles that).
if (process.env.NODE_ENV === "development") {
  initOpenNextCloudflareForDev();
}

const nextConfig: NextConfig = {
  /* config options here */
};

export default nextConfig;
