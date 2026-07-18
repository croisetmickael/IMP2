// pages/index.js
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Shell from "../components/Shell";
import PickerSheet from "../components/PickerSheet";

export default function Home() {
  const router = useRouter();
  const [today, setToday] = useState(null);
  const [pastManoeuvres, setPastManoeuvres] = useState([]);
  const [openPicker, setOpenPicker] = useState(false);

  useEffect(() => {
    fetch("/api/today")
      .then((r) => r.json())
      .then((data) => {
        setToday(data);
        if (!data.hasTodayManoeuvre && data.pastManoeuvres) {
          setPastManoeuvres(data.pastManoeuvres);
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

        {/* Manœuvre du jour */}
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
            <div className="eyebrow">Pas d'horaire</div>
            <div className="label" style={{ fontSize: 16 }}>
              Manœuvre
            </div>
            <div className="meta">Choisir une manœuvre</div>
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

      {/* Picker pour choisir une manœuvre passée */}
      {openPicker && pastManoeuvres.length > 0 && (
        <PickerSheet
          title="Choisir une manœuvre"
          options={pastManoeuvres}
          onSelect={handleManoeuvreSelection}
          onClose={() => setOpenPicker(false)}
        />
      )}
    </Shell>
  );
}
