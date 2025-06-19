import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { suggestions } = await req.json();

    if (!suggestions || !Array.isArray(suggestions)) {
      return new NextResponse('Invalid suggestions', { status: 400 });
    }

    // 创建改进建议记录
    const { data, error } = await supabaseAdmin
      .from('improvement_suggestions')
      .insert(suggestions)
      .select();

    if (error) {
      console.error('创建改进建议失败:', error);
      return new NextResponse('Failed to create improvement suggestions', { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('改进建议失败:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 