-- Drop the problematic admin policy that causes infinite recursion
DROP POLICY IF EXISTS "Allow admins to read all profiles" ON profiles;

-- Drop existing JWT-based admin policy if it exists
DROP POLICY IF EXISTS "Allow admins to read all profiles via JWT" ON profiles;

-- Create a new admin policy using JWT claims instead of querying the profiles table
CREATE POLICY "Allow admins to read all profiles via JWT"
ON profiles
FOR SELECT
USING (auth.jwt() ->> 'role' = 'ADMIN');

-- Drop existing feedback policies if they exist
DROP POLICY IF EXISTS "Allow admins to read all feedback submissions" ON feedback_submissions;
DROP POLICY IF EXISTS "Allow users to insert their own feedback" ON feedback_submissions;

-- Also add a policy for the feedback_submissions table to allow admins to read all data
CREATE POLICY "Allow admins to read all feedback submissions"
ON feedback_submissions
FOR SELECT
USING (auth.jwt() ->> 'role' = 'ADMIN');

-- Allow authenticated users to insert their own feedback
CREATE POLICY "Allow users to insert their own feedback"
ON feedback_submissions
FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL);