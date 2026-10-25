import { ImageResponse } from "next/og";
import { profile } from "@/data/profile";

export const alt = `${profile.name} — ${profile.headline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "#05070c",
          backgroundImage:
            "radial-gradient(circle at 15% 10%, rgba(34,211,238,0.25), transparent 45%), radial-gradient(circle at 90% 80%, rgba(139,92,246,0.22), transparent 45%)",
          color: "#e8ebf1",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 16,
              background: "linear-gradient(135deg, #22d3ee, #8b5cf6)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#031318",
              fontSize: 28,
              fontWeight: 700,
            }}
          >
            {profile.initials}
          </div>
          <div style={{ fontSize: 28, color: "#949cb0", fontFamily: "monospace" }}>COMPUTER SCIENCE ENGINEERING</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 30, color: "#22d3ee", fontFamily: "monospace" }}>{profile.displayName}</div>
          <div style={{ fontSize: 64, fontWeight: 700, letterSpacing: -2, lineHeight: 1.05, marginTop: 16 }}>{profile.headline}</div>
          <div style={{ fontSize: 30, color: "#949cb0", marginTop: 24 }}>{`${profile.role} · ${profile.subRole}`}</div>
        </div>
        <div style={{ display: "flex", gap: 14, fontSize: 24, color: "#949cb0", fontFamily: "monospace" }}>
          {["TrustScan", "DocTranslate Enterprise", "Symbolic AI", "Python"].map((t) => (
            <div key={t} style={{ border: "1px solid rgba(255,255,255,0.15)", borderRadius: 999, padding: "8px 20px" }}>
              {t}
            </div>
          ))}
        </div>
      </div>
    ),
    size,
  );
}
