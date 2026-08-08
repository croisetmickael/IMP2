// pages/login.js
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function Login() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [locked, setLocked] = useState(false);
  const [unlockCode, setUnlockCode] = useState("");

  useEffect(() => {
    // Vérifie si déjà authentifié
    const token = localStorage.getItem("smpm_auth");
    if (token === "authenticated") {
      router.push("/");
    }
    
    // Charge le nombre de tentatives échouées
    const storedAttempts = localStorage.getItem("smpm_attempts");
    if (storedAttempts) {
      setAttempts(parseInt(storedAttempts));
    }
  }, [router]);

  function handleSubmitCode() {
    setError("");
    
    if (code.toUpperCase() === "SMPM1") {
      // Code correct
      localStorage.setItem("smpm_auth", "authenticated");
      localStorage.removeItem("smpm_attempts");
      router.push("/");
    } else {
      // Code incorrect
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      localStorage.setItem("smpm_attempts", newAttempts);
      
      if (newAttempts >= 3) {
        setLocked(true);
        setError("⛔ Trop de tentatives. Code de déverrouillage requis.");
      } else {
        setError(`❌ Code incorrect. Tentatives restantes : ${3 - newAttempts}`);
      }
      
      setCode("");
    }
  }

  function handleUnlock() {
    setError("");
    
    if (unlockCode === "1880") {
      // Code de déverrouillage correct
      setLocked(false);
      setAttempts(0);
      localStorage.removeItem("smpm_attempts");
      setCode("");
      setUnlockCode("");
    } else {
      setError("❌ Code de déverrouillage incorrect");
      setUnlockCode("");
    }
  }

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "linear-gradient(135deg, #12294A 0%, #1a3a5c 100%)",
      fontFamily: "'Inter', sans-serif",
      padding: 20
    }}>
      <div style={{
        width: "100%",
        maxWidth: 400,
        background: "#fff",
        borderRadius: 20,
        padding: 40,
        boxShadow: "0 10px 40px rgba(0,0,0,0.2)"
      }}>
        {/* Logo / Titre */}
        <div style={{
          textAlign: "center",
          marginBottom: 40
        }}>
          <div style={{
            fontSize: 48,
            fontWeight: 700,
            color: "#12294A",
            marginBottom: 8
          }}>
            SMPM
          </div>
          <div style={{
            fontSize: 14,
            color: "#666",
            fontWeight: 500
          }}>
            GRIMP 80 - Contrôle Inventaire
          </div>
        </div>

        {!locked ? (
          <>
            {/* Input Code */}
            <div style={{ marginBottom: 20 }}>
              <label style={{
                display: "block",
                fontSize: 13,
                fontWeight: 600,
                color: "#333",
                marginBottom: 8
              }}>
                Code d'accès
              </label>
              <input
                type="password"
                placeholder="Entrer le code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSubmitCode()}
                autoFocus
                style={{
                  width: "100%",
                  padding: 14,
                  fontSize: 16,
                  border: "2px solid #e0e0e0",
                  borderRadius: 10,
                  fontWeight: 600,
                  letterSpacing: 2,
                  boxSizing: "border-box",
                  transition: "border-color 0.2s"
                }}
              />
            </div>

            {/* Erreur */}
            {error && (
              <div style={{
                background: "#fee",
                color: "#c33",
                padding: 12,
                borderRadius: 10,
                fontSize: 13,
                marginBottom: 20,
                fontWeight: 500,
                textAlign: "center"
              }}>
                {error}
              </div>
            )}

            {/* Bouton */}
            <button
              onClick={handleSubmitCode}
              style={{
                width: "100%",
                padding: 14,
                background: "#12294A",
                color: "#fff",
                border: "none",
                borderRadius: 10,
                fontSize: 16,
                fontWeight: 700,
                cursor: "pointer",
                transition: "background 0.2s"
              }}
              onMouseOver={(e) => e.target.style.background = "#1a3a5c"}
              onMouseOut={(e) => e.target.style.background = "#12294A"}
            >
              Accéder
            </button>
          </>
        ) : (
          <>
            {/* Code de Déverrouillage */}
            <div style={{
              background: "#fff3cd",
              border: "2px solid #ffc107",
              padding: 16,
              borderRadius: 10,
              marginBottom: 20,
              textAlign: "center"
            }}>
              <div style={{
                fontSize: 14,
                fontWeight: 600,
                color: "#856404",
                marginBottom: 8
              }}>
                ⛔ Compte verrouillé
              </div>
              <div style={{
                fontSize: 12,
                color: "#856404",
                marginBottom: 16
              }}>
                Trop de tentatives. Entrez le code de déverrouillage.
              </div>

              <input
                type="password"
                placeholder="Code de déverrouillage"
                value={unlockCode}
                onChange={(e) => setUnlockCode(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleUnlock()}
                autoFocus
                style={{
                  width: "100%",
                  padding: 12,
                  fontSize: 16,
                  border: "2px solid #ffc107",
                  borderRadius: 8,
                  fontWeight: 600,
                  letterSpacing: 2,
                  boxSizing: "border-box",
                  marginBottom: 12
                }}
              />
            </div>

            {error && (
              <div style={{
                background: "#fee",
                color: "#c33",
                padding: 12,
                borderRadius: 10,
                fontSize: 13,
                marginBottom: 20,
                fontWeight: 500,
                textAlign: "center"
              }}>
                {error}
              </div>
            )}

            <button
              onClick={handleUnlock}
              style={{
                width: "100%",
                padding: 14,
                background: "#ffc107",
                color: "#333",
                border: "none",
                borderRadius: 10,
                fontSize: 16,
                fontWeight: 700,
                cursor: "pointer",
                transition: "background 0.2s"
              }}
              onMouseOver={(e) => e.target.style.background = "#ffb300"}
              onMouseOut={(e) => e.target.style.background = "#ffc107"}
            >
              Déverrouiller
            </button>
          </>
        )}

        {/* Footer */}
        <div style={{
          textAlign: "center",
          fontSize: 11,
          color: "#999",
          marginTop: 24
        }}>
          SDIS 80 - Sécurité Incendie
        </div>
      </div>
    </div>
  );
}
