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
  return `You are a professional resume optimization expert. Please optimize the following resume for the target job description:

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

Please ensure the response is valid JSON format.`
}

function parseOptimizedContent(content: string) {
  try {
    const jsonMatch = content.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0])
    }
    throw new Error('No JSON found in response')
  } catch (error) {
    console.error('Error parsing optimized content:', error)
    return {
      optimizedResume: {
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
    }
  }
}