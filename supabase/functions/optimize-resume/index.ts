import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { resumeContent, jobDescription, userId, resumeId } = await req.json()

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Update job status to processing
    await supabase
      .from('optimization_jobs')
      .update({ status: 'processing' })
      .eq('id', resumeId)

    // Call OpenRouter API
    const openRouterKey = Deno.env.get('OPENROUTER_API_KEY')!
    const siteUrl = Deno.env.get('SITE_URL') || 'https://your-site.com'

    const prompt = generateOptimizationPrompt(resumeContent, jobDescription)

    const openRouterResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openRouterKey}`,
        'HTTP-Referer': siteUrl,
        'X-Title': 'Resume Tailor',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'qwen/qwen3-30b-a3b:free',
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 4000,
      }),
    })

    if (!openRouterResponse.ok) {
      throw new Error(`OpenRouter API error: ${openRouterResponse.statusText}`)
    }

    const data = await openRouterResponse.json()
    const optimizedContent = data.choices[0].message.content
    const parsedResult = parseOptimizedContent(optimizedContent)

    // Update optimization job with results
    await supabase
      .from('optimization_jobs')
      .update({
        status: 'completed',
        optimized_content: parsedResult,
        match_score: parsedResult.matchScore || 75,
      })
      .eq('id', resumeId)

    return new Response(
      JSON.stringify(parsedResult),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )

  } catch (error) {
    console.error('Error in optimize-resume function:', error)
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})

function generateOptimizationPrompt(resumeContent: any, jobDescription: string) {
  // 检测招聘描述的语言
  const detectJobLanguage = (text: string): string => {
    const chinesePattern = /[\u4e00-\u9fff]/g;
    const japanesePattern = /[\u3040-\u309f\u30a0-\u30ff]/g;
    const koreanPattern = /[\uac00-\ud7af]/g;
    
    if (chinesePattern.test(text)) return 'zh';
    if (japanesePattern.test(text)) return 'ja';
    if (koreanPattern.test(text)) return 'ko';
    return 'en';
  };

  const detectedJobLanguage = detectJobLanguage(jobDescription);

  const languageInstructions: Record<string, string> = {
    en: 'Please respond in English and ensure the output resume language matches the job description language',
    zh: '请用中文回复，确保输出简历的语言与招聘描述的语言保持一致',
    ja: '日本語で回答し、出力される履歴書の言語が求人記述の言語と一致するようにしてください',
    ko: '한국어로 답변하고, 출력되는 이력서의 언어가 채용 공고의 언어와 일치하도록 해주세요'
  };

  return `您是一位拥有15年丰富经验的资深HR猎头和简历优化专家，具备深厚的人力资源洞察力和市场敏感度。${languageInstructions[detectedJobLanguage] || languageInstructions['en']}.

## 您的专业背景：
- 15年人力资源和猎头经验，服务过500+知名企业
- 深度理解不同行业的招聘需求和用人标准
- 擅长从招聘官角度分析职位需求的深层意图
- 精通简历美化和专业表达优化
- 熟悉ATS系统和关键词匹配策略

## 任务要求：
请以专业HR猎头的视角，深度分析以下招聘需求，然后优化候选人简历：

**原始简历：**
${JSON.stringify(resumeContent, null, 2)}

**目标职位描述：**
${jobDescription}

## 分析流程：
1. **招聘需求意图分析**：深度解读职位描述背后的真实需求和期望
2. **简历匹配度评估**：从HR视角评估当前简历与职位的匹配程度
3. **专业优化美化**：运用专业表达技巧，提升简历的专业度和吸引力
4. **语言一致性确保**：确保输出简历的语言与招聘描述语言完全一致

请按以下JSON格式提供优化结果：
{
  "jobLanguage": "${detectedJobLanguage}",
  "recruitmentIntent": {
    "coreRequirements": ["核心要求1", "核心要求2"],
    "hiddenExpectations": ["隐含期望1", "隐含期望2"],
    "culturalFit": "企业文化匹配要求",
    "careerLevel": "职业级别定位"
  },
  "optimizedResume": {
    "personalInfo": {
      "name": "...",
      "email": "...",
      "phone": "...",
      "location": "...",
      "linkedin": "...",
      "summary": "高度专业化的个人简介，体现职业价值主张"
    },
    "experience": [
      {
        "title": "优化后的职位标题",
        "company": "公司名称",
        "duration": "任职时间",
        "description": "美化后的专业描述，突出成就和价值创造"
      }
    ],
    "education": [
      {
        "degree": "学位信息",
        "school": "院校名称", 
        "year": "时间",
        "details": "相关详情"
      }
    ],
    "skills": ["技能关键词优化"],
    "achievements": ["量化成就表述"]
  },
  "enhancementAnalysis": {
    "professionalUpgrades": ["专业表达提升点1", "专业表达提升点2"],
    "languageRefinements": ["语言美化改进1", "语言美化改进2"],
    "structuralImprovements": ["结构优化点1", "结构优化点2"]
  },
  "matchScore": 85,
  "improvementItems": 5,
  "keywordMatches": 12,
  "matchedKeywords": ["匹配关键词1", "匹配关键词2"],
  "addedKeywords": ["新增关键词1", "新增关键词2"],
  "optimizationSuggestions": ["优化建议1", "优化建议2"],
  "optimizationImprovements": [
    "hrInsightOptimization",
    "recruitmentIntentAlignment", 
    "professionalLanguageUpgrade",
    "resumeAestheticEnhancement",
    "crossCulturalAdaptation"
  ]
}

## 核心优化原则：
1. **深度理解招聘意图**：从招聘官角度解读职位需求的真实期望
2. **专业表达美化**：使用行业标准术语和专业表达方式
3. **价值导向重写**：突出候选人为企业创造的价值和贡献
4. **量化成果展示**：尽可能使用数据和具体成果证明能力
5. **文化适配性**：体现与目标企业文化的匹配度
6. **语言完美统一**：确保输出简历语言与招聘描述语言100%一致
7. **视觉专业度**：优化简历的整体表述和专业形象
8. **关键词自然融入**：巧妙融入关键词，避免生硬堆砌

请确保响应为有效的JSON格式，并且所有文本内容都使用与招聘描述相同的语言。`
}

function parseOptimizedContent(content: string) {
  try {
    const jsonMatch = content.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0])
      
      // 保持与原始结构的兼容性，同时扩展新功能
      return {
        ...parsed,
        // 确保所有必需字段都存在
        optimizedResume: parsed.optimizedResume || {
          personalInfo: {
            name: 'Professional',
            email: 'professional@example.com',
            summary: 'Professional summary optimized for the target position.'
          },
          experience: [],
          education: [],
          skills: [],
          achievements: []
        },
        matchScore: parsed.matchScore || 75,
        improvementItems: parsed.improvementItems || 3,
        keywordMatches: parsed.keywordMatches || 8,
        matchedKeywords: parsed.matchedKeywords || ['leadership', 'management'],
        addedKeywords: parsed.addedKeywords || ['strategy', 'innovation'],
        optimizationSuggestions: parsed.optimizationSuggestions || ['Enhanced professional summary', 'Improved keyword integration'],
        optimizationImprovements: parsed.optimizationImprovements || [
          'hrInsightOptimization',
          'recruitmentIntentAlignment',
          'professionalLanguageUpgrade'
        ]
      }
    }
    throw new Error('No JSON found in response')
  } catch (error) {
    console.error('Error parsing optimized content:', error)
    return {
      jobLanguage: 'zh',
      recruitmentIntent: {
        coreRequirements: ['核心技能要求', '行业经验要求'],
        hiddenExpectations: ['团队合作能力', '学习成长潜力'],
        culturalFit: '注重创新和执行力的企业文化',
        careerLevel: '中高级专业人才'
      },
      optimizedResume: {
        personalInfo: {
          name: 'Professional',
          email: 'professional@example.com',
          summary: '具备丰富行业经验的专业人才，致力于为企业创造价值'
        },
        experience: [],
        education: [],
        skills: [],
        achievements: []
      },
      enhancementAnalysis: {
        professionalUpgrades: ['专业术语优化', '行业表达规范'],
        languageRefinements: ['表述更加精准', '逻辑更加清晰'],
        structuralImprovements: ['信息层次优化', '重点突出']
      },
      matchScore: 75,
      improvementItems: 3,
      keywordMatches: 8,
      matchedKeywords: ['leadership', 'management'],
      addedKeywords: ['strategy', 'innovation'],
      optimizationSuggestions: ['Enhanced professional summary', 'Improved keyword integration'],
      optimizationImprovements: [
        'hrInsightOptimization',
        'recruitmentIntentAlignment',
        'professionalLanguageUpgrade',
        'resumeAestheticEnhancement',
        'crossCulturalAdaptation'
      ]
    }
  }
}