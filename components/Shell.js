// components/Shell.js
import { useRouter } from "next/router";

export default function Shell({ title, subtitle, showBack, onBack, children }) {
  const router = useRouter();

  function handleBack() {
    if (onBack) return onBack();
    router.push("/");
  }

  return (
    <div className="shell">
      <div className="watermark" />
      <div className="topbar">
        {showBack ? (
          <button className="back-btn" onClick={handleBack}>
            ← Retour
          </button>
        ) : (
          <img src="/logo.png" alt="GRIMP 80" />
        )}
        <div className="titles">
          <div className="brand">{title || "SMPM"}</div>
          <div className="sub">{subtitle || "GRIMP 80 · SDIS 80"}</div>
        </div>
      </div>
      <div className="content">{children}</div>
    </div>
  );
}
