import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: "/",
        destination: "/our-offerings",
        permanent: false,
      },
      {
        source: "/labs",
        destination: "https://bioarolabs.com",
        permanent: false,
      },
      {
        source: "/drugs",
        destination: "https://bioarodrugs.com",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
