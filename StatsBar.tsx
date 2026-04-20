import { AlertTriangle, Shield, TrendingUp, Users, Activity, BarChart3 } from "lucide-react";
import type { DashboardStats } from "../lib/api";

const riskColor = (score: number) => {
  if (score >= 60) return "var(--critical)";
  if (score >= 40) return "var(--high)";
  if (score >= 20) return "var(--medium)";
  return "var(--low)";
};

export default function StatsBar({ stats }: { stats: DashboardStats | null }) {
  if (!stats) return null;

  const cards = [
    {
      label: "Total Suppliers",
      value: stats.total_suppliers,
      icon: <Users size={20} />,
      color: "var(--accent)",
    },
    {
      label: "Active Alerts",
      value: stats.active_alerts,
      icon: <AlertTriangle size={20} />,
      color: "var(--high)",
    },
    {
      label: "Critical Risks",
      value: stats.critical_risks,
      icon: <Shield size={20} />,
      color: "var(--critical)",
    },
    {
      label: "Avg Risk Score",
      value: stats.average_risk_score.toFixed(1),
      icon: <TrendingUp size={20} />,
      color: riskColor(stats.average_risk_score),
    },
    {
      label: "Agents Active",
      value: stats.agents_active,
      icon: <Activity size={20} />,
      color: "var(--success)",
    },
  ];

  return (
    <div className="stats-bar">
      {cards.map((c) => (
        <div key={c.label} className="stat-card">
          <div className="stat-icon" style={{ color: c.color }}>
            {c.icon}
          </div>
          <div className="stat-info">
            <span className="stat-value" style={{ color: c.color }}>
              {c.value}
            </span>
            <span className="stat-label">{c.label}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
