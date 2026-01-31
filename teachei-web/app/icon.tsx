import { ImageResponse } from "next/og";

// Tamanho do favicon
export const size = {
  width: 64,
  height: 64,
};

export const contentType = "image/png";

// Gera o favicon dinamicamente com as letras "Te" do TeAchei
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 32,
          background: "#f8f6f0",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 12,
          fontFamily: "system-ui, sans-serif",
          fontWeight: 800,
        }}
      >
        <span style={{ color: "#4a9fef" }}>t</span>
        <span style={{ color: "#1e3a5f" }}>e</span>
      </div>
    ),
    {
      ...size,
    }
  );
}
