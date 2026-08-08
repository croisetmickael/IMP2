// pages/index.js
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Shell from "../components/Shell";

export default function Home() {
  const router = useRouter();
  const [today, setToday] = useState(null);
  const [allManoeuvres, setAllManoeuvres] = useState([]);
  const [openPicker, setOpenPicker] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchToday();
  }, []);

  async function fetchToday() {
    try {
      const res = await fetch("/api/today");
      const data = await res.json();
      setToday(data);
      setAllManoeuvres(data.allManoeuvres || []);
      setLoading(false);
    } catch (err) {
      console.error("Erreur:", err);
      setLoading(false);
    }
  }

  function handleManoeuvreSelection(manoeuvre) {
    // Extrait le lieu de la manoeuvre
    const lieu = manoeuvre.split(" - ")[1];
    router.push(`/manoeuvre?type=manoeuvre&lieu=${encodeURIComponent(lieu)}`);
  }

  if (loading) {
    return (
      <Shell title="SMPM">
        <div style={{ textAlign: "center", padding: 20 }}>Chargement...</div>
      </Shell>
    );
  }

  const todayDate = today?.today || new Date().toLocaleDateString("fr-FR");

  return (
    <Shell title="SMPM" subtitle="Accueil">
      {/* Boutons principaux */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
        {/* Intervention */}
        <button
          onClick={() => router.push("/manoeuvre?type=intervention")}
          style={{
            padding: 16,
            background: "var(--navy)",
            color: "#fff",
            border: "none",
            borderRadius: 10,
            fontWeight: 700,
            fontSize: 16,
            cursor: "pointer",
          }}
        >
          🚨 Intervention
        </button>

        {/* Inventaire */}
        <button
          onClick={() => router.push("/inventaire")}
          style={{
            padding: 16,
            background: "var(--navy)",
            color: "#fff",
            border: "none",
            borderRadius: 10,
            fontWeight: 700,
            fontSize: 16,
            cursor: "pointer",
          }}
        >
          📦 Inventaire
        </button>

        {/* Manoeuvre */}
        <button
          onClick={() => {
            if (today?.hasTodayManoeuvre) {
              handleManoeuvreSelection(`${todayDate} - ${today.todayManoeuvre}`);
            } else {
              setOpenPicker(!openPicker);
            }
          }}
          disabled={!today?.hasTodayManoeuvre && allManoeuvres.length === 0}
          style={{
            gridColumn: "1 / -1",
            padding: 16,
            background: today?.hasTodayManoeuvre ? "var(--gold)" : "#ccc",
            color: today?.hasTodayManoeuvre ? "var(--navy)" : "#666",
            border: "none",
            borderRadius: 10,
            fontWeight: 700,
            fontSize: 16,
            cursor: today?.hasTodayManoeuvre || allManoeuvres.length > 0 ? "pointer" : "not-allowed",
          }}
        >
          📋 {todayDate}
          {today?.hasTodayManoeuvre ? ` - ${today.todayManoeuvre}` : " - Pas de manoeuvre"}
        </button>

        {/* Schémas */}
        <button
          onClick={() => router.push("/schemas")}
          style={{
            gridColumn: "1 / -1",
            padding: 16,
            background: "#E67E22",
            color: "#fff",
            border: "none",
            borderRadius: 10,
            fontWeight: 700,
            fontSize: 16,
            cursor: "pointer",
          }}
        >
          📄 Schémas Manoeuvres
        </button>
      </div>

      {/* Picker Calendrier - Seulement si pas de manoeuvre du jour */}
      {!today?.hasTodayManoeuvre && openPicker && allManoeuvres.length > 0 && (
        <div className="card">
          <span className="field-label">Choisir une manœuvre :</span>
          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 8 }}>
            {allManoeuvres.map((m, i) => (
              <button
                key={i}
                onClick={() => {
                  handleManoeuvreSelection(m);
                  setOpenPicker(false);
                }}
                style={{
                  padding: 12,
                  background: "#f5f5f5",
                  color: "var(--navy)",
                  border: "1.5px solid var(--line)",
                  borderRadius: 8,
                  fontWeight: 600,
                  fontSize: 14,
                  cursor: "pointer",
                  textAlign: "left",
                }}
              >
                {m}
              </button>
            ))}
          </div>
        </div>
      )}
    </Shell>
  );
}
