import { useEffect, useRef, useState } from "react";
import { Shield, ChevronDown, Zap, Globe, Brain } from "lucide-react";

export default function ParallaxHero({ onEnter }: { onEnter: () => void }) {
  const heroRef = useRef<HTMLDivElement>(null);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const opacity = Math.max(0, 1 - scrollY / 600);
  const translateY = scrollY * 0.4;
  const scale = 1 + scrollY * 0.0003;

  return (
    <div ref={heroRef} className="hero-section">
      {/* Parallax background layers */}
      <div className="hero-bg-layer hero-bg-grid" style={{ transform: `translateY(${scrollY * 0.1}px)` }} />
      <div className="hero-bg-layer hero-bg-particles" style={{ transform: `translateY(${scrollY * 0.25}px)` }}>
        {Array.from({ length: 30 }).map((_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              left: `${(i * 37) % 100}%`,
              top: `${(i * 53) % 100}%`,
              animationDelay: `${(i * 0.3) % 5}s`,
              animationDuration: `${3 + (i % 4)}s`,
            }}
          />
        ))}
      </div>
      <div className="hero-bg-layer hero-bg-glow" style={{ transform: `translateY(${scrollY * 0.15}px) scale(${scale})` }} />

      {/* Floating risk indicators */}
      <div className="hero-floating-indicators" style={{ transform: `translateY(${scrollY * 0.3}px)`, opacity }}>
        <div className="floating-card fc-1">
          <span className="fc-dot critical" />
          <span>Typhoon Alert — East Asia</span>
        </div>
        <div className="floating-card fc-2">
          <span className="fc-dot high" />
          <span>Port Strike — Lagos</span>
        </div>
        <div className="floating-card fc-3">
          <span className="fc-dot medium" />
          <span>Rhine Low — Europe</span>
        </div>
        <div className="floating-card fc-4">
          <span className="fc-dot high" />
          <span>Route Risk — Red Sea</span>
        </div>
      </div>

      {/* Main hero content */}
      <div className="hero-content" style={{ transform: `translateY(${translateY}px)`, opacity }}>
        <div className="hero-badge">
          <Shield size={14} />
          <span>AI-Powered Multi-Agent System</span>
        </div>
        <h1 className="hero-title">
          <span className="hero-title-line">Supply Chain</span>
          <span className="hero-title-line gradient-text">Risk Analyzer</span>
        </h1>
        <p className="hero-subtitle">
          Real-time monitoring of global supply chains using autonomous AI agents.
          Detect disruptions from news, weather, and geopolitics before they impact your business.
        </p>

        <div className="hero-features">
          <div className="hero-feature">
            <Brain size={20} />
            <div>
              <strong>4 AI Agents</strong>
              <span>Autonomous monitoring</span>
            </div>
          </div>
          <div className="hero-feature">
            <Globe size={20} />
            <div>
              <strong>Global Coverage</strong>
              <span>15+ supplier regions</span>
            </div>
          </div>
          <div className="hero-feature">
            <Zap size={20} />
            <div>
              <strong>Real-Time</strong>
              <span>Instant alerts</span>
            </div>
          </div>
        </div>

        <button className="hero-cta" onClick={onEnter}>
          Launch Dashboard
          <ChevronDown size={18} className="cta-arrow" />
        </button>
      </div>

      {/* Scroll indicator */}
      <div className="scroll-indicator" style={{ opacity }}>
        <div className="scroll-mouse">
          <div className="scroll-wheel" />
        </div>
        <span>Scroll to explore</span>
      </div>
    </div>
  );
}
