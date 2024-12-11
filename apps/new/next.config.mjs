import SmeeClient from "smee-client";

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {},
};

export default nextConfig;

const smee = new SmeeClient({
  source: process.env.SMEE_WEBHOOK_URL,
  target: "http://localhost:3000/api/webhook",
});

smee.start();
