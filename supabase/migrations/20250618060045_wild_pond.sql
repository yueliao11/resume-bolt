/*
  # Resume Tailor Database Schema

  1. New Tables
    - `profiles`
      - `id` (uuid, primary key)
      - `user_id` (text, unique, references Clerk user ID)
      - `email` (text)
      - `full_name` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `resumes`
      - `id` (uuid, primary key)
      - `user_id` (text, references profiles.user_id)
      - `title` (text)
      - `content` (jsonb, structured resume data)
      - `file_url` (text, optional file storage URL)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `optimization_jobs`
      - `id` (uuid, primary key)
      - `user_id` (text, references profiles.user_id)
      - `resume_id` (uuid, references resumes.id)
      - `job_description` (text)
      - `optimized_content` (jsonb)
      - `match_score` (integer)
      - `status` (enum: pending, processing, completed, failed)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to access their own data
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text UNIQUE NOT NULL,
  email text,
  full_name text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create resumes table
CREATE TABLE IF NOT EXISTS resumes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text NOT NULL,
  title text NOT NULL,
  content jsonb NOT NULL DEFAULT '{}',
  file_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  FOREIGN KEY (user_id) REFERENCES profiles(user_id) ON DELETE CASCADE
);

-- Create optimization jobs table
CREATE TABLE IF NOT EXISTS optimization_jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text NOT NULL,
  resume_id uuid NOT NULL,
  job_description text NOT NULL,
  optimized_content jsonb DEFAULT '{}',
  match_score integer DEFAULT 0,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  FOREIGN KEY (user_id) REFERENCES profiles(user_id) ON DELETE CASCADE,
  FOREIGN KEY (resume_id) REFERENCES resumes(id) ON DELETE CASCADE
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE resumes ENABLE ROW LEVEL SECURITY;
ALTER TABLE optimization_jobs ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Users can read own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (user_id = auth.jwt() ->> 'sub');

CREATE POLICY "Users can insert own profile"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.jwt() ->> 'sub');

CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.jwt() ->> 'sub');

-- Create RLS policies for resumes
CREATE POLICY "Users can read own resumes"
  ON resumes
  FOR SELECT
  TO authenticated
  USING (user_id = auth.jwt() ->> 'sub');

CREATE POLICY "Users can insert own resumes"
  ON resumes
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.jwt() ->> 'sub');

CREATE POLICY "Users can update own resumes"
  ON resumes
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.jwt() ->> 'sub');

CREATE POLICY "Users can delete own resumes"
  ON resumes
  FOR DELETE
  TO authenticated
  USING (user_id = auth.jwt() ->> 'sub');

-- Create RLS policies for optimization_jobs
CREATE POLICY "Users can read own optimization jobs"
  ON optimization_jobs
  FOR SELECT
  TO authenticated
  USING (user_id = auth.jwt() ->> 'sub');

CREATE POLICY "Users can insert own optimization jobs"
  ON optimization_jobs
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.jwt() ->> 'sub');

CREATE POLICY "Users can update own optimization jobs"
  ON optimization_jobs
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.jwt() ->> 'sub');

CREATE POLICY "Users can delete own optimization jobs"
  ON optimization_jobs
  FOR DELETE
  TO authenticated
  USING (user_id = auth.jwt() ->> 'sub');

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_resumes_user_id ON resumes(user_id);
CREATE INDEX IF NOT EXISTS idx_optimization_jobs_user_id ON optimization_jobs(user_id);
CREATE INDEX IF NOT EXISTS idx_optimization_jobs_resume_id ON optimization_jobs(resume_id);
CREATE INDEX IF NOT EXISTS idx_optimization_jobs_status ON optimization_jobs(status);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers
CREATE TRIGGER update_profiles_updated_at 
  BEFORE UPDATE ON profiles 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_resumes_updated_at 
  BEFORE UPDATE ON resumes 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_optimization_jobs_updated_at 
  BEFORE UPDATE ON optimization_jobs 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();