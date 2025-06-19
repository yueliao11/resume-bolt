import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // 添加必要的安全头
  const headers = new Headers(request.headers);
  headers.set('x-middleware-cache', 'no-cache');
  
  // 只允许API路由在服务器端运行
  if (request.nextUrl.pathname.startsWith('/api/')) {
    headers.set('x-server-only', '1');
  }

  return NextResponse.next({
    request: {
      headers,
    },
  });
}

export const config = {
  matcher: [
    '/api/:path*',
  ],
};