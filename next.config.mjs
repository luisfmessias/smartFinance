/** @type {import('next').NextConfig} */
const nextConfig = {
  devIndicators: {
    position: "top-right",
  },
  experimental: {
    // Cache em disco do Turbopack desativado: um cache corrompido em
    // .next/dev/cache fazia o dev server entrar em loop de panics.
    turbopackFileSystemCacheForDev: false,
  },
};

export default nextConfig;
