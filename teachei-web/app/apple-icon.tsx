import { ImageResponse } from "next/og";

// Tamanho do ícone Apple (180x180 é o padrão)
export const size = {
  width: 180,
  height: 180,
};

export const contentType = "image/png";

// Gera o ícone Apple dinamicamente
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 90,
          background: "#f8f6f0",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 32,
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
