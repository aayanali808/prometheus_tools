import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Prometheus Tools",
  description: "AI workflows that actually do the work.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
