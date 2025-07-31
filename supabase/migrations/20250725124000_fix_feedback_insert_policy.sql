-- Drop existing feedback policies
DROP POLICY IF EXISTS "Allow users to insert their own feedback" ON feedback_submissions;
DROP POLICY IF EXISTS "Allow admins to read all feedback submissions" ON feedback_submissions;

-- Allow any authenticated user to insert feedback (since feedback form doesn't require login)
CREATE POLICY "Allow authenticated users to insert feedback"
ON feedback_submissions
FOR INSERT
WITH CHECK (true); -- Allow all inserts for now

-- Allow admins to read all feedback submissions
CREATE POLICY "Allow admins to read all feedback submissions"
ON feedback_submissions
FOR SELECT
USING (auth.jwt() ->> 'role' = 'ADMIN');

-- Also allow public read access for now (for testing)
CREATE POLICY "Allow public read access to feedback submissions"
ON feedback_submissions
FOR SELECT
USING (true);