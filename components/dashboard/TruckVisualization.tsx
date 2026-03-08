import React from 'react';
import { useState, useEffect } from "react";

import { Truck, Box } from 'lucide-react';

interface TruckVisualizationProps {
  containerId1: string;
  containerId2: string;
  containerId3: string;
  containerId4: string;
  containerId5: string;
  containerId6: string;
  containerId7: string;
  containerId8: string;
  containerDate1: string;
  containerDate2: string;
  containerDate3: string;
  containerDate4: string;
  containerDate5: string;
  containerDate6: string;
  containerDate7: string;
  containerDate8: string;
}

const TruckVisualization: React.FC<TruckVisualizationProps> = ({
  containerId1, containerId2, containerId3, containerId4,
  containerId5, containerId6, containerId7, containerId8,
  containerDate1, containerDate2, containerDate3, containerDate4,
  containerDate5, containerDate6, containerDate7, containerDate8,
}) => {

  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    const t = setInterval(() => setPulse((p) => !p), 1500);
    return () => clearInterval(t);
  }, []);

  const sections = [
    { num: 1, top: { id: containerId1, axle: "Баруун чингэлэг: 1", date: containerDate1 }, bottom: { id: containerId2, axle: "Зүүн чингэлэг: 1", date: containerDate2 } },
    { num: 2, top: { id: containerId3, axle: "Баруун чингэлэг: 2", date: containerDate3 }, bottom: { id: containerId4, axle: "Зүүн чингэлэг: 2", date: containerDate4 } },
    { num: 3, top: { id: containerId5, axle: "Баруун чингэлэг: 3", date: containerDate5 }, bottom: { id: containerId6, axle: "Зүүн чингэлэг: 3", date: containerDate6 } },
    { num: 4, top: { id: containerId7, axle: "Баруун чингэлэг: 4", date: containerDate7 }, bottom: { id: containerId8, axle: "Зүүн чингэлэг: 4", date: containerDate8 } },
  ];

  const sectionW = 110;
  const totalW = sectionW * 4;

  const TopBadge = ({ axle, id, date }: { axle: string; id: string; date: string }) => (
    <div style={{ width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.25)", borderRadius: 6, padding: "4px 6px", textAlign: "center", boxShadow: "0 2px 12px rgba(255,255,255,0.06)" }}>
      <div style={{ fontSize: 15, color: "rgba(255,255,255,0.35)", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 1 }}>{axle}</div>
      <div style={{ fontSize: 20, color: "#fff", fontWeight: 700, letterSpacing: "0.05em", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{id}</div>
      <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", letterSpacing: "0.06em", marginTop: 3 }}>{date}</div>
    </div>
  );

  const BottomBadge = ({ axle, id, date }: { axle: string; id: string; date: string }) => (
    <div style={{ width: "100%", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 6, padding: "4px 6px", textAlign: "center", boxShadow: "0 2px 12px rgba(255,255,255,0.04)" }}>
      <div style={{ fontSize: 15, color: "rgba(255,255,255,0.3)", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 1 }}>{axle}</div>
      <div style={{ fontSize: 20, color: "#fff", fontWeight: 700, letterSpacing: "0.05em", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{id}</div>
      <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", letterSpacing: "0.06em", marginTop: 3 }}>{date}</div>
      <div style={{ height: 2, borderRadius: 2, background: "linear-gradient(90deg,rgba(255,255,255,0.4),transparent)", marginTop: 3 }} />
    </div>
  );

  return (
    <div style={{ fontFamily: "'Courier New', monospace", background: "linear-gradient(160deg, #0d1117 0%, #0a1628 60%, #060d1a 100%)", borderRadius: "16px", padding: "24px", position: "relative", overflow: "hidden", boxShadow: "0 0 60px rgba(255,255,255,0.04), inset 0 1px 0 rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
      Grid background
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none", backgroundImage: "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)", backgroundSize: "32px 32px" }} />

      {/* Corner accents */}
      {[
        { top: 0, left: 0, borderTop: "2px solid rgba(255,255,255,0.25)", borderLeft: "2px solid rgba(255,255,255,0.25)", borderRadius: "12px 0 0 0" },
        { top: 0, right: 0, borderTop: "2px solid rgba(255,255,255,0.25)", borderRight: "2px solid rgba(255,255,255,0.25)", borderRadius: "0 12px 0 0" },
        { bottom: 0, left: 0, borderBottom: "2px solid rgba(255,255,255,0.25)", borderLeft: "2px solid rgba(255,255,255,0.25)", borderRadius: "0 0 0 12px" },
        { bottom: 0, right: 0, borderBottom: "2px solid rgba(255,255,255,0.25)", borderRight: "2px solid rgba(255,255,255,0.25)", borderRadius: "0 0 12px 0" },
      ].map((s, i) => <div key={i} style={{ position: "absolute", width: 40, height: 40, ...s }} />)}

      Header
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, position: "relative" }}>
        <div>
          <div style={{ fontSize: 9, letterSpacing: "0.3em", color: "rgba(255,255,255,0.5)", textTransform: "uppercase", marginBottom: 2 }}>WIM — Container Tracking</div>
          <div style={{ fontSize: 15, fontWeight: 900, color: "#fff", letterSpacing: "0.05em" }}>VEHICLE SCAN</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 20, padding: "4px 12px" }}>
          <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#fff", display: "inline-block", boxShadow: pulse ? "0 0 10px #fff" : "0 0 2px rgba(255,255,255,0.5)", transition: "box-shadow 0.5s" }} />
          <span style={{ fontSize: 9, color: "#fff", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase" }}>In Motion</span>
        </div>
      </div>

      {/* TOP ROW */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8, marginBottom: 6 }}>
        {sections.map((s, i) => (
          <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
            <TopBadge axle={s.top.axle} id={s.top.id} date={s.top.date} />
            <div style={{ width: 1, height: 8, background: "linear-gradient(rgba(255,255,255,0.5), transparent)" }} />
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#fff", boxShadow: "0 0 6px rgba(255,255,255,0.8)" }} />
          </div>
        ))}
      </div>

      {/* Trailer SVG */}
      <svg viewBox={`0 0 ${totalW} 50`} style={{ width: "100%", display: "block", filter: "drop-shadow(0 4px 20px rgba(255,255,255,0.06))" }}>
        <defs>
          <linearGradient id="tg4" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2d3f55" />
            <stop offset="100%" stopColor="#1a2840" />
          </linearGradient>
        </defs>
        <rect x="2" y="2" width={totalW - 4} height="44" rx="5" fill="url(#tg4)" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" />
        <rect x="6" y="3" width={totalW - 12} height="5" rx="2" fill="rgba(255,255,255,0.06)" />
        <rect x="2" y="40" width={totalW - 4} height="4" rx="2" fill="rgba(255,255,255,0.06)" />
        {[1, 2, 3].map((n) => (
          <line key={n} x1={n * sectionW} y1="4" x2={n * sectionW} y2="44" stroke="rgba(0,0,0,0.5)" strokeWidth="2.5" />
        ))}
        {sections.map((s, i) => (
          <g key={i}>
            <rect x={i * sectionW + 3} y="5" width={sectionW - 6} height="37" rx="2" fill="rgba(255,255,255,0.02)" stroke="rgba(255,255,255,0.1)" strokeWidth="1" strokeDasharray="4 3" />
            <text x={i * sectionW + sectionW / 2} y="33" textAnchor="middle" fontSize="28" fontFamily="'Courier New', monospace" fontWeight="900" fill="rgba(255,255,255,0.55)">{s.num}</text>
          </g>
        ))}
      </svg>

      <div style={{ height: 10 }} />

      {/* BOTTOM ROW */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8 }}>
        {sections.map((s, i) => (
          <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#fff", boxShadow: "0 0 6px rgba(255,255,255,0.8)" }} />
            <div style={{ width: 1, height: 8, background: "linear-gradient(transparent, rgba(255,255,255,0.4))" }} />
            <BottomBadge axle={s.bottom.axle} id={s.bottom.id} date={s.bottom.date} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default TruckVisualization;
