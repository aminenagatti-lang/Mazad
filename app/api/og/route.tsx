import { ImageResponse } from "next/og";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get("title") || "MazadAuto";
  const price = searchParams.get("price");

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: "100%",
          backgroundColor: "#111111",
          padding: "60px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", fontSize: 32, color: "white", fontWeight: 700 }}>
          Mazad<span style={{ color: "#16a34a" }}>Auto</span>
        </div>
        <div
          style={{
            fontSize: 56,
            color: "white",
            fontWeight: 800,
            marginTop: "auto",
            lineHeight: 1.1,
          }}
        >
          {title}
        </div>
        {price && (
          <div style={{ fontSize: 36, color: "#16a34a", fontWeight: 700, marginTop: 16 }}>
            Enchère actuelle: {price} DT
          </div>
        )}
        <div style={{ fontSize: 20, color: "#6b7280", marginTop: 24 }}>
          mazadauto.tn — Enchères automobile en Tunisie
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
