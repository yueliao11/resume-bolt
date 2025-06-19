/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  images: { 
    unoptimized: true,
    domains: ['images.pexels.com']
  },
  // Runtime configuration for server and client
  serverRuntimeConfig: {
    // Will only be available on the server side
    supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
    openrouterApiKey: process.env.OPENROUTER_API_KEY,
  },
  publicRuntimeConfig: {
    // Exposed to both server and client
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
    supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  },
  // 输出配置
  output: 'standalone',
  // 编译外部包
  transpilePackages: [
    '@clerk/nextjs',
    '@supabase/supabase-js',
    'openai',
  ],
};

module.exports = nextConfig; 