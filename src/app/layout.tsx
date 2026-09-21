import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "@fontsource/cormorant-garamond/latin-400.css";
import "@fontsource/cormorant-garamond/latin-400-italic.css";
import "@fontsource/cormorant-garamond/latin-500.css";
import "@fontsource/shippori-mincho/400.css";
import "@fontsource/shippori-mincho/600.css";
import "./globals.css";
import { Providers } from "./providers";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { site } from "@/config/site";

export const metadata: Metadata = {
  title: `${site.name} | ${site.nameEn}`,
  description: site.description,
  openGraph: {
    title: `${site.name} | ${site.nameEn}`,
    description: site.description,
    locale: "ja_JP",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#20282c",
};

// 描画前に「照明（ライト/ダーク）」を反映して、ちらつきを防ぐ。
// 既定は夜の展示室（dark）。ここを "on" 基準に変えると既定が昼になります。
const lightsScript = `(function(){try{var l=localStorage.getItem('yohaku:lights')==='on';var c=document.documentElement.classList;c.toggle('dark',!l);c.toggle('light',l);}catch(e){}})();`;

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ja" className="dark" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: lightsScript }} />
      </head>
      <body>
        <Providers>
          <a href="#main" className="skip-link">
            本文へ移動
          </a>
          <SiteHeader />
          <main id="main">{children}</main>
          <SiteFooter />
        </Providers>
      </body>
    </html>
  );
}
