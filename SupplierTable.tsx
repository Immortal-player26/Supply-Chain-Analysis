import type { Supplier } from "../lib/api";

const riskLevel = (score: number) => {
  if (score >= 60) return { label: "Critical", cls: "risk-critical" };
  if (score >= 40) return { label: "High", cls: "risk-high" };
  if (score >= 20) return { label: "Medium", cls: "risk-medium" };
  return { label: "Low", cls: "risk-low" };
};

export default function SupplierTable({ suppliers }: { suppliers: Supplier[] }) {
  return (
    <div className="panel">
      <h3 className="panel-title">Supplier Risk Overview</h3>
      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>Supplier</th>
              <th>Country</th>
              <th>Region</th>
              <th>Category</th>
              <th>Tier</th>
              <th>Risk Score</th>
            </tr>
          </thead>
          <tbody>
            {suppliers.map((s) => {
              const r = riskLevel(s.risk_score);
              return (
                <tr key={s.id}>
                  <td className="cell-name">{s.name}</td>
                  <td>{s.country}</td>
                  <td>{s.region}</td>
                  <td>{s.category || "—"}</td>
                  <td>
                    <span className="tier-badge">T{s.tier}</span>
                  </td>
                  <td>
                    <div className="risk-bar-cell">
                      <div className="risk-bar-track">
                        <div
                          className={`risk-bar-fill ${r.cls}`}
                          style={{ width: `${s.risk_score}%` }}
                        />
                      </div>
                      <span className={`risk-score ${r.cls}`}>{s.risk_score}</span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
