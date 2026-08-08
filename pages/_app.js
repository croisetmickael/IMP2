// pages/_app.js
import { useEffect } from "react";
import { useRouter } from "next/router";
import "../styles/globals.css";

export default function App({ Component, pageProps }) {
  const router = useRouter();

  useEffect(() => {
    // Vérifier l'authentification
    const checkAuth = () => {
      // Vider le token à chaque rechargement pour forcer la re-authentification
      if (typeof window !== "undefined") {
        localStorage.removeItem("smpm_auth");
      }
      
      // Si on n'est pas sur la page login, rediriger
      if (router.pathname !== "/login") {
        router.push("/login");
      }
    };

    checkAuth();
  }, [router.pathname]);

  return <Component {...pageProps} />;
}
