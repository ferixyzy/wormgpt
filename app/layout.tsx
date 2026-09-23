import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Luna Chat — GPT-5.6 Luna",
  description: "Modern AI chat assistant powered by GPT-5.6 Luna",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <link
          rel="preconnect"
          href="https://fonts.googleapis.com"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
        />
      </head>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
