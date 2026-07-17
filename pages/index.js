// pages/index.js
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Shell from "../components/Shell";

export default function Home() {
  const router = useRouter();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/today")
      .then((r) => r.json())
      .then(setData)
      .catch(() => setData({}))
      .finally(() => setLoading(false));
  }, []);

  function goManoeuvre(type, lieu) {
    router.push(
      `/manoeuvre?type=${encodeURIComponent(type)}&lieu=${encodeURIComponent(
        lieu || ""
      )}`
    );
  }

  const today = data?.today || "";

  return (
    <Shell>
      <div className="home-grid">
        <button
          className="home-tile primary"
          onClick={() => goManoeuvre("intervention", "INTERVENTION")}
        >
          <div className="eyebrow">{today}</div>
          <div className="label">Intervention</div>
          <div className="meta">Déclarer une intervention en cours</div>
        </button>

        {loading ? (
          <div className="home-tile disabled">
            <div className="eyebrow">{today}</div>
            <div className="label">Manœuvre du jour</div>
            <div className="meta">Chargement…</div>
          </div>
        ) : data?.manoeuvreDuJour ? (
          <button
            className="home-tile"
            onClick={() =>
              goManoeuvre("manoeuvre", data.manoeuvreDuJour.lieu)
            }
          >
            <div className="eyebrow">{today}</div>
            <div className="label">{data.manoeuvreDuJour.lieu}</div>
            <div className="meta">Manœuvre du jour — enregistrer ma participation</div>
          </button>
        ) : (
          <div className="home-tile disabled">
            <div className="eyebrow">{today}</div>
            <div className="label">Manœuvre du jour</div>
            <div className="meta">Aucune manœuvre prévue aujourd'hui</div>
          </div>
        )}

        <button className="home-tile" onClick={() => router.push("/suivi")}>
          <div className="eyebrow">Mon historique</div>
          <div className="label">Suivi</div>
          <div className="meta">Consulter mes manœuvres passées</div>
        </button>

        <button className="home-tile" onClick={() => router.push("/inventaire")}>
          <div className="eyebrow">Matériel</div>
          <div className="label">Inventaire</div>
          <div className="meta">Contrôler le matériel des caisses</div>
        </button>
      </div>
    </Shell>
  );
}
