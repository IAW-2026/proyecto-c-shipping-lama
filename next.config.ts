import type { NextConfig } from "next";

const CORS_HEADERS = [
  { key: "Access-Control-Allow-Origin",  value: "*" },
  { key: "Access-Control-Allow-Methods", value: "GET, POST, PATCH, PUT, DELETE, OPTIONS" },
  { key: "Access-Control-Allow-Headers", value: "Content-Type, Authorization" },
]

const nextConfig: NextConfig = {
  async headers() {
    return [
      // Aplica CORS a todos los endpoints públicos que consumen otras apps
      { source: "/api/envios",                                          headers: CORS_HEADERS },
      { source: "/api/envios/:envio_id/estado",                         headers: CORS_HEADERS },
      { source: "/api/envios/orden/:orden_id",                          headers: CORS_HEADERS },
      { source: "/api/envios/orden/:orden_id/liquidacion-logistico",    headers: CORS_HEADERS },
    ]
  },
};

export default nextConfig;
