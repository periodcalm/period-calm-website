-- Allow service role to delete all feedback
CREATE POLICY "Allow service role to delete all feedback"
ON feedback_submissions
FOR DELETE
USING (auth.role() = 'service_role'); 