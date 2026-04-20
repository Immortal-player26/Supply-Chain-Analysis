import type { DashboardStats } from "../lib/api";

const catMeta: Record<string, { emoji: string; color: string }> = {
  news: { emoji: "📰", color: "#6366f1" },
  weather: { emoji: "🌪️", color: "#06b6d4" },
  geopolitics: { emoji: "🌐", color: "#f59e0b" },
  logistics: { emoji: "🚢", color: "#8b5cf6" },
  economic: { emoji: "📈", color: "#22c55e" },
};

export default function DisruptionChart({ stats }: { stats: DashboardStats | null }) {
  if (!stats) return null;

  const cats = Object.entries(stats.disruption_categories);
  const max = Math.max(...cats.map(([, v]) => v), 1);

  return (
    <div className="panel">
      <h3 className="panel-title">Disruption Categories</h3>
      <div className="disruption-chart">
        {cats.map(([cat, count]) => {
          const meta = catMeta[cat] || { emoji: "⚠️", color: "#94a3b8" };
          return (
            <div key={cat} className="disruption-row">
              <span className="disruption-label">
                {meta.emoji} {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </span>
              <div className="disruption-bar-track">
                <div
                  className="disruption-bar-fill"
                  style={{
                    width: `${(count / max) * 100}%`,
                    background: meta.color,
                  }}
                />
              </div>
              <span className="disruption-count">{count}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
