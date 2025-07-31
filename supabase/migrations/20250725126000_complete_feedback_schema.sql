-- Complete feedback_submissions table schema to match form data
-- This migration ensures all required columns exist with correct types

-- Add all missing columns that the form needs
ALTER TABLE feedback_submissions 
ADD COLUMN IF NOT EXISTS first_name TEXT,
ADD COLUMN IF NOT EXISTS last_name TEXT,
ADD COLUMN IF NOT EXISTS age TEXT,
ADD COLUMN IF NOT EXISTS email TEXT,
ADD COLUMN IF NOT EXISTS phone TEXT,
ADD COLUMN IF NOT EXISTS city TEXT,
ADD COLUMN IF NOT EXISTS state TEXT,
ADD COLUMN IF NOT EXISTS instagram TEXT,
ADD COLUMN IF NOT EXISTS cycle_length TEXT,
ADD COLUMN IF NOT EXISTS last_period_date TEXT,
ADD COLUMN IF NOT EXISTS period_regularity TEXT,
ADD COLUMN IF NOT EXISTS previous_pain_management TEXT,
ADD COLUMN IF NOT EXISTS pain_severity TEXT,
ADD COLUMN IF NOT EXISTS when_tried TEXT,
ADD COLUMN IF NOT EXISTS timing_of_use TEXT,
ADD COLUMN IF NOT EXISTS frequency_of_use TEXT,
ADD COLUMN IF NOT EXISTS preparation_method TEXT,
ADD COLUMN IF NOT EXISTS effect_speed TEXT,
ADD COLUMN IF NOT EXISTS overall_satisfaction INTEGER,
ADD COLUMN IF NOT EXISTS would_drink_again TEXT,
ADD COLUMN IF NOT EXISTS benefits_experienced TEXT,
ADD COLUMN IF NOT EXISTS side_effects TEXT,
ADD COLUMN IF NOT EXISTS taste_rating INTEGER,
ADD COLUMN IF NOT EXISTS value_rating INTEGER,
ADD COLUMN IF NOT EXISTS packaging_rating INTEGER,
ADD COLUMN IF NOT EXISTS convenience_rating TEXT,
ADD COLUMN IF NOT EXISTS storage_experience TEXT,
ADD COLUMN IF NOT EXISTS dosage_followed TEXT,
ADD COLUMN IF NOT EXISTS budget_range TEXT,
ADD COLUMN IF NOT EXISTS price_points TEXT,
ADD COLUMN IF NOT EXISTS purchase_intent TEXT,
ADD COLUMN IF NOT EXISTS lifestyle_impact TEXT,
ADD COLUMN IF NOT EXISTS self_care_essentials TEXT,
ADD COLUMN IF NOT EXISTS current_feeling TEXT,
ADD COLUMN IF NOT EXISTS confidence_boost TEXT,
ADD COLUMN IF NOT EXISTS face_and_soul_campaign TEXT,
ADD COLUMN IF NOT EXISTS community_interest TEXT,
ADD COLUMN IF NOT EXISTS volunteer_interest TEXT,
ADD COLUMN IF NOT EXISTS testimonial_permission TEXT,
ADD COLUMN IF NOT EXISTS improvements TEXT,
ADD COLUMN IF NOT EXISTS would_recommend TEXT,
ADD COLUMN IF NOT EXISTS price_feedback TEXT,
ADD COLUMN IF NOT EXISTS final_thoughts TEXT,
ADD COLUMN IF NOT EXISTS submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS source TEXT DEFAULT 'structured_feedback';

-- Add constraints for rating columns
DO $$
BEGIN
    -- Add check constraints for rating columns if they don't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.check_constraints WHERE constraint_name = 'feedback_submissions_overall_satisfaction_check') THEN
        ALTER TABLE feedback_submissions ADD CONSTRAINT feedback_submissions_overall_satisfaction_check 
        CHECK (overall_satisfaction >= 1 AND overall_satisfaction <= 5);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.check_constraints WHERE constraint_name = 'feedback_submissions_taste_rating_check') THEN
        ALTER TABLE feedback_submissions ADD CONSTRAINT feedback_submissions_taste_rating_check 
        CHECK (taste_rating >= 1 AND taste_rating <= 5);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.check_constraints WHERE constraint_name = 'feedback_submissions_value_rating_check') THEN
        ALTER TABLE feedback_submissions ADD CONSTRAINT feedback_submissions_value_rating_check 
        CHECK (value_rating >= 1 AND value_rating <= 5);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.check_constraints WHERE constraint_name = 'feedback_submissions_packaging_rating_check') THEN
        ALTER TABLE feedback_submissions ADD CONSTRAINT feedback_submissions_packaging_rating_check 
        CHECK (packaging_rating >= 1 AND packaging_rating <= 5);
    END IF;
END $$;