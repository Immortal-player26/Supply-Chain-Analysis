import { useRef } from "react";
import { useInView } from "../hooks/useScrollProgress";
import {
  Brain,
  Database,
  BarChart3,
  Radar,
  Workflow,
  ShieldAlert,
} from "lucide-react";

const features = [
  {
    icon: <Brain size={28} />,
    title: "Predictive AI Modeling",
    desc: "Four specialized AI agents analyze patterns across news, weather, and geopolitics to forecast disruptions before they materialize.",
    accent: "#6366f1",
  },
  {
    icon: <Database size={28} />,
    title: "Real-Time Database Integration",
    desc: "Live connections to supplier databases, port authorities, and logistics networks ensure your risk picture is always current.",
    accent: "#06b6d4",
  },
  {
    icon: <BarChart3 size={28} />,
    title: "Automated Risk Scoring",
    desc: "Composite scoring engine deduplicates and weights signals from all agents into a single actionable risk metric per supplier.",
    accent: "#8b5cf6",
  },
  {
    icon: <Radar size={28} />,
    title: "Global Threat Radar",
    desc: "Visual heat maps and interactive globe show risk hotspots across every region in your supply chain network.",
    accent: "#f59e0b",
  },
  {
    icon: <Workflow size={28} />,
    title: "Multi-Agent Orchestration",
    desc: "Agents run in parallel with automatic coordination — no single point of failure, maximum coverage, minimal latency.",
    accent: "#10b981",
  },
  {
    icon: <ShieldAlert size={28} />,
    title: "Instant Alert Pipeline",
    desc: "Critical disruptions trigger immediate notifications with affected suppliers, confidence scores, and recommended actions.",
    accent: "#ef4444",
  },
];

export default function FeaturesGrid() {
  const ref = useRef<HTMLDivElement>(null);
  const visible = useInView(ref, 0.05);

  return (
    <section ref={ref} className={`features ${visible ? "features--visible" : ""}`}>
      <div className="features__header">
        <span className="section-tag">Capabilities</span>
        <h2 className="section-heading">
          Built for <span className="text-teal">Enterprise-Grade</span> Intelligence
        </h2>
        <p className="section-sub">
          Every capability is designed to reduce your Mean Time to Awareness from days to minutes.
        </p>
      </div>

      <div className="features__grid">
        {features.map((f, i) => (
          <div
            key={i}
            className="feature-card"
            style={{ transitionDelay: `${i * 0.08}s` }}
          >
            <div className="feature-card__glow" style={{ background: f.accent }} />
            <div className="feature-card__icon" style={{ color: f.accent }}>
              {f.icon}
            </div>
            <h3 className="feature-card__title">{f.title}</h3>
            <p className="feature-card__desc">{f.desc}</p>
            <div className="feature-card__line" style={{ background: f.accent }} />
          </div>
        ))}
      </div>
    </section>
  );
}
