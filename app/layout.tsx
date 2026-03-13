import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/styles/globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://jettnguyen.github.io"),
  title: {
    default: "Jett Nguyen · Digital Lab",
    template: "%s · Jett Nguyen"
  },
  icons: {
    icon: "/assets/jett.png",
    apple: "/assets/jett.png",
    shortcut: "/assets/jett.png"
  },
  description: "A digital lab of experiments: systems, writing, presentations, and product-minded engineering work.",
  openGraph: {
    title: "Jett Nguyen · Digital Lab",
    description: "Designing systems that shape behavior.",
    type: "website"
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="lab-grid fixed inset-0 -z-10 opacity-25" aria-hidden="true" />
        <SiteHeader />
        <main>{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
