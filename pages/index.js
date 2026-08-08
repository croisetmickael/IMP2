// pages/index.js
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Shell from "../components/Shell";

export default function Home() {
  const router = useRouter();
  const [today, setToday] = useState(null);
  const [allManoeuvres, setAllManoeuvres] = useState([]);
  const [openPicker, setOpenPicker] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [messageText, setMessageText] = useState("");
  const [senderName, setSenderName] = useState("");
  const [sendingMessage, setSendingMessage] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchToday();
  }, []);

  async function fetchToday() {
    try {
      const res = await fetch("/api/today");
      const data = await res.json();
      setToday(data);
      if (!data.hasTodayManoeuvre && data.allManoeuvres) {
        setAllManoeuvres(data.allManoeuvres);
      }
      setOpenPicker(!data.hasTodayManoeuvre);
    } catch (err) {
      console.error("Erreur:", err);
    } finally {
      setLoading(false);
    }
  }

  function handleManoeuvreSelection(manoeuvre) {
    router.push(`/manoeuvre?type=manoeuvre&lieu=${encodeURIComponent(manoeuvre)}`);
    setOpenPicker(false);
  }

  async function sendMessageToTelegram() {
    if (!messageText.trim()) {
      alert("Message vide");
      return;
    }

    setSendingMessage(true);
    try {
      const res = await fetch("/api/send-message-telegram", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: messageText,
          sender: senderName || "Anonyme",
        }),
      });

      const data = await res.json();
      if (data.ok) {
        alert("✅ Message envoyé !");
        setMessageText("");
        setSenderName("");
        setShowMessageModal(false);
      } else {
        alert("❌ Erreur lors de l'envoi");
      }
    } catch (err) {
      alert("❌ Erreur");
    } finally {
      setSendingMessage(false);
    }
  }

  if (loading) {
    return (
      <Shell title="SMPM">
        <div style={{ textAlign: "center", padding: 20 }}>Chargement...</div>
      </Shell>
    );
  }

  const todayDate = new Date().toLocaleDateString("fr-FR");

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
          onClick={() => setOpenPicker(!openPicker)}
          style={{
            gridColumn: "1 / -1",
            padding: 16,
            background: "var(--gold)",
            color: "var(--navy)",
            border: "none",
            borderRadius: 10,
            fontWeight: 700,
            fontSize: 16,
            cursor: "pointer",
          }}
        >
          📋 Manoeuvre
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

        {/* Message */}
        <button
          onClick={() => setShowMessageModal(true)}
          style={{
            gridColumn: "1 / -1",
            padding: 16,
            background: "#9B59B6",
            color: "#fff",
            border: "none",
            borderRadius: 10,
            fontWeight: 700,
            fontSize: 16,
            cursor: "pointer",
          }}
        >
          💬 Message
        </button>
      </div>

      {/* Picker Calendrier */}
      {openPicker && allManoeuvres.length > 0 && (
        <div className="card">
          <span className="field-label">Choisir une manœuvre :</span>
          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 8 }}>
            {allManoeuvres.map((m, i) => (
              <button
                key={i}
                onClick={() => handleManoeuvreSelection(m)}
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

      {/* Modale Message */}
      {showMessageModal && (
        <div
          className="modal-backdrop"
          onClick={() => setShowMessageModal(false)}
        >
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>📬 Envoyer un message</h3>

            <div style={{ marginBottom: 14 }}>
              <span className="field-label">Votre nom (optionnel)</span>
              <input
                type="text"
                placeholder="Ex : Chef d'équipe"
                value={senderName}
                onChange={(e) => setSenderName(e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px 14px",
                  fontSize: 16,
                  border: "1.5px solid var(--line)",
                  borderRadius: 10,
                  boxSizing: "border-box",
                  marginBottom: 12,
                }}
              />
            </div>

            <div style={{ marginBottom: 14 }}>
              <span className="field-label">Message</span>
              <textarea
                placeholder="Écris ton message ici..."
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                autoFocus
                style={{
                  width: "100%",
                  padding: "12px 14px",
                  fontSize: 14,
                  border: "1.5px solid var(--line)",
                  borderRadius: 10,
                  minHeight: 100,
                  fontFamily: "inherit",
                  boxSizing: "border-box",
                  marginBottom: 12,
                }}
              />
            </div>

            <div style={{ display: "flex", gap: 10 }}>
              <button
                className="btn btn-primary"
                style={{ flex: 1 }}
                onClick={sendMessageToTelegram}
                disabled={sendingMessage}
              >
                {sendingMessage ? "Envoi..." : "✅ Envoyer"}
              </button>
              <button
                className="btn btn-ghost"
                style={{ flex: 1 }}
                onClick={() => setShowMessageModal(false)}
              >
                ❌ Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </Shell>
  );
}
