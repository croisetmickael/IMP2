// pages/_app.js
import { useEffect } from "react";
import { useRouter } from "next/router";
import "../styles/globals.css";

// Arrivée depuis l'application EPI SMPM 80 (déjà authentifiée) : pas de code SMPM à ressaisir.
// Doit être identique à IMP2_SSO dans config.js de l'application EPI.
const EPI_SSO_KEY = "epi21-7Hq4mZ2vK9";

export default function App({ Component, pageProps }) {
  const router = useRouter();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("sso") === EPI_SSO_KEY) {
      sessionStorage.setItem("smpm_auth", "authenticated");
      params.delete("sso");
      const qs = params.toString();
      const target = router.pathname === "/login" ? "/" : router.pathname;
      router.replace(target + (qs ? "?" + qs : ""));
      return;
    }

    // Vérifier l'authentification
    const token = sessionStorage.getItem("smpm_auth");

    // Si pas de token et qu'on n'est pas sur login → rediriger
    if (!token && router.pathname !== "/login") {
      router.push("/login");
    }
  }, [router.pathname]);

  return <Component {...pageProps} />;
}
