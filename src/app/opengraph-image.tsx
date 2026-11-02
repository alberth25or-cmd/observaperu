import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Observa Perú: estudios de mercado hechos por estadísticos";

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
          background: "#0f1e4a",
          padding: "72px",
        }}
      >
        <svg width="84" height="84" viewBox="0 0 64 64" fill="none">
          <g stroke="#ffffff" strokeLinecap="round" fill="none">
            <path d="M7.85 38.47 A25 25 0 1 1 25.53 56.15" strokeWidth="3" />
            <circle cx="32" cy="32" r="10.5" strokeWidth="4" />
            <path d="M24.58 39.42 L17 47" strokeWidth="4.5" />
          </g>
        </svg>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: 76,
              fontWeight: 700,
              color: "#ffffff",
              letterSpacing: "-0.03em",
              lineHeight: 1.05,
            }}
          >
            Estudios de mercado hechos por estadísticos
          </div>
          <div
            style={{
              marginTop: 28,
              fontSize: 32,
              color: "#c9a84c",
              letterSpacing: "-0.01em",
            }}
          >
            Encuestas y estudios de mercado con rigor estadístico
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            fontSize: 26,
            color: "rgba(255,255,255,0.65)",
          }}
        >
          OBSERVA PERÚ
        </div>
      </div>
    ),
    size
  );
}
