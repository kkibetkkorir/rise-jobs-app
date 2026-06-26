/*
# Create Initial Database Schema for Rise Jobs

1. New Tables
- `profiles` - User profile data linked to auth.users
  - `id` (uuid, primary key, references auth.users)
  - `name` (text, user's display name)
  - `avatar_url` (text, optional profile picture URL)
  - `created_at` (timestamp)
  - `updated_at` (timestamp)

- `saved_jobs` - Jobs saved/bookmarked by users
  - `id` (uuid, primary key)
  - `user_id` (uuid, references auth.users, owner)
  - `job_id` (text, external job ID from Rise API)
  - `job_title` (text)
  - `company_name` (text)
  - `company_logo` (text, optional)
  - `job_url` (text)
  - `location` (text)
  - `job_type` (text)
  - `created_at` (timestamp)

- `job_alerts` - User job alert preferences
  - `id` (uuid, primary key)
  - `user_id` (uuid, references auth.users, owner)
  - `keywords` (text array)
  - `location` (text)
  - `job_type` (text)
  - `is_active` (boolean)
  - `created_at` (timestamp)

- `user_settings` - User preferences and settings
  - `id` (uuid, primary key)
  - `user_id` (uuid, references auth.users, owner)
  - `theme` (text, 'light' or 'dark')
  - `email_notifications` (boolean)
  - `push_notifications` (boolean)
  - `created_at` (timestamp)
  - `updated_at` (timestamp)

- `payment_history` - Track user payments
  - `id` (uuid, primary key)
  - `user_id` (uuid, references auth.users, owner)
  - `job_id` (text, external job ID)
  - `amount` (decimal)
  - `currency` (text)
  - `payment_method` (text)
  - `status` (text)
  - `checkout_id` (text, external payment reference)
  - `created_at` (timestamp)

2. Security
- Enable RLS on all tables
- Owner-scoped CRUD policies for authenticated users
- Profiles are readable by owner, writable by owner
- Saved jobs, alerts, settings scoped to owner
- Payment history readable by owner

3. Indexes
- Index on user_id for all tables for faster queries
- Index on job_id for saved_jobs and payment_history

4. Notes
- Uses ON DELETE CASCADE for foreign keys to maintain referential integrity
- All owner columns default to auth.uid() for automatic user assignment
- Timestamps use DEFAULT now() for automatic creation time
*/

-- Profiles table (linked to auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name text,
  avatar_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_profile" ON profiles;
CREATE POLICY "select_own_profile" ON profiles FOR SELECT
  TO authenticated USING (auth.uid() = id);

DROP POLICY IF EXISTS "insert_own_profile" ON profiles;
CREATE POLICY "insert_own_profile" ON profiles FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "update_own_profile" ON profiles;
CREATE POLICY "update_own_profile" ON profiles FOR UPDATE
  TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- Saved jobs table
CREATE TABLE IF NOT EXISTS saved_jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  job_id text NOT NULL,
  job_title text NOT NULL,
  company_name text,
  company_logo text,
  job_url text,
  location text,
  job_type text,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, job_id)
);

ALTER TABLE saved_jobs ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_saved_jobs_user_id ON saved_jobs(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_jobs_job_id ON saved_jobs(job_id);

DROP POLICY IF EXISTS "select_own_saved_jobs" ON saved_jobs;
CREATE POLICY "select_own_saved_jobs" ON saved_jobs FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_saved_jobs" ON saved_jobs;
CREATE POLICY "insert_own_saved_jobs" ON saved_jobs FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_saved_jobs" ON saved_jobs;
CREATE POLICY "delete_own_saved_jobs" ON saved_jobs FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- Job alerts table
CREATE TABLE IF NOT EXISTS job_alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  keywords text[] DEFAULT '{}',
  location text,
  job_type text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE job_alerts ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_job_alerts_user_id ON job_alerts(user_id);

DROP POLICY IF EXISTS "select_own_alerts" ON job_alerts;
CREATE POLICY "select_own_alerts" ON job_alerts FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_alerts" ON job_alerts;
CREATE POLICY "insert_own_alerts" ON job_alerts FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_alerts" ON job_alerts;
CREATE POLICY "update_own_alerts" ON job_alerts FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_alerts" ON job_alerts;
CREATE POLICY "delete_own_alerts" ON job_alerts FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- User settings table
CREATE TABLE IF NOT EXISTS user_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  theme text DEFAULT 'light',
  email_notifications boolean DEFAULT true,
  push_notifications boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_user_settings_user_id ON user_settings(user_id);

DROP POLICY IF EXISTS "select_own_settings" ON user_settings;
CREATE POLICY "select_own_settings" ON user_settings FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_settings" ON user_settings;
CREATE POLICY "insert_own_settings" ON user_settings FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_settings" ON user_settings;
CREATE POLICY "update_own_settings" ON user_settings FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Payment history table
CREATE TABLE IF NOT EXISTS payment_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  job_id text NOT NULL,
  amount decimal(10,2) NOT NULL,
  currency text DEFAULT 'USD',
  payment_method text,
  status text DEFAULT 'pending',
  checkout_id text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE payment_history ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_payment_history_user_id ON payment_history(user_id);
CREATE INDEX IF NOT EXISTS idx_payment_history_job_id ON payment_history(job_id);

DROP POLICY IF EXISTS "select_own_payments" ON payment_history;
CREATE POLICY "select_own_payments" ON payment_history FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_payments" ON payment_history;
CREATE POLICY "insert_own_payments" ON payment_history FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

-- Function to automatically create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  
  INSERT INTO public.user_settings (user_id, theme)
  VALUES (NEW.id, 'light');
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger the function on user creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

DROP TRIGGER IF EXISTS update_user_settings_updated_at ON user_settings;
CREATE TRIGGER update_user_settings_updated_at
  BEFORE UPDATE ON user_settings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
