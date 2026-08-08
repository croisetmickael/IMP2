// pages/suivi.js
import { useState } from "react";
import { useRouter } from "next/router";
import Shell from "../components/Shell";
import { getRandomMatricule } from "../lib/helpers";

export default function Suivi() {
  const router = useRouter();
  const [matricule, setMatricule] = useState("");
  const [randomMatricule] = useState(getRandomMatricule());
  const [manoeuvres, setManoeuvres] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState("");

  async function searchManoeuvres() {
    setError("");
    if (!matricule.trim()) {
      setError("Matricule requis");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/mes-manoeuvres?matricule=${matricule.trim()}`);
      const data = await res.json();
      if (data.ok) {
        setManoeuvres(data.manoeuvres || []);
        setSearched(true);
      } else {
        setError(data.error || "Erreur");
      }
    } catch (err) {
      setError("Erreur chargement");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Shell title="SMPM" subtitle="Suivi" showBack>
      {/* Recherche */}
      <div className="card" style={{ marginBottom: 20 }}>
        <span className="field-label">Matricule</span>
        <input
          type="tel"
          inputMode="numeric"
          placeholder={`Ex : ${randomMatricule}`}
          value={matricule}
          onChange={(e) => setMatricule(e.target.value)}
          style={{ marginBottom: 12 }}
        />
        {error && <div className="alert alert-error">{error}</div>}
        <button
          className="btn btn-primary"
          onClick={searchManoeuvres}
          disabled={loading}
          style={{ width: "100%" }}
        >
          {loading ? "Recherche..." : "🔍 Rechercher"}
        </button>
      </div>

      {/* Résultats */}
      {searched && (
        <div className="card">
          <h3 style={{ marginTop: 0 }}>Manoeuvres effectuées</h3>
          {manoeuvres.length === 0 ? (
            <div style={{ textAlign: "center", color: "var(--ink-soft)" }}>
              Aucune manoeuvre trouvée
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 10 }}>
              {manoeuvres.map((m, i) => (
                <div
                  key={i}
                  style={{
                    padding: 12,
                    background: "#f9f9f9",
                    borderLeft: "4px solid var(--gold)",
                    borderRadius: 6,
                  }}
                >
                  <div style={{ fontWeight: 700, marginBottom: 4 }}>{m.date} - {m.heure}</div>
                  <div style={{ fontSize: 14, marginBottom: 4 }}>📍 {m.action}</div>
                  {m.observation && (
                    <div style={{ fontSize: 13, color: "var(--ink-soft)" }}>
                      📝 {m.observation}
                    </div>
                  )}
                  <div style={{ fontSize: 12, color: "var(--ink-soft)", marginTop: 6 }}>
                    Rôle: {m.roles || "-"}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </Shell>
  );
}
