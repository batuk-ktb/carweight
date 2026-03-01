"use client";
import Navbar from "@/components/Navbar";
import { useEffect, useState } from "react";
import Link from "next/link";

const PUU_LABELS: Record<number, string> = {
  1: "Оролт 1", 2: "Оролт 2", 3: "Оролт 3", 4: "Оролт 4", 5: "Оролт 5",
  6: "Гаралт 1", 7: "Гаралт 2", 8: "Гаралт 3", 9: "Гаралт 4", 10: "Гаралт 5",
  11: "Зүүн хяналт 1", 12: "Зүүн хяналт 2", 13: "Зүүн хяналт 3", 14: "Зүүн хяналт 4",
  15: "Баруун хяналт 1", 16: "Баруун хяналт 2",
};

export default function Dashboard() {
  const [status, setStatus] = useState<boolean[]>([]);

  useEffect(() => {
    setStatus([
      true, false, true, true, false, true, true, false, true, true,
      false, true, true, false, true, true, false, true, true, false,
      true, true, false, true,
    ]);
  }, []);

  const panelStyle: React.CSSProperties = {
    fontFamily: "'Courier New', monospace",
    background: "linear-gradient(160deg, #0d1117 0%, #0a1628 60%, #060d1a 100%)",
    borderRadius: "16px",
    position: "relative",
    overflow: "hidden",
    boxShadow: "0 0 60px rgba(0,229,255,0.04), inset 0 1px 0 rgba(0,229,255,0.05)",
    border: "1px solid rgba(0,229,255,0.1)",
  };

  const gridBg = (
    <div style={{
      position: "absolute", inset: 0, pointerEvents: "none",
      backgroundImage: "linear-gradient(rgba(0,229,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(0,229,255,0.025) 1px, transparent 1px)",
      backgroundSize: "32px 32px",
    }} />
  );

  const corners = [
    { top: 0, left: 0, borderTop: "2px solid rgba(0,229,255,0.35)", borderLeft: "2px solid rgba(0,229,255,0.35)", borderRadius: "12px 0 0 0" },
    { top: 0, right: 0, borderTop: "2px solid rgba(0,229,255,0.35)", borderRight: "2px solid rgba(0,229,255,0.35)", borderRadius: "0 12px 0 0" },
    { bottom: 0, left: 0, borderBottom: "2px solid rgba(0,229,255,0.35)", borderLeft: "2px solid rgba(0,229,255,0.35)", borderRadius: "0 0 0 12px" },
    { bottom: 0, right: 0, borderBottom: "2px solid rgba(0,229,255,0.35)", borderRight: "2px solid rgba(0,229,255,0.35)", borderRadius: "0 0 12px 0" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#0d1117", fontFamily: "'Courier New', monospace" }}>
      {/* Grid background */}
      <div style={{
        position: "fixed", inset: 0, pointerEvents: "none",
        backgroundImage: "linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)",
        backgroundSize: "32px 32px",
      }} />

      <Navbar puuStatus={status} />

      <div style={{ padding: "80px 24px 24px", position: "relative", zIndex: 1 }}>

        {/* ── Map Area ── */}
        <div style={{ ...panelStyle, padding: 20 }}>
          {gridBg}
          {corners.map((s, i) => <div key={i} style={{ position: "absolute", width: 40, height: 40, ...s }} />)}

          {/* Map header */}
          <div style={{ position: "relative", marginBottom: 14, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <div style={{ fontSize: 7, letterSpacing: "0.3em", color: "rgba(0,229,255,0.4)", textTransform: "uppercase" }}>Live View</div>
              <div style={{ fontSize: 13, fontWeight: 900, color: "#fff", letterSpacing: "0.06em" }}>MINE MAP</div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(0,229,255,0.05)", border: "1px solid rgba(0,229,255,0.15)", borderRadius: 20, padding: "4px 12px" }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#00e5ff", boxShadow: "0 0 8px rgba(0,229,255,0.9)", display: "inline-block", animation: "pulse 1.5s infinite" }} />
              <span style={{ fontSize: 8, color: "rgba(0,229,255,0.8)", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase" }}>Live</span>
            </div>
          </div>

          {/* Map image + pins */}
          <div style={{ position: "relative", borderRadius: 10, overflow: "hidden", border: "1px solid rgba(0,229,255,0.08)" }}>
            <img
              src="/mine-map.jpg"
              alt="map"
              style={{ width: "100%", aspectRatio: "16/9", objectFit: "cover", display: "block", filter: "brightness(0.85) saturate(0.7)" }}
            />
            {/* Overlay grid on map */}
            <div style={{
              position: "absolute", inset: 0, pointerEvents: "none",
              backgroundImage: "linear-gradient(rgba(0,229,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,229,255,0.03) 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }} />

            {status.map((s, i) => (
              <Link key={i} href={`/puu/${i + 1}`} style={{ textDecoration: "none" }}>
                <div
                  style={{
                    position: "absolute",
                    top: `${i * 25}px`,
                    left: `${i * 25}px`,
                  }}
                  title={`${PUU_LABELS[i + 1] ?? `Пүү ${i + 1}`} — ${s ? "ON" : "OFF"}`}
                >
                  {/* Custom pin */}
                  <div style={{
                    width: 20, height: 20,
                    background: s ? "rgba(34,197,94,0.9)" : "rgba(239,68,68,0.9)",
                    boxShadow: s ? "0 0 10px rgba(34,197,94,0.7)" : "0 0 10px rgba(239,68,68,0.7)",
                    border: `2px solid ${s ? "rgba(34,197,94,0.5)" : "rgba(239,68,68,0.5)"}`,
                    borderRadius: "50% 50% 50% 0",
                    transform: "rotate(-45deg)",
                    cursor: "pointer",
                    transition: "transform 0.2s",
                  }}
                    onMouseEnter={(e) => { e.currentTarget.style.transform = "rotate(-45deg) scale(1.3)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.transform = "rotate(-45deg) scale(1)"; }}
                  />
                </div>
              </Link>
            ))}
          </div>

          {/* Legend */}
          <div style={{ position: "relative", marginTop: 12, display: "flex", gap: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#22c55e", boxShadow: "0 0 6px rgba(34,197,94,0.8)" }} />
              <span style={{ fontSize: 8, color: "rgba(255,255,255,0.45)", letterSpacing: "0.15em", textTransform: "uppercase" }}>Active</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#ef4444", boxShadow: "0 0 6px rgba(239,68,68,0.8)" }} />
              <span style={{ fontSize: 8, color: "rgba(255,255,255,0.45)", letterSpacing: "0.15em", textTransform: "uppercase" }}>Inactive</span>
            </div>
            <div style={{ marginLeft: "auto", fontSize: 8, color: "rgba(0,229,255,0.35)", letterSpacing: "0.15em" }}>
              TOTAL: {status.length} UNITS
            </div>
          </div>
        </div>

      </div>

      <style>{`
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
      `}</style>
    </div>
  );
}
