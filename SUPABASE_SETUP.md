# Supabase Setup Guide

This guide will walk you through setting up Supabase for the Prompt Manager app.

## Step 1: Create a Supabase Account

1. Go to [https://supabase.com](https://supabase.com)
2. Click "Start your project"
3. Sign up with GitHub, Google, or email
4. Verify your email if required

## Step 2: Create a New Project

1. Click "New Project"
2. Choose an organization (or create one)
3. Enter project details:
   - **Name**: `prompt-manager` (or any name you prefer)
   - **Database Password**: Create a strong password (save this!)
   - **Region**: Choose the closest region to you
4. Click "Create new project"
5. Wait 1-2 minutes for the project to be provisioned

## Step 3: Create the Prompts Table

1. In your Supabase dashboard, go to **Table Editor** (left sidebar)
2. Click "Create a new table"
3. Configure the table:
   - **Name**: `prompts`
   - **Enable Row Level Security (RLS)**: Yes (recommended)
   
4. Add the following columns:

| Column Name | Type | Default Value | Primary | Nullable |
|-------------|------|---------------|---------|----------|
| id | uuid | gen_random_uuid() | ✓ | No |
| title | text | - | - | No |
| description | text | - | - | No |
| color | text | - | - | Yes |
| created_at | timestamptz | now() | - | No |
| updated_at | timestamptz | now() | - | No |

5. Click "Save" to create the table

### Alternative: Use SQL Editor

Go to **SQL Editor** and run this SQL:

```sql
CREATE TABLE prompts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  color TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Enable Row Level Security
ALTER TABLE prompts ENABLE ROW LEVEL SECURITY;

-- Create a policy to allow all operations (for demo purposes)
-- In production, you'd want more restrictive policies
CREATE POLICY "Allow all operations" ON prompts
  FOR ALL
  USING (true)
  WITH CHECK (true);
```

## Step 4: Set Up Row Level Security (RLS) Policies

If you created the table via the UI, you need to add RLS policies:

1. Go to **Authentication** → **Policies**
2. Click "New Policy" on the `prompts` table
3. Choose "Create a policy from scratch"
4. Configure:
   - **Policy name**: `Allow all operations`
   - **Allowed operations**: SELECT, INSERT, UPDATE, DELETE
   - **USING expression**: `true`
   - **WITH CHECK expression**: `true`
5. Click "Save"

> **Note**: For production, you'd want to restrict these policies based on user authentication.

## Step 5: Get Your API Credentials

1. Go to **Settings** (gear icon) → **API**
2. Copy these values:
   - **Project URL**: This is your `VITE_SUPABASE_URL`
   - **anon public key**: This is your `VITE_SUPABASE_ANON_KEY`

## Step 6: Configure Your Local Environment

1. Create a `.env` file in the `prompt-manager` directory:

```bash
cp .env.example .env
```

2. Edit `.env` and add your credentials:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

3. Restart the development server:

```bash
npm run dev
```

## Step 7: Verify the Connection

1. Open the app in your browser
2. Add a new prompt using the + button
3. Check your Supabase Table Editor - the prompt should appear there
4. Refresh the page - the prompt should persist

## Troubleshooting

### "Supabase credentials not found"
- Make sure `.env` file exists in the `prompt-manager` directory
- Check that the variable names start with `VITE_`
- Restart the dev server after creating `.env`

### "Error fetching from Supabase"
- Check your RLS policies are correctly set
- Verify the table name is exactly `prompts`
- Check browser console for detailed error messages

### Data not persisting
- Make sure RLS policies allow INSERT and SELECT
- Check the browser Network tab for failed requests
- Verify your API keys are correct

## Optional: Add User Authentication

For a production app with user-specific prompts:

1. Enable authentication in Supabase (Email, Google, etc.)
2. Add a `user_id` column to the prompts table
3. Update RLS policies to filter by `auth.uid()`
4. Add authentication UI to your app

Example RLS policy for user-specific data:

```sql
-- Users can only see their own prompts
CREATE POLICY "Users can manage own prompts" ON prompts
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
```

## Need Help?

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Discord](https://discord.supabase.com)
- [Supabase GitHub](https://github.com/supabase/supabase)
