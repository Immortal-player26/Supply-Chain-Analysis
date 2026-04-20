import { Bot, CheckCircle, Clock, Loader } from "lucide-react";
import type { AgentStatus, AgentLog } from "../lib/api";

const agentEmoji: Record<string, string> = {
  NewsMonitor: "📰",
  WeatherMonitor: "🌤️",
  GeopoliticsMonitor: "🌐",
  RiskScorer: "🧠",
};

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function AgentPanel({
  status,
  logs,
}: {
  status: AgentStatus | null;
  logs: AgentLog[];
}) {
  if (!status) return null;

  return (
    <div className="panel">
      <h3 className="panel-title">
        <Bot size={18} /> AI Agents
        <span className="agent-status-dot active" title="All agents active" />
      </h3>

      {/* Agent cards */}
      <div className="agent-grid">
        {status.agents.map((agent) => (
          <div key={agent.name} className="agent-card">
            <div className="agent-icon">{agentEmoji[agent.name] || "🤖"}</div>
            <div className="agent-info">
              <strong>{agent.name}</strong>
              <span className="agent-desc">{agent.description.slice(0, 80)}…</span>
            </div>
            <span className={`agent-badge ${agent.status}`}>
              {agent.status === "active" ? <CheckCircle size={12} /> : <Loader size={12} />}
              {agent.status}
            </span>
          </div>
        ))}
      </div>

      {/* Recent activity log */}
      <h4 className="sub-title">Recent Activity</h4>
      <div className="agent-log-list">
        {logs.slice(0, 8).map((log) => (
          <div key={log.id} className="agent-log-item">
            <span className="log-agent">{agentEmoji[log.agent_name] || "🤖"}</span>
            <div className="log-content">
              <span className="log-action">{log.action}</span>
              <span className="log-details">{log.details}</span>
            </div>
            <span className="log-time">
              <Clock size={11} /> {timeAgo(log.timestamp)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
