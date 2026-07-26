// pages/_app.js
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Oswald, Inter } from "next/font/google";
import "../styles/globals.css";

const oswald = Oswald({ subsets: ["latin"] });
const inter = Inter({ subsets: ["latin"] });

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Vérifie l'authentification au démarrage
    const token = localStorage.getItem("smpm_auth");
    if (token === "authenticated") {
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    // Si pas authentifié et pas sur la page login, rediriger vers login
    if (!isLoading && !isAuthenticated && router.pathname !== "/login") {
      router.push("/login");
    }
  }, [isAuthenticated, isLoading, router]);

  // Pages publiques (pas besoin d'auth)
  const publicPages = ["/login"];
  const isPublicPage = publicPages.includes(router.pathname);

  if (isLoading) {
    return <div style={{ padding: 20, textAlign: "center" }}>Chargement...</div>;
  }

  if (!isAuthenticated && !isPublicPage) {
    return null; // Redirection en cours
  }

  return (
    <div style={{ fontFamily: isPublicPage ? inter.style.fontFamily : oswald.style.fontFamily }}>
      <style jsx global>{`
        * {
          font-family: ${isPublicPage ? inter.style.fontFamily : oswald.style.fontFamily};
        }
      `}</style>
      <Component {...pageProps} />
    </div>
  );
}

export default MyApp;
