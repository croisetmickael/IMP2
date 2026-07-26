// components/Shell.js
import { useRouter } from "next/router";

export default function Shell({ title, subtitle, showBack, onBack, children, rightAction }) {
  const router = useRouter();

  function handleBack() {
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  }

  function handleLogout() {
    localStorage.removeItem("smpm_auth");
    localStorage.removeItem("smpm_attempts");
    router.push("/login");
  }

  return (
    <div style={{ paddingBottom: 20 }}>
      {/* Topbar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "16px 20px",
          background: "var(--navy)",
          color: "#fff",
          position: "sticky",
          top: 0,
          zIndex: 100,
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12, flex: 1 }}>
          {showBack ? (
            <button
              onClick={handleBack}
              style={{
                background: "none",
                border: "none",
                color: "#fff",
                fontSize: 18,
                cursor: "pointer",
                padding: 0,
              }}
            >
              ← Retour
            </button>
          ) : (
            <div style={{ fontSize: 20, fontWeight: 700 }}>{title}</div>
          )}
        </div>

        <div style={{ textAlign: "center", flex: 2 }}>
          {subtitle && (
            <div style={{ fontSize: 14, fontWeight: 600, color: "rgba(255,255,255,0.9)" }}>
              {subtitle}
            </div>
          )}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 12, flex: 1, justifyContent: "flex-end" }}>
          {rightAction && (
            <button onClick={rightAction.onClick} style={{ ...rightAction.style }}>
              {rightAction.label}
            </button>
          )}
          
          {/* Bouton Déconnexion */}
          <button
            onClick={handleLogout}
            title="Déconnexion"
            style={{
              background: "rgba(255,255,255,0.2)",
              border: "none",
              color: "#fff",
              fontSize: 16,
              cursor: "pointer",
              padding: "6px 12px",
              borderRadius: 6,
              fontWeight: 600,
              transition: "background 0.2s"
            }}
            onMouseOver={(e) => e.target.style.background = "rgba(255,255,255,0.3)"}
            onMouseOut={(e) => e.target.style.background = "rgba(255,255,255,0.2)"}
          >
            🚪
          </button>
        </div>
      </div>

      {/* Contenu */}
      <div style={{ padding: "20px", maxWidth: 600, margin: "0 auto" }}>
        {children}
      </div>
    </div>
  );
}
