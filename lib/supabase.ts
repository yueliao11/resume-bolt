import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Profile = {
  id: string;
  user_id: string;
  email: string;
  full_name: string;
  created_at: string;
  updated_at: string;
};

export type Resume = {
  id: string;
  user_id: string;
  title: string;
  content: any;
  file_url?: string;
  created_at: string;
  updated_at: string;
};

export type OptimizationJob = {
  id: string;
  user_id: string;
  resume_id: string;
  job_description: string;
  optimized_content: any;
  match_score: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  created_at: string;
  updated_at: string;
};