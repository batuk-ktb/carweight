"use client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState, useEffect } from "react";

const PUU_LABELS: Record<number, string> = {
  1: "Оролт 1", 2: "Оролт 2", 3: "Оролт 3", 4: "Оролт 4", 5: "Оролт 5",
  6: "Гаралт 1", 7: "Гаралт 2", 8: "Гаралт 3", 9: "Гаралт 4", 10: "Гаралт 5",
  11: "Зүүн хяналт 1", 12: "Зүүн хяналт 2", 13: "Зүүн хяналт 3", 14: "Зүүн хяналт 4",
  15: "Баруун хяналт 1", 16: "Баруун хяналт 2",
};

const PAGE_SIZE = 10;

interface NavbarProps {
  puuStatus?: boolean[];
}

export default function Navbar({ puuStatus }: NavbarProps) {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [time, setTime] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Fallback sample data if no prop provided
  const status = puuStatus ?? [
    true, false, true, true, false, true, true, false, true, true,
    false, true, true, false, true, true,
  ];

  const totalPages = Math.ceil(status.length / PAGE_SIZE);
  const pageOffset = (currentPage - 1) * PAGE_SIZE;
  const paginated = status.slice(pageOffset, pageOffset + PAGE_SIZE);

  useEffect(() => {
    const tick = () =>
      setTime(new Date().toLocaleTimeString("mn-MN", { hour: "2-digit", minute: "2-digit", second: "2-digit" }));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  };

  const menuItems = [
    { label: "Хяналтын самбар", href: "/dashboard", icon: "▣" },
    { label: "Тохиргоо", href: "/settings", icon: "⚙" },
    { label: "Нууц үг солих", href: "/change-password", icon: "🔑" },
    { label: "Бидний тухай", href: "/about", icon: "ℹ" },
  ];

  const gridBg = (
    <div style={{
      position: "absolute", inset: 0, pointerEvents: "none",
      backgroundImage: "linear-gradient(rgba(0,229,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(0,229,255,0.02) 1px, transparent 1px)",
      backgroundSize: "32px 32px",
    }} />
  );

  const btnBase: React.CSSProperties = {
    background: "rgba(0,229,255,0.04)",
    border: "1px solid rgba(0,229,255,0.15)",
    borderRadius: 6,
    cursor: "pointer",
    color: "rgba(0,229,255,0.7)",
    fontFamily: "'Courier New', monospace",
    fontWeight: 700,
    transition: "all 0.15s",
  };

  return (
    <>
      {/* ══════════════════ NAVBAR ══════════════════ */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000,
        fontFamily: "'Courier New', monospace",
        background: "linear-gradient(90deg, #0d1117 0%, #0a1628 50%, #060d1a 100%)",
        borderBottom: "1px solid rgba(0,229,255,0.15)",
        boxShadow: "0 4px 30px rgba(0,0,0,0.5), inset 0 1px 0 rgba(0,229,255,0.08)",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 24px", height: 56,
      }}>
        {gridBg}
        <div style={{ position: "absolute", bottom: 0, left: 0, width: 30, height: 2, background: "linear-gradient(90deg, rgba(0,229,255,0.5), transparent)" }} />
        <div style={{ position: "absolute", bottom: 0, right: 0, width: 30, height: 2, background: "linear-gradient(270deg, rgba(0,229,255,0.5), transparent)" }} />

        {/* Left: Hamburger + Logo + Title */}
        <div style={{ display: "flex", alignItems: "center", gap: 14, position: "relative" }}>
          <button
            onClick={() => setSidebarOpen(o => !o)}
            style={{
              background: sidebarOpen ? "rgba(0,229,255,0.12)" : "rgba(0,229,255,0.05)",
              border: `1px solid ${sidebarOpen ? "rgba(0,229,255,0.4)" : "rgba(0,229,255,0.18)"}`,
              borderRadius: 8, width: 36, height: 36,
              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
              gap: sidebarOpen ? 0 : 5,
              cursor: "pointer", transition: "all 0.25s", padding: 0, flexShrink: 0,
            }}
          >
            {[0, 1, 2].map((i) => (
              <span key={i} style={{
                display: "block", width: 16, height: 2,
                background: "rgba(0,229,255,0.85)", borderRadius: 2,
                transition: "all 0.25s", transformOrigin: "center",
                transform: sidebarOpen
                  ? i === 0 ? "rotate(45deg) translate(5px, 5px)"
                  : i === 1 ? "scaleX(0)"
                  : "rotate(-45deg) translate(5px, -5px)"
                  : "none",
                opacity: sidebarOpen && i === 1 ? 0 : 1,
              }} />
            ))}
          </button>
        </div>
        {/* Center: name */}

        <div style={{ fontSize: 26, fontWeight: 900, color: "#fff", letterSpacing: "0.08em", textTransform: "uppercase", lineHeight: 1 }}>
        Автожингийн систем
        </div>
        {/* Left side: live clock */}
        <div style={{ position: "relative", display: "flex", alignItems: "center", gap: 8, background: "rgba(0,229,255,0.04)", border: "1px solid rgba(0,229,255,0.12)", borderRadius: 8, padding: "5px 14px" }}>
          <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#00e5ff", boxShadow: "0 0 6px rgba(0,229,255,0.9)", display: "inline-block", animation: "navpulse 1.5s infinite" }} />
          <span style={{ fontSize: 13, fontWeight: 900, color: "#fff", letterSpacing: "0.12em" }}>{time}</span>
        </div>

      </nav>

      {/* ══════════════════ BACKDROP ══════════════════ */}
      <div
        onClick={() => setSidebarOpen(false)}
        style={{
          position: "fixed", inset: 0, zIndex: 998,
          background: "rgba(0,0,0,0.55)", backdropFilter: "blur(2px)",
          opacity: sidebarOpen ? 1 : 0,
          pointerEvents: sidebarOpen ? "all" : "none",
          transition: "opacity 0.3s ease",
        }}
      />

      {/* ══════════════════ SLIDE SIDEBAR ══════════════════ */}
      <div style={{
        position: "fixed", top: 56, left: 0, bottom: 0, width: 290,
        zIndex: 999, fontFamily: "'Courier New', monospace",
        background: "linear-gradient(160deg, #0d1117 0%, #0a1628 60%, #060d1a 100%)",
        borderRight: "1px solid rgba(0,229,255,0.15)",
        borderTop: "1px solid rgba(0,229,255,0.1)",
        boxShadow: sidebarOpen ? "8px 0 40px rgba(0,0,0,0.6), 2px 0 20px rgba(0,229,255,0.05)" : "none",
        transform: sidebarOpen ? "translateX(0)" : "translateX(-100%)",
        transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        display: "flex", flexDirection: "column", overflow: "hidden",
      }}>
        {gridBg}
        <div style={{ position: "absolute", top: 0, right: 0, bottom: 0, width: 1, background: "linear-gradient(180deg, rgba(0,229,255,0.3), transparent 40%, transparent 60%, rgba(0,229,255,0.1))" }} />

        {/* ── Nav menu section ── */}
        <div style={{ padding: "16px 16px 10px", borderBottom: "1px solid rgba(0,229,255,0.08)", position: "relative" }}>
          <div style={{ fontSize: 7, letterSpacing: "0.35em", color: "rgba(0,229,255,0.4)", textTransform: "uppercase", marginBottom: 10 }}>Navigation</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
            {menuItems.map((item) => (
              <Link key={item.href} href={item.href} onClick={() => setSidebarOpen(false)} style={{ textDecoration: "none" }}>
                <div
                  style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 12px", borderRadius: 8, background: "rgba(0,229,255,0.02)", border: "1px solid rgba(0,229,255,0.07)", cursor: "pointer", transition: "all 0.15s", color: "rgba(255,255,255,0.8)" }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(0,229,255,0.08)"; e.currentTarget.style.borderColor = "rgba(0,229,255,0.25)"; e.currentTarget.style.color = "#fff"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(0,229,255,0.02)"; e.currentTarget.style.borderColor = "rgba(0,229,255,0.07)"; e.currentTarget.style.color = "rgba(255,255,255,0.8)"; }}
                >
                  <span style={{ fontSize: 13, width: 20, textAlign: "center", opacity: 0.7, flexShrink: 0 }}>{item.icon}</span>
                  <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.05em" }}>{item.label}</span>
                  <span style={{ marginLeft: "auto", fontSize: 10, color: "rgba(0,229,255,0.3)" }}>›</span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* ── Puu Status section ── */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>

          {/* Section header with ON/OFF summary */}
          <div style={{ padding: "12px 16px 8px", borderBottom: "1px solid rgba(0,229,255,0.06)", position: "relative", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <div style={{ fontSize: 7, letterSpacing: "0.35em", color: "rgba(0,229,255,0.4)", textTransform: "uppercase", marginBottom: 2 }}>Terminal</div>
              <div style={{ fontSize: 12, fontWeight: 900, color: "#fff", letterSpacing: "0.06em", textTransform: "uppercase" }}>ПҮҮ STATUS</div>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <span style={{ fontSize: 8, color: "rgba(34,197,94,0.7)", letterSpacing: "0.1em", fontWeight: 700 }}>● {status.filter(Boolean).length} ON</span>
              <span style={{ fontSize: 8, color: "rgba(239,68,68,0.7)", letterSpacing: "0.1em", fontWeight: 700 }}>● {status.filter(s => !s).length} OFF</span>
            </div>
          </div>

          {/* Puu list — scrollable */}
          <div style={{ flex: 1, overflowY: "auto", padding: "8px 10px", display: "flex", flexDirection: "column", gap: 3 }}>
            {paginated.map((s, i) => {
              const puuNum = pageOffset + i + 1;
              const label = PUU_LABELS[puuNum] ?? `Пүү ${puuNum}`;
              return (
                <Link key={puuNum} href={`/puu/${puuNum}`} onClick={() => setSidebarOpen(false)} style={{ textDecoration: "none" }}>
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 12px", borderRadius: 8, background: "rgba(0,229,255,0.02)", border: "1px solid rgba(0,229,255,0.06)", cursor: "pointer", transition: "all 0.15s" }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(0,229,255,0.07)"; e.currentTarget.style.borderColor = "rgba(0,229,255,0.2)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(0,229,255,0.02)"; e.currentTarget.style.borderColor = "rgba(0,229,255,0.06)"; }}
                    title={label}
                  >
                    {/* Status dot */}
                    <div style={{ width: 8, height: 8, borderRadius: "50%", flexShrink: 0, background: s ? "#22c55e" : "#ef4444", boxShadow: s ? "0 0 8px rgba(34,197,94,0.8)" : "0 0 8px rgba(239,68,68,0.8)" }} />
                    <span style={{ fontSize: 13, fontWeight: 900, color: "#fff", letterSpacing: "0.04em", flex: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {label}
                    </span>
                    <span style={{ fontSize: 8, color: s ? "rgba(34,197,94,0.7)" : "rgba(239,68,68,0.7)", letterSpacing: "0.15em", fontWeight: 700, textTransform: "uppercase" }}>
                      {s ? "ON" : "OFF"}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div style={{ borderTop: "1px solid rgba(0,229,255,0.07)", padding: "8px 10px", display: "flex", alignItems: "center", justifyContent: "center", gap: 4 }}>
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                style={{ ...btnBase, padding: "4px 10px", fontSize: 11, opacity: currentPage === 1 ? 0.3 : 1, cursor: currentPage === 1 ? "not-allowed" : "pointer" }}
              >◀</button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <button
                  key={p}
                  onClick={() => setCurrentPage(p)}
                  style={{
                    ...btnBase,
                    width: 28, height: 28, fontSize: 10,
                    background: p === currentPage ? "rgba(0,229,255,0.15)" : "rgba(0,229,255,0.04)",
                    borderColor: p === currentPage ? "rgba(0,229,255,0.45)" : "rgba(0,229,255,0.15)",
                    color: p === currentPage ? "#00e5ff" : "rgba(0,229,255,0.6)",
                    boxShadow: p === currentPage ? "0 0 10px rgba(0,229,255,0.15)" : "none",
                  }}
                >{p}</button>
              ))}

              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                style={{ ...btnBase, padding: "4px 10px", fontSize: 11, opacity: currentPage === totalPages ? 0.3 : 1, cursor: currentPage === totalPages ? "not-allowed" : "pointer" }}
              >▶</button>
            </div>
          )}
        </div>

        {/* ── Divider ── */}
        <div style={{ height: 1, background: "linear-gradient(90deg, transparent, rgba(0,229,255,0.15), transparent)", margin: "0 16px" }} />

        {/* ── Logout ── */}
        <div style={{ padding: "10px 10px" }}>
          <button
            onClick={handleLogout}
            style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", width: "100%", borderRadius: 8, background: "rgba(239,68,68,0.04)", border: "1px solid rgba(239,68,68,0.15)", cursor: "pointer", color: "rgba(239,68,68,0.8)", fontSize: 12, fontWeight: 700, fontFamily: "'Courier New', monospace", letterSpacing: "0.06em", transition: "all 0.15s", textAlign: "left" }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(239,68,68,0.1)"; e.currentTarget.style.borderColor = "rgba(239,68,68,0.35)"; e.currentTarget.style.color = "#ef4444"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(239,68,68,0.04)"; e.currentTarget.style.borderColor = "rgba(239,68,68,0.15)"; e.currentTarget.style.color = "rgba(239,68,68,0.8)"; }}
          >
            <span style={{ fontSize: 14, width: 20, textAlign: "center", flexShrink: 0 }}>⏻</span>
            Гарах
          </button>
        </div>

        {/* ── Footer ── */}
        <div style={{ padding: "8px 20px", borderTop: "1px solid rgba(0,229,255,0.06)", display: "flex", justifyContent: "space-between" }}>
          <span style={{ fontSize: 7, color: "rgba(0,229,255,0.25)", letterSpacing: "0.2em", textTransform: "uppercase" }}>WIM v2.0</span>
          <span style={{ fontSize: 7, color: "rgba(0,229,255,0.25)", letterSpacing: "0.15em", textTransform: "uppercase" }}>DIGITAL POWER LLC</span>
        </div>
      </div>

      <style>{`
        @keyframes navpulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
      `}</style>
    </>
  );
}
