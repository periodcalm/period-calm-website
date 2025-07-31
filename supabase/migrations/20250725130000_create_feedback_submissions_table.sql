-- Create feedback_submissions table for structured feedback collection
CREATE TABLE IF NOT EXISTS feedback_submissions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    
    -- Basic Information
    first_name TEXT,
    last_name TEXT,
    age TEXT,
    email TEXT,
    phone TEXT,
    city TEXT,
    state TEXT,
    instagram TEXT,
    
    -- Period & Health Information
    cycle_length TEXT,
    last_period_date TEXT,
    period_regularity TEXT,
    previous_pain_management TEXT,
    pain_severity TEXT,
    
    -- Product Experience
    when_tried TEXT,
    effect_speed TEXT,
    overall_satisfaction INTEGER CHECK (overall_satisfaction >= 1 AND overall_satisfaction <= 5),
    would_drink_again TEXT,
    benefits_experienced TEXT[],
    side_effects TEXT,
    taste_rating INTEGER CHECK (taste_rating >= 1 AND taste_rating <= 5),
    value_rating INTEGER CHECK (value_rating >= 1 AND value_rating <= 5),
    packaging_rating INTEGER CHECK (packaging_rating >= 1 AND packaging_rating <= 5),
    convenience_rating TEXT,
    
    -- Usage Details
    timing_of_use TEXT,
    frequency_of_use TEXT,
    
    -- Lifestyle & Emotional Impact
    lifestyle_impact TEXT[],
    self_care_essentials TEXT[],
    current_feeling TEXT,
    confidence_boost TEXT,
    
    -- Community & Engagement
    face_and_soul_campaign TEXT,
    community_interest TEXT,
    volunteer_interest TEXT,
    testimonial_permission TEXT,
    
    -- Feedback & Recommendations
    improvements TEXT,
    would_recommend TEXT,
    price_feedback TEXT,
    final_thoughts TEXT,
    
    -- Legacy fields (for backward compatibility)
    when_drank TEXT,
    effect_within_30min TEXT,
    rating INTEGER,
    fair_price TEXT,
    
    -- Metadata
    source TEXT DEFAULT 'structured_feedback',
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_feedback_submissions_email ON feedback_submissions(email);
CREATE INDEX IF NOT EXISTS idx_feedback_submissions_submitted_at ON feedback_submissions(submitted_at);
CREATE INDEX IF NOT EXISTS idx_feedback_submissions_source ON feedback_submissions(source);
CREATE INDEX IF NOT EXISTS idx_feedback_submissions_satisfaction ON feedback_submissions(overall_satisfaction);

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_feedback_submissions_updated_at 
    BEFORE UPDATE ON feedback_submissions 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE feedback_submissions ENABLE ROW LEVEL SECURITY;

-- Create policies for feedback submissions
-- Allow anyone to insert feedback (public feedback form)
CREATE POLICY "Allow public feedback submission" ON feedback_submissions
    FOR INSERT WITH CHECK (true);

-- Allow users to view their own feedback (if they provide email)
CREATE POLICY "Allow users to view own feedback" ON feedback_submissions
    FOR SELECT USING (email = current_setting('request.jwt.claims', true)::json->>'email');

-- Allow admins to view all feedback
CREATE POLICY "Allow admins to view all feedback" ON feedback_submissions
    FOR ALL USING (
        current_setting('request.jwt.claims', true)::json->>'role' = 'admin'
    );

-- Create a view for feedback analytics
CREATE OR REPLACE VIEW feedback_analytics AS
SELECT 
    DATE_TRUNC('day', submitted_at) as date,
    COUNT(*) as total_submissions,
    AVG(overall_satisfaction) as avg_satisfaction,
    AVG(taste_rating) as avg_taste,
    AVG(value_rating) as avg_value,
    AVG(packaging_rating) as avg_packaging,
    COUNT(CASE WHEN would_recommend LIKE '%definitely%' THEN 1 END) as would_recommend_count,
    COUNT(CASE WHEN would_drink_again LIKE '%definitely%' OR would_drink_again LIKE '%probably%' THEN 1 END) as would_drink_again_count
FROM feedback_submissions 
WHERE submitted_at >= NOW() - INTERVAL '30 days'
GROUP BY DATE_TRUNC('day', submitted_at)
ORDER BY date DESC; 