// pages/_app.js
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Oswald, Inter } from "next/font/google";
import "../styles/globals.css";

const oswald = Oswald({ subsets: ["latin"] });
const inter = Inter({ subsets: ["latin"] });

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!router.isReady) return;

    const token = localStorage.getItem("smpm_auth");
    const isLoginPage = router.pathname === "/login";

    // Si on est sur login ET authentifié → aller à l'accueil
    if (isLoginPage && token === "authenticated") {
      router.push("/");
      return;
    }

    // Si on n'est pas sur login ET pas authentifié → aller à login
    if (!isLoginPage && token !== "authenticated") {
      router.push("/login");
      return;
    }

    setIsReady(true);
  }, [router.isReady, router.pathname]);

  if (!router.isReady || !isReady) {
    return null;
  }

  return (
    <div style={{ fontFamily: inter.style.fontFamily }}>
      <style jsx global>{`
        * {
          font-family: ${inter.style.fontFamily};
        }
      `}</style>
      <Component {...pageProps} />
    </div>
  );
}

export default MyApp;
