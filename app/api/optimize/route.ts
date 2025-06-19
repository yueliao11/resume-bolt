import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { resumeContent, jobDescription } = await req.json();

    if (!resumeContent || !jobDescription) {
      return new NextResponse('Missing required fields', { status: 400 });
    }

    // TODO: 调用 AI 服务进行优化
    // 这里先使用模拟数据
    const mockResult = {
      jobTitle: '高级软件工程师',
      company: 'TechCorp',
      optimizedResume: {
        content: `优化后的简历内容:
${resumeContent}

针对职位要求进行了以下优化:
1. 突出了相关技术经验
2. 强调了项目成果
3. 调整了技能描述`
      },
      matchScore: 85,
      matchedKeywords: ['React', 'Node.js', 'TypeScript', 'AWS'],
      addedKeywords: ['系统架构', '团队管理', '敏捷开发'],
      missingKeywords: ['Kubernetes', 'GraphQL'],
      keywordSuggestions: [
        '建议添加 Kubernetes 相关经验',
        '可以补充 GraphQL 项目经验'
      ],
      optimizationSuggestions: [
        '建议在项目经验中添加具体的数据指标',
        '可以更详细地描述团队管理经验',
        '建议突出系统架构设计能力'
      ]
    };

    return NextResponse.json(mockResult);
  } catch (error) {
    console.error('优化失败:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 