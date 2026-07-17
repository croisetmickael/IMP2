// pages/inventaire.js
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import Shell from "../components/Shell";

export default function Inventaire() {
  const router = useRouter();
  const [items, setItems] = useState([]);
  const [statuses, setStatuses] = useState({}); // { article: "ok" | "nonok" }
  const [matricule, setMatricule] = useState("");
  const [observation, setObservation] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    fetch("/api/inventaire")
      .then((r) => r.json())
      .then((d) => setItems(d.items || []))
      .catch(() => {});
  }, []);

  // Cle unique par article : plusieurs caisses peuvent contenir un article
  // du meme nom (ex. "SANGLE VARIO" dans Caisse N°3 et Sac Baroud), donc on
  // ne peut pas utiliser le seul nom comme identifiant.
  function itemKey(it) {
    return `${it.emplacement || "Autre"}::${it.article}`;
  }

  const grouped = useMemo(() => {
    const groups = {};
    for (const it of items) {
      const key = it.emplacement || "Autre";
      if (!groups[key]) groups[key] = [];
      groups[key].push(it);
    }
    return groups;
  }, [items]);

  const checkedCount = Object.keys(statuses).length;

  function setStatus(key, status) {
    setStatuses((s) => {
      const next = { ...s };
      if (next[key] === status) {
        delete next[key]; // toggle off
      } else {
        next[key] = status;
      }
      return next;
    });
  }

  async function handleValidate() {
    setError("");
    if (!matricule.trim()) {
      setError("Merci de saisir un matricule.");
      return;
    }
    if (checkedCount === 0) {
      setError("Contrôle au moins un article avant de valider.");
      return;
    }
    setSubmitting(true);
    const itemsOk = Object.entries(statuses)
      .filter(([, v]) => v === "ok")
      .map(([k]) => k.split("::")[1] ? k.replace("::", " — ") : k);
    const itemsNonOk = Object.entries(statuses)
      .filter(([, v]) => v === "nonok")
      .map(([k]) => k.split("::")[1] ? k.replace("::", " — ") : k);

    try {
      const res = await fetch("/api/save-inventaire", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          matricule: matricule.trim(),
          itemsOk,
          itemsNonOk,
          observation,
        }),
      });
      const data = await res.json();
      if (!data.ok) {
        setError(data.error || "Une erreur est survenue.");
      } else {
        setResult({ agent: data.agent, itemsOk, itemsNonOk });
      }
    } catch (err) {
      setError("Impossible d'enregistrer. Vérifie ta connexion et réessaie.");
    } finally {
      setSubmitting(false);
    }
  }

  if (result) {
    return (
      <Shell title="SMPM" subtitle="Inventaire" showBack onBack={() => router.push("/")}>
        <div className="alert alert-success">
          Contrôle enregistré pour {result.agent.prenom} {result.agent.nom}.
        </div>
        <div className="card">
          <div className="field-label">OK ({result.itemsOk.length})</div>
          <div style={{ marginBottom: 12 }}>
            {result.itemsOk.join(", ") || "—"}
          </div>
          <div className="field-label">Non OK ({result.itemsNonOk.length})</div>
          <div>{result.itemsNonOk.join(", ") || "—"}</div>
        </div>
        <button className="btn btn-primary" onClick={() => router.push("/")}>
          Retour à l'accueil
        </button>
      </Shell>
    );
  }

  return (
    <Shell title="SMPM" subtitle="Inventaire" showBack>
      <p style={{ color: "var(--ink-soft)", fontSize: 14, marginBottom: 4 }}>
        Coche OK ou Non OK pour chaque article contrôlé. Tu peux valider
        même si tu n'as pas tout vérifié.
      </p>

      {Object.entries(grouped).map(([emplacement, list]) => (
        <div key={emplacement}>
          <div className="inv-group-title">{emplacement}</div>
          {list.map((it) => {
            const key = itemKey(it);
            const status = statuses[key];
            return (
              <div className="inv-row" key={key}>
                <div>
                  <div className={`inv-name ${status === "nonok" ? "nonok" : ""}`}>
                    {it.article}
                  </div>
                  {it.quantite && (
                    <div className="inv-qty">Qté : {it.quantite}</div>
                  )}
                </div>
                <button
                  type="button"
                  className={`pill-btn ok ${status === "ok" ? "active" : ""}`}
                  onClick={() => setStatus(key, "ok")}
                  aria-label={`${it.article} OK`}
                >
                  ✓
                </button>
                <button
                  type="button"
                  className={`pill-btn nonok ${status === "nonok" ? "active" : ""}`}
                  onClick={() => setStatus(key, "nonok")}
                  aria-label={`${it.article} Non OK`}
                >
                  ✕
                </button>
              </div>
            );
          })}
        </div>
      ))}

      <div className="sticky-footer">
        <div className="card">
          <span className="field-label">
            {checkedCount} article{checkedCount > 1 ? "s" : ""} contrôlé
            {checkedCount > 1 ? "s" : ""}
          </span>

          <span className="field-label" style={{ marginTop: 10 }}>
            Observation générale (facultatif)
          </span>
          <textarea
            value={observation}
            onChange={(e) => setObservation(e.target.value)}
            placeholder="Remarques sur le contrôle…"
          />

          <div style={{ height: 12 }} />

          <span className="field-label">Matricule</span>
          <input
            type="tel"
            inputMode="numeric"
            placeholder="Ex : 21005"
            value={matricule}
            onChange={(e) => setMatricule(e.target.value)}
          />

          {error && (
            <div className="alert alert-error" style={{ marginTop: 12 }}>
              {error}
            </div>
          )}

          <button
            className="btn btn-primary"
            style={{ marginTop: 12 }}
            disabled={submitting}
            onClick={handleValidate}
          >
            {submitting ? "Enregistrement…" : "Valider le contrôle"}
          </button>
        </div>
      </div>
    </Shell>
  );
}
