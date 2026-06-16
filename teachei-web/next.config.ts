import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // TODO: restringir hostname ao domínio do Blob Storage (ex.: "*.blob.core.windows.net")
    // em vez de "**" para evitar abuso do otimizador de imagens.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;
