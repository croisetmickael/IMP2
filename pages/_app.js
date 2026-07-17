// pages/_app.js
import { Oswald, Inter } from "next/font/google";
import Head from "next/head";
import "../styles/globals.css";

const display = Oswald({
  subsets: ["latin"],
  weight: ["500", "700"],
  variable: "--font-display",
});

const body = Inter({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-body",
});

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>SMPM — Suivi GRIMP 80</title>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1"
        />
        <meta name="theme-color" content="#12294a" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
        <link rel="icon" href="/icons/icon-192.png" />
      </Head>
      <div className={`${display.variable} ${body.variable}`}>
        <Component {...pageProps} />
      </div>
    </>
  );
}
