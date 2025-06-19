import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { 
      optimization_id,
      matched_keywords,
      added_keywords,
      missing_keywords,
      suggestions
    } = await req.json();

    if (!optimization_id) {
      return new NextResponse('Missing optimization_id', { status: 400 });
    }

    // 创建关键词分析记录
    const { data, error } = await supabaseAdmin
      .from('keyword_analyses')
      .insert({
        optimization_id,
        matched_keywords,
        added_keywords,
        missing_keywords,
        suggestions
      })
      .select()
      .single();

    if (error) {
      console.error('创建关键词分析失败:', error);
      return new NextResponse('Failed to create keyword analysis', { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('关键词分析失败:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 