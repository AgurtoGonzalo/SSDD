import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Permitir la conexión en vivo de Tunnelmole
  // NOTA: Si reiniciás tunnelmole y cambia tu URL, tenés que actualizar este string
  allowedDevOrigins: ["izqlqn-ip-181-30-149-25.tunnelmole.net"],
};

export default nextConfig;
