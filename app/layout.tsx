import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { LayoutProvider } from "../layout/context/layoutcontext";

import "primereact/resources/primereact.css";
import "primeflex/primeflex.css";
import "primeicons/primeicons.css";
import "../styles/layout/layout.scss";
import "../styles/demo/Demos.scss";

const inter = Inter({ subsets: ['latin'] })
interface RootLayoutProps {
  children: React.ReactNode;
}


export const metadata: Metadata = {
  title: "Koperasi",
  description:
    "tentang Koperasi",
  robots: { index: false, follow: false },
  viewport: { initialScale: 1, width: "device-width" },
  openGraph: {
    type: "website",
    title: "Koperasi",
    url: "",
    description:
      "tentang Koperasi",
    images: ["https://i2.wp.com/www.maxmanroe.com/vid/wp-content/uploads/2018/09/Pengertian-Akuntansi-Adalah.jpg"],
    ttl: 604800,
  },
  icons: {
    icon: "/favicon.ico",
  },
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
    <head>
      <link
        id="theme-css"
        href={`/themes/lara-light-indigo/theme.css`}
        rel="stylesheet"
      ></link>
    </head>
    <body>
      <LayoutProvider>{children}</LayoutProvider>
    </body>
  </html>
);
}
