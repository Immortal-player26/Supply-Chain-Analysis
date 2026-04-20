import { useState } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  Line,
  ZoomableGroup,
} from "react-simple-maps";
import type { Supplier } from "../lib/api";

const GEO_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

const riskColor = (score: number) => {
  if (score >= 60) return "#ef4444";
  if (score >= 40) return "#f59e0b";
  if (score >= 20) return "#3b82f6";
  return "#22c55e";
};

const SUPPLY_LINKS = [
  [0, 1], [1, 8], [2, 3], [5, 2], [7, 2],
  [4, 10], [13, 12], [9, 6], [11, 6], [0, 12],
];

export default function WorldMap({ suppliers }: { suppliers: Supplier[] }) {
  const [tooltip, setTooltip] = useState<{ name: string; risk: number; x: number; y: number } | null>(null);

  const validSuppliers = suppliers.filter(
    (s) => s.latitude != null && s.longitude != null
  );

  return (
    <div className="panel">
      <h3 className="panel-title">Global Supply Chain Map</h3>
      <div className="map-container" style={{ position: "relative" }}>
        <ComposableMap
          projection="geoMercator"
          projectionConfig={{ scale: 130, center: [20, 20] }}
          className="world-map-svg"
          style={{ width: "100%", height: "auto" }}
        >
          <ZoomableGroup>
            {/* Country shapes */}
            <Geographies geography={GEO_URL}>
              {({ geographies }) =>
                geographies.map((geo) => (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill="rgba(30, 41, 59, 0.7)"
                    stroke="rgba(100, 116, 139, 0.3)"
                    strokeWidth={0.5}
                    style={{
                      default: { outline: "none" },
                      hover: { fill: "rgba(51, 65, 85, 0.8)", outline: "none" },
                      pressed: { outline: "none" },
                    }}
                  />
                ))
              }
            </Geographies>

            {/* Supply chain connection lines */}
            {SUPPLY_LINKS.map(([si, ti], idx) => {
              const s1 = validSuppliers[si];
              const s2 = validSuppliers[ti];
              if (!s1 || !s2) return null;
              return (
                <Line
                  key={idx}
                  from={[s1.longitude!, s1.latitude!]}
                  to={[s2.longitude!, s2.latitude!]}
                  stroke="rgba(99, 102, 241, 0.35)"
                  strokeWidth={1}
                  strokeLinecap="round"
                  strokeDasharray="5 5"
                />
              );
            })}

            {/* Supplier markers */}
            {validSuppliers.map((s) => {
              const color = riskColor(s.risk_score);
              return (
                <Marker
                  key={s.id}
                  coordinates={[s.longitude!, s.latitude!]}
                  onMouseEnter={(e) =>
                    setTooltip({
                      name: s.name,
                      risk: s.risk_score,
                      x: e.clientX,
                      y: e.clientY,
                    })
                  }
                  onMouseLeave={() => setTooltip(null)}
                >
                  <circle r={8} fill={color} opacity={0.25} className="pulse-ring" />
                  <circle r={4} fill={color} stroke="rgba(0,0,0,0.4)" strokeWidth={0.8} />
                </Marker>
              );
            })}
          </ZoomableGroup>
        </ComposableMap>

        {/* Tooltip */}
        {tooltip && (
          <div
            className="map-tooltip"
            style={{
              position: "fixed",
              left: tooltip.x + 12,
              top: tooltip.y - 10,
              background: "rgba(15, 23, 42, 0.95)",
              border: "1px solid rgba(100, 116, 139, 0.3)",
              borderRadius: 8,
              padding: "8px 12px",
              fontSize: "0.78rem",
              color: "#e2e8f0",
              pointerEvents: "none",
              zIndex: 50,
              whiteSpace: "nowrap",
            }}
          >
            <strong>{tooltip.name}</strong>
            <br />
            <span style={{ color: riskColor(tooltip.risk) }}>
              Risk: {tooltip.risk}
            </span>
          </div>
        )}

        {/* Legend */}
        <div className="map-legend">
          <div className="legend-item"><span className="legend-dot" style={{ background: "#22c55e" }} /> Low (0-19)</div>
          <div className="legend-item"><span className="legend-dot" style={{ background: "#3b82f6" }} /> Medium (20-39)</div>
          <div className="legend-item"><span className="legend-dot" style={{ background: "#f59e0b" }} /> High (40-59)</div>
          <div className="legend-item"><span className="legend-dot" style={{ background: "#ef4444" }} /> Critical (60+)</div>
        </div>
      </div>
    </div>
  );
}
