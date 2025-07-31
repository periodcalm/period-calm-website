# Clear Feedback Data - SQL Commands

If the API clear endpoints are not working due to RLS policies, you can run these SQL commands directly in your Supabase SQL Editor:

## Option 1: Clear All Feedback Submissions
```sql
DELETE FROM feedback_submissions;
```

## Option 2: Clear with Verification
```sql
-- First, check how many records exist
SELECT COUNT(*) FROM feedback_submissions;

-- Then delete all records
DELETE FROM feedback_submissions;

-- Verify deletion
SELECT COUNT(*) FROM feedback_submissions;
```

## Option 3: Clear Only Recent Submissions (if you want to keep some data)
```sql
-- Delete submissions from the last 7 days
DELETE FROM feedback_submissions 
WHERE submitted_at > NOW() - INTERVAL '7 days';
```

## Option 4: Clear with Backup (recommended)
```sql
-- Create a backup table first
CREATE TABLE feedback_submissions_backup AS 
SELECT * FROM feedback_submissions;

-- Then delete from original table
DELETE FROM feedback_submissions;

-- Verify
SELECT COUNT(*) FROM feedback_submissions;
SELECT COUNT(*) FROM feedback_submissions_backup;
```

## How to Run These Commands:
1. Go to your Supabase Dashboard
2. Navigate to SQL Editor
3. Paste the command you want to run
4. Click "Run" to execute

## After Running the SQL:
1. Refresh your analytics page
2. The count should show 0 submissions
3. You can now start fresh with new form submissions

## If You Need to Restore Data:
```sql
-- Restore from backup (if you created one)
INSERT INTO feedback_submissions 
SELECT * FROM feedback_submissions_backup;

-- Drop the backup table
DROP TABLE feedback_submissions_backup;
``` 