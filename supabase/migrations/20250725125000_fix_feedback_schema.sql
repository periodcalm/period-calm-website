-- Fix feedback_submissions table schema to match form data
-- Add missing columns and fix data types

-- Add missing columns that the form is trying to insert
ALTER TABLE feedback_submissions 
ADD COLUMN IF NOT EXISTS preparation_method TEXT,
ADD COLUMN IF NOT EXISTS storage_experience TEXT,
ADD COLUMN IF NOT EXISTS dosage_followed TEXT;

-- Add benefits_experienced column if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'feedback_submissions' AND column_name = 'benefits_experienced') THEN
        ALTER TABLE feedback_submissions ADD COLUMN benefits_experienced TEXT;
    END IF;
END $$;

-- Add lifestyle_impact column if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'feedback_submissions' AND column_name = 'lifestyle_impact') THEN
        ALTER TABLE feedback_submissions ADD COLUMN lifestyle_impact TEXT;
    END IF;
END $$;

-- Add self_care_essentials column if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'feedback_submissions' AND column_name = 'self_care_essentials') THEN
        ALTER TABLE feedback_submissions ADD COLUMN self_care_essentials TEXT;
    END IF;
END $$;

-- Now convert any existing array columns to TEXT (if they exist and are arrays)
DO $$
BEGIN
    -- Convert benefits_experienced from TEXT[] to TEXT if it exists and is an array
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'feedback_submissions' AND column_name = 'benefits_experienced' AND data_type = 'ARRAY') THEN
        ALTER TABLE feedback_submissions 
        ALTER COLUMN benefits_experienced TYPE TEXT USING 
          CASE 
            WHEN benefits_experienced IS NULL THEN NULL
            WHEN array_length(benefits_experienced, 1) = 0 THEN ''
            ELSE array_to_string(benefits_experienced, ', ')
          END;
    END IF;
    
    -- Convert lifestyle_impact from TEXT[] to TEXT if it exists and is an array
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'feedback_submissions' AND column_name = 'lifestyle_impact' AND data_type = 'ARRAY') THEN
        ALTER TABLE feedback_submissions 
        ALTER COLUMN lifestyle_impact TYPE TEXT USING 
          CASE 
            WHEN lifestyle_impact IS NULL THEN NULL
            WHEN array_length(lifestyle_impact, 1) = 0 THEN ''
            ELSE array_to_string(lifestyle_impact, ', ')
          END;
    END IF;
    
    -- Convert self_care_essentials from TEXT[] to TEXT if it exists and is an array
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'feedback_submissions' AND column_name = 'self_care_essentials' AND data_type = 'ARRAY') THEN
        ALTER TABLE feedback_submissions 
        ALTER COLUMN self_care_essentials TYPE TEXT USING 
          CASE 
            WHEN self_care_essentials IS NULL THEN NULL
            WHEN array_length(self_care_essentials, 1) = 0 THEN ''
            ELSE array_to_string(self_care_essentials, ', ')
          END;
    END IF;
END $$;