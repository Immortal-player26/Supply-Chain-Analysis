import { useRef, useState, useEffect } from "react";
import { useInView } from "../hooks/useScrollProgress";

/**
 * As the user scrolls, a high-fidelity dashboard mockup scales up into view.
 * Uses scroll-driven transform for the "zoom reveal" effect.
 */
export default function DashboardReveal() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const visible = useInView(sectionRef, 0.08);
  const [scrollProg, setScrollProg] = useState(0);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(() => {
          const rect = el.getBoundingClientRect();
          const vh = window.innerHeight;
          const raw = (vh - rect.top) / (vh + rect.height);
          setScrollProg(Math.max(0, Math.min(1, raw)));
          ticking = false;
        });
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Scale from 0.7 → 1 as section scrolls into view
  const scale = 0.7 + scrollProg * 0.3;
  const opacity = Math.min(1, scrollProg * 2.5);

  return (
    <section ref={sectionRef} className={`dash-reveal ${visible ? "dash-reveal--visible" : ""}`}>
      <div className="dash-reveal__header">
        <span className="section-tag">Live Dashboard</span>
        <h2 className="section-heading">
          See Risk <span className="text-teal">Before</span> It Hits.
        </h2>
        <p className="section-sub">
          A command center built for supply chain intelligence — real-time risk scoring,
          global heat maps, and AI agent activity at your fingertips.
        </p>
      </div>

      <div
        className="dash-reveal__frame"
        style={{ transform: `scale(${scale})`, opacity }}
      >
        {/* Mockup chrome */}
        <div className="mockup-chrome">
          <div className="chrome-dots">
            <span /><span /><span />
          </div>
          <div className="chrome-url">
            <span>🔒</span> app.supplyshield.ai/dashboard
          </div>
        </div>

        {/* Dashboard mockup content */}
        <div className="mockup-body">
          {/* Top stats row */}
          <div className="mock-stats">
            {[
              { label: "Suppliers", value: "15", color: "var(--accent)" },
              { label: "Active Alerts", value: "8", color: "var(--risk-high)" },
              { label: "Critical", value: "1", color: "var(--risk-critical)" },
              { label: "Avg Risk", value: "39.9", color: "var(--risk-medium)" },
              { label: "AI Agents", value: "4", color: "var(--success)" },
            ].map((s, i) => (
              <div key={i} className="mock-stat-card">
                <span className="mock-stat-value" style={{ color: s.color }}>{s.value}</span>
                <span className="mock-stat-label">{s.label}</span>
              </div>
            ))}
          </div>

          {/* Map + alerts row */}
          <div className="mock-main-row">
            {/* Map area */}
            <div className="mock-map-area">
              <div className="mock-map-label">Global Risk Map</div>
              <svg viewBox="0 0 500 250" className="mock-map-svg">
                {/* Grid */}
                {Array.from({ length: 10 }).map((_, i) => (
                  <line key={`h${i}`} x1="0" y1={i * 28} x2="500" y2={i * 28} stroke="rgba(56,189,248,0.06)" strokeWidth="0.5" />
                ))}
                {Array.from({ length: 18 }).map((_, i) => (
                  <line key={`v${i}`} x1={i * 28} y1="0" x2={i * 28} y2="250" stroke="rgba(56,189,248,0.06)" strokeWidth="0.5" />
                ))}
                {/* Continents (simplified) */}
                <path d="M60,40 L100,30 L130,45 L140,70 L130,100 L115,110 L100,120 L85,100 L70,90 L55,70Z" fill="rgba(56,189,248,0.07)" stroke="rgba(56,189,248,0.15)" />
                <path d="M110,130 L130,125 L140,140 L145,170 L135,200 L120,210 L110,190 L105,160Z" fill="rgba(56,189,248,0.07)" stroke="rgba(56,189,248,0.15)" />
                <path d="M220,35 L250,30 L265,40 L260,60 L245,70 L230,65 L220,55Z" fill="rgba(56,189,248,0.07)" stroke="rgba(56,189,248,0.15)" />
                <path d="M230,80 L260,75 L270,100 L265,140 L250,170 L235,165 L225,135 L220,100Z" fill="rgba(56,189,248,0.07)" stroke="rgba(56,189,248,0.15)" />
                <path d="M275,30 L350,25 L390,40 L400,70 L385,90 L360,100 L325,95 L300,80 L280,65 L270,50Z" fill="rgba(56,189,248,0.07)" stroke="rgba(56,189,248,0.15)" />
                <path d="M360,105 L390,100 L400,115 L395,135 L375,140 L360,130Z" fill="rgba(56,189,248,0.07)" stroke="rgba(56,189,248,0.15)" />
                <path d="M390,165 L425,160 L440,175 L435,195 L415,200 L395,190Z" fill="rgba(56,189,248,0.07)" stroke="rgba(56,189,248,0.15)" />
                {/* Risk dots */}
                {[
                  { cx: 337, cy: 48, r: "#ef4444" },
                  { cx: 310, cy: 60, r: "#f59e0b" },
                  { cx: 240, cy: 50, r: "#22c55e" },
                  { cx: 248, cy: 56, r: "#22c55e" },
                  { cx: 290, cy: 68, r: "#f59e0b" },
                  { cx: 100, cy: 60, r: "#22c55e" },
                  { cx: 232, cy: 120, r: "#f59e0b" },
                  { cx: 355, cy: 52, r: "#3b82f6" },
                  { cx: 128, cy: 150, r: "#f59e0b" },
                  { cx: 243, cy: 45, r: "#22c55e" },
                  { cx: 375, cy: 112, r: "#f59e0b" },
                  { cx: 275, cy: 85, r: "#3b82f6" },
                ].map((d, i) => (
                  <g key={i}>
                    <circle cx={d.cx} cy={d.cy} r="6" fill={d.r} opacity="0.2" className="mock-pulse" />
                    <circle cx={d.cx} cy={d.cy} r="2.5" fill={d.r} />
                  </g>
                ))}
                {/* Connections */}
                <line x1="337" y1="48" x2="310" y2="60" stroke="rgba(99,102,241,0.2)" strokeWidth="0.5" strokeDasharray="3 3" />
                <line x1="337" y1="48" x2="355" y2="52" stroke="rgba(99,102,241,0.2)" strokeWidth="0.5" strokeDasharray="3 3" />
                <line x1="310" y1="60" x2="290" y2="68" stroke="rgba(99,102,241,0.2)" strokeWidth="0.5" strokeDasharray="3 3" />
              </svg>
            </div>

            {/* Alert sidebar */}
            <div className="mock-alerts">
              <div className="mock-alerts-label">Live Alerts</div>
              {[
                { level: "CRITICAL", title: "Semiconductor Export Controls", color: "var(--risk-critical)" },
                { level: "HIGH", title: "Typhoon — East China Sea", color: "var(--risk-high)" },
                { level: "HIGH", title: "Red Sea Shipping Disruption", color: "var(--risk-high)" },
                { level: "MEDIUM", title: "Rhine River Low Levels", color: "var(--risk-medium)" },
              ].map((a, i) => (
                <div key={i} className="mock-alert-row">
                  <span className="mock-alert-badge" style={{ background: a.color }}>{a.level}</span>
                  <span className="mock-alert-title">{a.title}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Agent status bar */}
          <div className="mock-agent-bar">
            {["NewsMonitor", "WeatherMonitor", "GeopoliticsMonitor", "RiskScorer"].map((name) => (
              <div key={name} className="mock-agent-chip">
                <span className="mock-agent-dot" />
                {name}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Glow effect behind dashboard */}
      <div className="dash-reveal__glow" style={{ opacity: scrollProg * 0.6 }} />
    </section>
  );
}
