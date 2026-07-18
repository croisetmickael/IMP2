// pages/index.js
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Shell from "../components/Shell";

export default function Home() {
  const router = useRouter();
  const [today, setToday] = useState(null);
  const [allManoeuvres, setAllManoeuvres] = useState([]);
  const [openPicker, setOpenPicker] = useState(false);

  useEffect(() => {
    fetch("/api/today")
      .then((r) => r.json())
      .then((data) => {
        setToday(data);
        if (!data.hasTodayManoeuvre && data.allManoeuvres) {
          setAllManoeuvres(data.allManoeuvres);
        }
      })
      .catch(() => {});
  }, []);

  function handleManoeuvreSelection(manoeuvre) {
    router.push(`/manoeuvre?type=manoeuvre&lieu=${encodeURIComponent(manoeuvre)}`);
  }

  const todayDate = new Date().toLocaleDateString("fr-FR");

  return (
    <Shell title="SMPM">
      <div className="home-grid">
        {/* Intervention */}
        <button
          className="home-tile primary"
          onClick={() => router.push("/manoeuvre?type=intervention")}
        >
          <div className="eyebrow">Aujourd'hui</div>
          <div className="label">{todayDate}</div>
          <div className="meta">INTERVENTION</div>
        </button>

        {/* Manœuvre du jour ou sélection */}
        {today?.hasTodayManoeuvre ? (
          <button
            className="home-tile"
            onClick={() =>
              router.push(
                `/manoeuvre?type=manoeuvre&lieu=${encodeURIComponent(today.manoeuvre)}`
              )
            }
          >
            <div className="eyebrow">{todayDate}</div>
            <div className="label" style={{ fontSize: 16 }}>
              {today.manoeuvre}
            </div>
            <div className="meta">{today.lieu || "Manœuvre"}</div>
          </button>
        ) : (
          <button
            className="home-tile"
            onClick={() => setOpenPicker(true)}
          >
            <div className="eyebrow">Calendrier</div>
            <div className="label" style={{ fontSize: 16 }}>
              Manœuvre
            </div>
            <div className="meta">Choisir dans le calendrier</div>
          </button>
        )}

        {/* Suivi */}
        <button
          className="home-tile"
          onClick={() => router.push("/suivi")}
        >
          <div className="eyebrow">Historique</div>
          <div className="label">Suivi</div>
          <div className="meta">Mes manœuvres</div>
        </button>

        {/* Inventaire */}
        <button
          className="home-tile"
          onClick={() => router.push("/inventaire")}
        >
          <div className="eyebrow">Contrôle</div>
          <div className="label">Inventaire</div>
          <div className="meta">Matériel GRIMP</div>
        </button>
      </div>

      {/* Picker pour choisir une manœuvre du calendrier */}
      {openPicker && allManoeuvres.length > 0 && (
        <div className="sheet-backdrop" onClick={() => setOpenPicker(false)}>
          <div className="sheet" onClick={(e) => e.stopPropagation()}>
            <h3>Choisir une manœuvre</h3>
            {allManoeuvres.map((m, i) => (
              <button
                key={i}
                type="button"
                className="sheet-option"
                onClick={() => {
                  handleManoeuvreSelection(m.manoeuvre);
                  setOpenPicker(false);
                }}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  gap: 4,
                }}
              >
                <span style={{ fontWeight: 700, fontSize: 15 }}>
                  {m.manoeuvre}
                </span>
                <span style={{ fontSize: 12, color: "var(--ink-soft)" }}>
                  {m.date} — {m.lieu}
                </span>
              </button>
            ))}
            <button className="sheet-cancel" onClick={() => setOpenPicker(false)}>
              Fermer
            </button>
          </div>
        </div>
      )}
    </Shell>
  );
}
