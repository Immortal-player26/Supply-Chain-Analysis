import { useEffect, useRef, useState } from "react";
import { Shield, ArrowDown } from "lucide-react";
import NodeNetwork from "./NodeNetwork";

export default function ParallaxHero({ onEnter }: { onEnter: () => void }) {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const vh = typeof window !== "undefined" ? window.innerHeight : 900;
  const fadeOut = Math.max(0, 1 - scrollY / (vh * 0.6));
  const slideUp = scrollY * 0.35;
  const networkScale = 1 + scrollY * 0.0006;

  return (
    <section className="hero">
      {/* Layer 0 – deep gradient bg */}
      <div className="hero__bg" />

      {/* Layer 1 – node network (slowest) */}
      <div
        className="hero__network-wrap"
        style={{ transform: `scale(${networkScale}) translateY(${scrollY * 0.08}px)` }}
      >
        <NodeNetwork />
      </div>

      {/* Layer 2 – radial glow orbs (medium speed) */}
      <div className="hero__orbs" style={{ transform: `translateY(${scrollY * 0.2}px)` }}>
        <div className="orb orb--teal" />
        <div className="orb orb--indigo" />
        <div className="orb orb--purple" />
      </div>

      {/* Layer 3 – floating data fragments (medium–fast) */}
      <div className="hero__fragments" style={{ transform: `translateY(${scrollY * 0.3}px)`, opacity: fadeOut }}>
        {[
          { label: "CRITICAL", sub: "Suez Canal Blockage", cls: "frag--critical", x: "7%", y: "22%" },
          { label: "HIGH", sub: "Taiwan Chip Shortage", cls: "frag--high", x: "82%", y: "18%" },
          { label: "MEDIUM", sub: "Rhine Water Level", cls: "frag--medium", x: "12%", y: "72%" },
          { label: "HIGH", sub: "Red Sea Route Risk", cls: "frag--high", x: "78%", y: "68%" },
          { label: "MONITORING", sub: "EU Carbon Tax", cls: "frag--low", x: "88%", y: "42%" },
        ].map((f, i) => (
          <div
            key={i}
            className={`data-fragment ${f.cls}`}
            style={{
              left: f.x,
              top: f.y,
              animationDelay: `${i * 0.8}s`,
            }}
          >
            <span className="frag-badge">{f.label}</span>
            <span className="frag-text">{f.sub}</span>
          </div>
        ))}
      </div>

      {/* Layer 4 – hero content (fastest – fades out on scroll) */}
      <div
        className="hero__content"
        style={{ transform: `translateY(${-slideUp}px)`, opacity: fadeOut }}
      >
        <div className="hero__pill">
          <Shield size={13} />
          <span>AI-Powered Multi-Agent Platform</span>
          <span className="pill-dot" />
          <span className="pill-live">Live</span>
        </div>

        <h1 className="hero__title">
          Anticipate Disruptions.<br />
          <span className="hero__title--accent">Secure Your Supply Chain.</span>
        </h1>

        <p className="hero__sub">
          Real-time monitoring across news, weather &amp; geopolitics —
          powered by autonomous AI agents that never sleep.
        </p>

        <div className="hero__stats">
          <div className="hero-stat">
            <span className="hero-stat__num">4</span>
            <span className="hero-stat__label">AI Agents</span>
          </div>
          <div className="hero-stat__divider" />
          <div className="hero-stat">
            <span className="hero-stat__num">15+</span>
            <span className="hero-stat__label">Regions</span>
          </div>
          <div className="hero-stat__divider" />
          <div className="hero-stat">
            <span className="hero-stat__num">&lt;5 min</span>
            <span className="hero-stat__label">Alert Latency</span>
          </div>
        </div>

        <div className="hero__actions">
          <button className="btn-primary" onClick={onEnter}>
            Launch Dashboard
          </button>
          <button className="btn-glass" onClick={onEnter}>
            Watch Demo
          </button>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="hero__scroll-cue" style={{ opacity: fadeOut }}>
        <div className="scroll-line" />
        <ArrowDown size={14} className="scroll-arrow" />
        <span>Scroll to explore</span>
      </div>
    </section>
  );
}
