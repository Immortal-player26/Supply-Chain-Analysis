import { useRef } from "react";
import { useInView } from "../hooks/useScrollProgress";
import {
  AlertTriangle,
  CloudLightning,
  Globe2,
  TrendingDown,
  Brain,
  ShieldCheck,
  BarChart3,
  Zap,
} from "lucide-react";

const risks = [
  { icon: <Globe2 size={20} />, title: "Geopolitical Shifts", desc: "Trade wars, sanctions, and export bans can halt supply overnight." },
  { icon: <CloudLightning size={20} />, title: "Extreme Weather", desc: "Hurricanes, floods, and droughts cripple logistics and production." },
  { icon: <AlertTriangle size={20} />, title: "Port Disruptions", desc: "Strikes and congestion cascade across interconnected networks." },
  { icon: <TrendingDown size={20} />, title: "Demand Volatility", desc: "Sudden shifts leave manufacturers over- or under-stocked." },
];

const solutions = [
  { icon: <Brain size={20} />, title: "Predictive AI Modeling", desc: "Multi-agent AI anticipates disruptions before they happen." },
  { icon: <ShieldCheck size={20} />, title: "Automated Risk Scoring", desc: "Composite scores aggregate signals across all domains." },
  { icon: <BarChart3 size={20} />, title: "Real-Time Analytics", desc: "Live dashboards surface actionable intelligence instantly." },
  { icon: <Zap size={20} />, title: "Instant Alerts", desc: "Critical notifications push to your team in under 5 minutes." },
];

export default function ProblemSolution() {
  const ref = useRef<HTMLDivElement>(null);
  const visible = useInView(ref, 0.1);

  return (
    <section ref={ref} className={`ps-section ${visible ? "ps--visible" : ""}`}>
      {/* Section heading */}
      <div className="ps-header">
        <span className="section-tag">Why It Matters</span>
        <h2 className="section-heading">
          The Problem Is <span className="text-red">Growing.</span><br />
          Our Solution Is <span className="text-teal">Smarter.</span>
        </h2>
      </div>

      <div className="ps-grid">
        {/* Left — Problems */}
        <div className="ps-col ps-col--left">
          <h3 className="ps-col__label ps-col__label--risk">
            <AlertTriangle size={16} /> The Risks
          </h3>
          {risks.map((r, i) => (
            <div
              key={i}
              className="ps-card ps-card--risk"
              style={{ transitionDelay: `${i * 0.1}s` }}
            >
              <div className="ps-card__icon ps-card__icon--risk">{r.icon}</div>
              <div>
                <h4>{r.title}</h4>
                <p>{r.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Center divider */}
        <div className="ps-divider">
          <div className="ps-divider__line" />
          <div className="ps-divider__badge">VS</div>
          <div className="ps-divider__line" />
        </div>

        {/* Right — Solutions */}
        <div className="ps-col ps-col--right">
          <h3 className="ps-col__label ps-col__label--solution">
            <ShieldCheck size={16} /> Our Solution
          </h3>
          {solutions.map((s, i) => (
            <div
              key={i}
              className="ps-card ps-card--solution"
              style={{ transitionDelay: `${(i + 4) * 0.1}s` }}
            >
              <div className="ps-card__icon ps-card__icon--solution">{s.icon}</div>
              <div>
                <h4>{s.title}</h4>
                <p>{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
