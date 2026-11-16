import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Hirayama CRM | Relacionamentos que protegem",
  description: "Clientes, oportunidades, apólices e renovações da Hirayama Corretora em um só lugar.",
  robots: { index: false, follow: false },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="antialiased">{children}</body>
    </html>
  );
}
