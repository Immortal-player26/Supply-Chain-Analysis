import { useEffect, useState } from "react";
import { Shield } from "lucide-react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav className={`navbar ${scrolled ? "navbar--scrolled" : ""}`}>
      <div className="navbar__inner">
        <a className="navbar__brand" href="#">
          <Shield size={20} />
          <span>SupplyShield<span className="brand-ai">AI</span></span>
        </a>
        <div className="navbar__links">
          <a href="#features">Features</a>
          <a href="#dashboard">Dashboard</a>
          <a href="#tech">Stack</a>
          <a className="navbar__cta" href="#dashboard">Launch App →</a>
        </div>
      </div>
    </nav>
  );
}
