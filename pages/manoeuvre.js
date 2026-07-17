// pages/manoeuvre.js
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Shell from "../components/Shell";
import PickerSheet from "../components/PickerSheet";

const FIELD_LABELS = {
  manoeuvre: "Manœuvre",
  mat: "Mât",
  treuil: "Treuil",
  role: "Rôle",
};

export default function Manoeuvre() {
  const router = useRouter();
  const { type, lieu } = router.query;

  const [options, setOptions] = useState({
    manoeuvres: [],
    mats: [],
    treuils: [],
    roles: [],
  });
  const [selection, setSelection] = useState({
    manoeuvre: "",
    mat: "",
    treuil: "",
    role: "",
  });
  const [openPicker, setOpenPicker] = useState(null);
  const [matricule, setMatricule] = useState("");
  const [observation, setObservation] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    if (!router.isReady) return;
    fetch("/api/actions")
      .then((r) => r.json())
      .then(setOptions)
      .catch(() => {});
  }, [router.isReady]);

  const optionKeyMap = {
    manoeuvre: "manoeuvres",
    mat: "mats",
    treuil: "treuils",
    role: "roles",
  };

  function selectValue(field, value) {
    setSelection((s) => ({ ...s, [field]: value }));
    setOpenPicker(null);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (!matricule.trim()) {
      setError("Merci de saisir un matricule.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/save-manoeuvre", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          matricule: matricule.trim(),
          manoeuvre: selection.manoeuvre,
          mat: selection.mat,
          treuil: selection.treuil,
          role: selection.role,
          observation,
        }),
      });
      const data = await res.json();
      if (!data.ok) {
        setError(data.error || "Une erreur est survenue.");
      } else {
        setResult(data.agent);
      }
    } catch (err) {
      setError("Impossible d'enregistrer. Vérifie ta connexion et réessaie.");
    } finally {
      setSubmitting(false);
    }
  }

  function resetForAnotherAgent() {
    setMatricule("");
    setObservation("");
    setResult(null);
    setError("");
  }

  const heading =
    type === "intervention" ? "Intervention" : lieu || "Manœuvre";

  if (result) {
    return (
      <Shell title="SMPM" showBack onBack={() => router.push("/")}>
        <div className="alert alert-success">
          Enregistré pour {result.prenom} {result.nom}.
        </div>
        <div className="card">
          <div className="field-label">Contexte</div>
          <div style={{ fontWeight: 700, color: "var(--navy)" }}>{heading}</div>
        </div>
        <button
          className="btn btn-primary"
          style={{ marginBottom: 10 }}
          onClick={resetForAnotherAgent}
        >
          Ajouter un autre agent
        </button>
        <button className="btn btn-ghost" onClick={() => router.push("/")}>
          Retour à l'accueil
        </button>
      </Shell>
    );
  }

  return (
    <Shell title="SMPM" subtitle={heading} showBack>
      {error && <div className="alert alert-error">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="card">
          {["manoeuvre", "mat", "treuil", "role"].map((field) => (
            <div key={field} style={{ marginBottom: 12 }}>
              <span className="field-label">{FIELD_LABELS[field]}</span>
              <button
                type="button"
                className={`choice-btn ${selection[field] ? "filled" : ""}`}
                onClick={() => setOpenPicker(field)}
              >
                <span>{selection[field] || `Choisir ${FIELD_LABELS[field].toLowerCase()}`}</span>
                <span className="arrow">▾</span>
              </button>
            </div>
          ))}
        </div>

        <div className="card">
          <span className="field-label">Matricule</span>
          <input
            type="tel"
            inputMode="numeric"
            placeholder="Ex : 21005"
            value={matricule}
            onChange={(e) => setMatricule(e.target.value)}
          />

          <div style={{ height: 12 }} />

          <span className="field-label">Observation (facultatif)</span>
          <textarea
            value={observation}
            onChange={(e) => setObservation(e.target.value)}
            placeholder="Remarques sur la manœuvre…"
          />
        </div>

        <button className="btn btn-primary" disabled={submitting} type="submit">
          {submitting ? "Enregistrement…" : "Valider"}
        </button>
      </form>

      {openPicker && (
        <PickerSheet
          title={`Choisir : ${FIELD_LABELS[openPicker]}`}
          options={options[optionKeyMap[openPicker]] || []}
          onSelect={(v) => selectValue(openPicker, v)}
          onClose={() => setOpenPicker(null)}
        />
      )}
    </Shell>
  );
}
