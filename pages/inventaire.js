// pages/inventaire.js
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import Shell from "../components/Shell";
import { INVENTORY_GROUPS } from "../lib/constants";
import { getRandomMatricule } from "../lib/helpers";

export default function Inventaire() {
  const router = useRouter();
  const [activeGroup, setActiveGroup] = useState("baroud");
  const [items, setItems] = useState([]);
  const [statuses, setStatuses] = useState({});
  const [quantities, setQuantities] = useState({});
  const [descriptions, setDescriptions] = useState({});
  const [matricule, setMatricule] = useState("");
  const [randomMatricule, setRandomMatricule] = useState("");
  const [observation, setObservation] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  // Modal pour saisir quantité manquante + description
  const [modalItem, setModalItem] = useState(null);
  const [modalQuantity, setModalQuantity] = useState("");
  const [modalDescription, setModalDescription] = useState("");
  const [modalError, setModalError] = useState("");

  useEffect(() => {
    setRandomMatricule(getRandomMatricule());
  }, []);

  // Fonction pour charger l'inventaire
  async function loadInventory(group) {
    try {
      setLoading(true);
      const res = await fetch(`/api/inventaire?group=${group}`);
      const data = await res.json();
      setItems(data.items || []);
      setStatuses({});
      setQuantities({});
      setDescriptions({});
    } catch (err) {
      console.error("Erreur chargement inventaire:", err);
    } finally {
      setLoading(false);
    }
  }

  // Charger les articles du groupe actif
  useEffect(() => {
    loadInventory(activeGroup);
  }, [activeGroup]);

  // Actualisation manuelle
  async function handleRefresh() {
    setRefreshing(true);
    await loadInventory(activeGroup);
    setRefreshing(false);
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

  function itemKey(it) {
    return `${it.emplacement || "Autre"}::${it.article}`;
  }

  function setStatus(key, status) {
    if (status === "nonok") {
      // Ouvrir le modal pour demander quantité ET/OU description
      setModalItem(key);
      setModalQuantity(quantities[key] || "");
      setModalDescription(descriptions[key] || "");
      setModalError("");
    } else {
      setStatuses((s) => {
        const next = { ...s };
        if (next[key] === status) {
          delete next[key];
        } else {
          next[key] = status;
        }
        return next;
      });
      // Effacer quantité et description si passé à OK
      setQuantities((q) => {
        const next = { ...q };
        delete next[key];
        return next;
      });
      setDescriptions((d) => {
        const next = { ...d };
        delete next[key];
        return next;
      });
    }
  }

  function handleConfirmQuantity() {
    const qty = modalQuantity.trim();
    const desc = modalDescription.trim();

    // Au moins l'un des deux doit être rempli
    if (!qty && !desc) {
      setModalError("Remplis au moins le nombre manquant ou la description.");
      return;
    }

    setStatuses((s) => ({ ...s, [modalItem]: "nonok" }));
    setQuantities((q) => ({ ...q, [modalItem]: qty }));
    setDescriptions((d) => ({ ...d, [modalItem]: desc }));
    
    setModalItem(null);
    setModalQuantity("");
    setModalDescription("");
    setModalError("");
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

    // Grouper par emplacement
    const itemsByEmplacement = {};
    Object.entries(statuses).forEach(([key, status]) => {
      if (status === "nonok") {
        const parts = key.split("::");
        const emplacement = parts[0];
        const article = parts[1];
        
        if (!itemsByEmplacement[emplacement]) {
          itemsByEmplacement[emplacement] = [];
        }

        let detail = article;
        const qty = quantities[key];
        const desc = descriptions[key];
        if (qty) {
          detail += ` (${qty} manquantes)`;
        }
        if (desc) {
          detail += ` - ${desc}`;
        }
        itemsByEmplacement[emplacement].push(detail);
      }
    });

    // Formater : "Groupe / article1, article2, article3"
    const itemsNonOk = Object.entries(itemsByEmplacement).map(
      ([emplacement, articles]) => `${emplacement} / ${articles.join(", ")}`
    );

    try {
      const res = await fetch("/api/save-inventaire", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          matricule: matricule.trim(),
          itemsNonOk,
          observation,
        }),
      });
      const data = await res.json();
      if (!data.ok) {
        setError(data.error || "Une erreur est survenue.");
      } else {
        setResult({ agent: data.agent, itemsNonOk });
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
          <div className="field-label">Problèmes détectés (Non OK)</div>
          <div style={{ fontSize: 14, fontWeight: 600, color: "var(--red)" }}>
            {result.itemsNonOk.length > 0
              ? result.itemsNonOk.map((item, i) => <div key={i}>{item}</div>)
              : "Aucun problème — tous les articles contrôlés sont OK ✓"}
          </div>
        </div>
        <button className="btn btn-primary" onClick={() => router.push("/")}>
          Retour à l'accueil
        </button>
      </Shell>
    );
  }

  return (
    <Shell 
      title="SMPM" 
      subtitle="Inventaire" 
      showBack
      rightAction={
        <button
          style={{
            background: "rgba(255, 255, 255, 0.12)",
            border: "1px solid rgba(255, 255, 255, 0.25)",
            color: "#fff",
            borderRadius: "999px",
            padding: "8px 14px",
            fontSize: "12px",
            fontWeight: 600,
            cursor: "pointer",
            opacity: refreshing ? 0.6 : 1,
          }}
          onClick={handleRefresh}
          disabled={refreshing}
          title="Actualiser l'inventaire"
        >
          {refreshing ? "🔄" : "🔄"}
        </button>
      }
    >
      {/* Boutons de groupe */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
        {INVENTORY_GROUPS.map((group) => (
          <button
            key={group.id}
            style={{
              padding: 12,
              borderRadius: 10,
              border: "1.5px solid",
              borderColor: activeGroup === group.id ? "var(--gold-dark)" : "var(--line)",
              background: activeGroup === group.id ? "#fff8e8" : "#fff",
              color: activeGroup === group.id ? "var(--navy)" : "var(--ink)",
              fontWeight: activeGroup === group.id ? 700 : 600,
              fontSize: 14,
              cursor: "pointer",
              textTransform: "uppercase",
              letterSpacing: "0.03em",
            }}
            onClick={() => setActiveGroup(group.id)}
          >
            {group.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ textAlign: "center", color: "var(--ink-soft)", padding: 20 }}>
          Chargement…
        </div>
      ) : items.length === 0 ? (
        <div className="empty-state">Aucun article dans ce groupe.</div>
      ) : (
        <>
          {Object.entries(grouped).map(([emplacement, list]) => (
            <div key={emplacement}>
              <div className="inv-group-title">{emplacement}</div>
              {list.map((it) => {
                const key = itemKey(it);
                const status = statuses[key];
                return (
                  <div className="inv-row" key={key}>
                    <div className="inv-article-info">
                      <div className={`inv-name ${status === "nonok" ? "nonok" : ""}`}>
                        {it.article}
                      </div>
                      {it.quantite && (
                        <div className="inv-qty">Qté : {it.quantite}</div>
                      )}
                    </div>
                    <div className="inv-buttons">
                      <button
                        type="button"
                        className={`pill-btn ok ${status === "ok" ? "active" : ""}`}
                        onClick={() => setStatus(key, "ok")}
                        aria-label={`${it.article} OK`}
                        title="OK"
                      >
                        ✓
                      </button>
                      <button
                        type="button"
                        className={`pill-btn nonok ${status === "nonok" ? "active" : ""}`}
                        onClick={() => setStatus(key, "nonok")}
                        aria-label={`${it.article} Non OK`}
                        title="Non OK"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </>
      )}

      {/* Modal pour saisir quantité manquante + description */}
      {modalItem && (
        <div className="modal-backdrop" onClick={() => setModalItem(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>Détail du problème</h3>
            <p style={{ fontSize: 12, color: "var(--ink-soft)", marginBottom: 12 }}>
              Remplis au moins un champ
            </p>
            
            <div style={{ marginBottom: 14 }}>
              <span className="field-label">Nombre manquant (optionnel)</span>
              <input
                type="tel"
                inputMode="numeric"
                placeholder="Ex : 2"
                value={modalQuantity}
                onChange={(e) => setModalQuantity(e.target.value)}
                autoFocus
                style={{
                  width: "100%",
                  padding: "12px 14px",
                  fontSize: 16,
                  border: "1.5px solid var(--line)",
                  borderRadius: 10,
                }}
              />
            </div>

            <div style={{ marginBottom: 14 }}>
              <span className="field-label">Description (optionnel)</span>
              <textarea
                placeholder="Ex: Cassé, dégradé, à remplacer…"
                value={modalDescription}
                onChange={(e) => setModalDescription(e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px 14px",
                  fontSize: 14,
                  border: "1.5px solid var(--line)",
                  borderRadius: 10,
                  minHeight: 60,
                  fontFamily: "inherit",
                }}
              />
            </div>

            {modalError && (
              <div className="alert alert-error" style={{ marginBottom: 12 }}>
                {modalError}
              </div>
            )}

            <div style={{ display: "flex", gap: 10 }}>
              <button
                className="btn btn-primary"
                style={{ flex: 1 }}
                onClick={handleConfirmQuantity}
              >
                OK
              </button>
              <button
                className="btn btn-ghost"
                style={{ flex: 1 }}
                onClick={() => setModalItem(null)}
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}

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
            placeholder={`Ex : ${randomMatricule}`}
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
