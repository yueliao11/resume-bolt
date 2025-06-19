import { Language, ResumeData, OptimizationResult } from '@/lib/types';

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY!;
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export async function optimizeResume(
  resumeContent: ResumeData, 
  jobDescription: string, 
  language: Language = 'en'
): Promise<OptimizationResult> {
  try {
    const prompt = generateOptimizationPrompt(resumeContent, jobDescription, language);
    
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'HTTP-Referer': SITE_URL,
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
    });

    if (!response.ok) {
      throw new Error(`OpenRouter API error: ${response.statusText}`);
    }

    const data = await response.json();
    const optimizedContent = data.choices[0].message.content;
    
    return parseOptimizedContent(optimizedContent);
  } catch (error) {
    console.error('Error optimizing resume:', error);
    throw error;
  }
}

function generateOptimizationPrompt(
  resumeContent: ResumeData, 
  jobDescription: string, 
  language: Language
): string {
  const languageInstructions: Record<Language, string> = {
    en: 'Respond in English',
    zh: '请用中文回复',
    ja: '日本語で回答してください',
    ko: '한국어로 답변해 주세요',
    de: 'Antworten Sie auf Deutsch',
    it: 'Rispondi in italiano',
    es: 'Responde en español',
  };

  return `You are a professional resume optimization expert. ${languageInstructions[language] || 'Respond in English'}.

Please optimize the following resume for the target job description:

ORIGINAL RESUME:
${JSON.stringify(resumeContent, null, 2)}

TARGET JOB DESCRIPTION:
${jobDescription}

Please provide the optimization in the following JSON format:
{
  "optimizedResume": {
    "personalInfo": {
      "name": "...",
      "email": "...",
      "phone": "...",
      "location": "...",
      "linkedin": "...",
      "summary": "..."
    },
    "experience": [
      {
        "title": "...",
        "company": "...",
        "duration": "...",
        "description": "..."
      }
    ],
    "education": [
      {
        "degree": "...",
        "school": "...",
        "year": "...",
        "details": "..."
      }
    ],
    "skills": ["..."],
    "achievements": ["..."]
  },
  "matchScore": 85,
  "improvementItems": 5,
  "keywordMatches": 12,
  "matchedKeywords": ["keyword1", "keyword2"],
  "addedKeywords": ["newkeyword1", "newkeyword2"],
  "optimizationSuggestions": ["suggestion1", "suggestion2"],
  "optimizationImprovements": [
    "deepAnalysisOptimization",
    "professionalExpressionUpgrade",
    "keywordIntegration",
    "preciseRequirementMatching",
    "structuralReorganization"
  ]
}

Key optimization requirements:
1. Tailor the resume content to match the job requirements
2. Integrate relevant keywords naturally from the job description
3. Rewrite experience descriptions to better align with the target role
4. Create a compelling professional summary
5. Ensure the resume highlights the most relevant skills and achievements
6. Calculate a realistic match score based on how well the resume fits the job
7. Provide specific improvement suggestions

Please ensure the response is valid JSON format.`;
}

function parseOptimizedContent(content: string): OptimizationResult {
  try {
    // Try to extract JSON from the response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    throw new Error('No JSON found in response');
  } catch (error) {
    console.error('Error parsing optimized content:', error);
    // Return a fallback structure
    return {
      optimizedResume: {
        personalInfo: {
          name: 'John Doe',
          email: 'john@example.com',
          summary: 'Professional summary optimized for the target position.'
        },
        experience: [],
        education: [],
        skills: [],
        achievements: []
      },
      matchScore: 75,
      improvementItems: 3,
      keywordMatches: 8,
      matchedKeywords: ['leadership', 'management'],
      addedKeywords: ['strategy', 'innovation'],
      optimizationSuggestions: ['Enhanced professional summary', 'Improved keyword integration'],
      optimizationImprovements: [
        'deepAnalysisOptimization',
        'professionalExpressionUpgrade',
        'keywordIntegration'
      ]
    };
  }
}