"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface LoginResponse {
  success: boolean;
  message?: string;
}

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: username, password }),
      });
      const data: LoginResponse = await res.json();
      if (res.ok && data.success) {
        router.push("/dashboard");
      } else {
        setError(data.message || "Invalid credentials");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0d1117",
        fontFamily: "'Courier New', monospace",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* ── Background: digital vehicles image ── */}
      <div style={{
        position: "fixed",
        inset: 0,
 //       backgroundImage: "url('/digital_vehicles.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        opacity: 0.35,
        pointerEvents: "none",
      }} />

      {/* ── Grid overlay ── */}
      <div style={{
        position: "fixed", inset: 0, pointerEvents: "none",
        backgroundImage: "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
        backgroundSize: "32px 32px",
      }} />

      {/* ── Scanlines ── */}
      <div style={{
        position: "fixed", inset: 0, pointerEvents: "none",
        backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.08) 3px, rgba(0,0,0,0.08) 4px)",
      }} />

      {/* ── Top header bar ── */}
      <div style={{
        position: "relative",
        zIndex: 10,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "16px 32px",
        borderBottom: "1px solid rgba(0,229,255,0.12)",
        background: "rgba(13,17,23,0.7)",
        backdropFilter: "blur(8px)",
      }}>
        {/* Left corner accent */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {/* <div style={{ position: "relative", width: 36, height: 36 }}>
            <div style={{ position: "absolute", top: 0, left: 0, width: 14, height: 14, borderTop: "2px solid rgba(0,229,255,0.7)", borderLeft: "2px solid rgba(0,229,255,0.7)" }} />
            <div style={{ position: "absolute", bottom: 0, right: 0, width: 14, height: 14, borderBottom: "2px solid rgba(0,229,255,0.7)", borderRight: "2px solid rgba(0,229,255,0.7)" }} />
            <div style={{ position: "absolute", inset: 6, borderRadius: "50%", background: "rgba(0,229,255,0.15)", border: "1px solid rgba(0,229,255,0.3)" }} />
          </div> */}
          
          <div>
            <div style={{ fontSize: 8, letterSpacing: "0.35em", color: "rgba(0,229,255,0.5)", textTransform: "uppercase" }}></div>
            <div style={{ fontSize: 15, fontWeight: 900, color: "#fff", letterSpacing: "0.1em", textTransform: "uppercase" }}>ЭРДЭНЭС ТАВАН ТОЛГОЙ ХК</div>
          </div>
        </div>


      </div>

      {/* ── Main content: left info + right login card ── */}
      <div style={{
        position: "relative",
        zIndex: 10,
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "40px 60px",
        gap: 40,
      }}>

        {/* Left: decorative info panel */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 24, maxWidth: 400 }}>

          {/* Big title */}
          <div>
            <div style={{ fontSize: 9, letterSpacing: "0.4em", color: "rgba(0,229,255,0.5)", textTransform: "uppercase", marginBottom: 10 }}>
              ── Weigh-In-Motion System
            </div>
            <div style={{ fontSize: 38, fontWeight: 900, color: "#fff", letterSpacing: "0.06em", textTransform: "uppercase", lineHeight: 1.1, textShadow: "0 0 40px rgba(0,229,255,0.2)" }}>
              АВТО<br />ЖИНГИЙН<br /><span style={{ color: "rgba(0,229,255,0.7)" }}>СИСТЕМ</span>
            </div>
          </div>

          {/* Divider */}
          <div style={{ width: 80, height: 2, background: "linear-gradient(90deg, rgba(0,229,255,0.6), transparent)" }} />

          {/* Bottom corner accent */}
          <div style={{ display: "flex", gap: 8, alignItems: "center", marginTop: 8 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: "rgba(0,229,255,0.6)", boxShadow: "0 0 8px rgba(0,229,255,0.8)" }} />
            <div style={{ flex: 1, height: 1, background: "linear-gradient(90deg, rgba(0,229,255,0.3), transparent)" }} />
          </div>
        </div>

        {/* Right: Login card */}
        <div style={{
          width: "100%",
          maxWidth: 380,
          background: "linear-gradient(160deg, rgba(13,17,23,0.95) 0%, rgba(10,22,40,0.95) 60%, rgba(6,13,26,0.95) 100%)",
          borderRadius: "16px",
          padding: "36px 32px",
          position: "relative",
          overflow: "hidden",
          boxShadow: "0 0 60px rgba(0,229,255,0.06), 0 0 120px rgba(0,0,0,0.8), inset 0 1px 0 rgba(0,229,255,0.08)",
          border: "1px solid rgba(0,229,255,0.15)",
          backdropFilter: "blur(12px)",
        }}>
          {/* Corner accents */}
          {[
            { top: 0, left: 0, borderTop: "2px solid rgba(0,229,255,0.4)", borderLeft: "2px solid rgba(0,229,255,0.4)", borderRadius: "12px 0 0 0" },
            { top: 0, right: 0, borderTop: "2px solid rgba(0,229,255,0.4)", borderRight: "2px solid rgba(0,229,255,0.4)", borderRadius: "0 12px 0 0" },
            { bottom: 0, left: 0, borderBottom: "2px solid rgba(0,229,255,0.4)", borderLeft: "2px solid rgba(0,229,255,0.4)", borderRadius: "0 0 0 12px" },
            { bottom: 0, right: 0, borderBottom: "2px solid rgba(0,229,255,0.4)", borderRight: "2px solid rgba(0,229,255,0.4)", borderRadius: "0 0 12px 0" },
          ].map((s, i) => (
            <div key={i} style={{ position: "absolute", width: 40, height: 40, ...s }} />
          ))}

          {/* Grid inside card */}
          <div style={{
            position: "absolute", inset: 0, pointerEvents: "none",
            backgroundImage: "linear-gradient(rgba(0,229,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(0,229,255,0.02) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }} />

          <div style={{ position: "relative" }}>
            {/* Card header */}
            <div style={{ marginBottom: 28 }}>
              <div style={{ fontSize: 8, letterSpacing: "0.35em", color: "rgba(0,229,255,0.5)", textTransform: "uppercase", marginBottom: 6 }}>
                Secure Access
              </div>
              <div style={{ fontSize: 17, fontWeight: 900, color: "#fff", letterSpacing: "0.06em", textTransform: "uppercase" }}>
                Системд нэвтрэх
              </div>
              <div style={{ width: 40, height: 2, borderRadius: 2, background: "linear-gradient(90deg, rgba(0,229,255,0.6), transparent)", marginTop: 10 }} />
            </div>

            {/* Form */}
            <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: 16 }}>

              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <label style={{ fontSize: 8, letterSpacing: "0.25em", color: "rgba(0,229,255,0.5)", textTransform: "uppercase" }}>
                  Username
                </label>
                <input
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  style={{
                    background: "rgba(0,229,255,0.03)",
                    border: "1px solid rgba(0,229,255,0.15)",
                    borderRadius: 8,
                    padding: "10px 14px",
                    color: "#fff",
                    fontSize: 13,
                    fontFamily: "'Courier New', monospace",
                    fontWeight: 600,
                    letterSpacing: "0.04em",
                    outline: "none",
                    width: "100%",
                    boxSizing: "border-box",
                    transition: "border-color 0.2s, box-shadow 0.2s",
                  }}
                  onFocus={(e) => { e.target.style.borderColor = "rgba(0,229,255,0.5)"; e.target.style.boxShadow = "0 0 12px rgba(0,229,255,0.1)"; }}
                  onBlur={(e) => { e.target.style.borderColor = "rgba(0,229,255,0.15)"; e.target.style.boxShadow = "none"; }}
                />
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <label style={{ fontSize: 8, letterSpacing: "0.25em", color: "rgba(0,229,255,0.5)", textTransform: "uppercase" }}>
                  Password
                </label>
                <input
                  type="password"
                  placeholder="Your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  style={{
                    background: "rgba(0,229,255,0.03)",
                    border: "1px solid rgba(0,229,255,0.15)",
                    borderRadius: 8,
                    padding: "10px 14px",
                    color: "#fff",
                    fontSize: 13,
                    fontFamily: "'Courier New', monospace",
                    fontWeight: 600,
                    letterSpacing: "0.04em",
                    outline: "none",
                    width: "100%",
                    boxSizing: "border-box",
                    transition: "border-color 0.2s, box-shadow 0.2s",
                  }}
                  onFocus={(e) => { e.target.style.borderColor = "rgba(0,229,255,0.5)"; e.target.style.boxShadow = "0 0 12px rgba(0,229,255,0.1)"; }}
                  onBlur={(e) => { e.target.style.borderColor = "rgba(0,229,255,0.15)"; e.target.style.boxShadow = "none"; }}
                />
              </div>

              {error && (
                <div style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 8, padding: "8px 12px", display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#ef4444", boxShadow: "0 0 6px rgba(239,68,68,0.8)", flexShrink: 0 }} />
                  <span style={{ fontSize: 11, color: "#ef4444", fontWeight: 600, letterSpacing: "0.04em" }}>{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                style={{
                  marginTop: 8,
                  padding: "12px 24px",
                  background: loading ? "rgba(0,229,255,0.04)" : "rgba(0,229,255,0.08)",
                  border: `1px solid ${loading ? "rgba(0,229,255,0.1)" : "rgba(0,229,255,0.35)"}`,
                  borderRadius: 8,
                  color: loading ? "rgba(0,229,255,0.35)" : "rgba(0,229,255,0.9)",
                  fontSize: 11,
                  fontFamily: "'Courier New', monospace",
                  fontWeight: 900,
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  cursor: loading ? "not-allowed" : "pointer",
                  transition: "all 0.2s",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                }}
                onMouseEnter={(e) => { if (!loading) { const b = e.currentTarget; b.style.background = "rgba(0,229,255,0.15)"; b.style.boxShadow = "0 0 20px rgba(0,229,255,0.15)"; }}}
                onMouseLeave={(e) => { if (!loading) { const b = e.currentTarget; b.style.background = "rgba(0,229,255,0.08)"; b.style.boxShadow = "none"; }}}
              >
                {loading && (
                  <span style={{ width: 10, height: 10, borderRadius: "50%", border: "2px solid rgba(0,229,255,0.2)", borderTopColor: "rgba(0,229,255,0.8)", display: "inline-block", animation: "spin 0.8s linear infinite" }} />
                )}
                {loading ? "Нэвтэрч байна..." : "Нэвтрэх"}
              </button>

            </form>
          </div>
        </div>

      </div>

      {/* ── Bottom status bar ── */}
            <div style={{
        position: "relative",
        zIndex: 10,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "10px 32px",
        borderTop: "1px solid rgba(0,229,255,0.08)",
        background: "rgba(13,17,23,0.7)",
        backdropFilter: "blur(8px)",
      }}>
        <span style={{ fontSize: 8, color: "rgba(0,229,255,0.35)", letterSpacing: "0.2em", textTransform: "uppercase" }}></span>

        <span style={{ fontSize: 8, color: "rgba(0,229,255,0.35)", letterSpacing: "0.2em", textTransform: "uppercase" }}>
          Web version 2.1
        </span>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <img
            src="/logo.png"
            alt="Logo"
            style={{ width: 28, height: 28, objectFit: "contain", filter: "drop-shadow(0 0 8px rgba(220,38,38,0.5))" }}
          />
          <span style={{ fontSize: 8, color: "rgba(0,229,255,0.35)", letterSpacing: "0.2em", textTransform: "uppercase" }}>
            Developed by DIGITAL POWER LLC
          </span>
        </div>
      </div>


      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
        input::placeholder { color: rgba(255,255,255,0.15); }
      `}</style>
    </div>
  );
}
