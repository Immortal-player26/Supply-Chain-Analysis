import { AlertTriangle, CheckCircle, Clock, ExternalLink } from "lucide-react";
import type { RiskAlert } from "../lib/api";

const levelClass: Record<string, string> = {
  critical: "badge-critical",
  high: "badge-high",
  medium: "badge-medium",
  low: "badge-low",
};

const categoryIcon: Record<string, string> = {
  news: "📰",
  weather: "🌪️",
  geopolitics: "🌐",
  logistics: "🚢",
  economic: "📈",
};

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function AlertFeed({
  alerts,
  onResolve,
}: {
  alerts: RiskAlert[];
  onResolve: (id: number) => void;
}) {
  if (alerts.length === 0) {
    return (
      <div className="panel">
        <h3 className="panel-title">
          <AlertTriangle size={18} /> Risk Alerts
        </h3>
        <div className="empty-state">
          <CheckCircle size={40} />
          <p>No active alerts. All clear!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="panel">
      <h3 className="panel-title">
        <AlertTriangle size={18} /> Live Risk Alerts
        <span className="alert-count">{alerts.length}</span>
      </h3>
      <div className="alert-feed">
        {alerts.map((alert) => (
          <div key={alert.id} className={`alert-card alert-${alert.risk_level}`}>
            <div className="alert-header">
              <span className="alert-category-icon">
                {categoryIcon[alert.category] || "⚠️"}
              </span>
              <div className="alert-meta">
                <span className={`badge ${levelClass[alert.risk_level] || ""}`}>
                  {alert.risk_level.toUpperCase()}
                </span>
                <span className="alert-time">
                  <Clock size={12} /> {timeAgo(alert.detected_at)}
                </span>
              </div>
            </div>
            <h4 className="alert-title">{alert.title}</h4>
            <p className="alert-desc">{alert.description}</p>
            <div className="alert-footer">
              <span className="alert-region">{alert.affected_region}</span>
              <span className="alert-confidence">
                {(alert.confidence * 100).toFixed(0)}% confidence
              </span>
              <button className="btn-resolve" onClick={() => onResolve(alert.id)} title="Mark resolved">
                <CheckCircle size={14} /> Resolve
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
