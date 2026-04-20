import { useRef } from "react";
import Navbar from "./components/Navbar";
import ParallaxHero from "./components/ParallaxHero2";
import ProblemSolution from "./components/ProblemSolution";
import DashboardReveal from "./components/DashboardReveal";
import FeaturesGrid from "./components/FeaturesGrid";
import TechStack from "./components/TechStack";
import StatsBar from "./components/StatsBar";
import AlertFeed from "./components/AlertFeed";
import AgentPanel from "./components/AgentPanel";
import SupplierTable from "./components/SupplierTable";
import WorldMap from "./components/WorldMap";
import DisruptionChart from "./components/DisruptionChart";
import { useRiskData } from "./hooks/useRiskData";
import { Shield, RefreshCw } from "lucide-react";

export default function App() {
  const dashRef = useRef<HTMLDivElement>(null);
  const {
    dashboard,
    suppliers,
    alerts,
    agentLogs,
    agentStatus,
    loading,
    error,
    refresh,
    resolveAlert,
  } = useRiskData();

  const scrollToDashboard = () => {
    dashRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="app">
      <Navbar />

      {/* ── Parallax Hero ── */}
      <ParallaxHero onEnter={scrollToDashboard} />

      {/* ── Problem vs Solution ── */}
      <ProblemSolution />

      {/* ── Dashboard Reveal ── */}
      <DashboardReveal />

      {/* ── Features Grid ── */}
      <div id="features">
        <FeaturesGrid />
      </div>

      {/* ── Tech Stack ── */}
      <div id="tech">
        <TechStack />
      </div>

      {/* ── CTA Section ── */}
      <section className="cta-section">
        <div className="cta-glow" />
        <h2 className="section-heading">
          Ready to <span className="text-teal">Secure</span> Your Supply Chain?
        </h2>
        <p className="section-sub">
          Explore the live dashboard below — powered by real AI agents running right now.
        </p>
        <button className="btn-primary btn-primary--lg" onClick={scrollToDashboard}>
          Open Live Dashboard ↓
        </button>
      </section>

      {/* ── Live Dashboard ── */}
      <div ref={dashRef} id="dashboard" className="dashboard-section">
        <header className="dash-header">
          <div className="dash-brand">
            <Shield size={24} />
            <span>SupplyShield AI</span>
          </div>
          <div className="dash-actions">
            {error && <span className="error-msg">⚠ API unavailable — showing cached data</span>}
            <button className="btn-refresh" onClick={refresh} disabled={loading}>
              <RefreshCw size={16} className={loading ? "spin" : ""} />
              {loading ? "Refreshing…" : "Refresh"}
            </button>
          </div>
        </header>

        <StatsBar stats={dashboard} />

        <div className="dash-grid">
          <div className="dash-col-main">
            <WorldMap suppliers={suppliers} />
            <SupplierTable suppliers={suppliers} />
          </div>
          <div className="dash-col-side">
            <AlertFeed alerts={alerts} onResolve={resolveAlert} />
            <DisruptionChart stats={dashboard} />
            <AgentPanel status={agentStatus} logs={agentLogs} />
          </div>
        </div>

        <footer className="dash-footer">
          <p>SupplyShield AI — Multi-Agent Supply Chain Risk Analyzer</p>
          <p>Built with Python + FastAPI + React + OpenAI</p>
        </footer>
      </div>
    </div>
  );
}
