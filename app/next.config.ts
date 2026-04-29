import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["puppeteer-core", "@sparticuz/chromium"],
  outputFileTracingIncludes: {
    "/api/rank-buddy/email-report": [
      "./node_modules/@sparticuz/chromium/bin/**/*",
    ],
    "/api/rank-buddy/pdf": [
      "./node_modules/@sparticuz/chromium/bin/**/*",
    ],
  },
};

export default nextConfig;
