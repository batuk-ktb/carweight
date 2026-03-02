"use client";

export default function Loader() {
  return (
    <div style={{
      position: "fixed",
      inset: 0,
      zIndex: 9999,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      backdropFilter: "blur(6px)",
      WebkitBackdropFilter: "blur(6px)",
      animation: "loader-fadein 0.3s ease forwards",
    }}>

      <div style={{ position: "relative", width: 180, height: 180 }}>

        {/* Sweep */}
        <div style={{
          position: "absolute", inset: 0, borderRadius: "50%",
          background: "conic-gradient(from 0deg, rgba(0,229,255,0.35) 0deg, transparent 70deg)",
          animation: "radar-spin 2s linear infinite",
        }} />

        {/* Outer ring */}
        <svg viewBox="0 0 180 180" style={{ position: "absolute", inset: 0, animation: "radar-spin-rev 3.5s linear infinite" }}>
          <circle cx="90" cy="90" r="85" fill="none" stroke="rgba(0,229,255,0.12)" strokeWidth="1" />
          <circle cx="90" cy="90" r="85" fill="none" stroke="rgba(0,229,255,0.7)" strokeWidth="1.5" strokeDasharray="24 400" strokeLinecap="round" />
        </svg>

        {/* Mid ring */}
        <svg viewBox="0 0 180 180" style={{ position: "absolute", inset: 0, animation: "radar-spin 2.5s linear infinite" }}>
          <circle cx="90" cy="90" r="60" fill="none" stroke="rgba(0,229,255,0.08)" strokeWidth="1" />
          <circle cx="90" cy="90" r="60" fill="none" stroke="rgba(0,229,255,0.5)" strokeWidth="1.5" strokeDasharray="14 280" strokeLinecap="round" />
        </svg>

        {/* Inner ring + crosshairs + ticks */}
        <svg viewBox="0 0 180 180" style={{ position: "absolute", inset: 0 }}>
          <circle cx="90" cy="90" r="35" fill="none" stroke="rgba(0,229,255,0.07)" strokeWidth="1" />
          <line x1="90" y1="5"  x2="90"  y2="175" stroke="rgba(0,229,255,0.07)" strokeWidth="1" />
          <line x1="5"  y1="90" x2="175" y2="90"  stroke="rgba(0,229,255,0.07)" strokeWidth="1" />
          {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => {
            const rad = (deg * Math.PI) / 180;
            const x1 = 90 + 82 * Math.cos(rad);
            const y1 = 90 + 82 * Math.sin(rad);
            const x2 = 90 + 88 * Math.cos(rad);
            const y2 = 90 + 88 * Math.sin(rad);
            return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(0,229,255,0.3)" strokeWidth="1.5" />;
          })}
        </svg>

        {/* Blip dots */}
        <svg viewBox="0 0 180 180" style={{ position: "absolute", inset: 0 }}>
          <circle cx="120" cy="60" r="3" fill="#00e5ff" opacity="0.8">
            <animate attributeName="opacity" values="0.8;0.1;0.8" dur="2s" repeatCount="indefinite" />
          </circle>
          <circle cx="55" cy="110" r="2" fill="#00e5ff" opacity="0.6">
            <animate attributeName="opacity" values="0.6;0.05;0.6" dur="3s" repeatCount="indefinite" />
          </circle>
          <circle cx="140" cy="120" r="2.5" fill="#00e5ff" opacity="0.7">
            <animate attributeName="opacity" values="0.7;0.1;0.7" dur="1.5s" repeatCount="indefinite" />
          </circle>
        </svg>

        {/* Center dot */}
        <div style={{
          position: "absolute",
          top: "50%", left: "50%",
          width: 14, height: 14,
          borderRadius: "50%",
          background: "#00e5ff",
          boxShadow: "0 0 20px rgba(0,229,255,0.9), 0 0 50px rgba(0,229,255,0.4)",
          animation: "pulse-center 1.5s ease-in-out infinite",
        }} />
      </div>

      <style>{`
        @keyframes loader-fadein  { from { opacity: 0; } to { opacity: 1; } }
        @keyframes radar-spin     { to { transform: rotate(360deg); } }
        @keyframes radar-spin-rev { to { transform: rotate(-360deg); } }
        @keyframes pulse-center {
          0%, 100% { transform: translate(-50%,-50%) scale(1);   box-shadow: 0 0 20px rgba(0,229,255,0.9); }
          50%       { transform: translate(-50%,-50%) scale(1.5); box-shadow: 0 0 30px rgba(0,229,255,1), 0 0 60px rgba(0,229,255,0.4); }
        }
      `}</style>
    </div>
  );
}
