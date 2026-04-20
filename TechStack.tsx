import { useRef, useState, useEffect } from "react";
import { useInView } from "../hooks/useScrollProgress";

const techItems = [
  { label: "Python", icon: "🐍" },
  { label: "FastAPI", icon: "⚡" },
  { label: "React", icon: "⚛️" },
  { label: "TypeScript", icon: "🔷" },
  { label: "OpenAI", icon: "🧠" },
  { label: "SQLAlchemy", icon: "🗄️" },
  { label: "PostgreSQL", icon: "🐘" },
  { label: "Azure AI", icon: "☁️" },
  { label: "Docker", icon: "🐳" },
  { label: "Vite", icon: "⚡" },
];

export default function TechStack() {
  const ref = useRef<HTMLDivElement>(null);
  const visible = useInView(ref, 0.1);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section ref={ref} className={`tech ${visible ? "tech--visible" : ""}`}>
      {/* Slow-moving background icons */}
      <div className="tech__bg-icons" style={{ transform: `translateY(${scrollY * -0.06}px)` }}>
        {techItems.map((t, i) => (
          <div
            key={i}
            className="tech-bg-icon"
            style={{
              left: `${(i * 10) % 95}%`,
              top: `${((i * 23) % 80) + 5}%`,
              animationDelay: `${i * 0.4}s`,
              fontSize: `${1.5 + (i % 3) * 0.5}rem`,
            }}
          >
            {t.icon}
          </div>
        ))}
      </div>

      <div className="tech__content">
        <span className="section-tag">Technology</span>
        <h2 className="section-heading">
          Powered by a <span className="text-teal">Modern Stack</span>
        </h2>
        <p className="section-sub">
          Enterprise-ready architecture built on battle-tested open-source technologies
          and cutting-edge AI infrastructure.
        </p>

        <div className="tech__chips">
          {techItems.map((t, i) => (
            <div
              key={i}
              className="tech-chip"
              style={{ transitionDelay: `${i * 0.06}s` }}
            >
              <span className="tech-chip__icon">{t.icon}</span>
              <span>{t.label}</span>
            </div>
          ))}
        </div>

        {/* Architecture diagram */}
        <div className="tech__arch">
          <div className="arch-layer">
            <div className="arch-label">Frontend</div>
            <div className="arch-items">
              <span>React 18</span><span>TypeScript</span><span>Vite</span>
            </div>
          </div>
          <div className="arch-arrow">↓</div>
          <div className="arch-layer">
            <div className="arch-label">API Layer</div>
            <div className="arch-items">
              <span>FastAPI</span><span>REST</span><span>WebSocket</span>
            </div>
          </div>
          <div className="arch-arrow">↓</div>
          <div className="arch-layer">
            <div className="arch-label">AI Agents</div>
            <div className="arch-items">
              <span>News Agent</span><span>Weather Agent</span><span>Geo Agent</span><span>Risk Scorer</span>
            </div>
          </div>
          <div className="arch-arrow">↓</div>
          <div className="arch-layer">
            <div className="arch-label">Data</div>
            <div className="arch-items">
              <span>SQLAlchemy</span><span>PostgreSQL</span><span>OpenAI API</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
