{/* VALIDATION - Juste après les articles */}
      <div style={{ marginTop: 20 }}>
        <div className="card">
          {/* Nombre articles contrôlés */}
          <span className="field-label">
            {checkedCount} article{checkedCount > 1 ? "s" : ""} contrôlé
            {checkedCount > 1 ? "s" : ""}
          </span>

          <div style={{ height: 12 }} />

          {/* Choix Baroud 1 ou 2 */}
          {activeGroup === "baroud" && (
            <>
              <span className="field-label">Quel Baroud ?</span>
              <div style={{ display: "flex", gap: 10, marginBottom: 12 }}>
                <button
                  onClick={() => setBaroudChoice("1")}
                  style={{
                    flex: 1,
                    padding: 12,
                    borderRadius: 10,
                    border: "2px solid",
                    borderColor: baroudChoice === "1" ? "var(--gold)" : "var(--line)",
                    background: baroudChoice === "1" ? "var(--gold)" : "#fff",
                    color: baroudChoice === "1" ? "var(--navy)" : "var(--ink)",
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  Baroud 1
                </button>
                <button
                  onClick={() => setBaroudChoice("2")}
                  style={{
                    flex: 1,
                    padding: 12,
                    borderRadius: 10,
                    border: "2px solid",
                    borderColor: baroudChoice === "2" ? "var(--gold)" : "var(--line)",
                    background: baroudChoice === "2" ? "var(--gold)" : "#fff",
                    color: baroudChoice === "2" ? "var(--navy)" : "var(--ink)",
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  Baroud 2
                </button>
              </div>
            </>
          )}

          {/* Observation */}
          <span className="field-label">Observation</span>
          <textarea
            value={observation}
            onChange={(e) => setObservation(e.target.value)}
            placeholder="Remarques…"
            style={{ marginBottom: 12 }}
          />

          {/* Matricule */}
          <span className="field-label">Matricule</span>
          <input
            type="tel"
            inputMode="numeric"
            placeholder={`Ex : ${randomMatricule}`}
            value={matricule}
            onChange={(e) => setMatricule(e.target.value)}
            style={{ marginBottom: 12 }}
          />

          {/* Bouton Intervention */}
          <button
            type="button"
            onClick={() => setObservation(observation ? observation + ", intervention" : "intervention")}
            style={{
              width: "100%",
              padding: 12,
              background: "var(--gold)",
              color: "var(--navy)",
              border: "none",
              borderRadius: 10,
              fontWeight: 700,
              cursor: "pointer",
              marginBottom: 12,
            }}
          >
            + Intervention
          </button>

          {/* Erreur */}
          {error && <div className="alert alert-error">{error}</div>}

          {/* Bouton Valider */}
          <button
            className="btn btn-primary"
            disabled={submitting}
            onClick={submit}
          >
            {submitting ? "Enregistrement…" : "Valider"}
          </button>
        </div>
      </div>
    </Shell>
  );
}
