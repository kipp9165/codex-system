import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Codex System – Invention Radar",
  description: "AI-free invention analysis: structure, novelty, risks, and opportunities.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
