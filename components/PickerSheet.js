// components/PickerSheet.js
export default function PickerSheet({ title, options, onSelect, onClose }) {
  return (
    <div className="sheet-backdrop" onClick={onClose}>
      <div className="sheet" onClick={(e) => e.stopPropagation()}>
        <h3>{title}</h3>
        {options.length === 0 && (
          <div style={{ padding: "0 20px", color: "#565b63" }}>
            Aucune option disponible.
          </div>
        )}
        {options.map((opt) => (
          <button
            key={opt}
            className="sheet-option"
            onClick={() => onSelect(opt)}
          >
            {opt}
          </button>
        ))}
        <button className="sheet-cancel" onClick={onClose}>
          Annuler
        </button>
      </div>
    </div>
  );
}
