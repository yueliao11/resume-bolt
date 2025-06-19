/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  images: { 
    unoptimized: true 
  },
  // 强制动态渲染某些页面以避免预渲染问题
  experimental: {
    outputFileTracingExcludes: {
      '*': [
        'supabase/functions/**/*',
        '.git/**/*',
        '.next/**/*',
        'node_modules/@esbuild/**/*',
        'node_modules/@swc/**/*',
      ],
    },
    // 禁用静态优化以避免 Clerk 预渲染问题
    forceSwcTransforms: true,
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    
    // 排除原生模块
    config.externals = config.externals || [];
    config.externals.push({
      '@next/swc-linux-x64-gnu': 'commonjs @next/swc-linux-x64-gnu',
      '@next/swc-linux-x64-musl': 'commonjs @next/swc-linux-x64-musl',
    });
    
    return config;
  },
};

module.exports = nextConfig;