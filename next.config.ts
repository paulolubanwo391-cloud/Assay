import type { NextConfig } from "next";

/**
 * The site is exported as plain static files. There is no server and no
 * runtime dependency on any third-party API: every number on the page was
 * computed at build time from data/metrics.json and data/series.json.
 * NEXT_PUBLIC_BASE_PATH lets the same build serve from a sub-path (GitHub Pages).
 */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const config: NextConfig = {
  output: "export",
  basePath,
  trailingSlash: true,
  images: { unoptimized: true },
  reactStrictMode: true,
};

export default config;
