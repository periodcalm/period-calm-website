-- Create optimized feedback submissions table with comprehensive schema
-- This table stores all feedback data from the optimized 35-question form

CREATE TABLE IF NOT EXISTS feedback_submissions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Personal Information
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    age INTEGER,
    city VARCHAR(100),
    state VARCHAR(100),
    profession VARCHAR(200),
    
    -- Period Details
    cycle_regularity VARCHAR(50), -- Regular, Irregular, etc.
    pain_severity VARCHAR(50), -- Mild, Moderate, Severe, etc.
    what_used_before VARCHAR(100), -- Previous pain management methods
    comparison_with_other_products VARCHAR(100), -- How it compares to others
    
    -- Product Experience
    when_tried_and_timing VARCHAR(100), -- When and how they used it
    frequency_of_use VARCHAR(100), -- How often they used it
    preparation_method VARCHAR(100), -- How they prepared it
    effect_speed VARCHAR(50), -- How quickly relief came
    effect_duration VARCHAR(50), -- How long relief lasted
    overall_satisfaction INTEGER CHECK (overall_satisfaction >= 1 AND overall_satisfaction <= 5),
    taste_rating INTEGER CHECK (taste_rating >= 1 AND taste_rating <= 5),
    packaging_convenience_rating INTEGER CHECK (packaging_convenience_rating >= 1 AND packaging_convenience_rating <= 5),
    value_for_money_rating INTEGER CHECK (value_for_money_rating >= 1 AND value_for_money_rating <= 5),
    
    -- Symptoms and Benefits (JSONB for multiple selections)
    symptoms_and_benefits JSONB DEFAULT '[]'::jsonb,
    side_effects VARCHAR(100),
    flavor_preferences JSONB DEFAULT '[]'::jsonb,
    
    -- Business Insights
    price_opinion VARCHAR(100), -- Pricing feedback
    would_buy VARCHAR(50), -- Purchase intent
    recommend_to_others VARCHAR(50), -- Recommendation likelihood
    social_media_handle VARCHAR(100),
    volunteer_interest VARCHAR(50),
    campaign_face_interest VARCHAR(50),
    testimonial_permission VARCHAR(50),
    
    -- Emotional & Lifestyle Impact
    current_mood VARCHAR(50),
    happiness_factors JSONB DEFAULT '[]'::jsonb,
    confidence_boost VARCHAR(50),
    lifestyle_impact JSONB DEFAULT '[]'::jsonb,
    self_care_essentials JSONB DEFAULT '[]'::jsonb,
    
    -- Additional Feedback
    improvements TEXT,
    final_thoughts TEXT,
    
    -- Metadata
    submission_source VARCHAR(50) DEFAULT 'website',
    user_agent TEXT,
    ip_address INET,
    
    -- Indexes for better query performance
    CONSTRAINT valid_ratings CHECK (
        (overall_satisfaction IS NULL OR (overall_satisfaction >= 1 AND overall_satisfaction <= 5)) AND
        (taste_rating IS NULL OR (taste_rating >= 1 AND taste_rating <= 5)) AND
        (packaging_convenience_rating IS NULL OR (packaging_convenience_rating >= 1 AND packaging_convenience_rating <= 5)) AND
        (value_for_money_rating IS NULL OR (value_for_money_rating >= 1 AND value_for_money_rating <= 5))
    )
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_feedback_created_at ON feedback_submissions(created_at);
CREATE INDEX IF NOT EXISTS idx_feedback_email ON feedback_submissions(email);
CREATE INDEX IF NOT EXISTS idx_feedback_overall_satisfaction ON feedback_submissions(overall_satisfaction);
CREATE INDEX IF NOT EXISTS idx_feedback_would_buy ON feedback_submissions(would_buy);
CREATE INDEX IF NOT EXISTS idx_feedback_recommend_to_others ON feedback_submissions(recommend_to_others);
CREATE INDEX IF NOT EXISTS idx_feedback_city ON feedback_submissions(city);
CREATE INDEX IF NOT EXISTS idx_feedback_age ON feedback_submissions(age);
CREATE INDEX IF NOT EXISTS idx_feedback_pain_severity ON feedback_submissions(pain_severity);

-- Create GIN indexes for JSONB columns for efficient searching
CREATE INDEX IF NOT EXISTS idx_feedback_symptoms_benefits ON feedback_submissions USING GIN(symptoms_and_benefits);
CREATE INDEX IF NOT EXISTS idx_feedback_flavor_preferences ON feedback_submissions USING GIN(flavor_preferences);
CREATE INDEX IF NOT EXISTS idx_feedback_happiness_factors ON feedback_submissions USING GIN(happiness_factors);
CREATE INDEX IF NOT EXISTS idx_feedback_lifestyle_impact ON feedback_submissions USING GIN(lifestyle_impact);
CREATE INDEX IF NOT EXISTS idx_feedback_self_care_essentials ON feedback_submissions USING GIN(self_care_essentials);

-- Enable Row Level Security (RLS)
ALTER TABLE feedback_submissions ENABLE ROW LEVEL SECURITY;

-- Create policies for RLS
-- Allow anyone to insert feedback
CREATE POLICY "Allow public feedback submission" ON feedback_submissions
    FOR INSERT WITH CHECK (true);

-- Allow reading own feedback (if we implement user authentication later)
CREATE POLICY "Allow read own feedback" ON feedback_submissions
    FOR SELECT USING (true); -- For now, allow all reads. Can be restricted later

-- Create a function to automatically update the updated_at timestamp
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

-- Create analytics view for easy reporting
CREATE OR REPLACE VIEW feedback_analytics AS
SELECT 
    -- Basic counts
    COUNT(*) as total_submissions,
    COUNT(DISTINCT email) as unique_users,
    
    -- Satisfaction metrics
    AVG(overall_satisfaction) as avg_overall_satisfaction,
    AVG(taste_rating) as avg_taste_rating,
    AVG(packaging_convenience_rating) as avg_packaging_rating,
    AVG(value_for_money_rating) as avg_value_rating,
    
    -- Purchase intent
    COUNT(CASE WHEN would_buy IN ('Yes, definitely!', 'Yes, probably') THEN 1 END) as likely_to_buy,
    COUNT(CASE WHEN would_buy = 'Maybe' THEN 1 END) as maybe_to_buy,
    COUNT(CASE WHEN would_buy IN ('No, probably not', 'No, definitely not') THEN 1 END) as unlikely_to_buy,
    
    -- Recommendation metrics
    COUNT(CASE WHEN recommend_to_others IN ('Yes, definitely!', 'Yes, probably') THEN 1 END) as likely_to_recommend,
    COUNT(CASE WHEN recommend_to_others = 'Maybe' THEN 1 END) as maybe_recommend,
    COUNT(CASE WHEN recommend_to_others IN ('No, probably not', 'No, definitely not') THEN 1 END) as unlikely_to_recommend,
    
    -- Pain severity distribution
    COUNT(CASE WHEN pain_severity = 'Mild - manageable' THEN 1 END) as mild_pain_users,
    COUNT(CASE WHEN pain_severity = 'Moderate - affects daily life' THEN 1 END) as moderate_pain_users,
    COUNT(CASE WHEN pain_severity = 'Severe - debilitating' THEN 1 END) as severe_pain_users,
    COUNT(CASE WHEN pain_severity = 'Very severe - bed rest needed' THEN 1 END) as very_severe_pain_users,
    
    -- Age distribution
    AVG(age) as avg_age,
    COUNT(CASE WHEN age < 25 THEN 1 END) as under_25,
    COUNT(CASE WHEN age >= 25 AND age < 35 THEN 1 END) as age_25_34,
    COUNT(CASE WHEN age >= 35 AND age < 45 THEN 1 END) as age_35_44,
    COUNT(CASE WHEN age >= 45 THEN 1 END) as over_45,
    
    -- Effect metrics
    COUNT(CASE WHEN effect_speed = 'Within 15 minutes' THEN 1 END) as very_fast_relief,
    COUNT(CASE WHEN effect_speed IN ('15-30 minutes', '30-60 minutes') THEN 1 END) as fast_relief,
    COUNT(CASE WHEN effect_speed IN ('1-2 hours', 'More than 2 hours') THEN 1 END) as slow_relief,
    COUNT(CASE WHEN effect_speed = 'No relief' THEN 1 END) as no_relief,
    
    -- Side effects
    COUNT(CASE WHEN side_effects = 'None' THEN 1 END) as no_side_effects,
    COUNT(CASE WHEN side_effects != 'None' AND side_effects IS NOT NULL THEN 1 END) as with_side_effects,
    
    -- Community engagement
    COUNT(CASE WHEN volunteer_interest IN ('Yes, I\'m interested!', 'Maybe, tell me more') THEN 1 END) as volunteer_interested,
    COUNT(CASE WHEN campaign_face_interest IN ('Yes, I\'d love to!', 'Maybe, I\'m interested') THEN 1 END) as campaign_interested,
    COUNT(CASE WHEN testimonial_permission IN ('Yes, with my name', 'Yes, anonymously') THEN 1 END) as testimonial_permitted,
    
    -- Recent activity
    COUNT(CASE WHEN created_at >= NOW() - INTERVAL '7 days' THEN 1 END) as submissions_last_7_days,
    COUNT(CASE WHEN created_at >= NOW() - INTERVAL '30 days' THEN 1 END) as submissions_last_30_days
    
FROM feedback_submissions;

-- Create a function to get popular symptoms and benefits
CREATE OR REPLACE FUNCTION get_popular_symptoms_benefits()
RETURNS TABLE(symptom_benefit TEXT, count BIGINT) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        jsonb_array_elements_text(symptoms_and_benefits) as symptom_benefit,
        COUNT(*) as count
    FROM feedback_submissions
    WHERE symptoms_and_benefits IS NOT NULL AND jsonb_array_length(symptoms_and_benefits) > 0
    GROUP BY jsonb_array_elements_text(symptoms_and_benefits)
    ORDER BY count DESC;
END;
$$ LANGUAGE plpgsql;

-- Create a function to get popular flavor preferences
CREATE OR REPLACE FUNCTION get_popular_flavor_preferences()
RETURNS TABLE(flavor TEXT, count BIGINT) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        jsonb_array_elements_text(flavor_preferences) as flavor,
        COUNT(*) as count
    FROM feedback_submissions
    WHERE flavor_preferences IS NOT NULL AND jsonb_array_length(flavor_preferences) > 0
    GROUP BY jsonb_array_elements_text(flavor_preferences)
    ORDER BY count DESC;
END;
$$ LANGUAGE plpgsql;

-- Insert some sample data for testing
INSERT INTO feedback_submissions (
    first_name, last_name, email, phone, age, city, state, profession,
    cycle_regularity, pain_severity, what_used_before, comparison_with_other_products,
    when_tried_and_timing, frequency_of_use, preparation_method, effect_speed, effect_duration,
    overall_satisfaction, taste_rating, packaging_convenience_rating, value_for_money_rating,
    symptoms_and_benefits, side_effects, flavor_preferences,
    price_opinion, would_buy, recommend_to_others, social_media_handle,
    volunteer_interest, campaign_face_interest, testimonial_permission,
    current_mood, happiness_factors, confidence_boost, lifestyle_impact, self_care_essentials,
    improvements, final_thoughts
) VALUES 
(
    'Priya', 'Sharma', 'priya.sharma@email.com', '+91 98765 43210', 28, 'Mumbai', 'Maharashtra', 'Software Engineer',
    'Regular (28-32 days)', 'Moderate - affects daily life', 'Painkillers (Paracetamol/Ibuprofen)', 'Better than most',
    'When cramps began', 'Multiple times per period', 'Mixed with hot water', '30-60 minutes', '4-6 hours',
    4, 4, 4, 4,
    '["Lower abdominal cramps", "Back pain", "Better sleep", "Energy boost"]'::jsonb, 'None',
    '["Current: 4★ - Very good", "Future: Honey & Ginger", "Future: Chamomile & Lavender"]'::jsonb,
    'Reasonable (₹70)', 'Yes, probably', 'Yes, probably', '@priya_sharma',
    'Yes, I\'m interested!', 'Maybe, I\'m interested', 'Yes, anonymously',
    'Happy and energetic', '["Comfort food", "Rest and relaxation", "Music"]'::jsonb, 'Yes, somewhat',
    '["Could work normally", "Better sleep quality", "Less stress"]'::jsonb, '["Hot water bottle", "Comfortable clothes", "Rest"]'::jsonb,
    'Maybe add more flavor options', 'Really helped with my period pain!'
),
(
    'Anjali', 'Patel', 'anjali.patel@email.com', '+91 87654 32109', 32, 'Delhi', 'Delhi', 'Marketing Manager',
    'Regular (28-32 days)', 'Severe - debilitating', 'Hot water bottle', 'Much better than others',
    'Before period started', 'Multiple times per period', 'Mixed with milk', '15-30 minutes', '6-8 hours',
    5, 5, 5, 5,
    '["Lower abdominal cramps", "Headaches", "Mood swings", "Better focus", "Reduced anxiety"]'::jsonb, 'None',
    '["Current: 5★ - Loved it!", "Future: Mint & Lemon", "Future: Rose & Saffron"]'::jsonb,
    'Very affordable (₹55)', 'Yes, definitely!', 'Yes, definitely!', '@anjali_patel',
    'Yes, I\'m interested!', 'Yes, I\'d love to!', 'Yes, with my name',
    'Happy and energetic', '["Exercise", "Talking to friends", "Self-care rituals"]'::jsonb, 'Yes, significantly',
    '["Could exercise", "More confident", "Better mood", "Could socialize"]'::jsonb, '["Exercise", "Healthy food", "Meditation"]'::jsonb,
    'Perfect as it is!', 'Life-changing product!'
),
(
    'Meera', 'Kumar', 'meera.kumar@email.com', '+91 76543 21098', 25, 'Bangalore', 'Karnataka', 'Student',
    'Irregular', 'Mild - manageable', 'Exercise', 'About the same',
    'During period', 'Once per period', 'As directed on package', '1-2 hours', '2-4 hours',
    3, 3, 4, 3,
    '["Bloating", "Fatigue"]'::jsonb, 'Mild nausea',
    '["Current: 3★ - Good", "Future: Cinnamon & Cardamom"]'::jsonb,
    'Acceptable (₹90)', 'Maybe', 'Maybe', '@meera_kumar',
    'Not right now', 'Not comfortable', 'No, keep it private',
    'Neutral', '["Reading", "Music"]'::jsonb, 'A little bit',
    '["Could work normally"]'::jsonb, '["Reading", "Music"]'::jsonb,
    'Could be more affordable', 'It was okay, might try again'
);

-- Grant necessary permissions
GRANT ALL ON feedback_submissions TO authenticated;
GRANT ALL ON feedback_submissions TO anon;
GRANT SELECT ON feedback_analytics TO authenticated;
GRANT SELECT ON feedback_analytics TO anon;
GRANT EXECUTE ON FUNCTION get_popular_symptoms_benefits() TO authenticated;
GRANT EXECUTE ON FUNCTION get_popular_symptoms_benefits() TO anon;
GRANT EXECUTE ON FUNCTION get_popular_flavor_preferences() TO authenticated;
GRANT EXECUTE ON FUNCTION get_popular_flavor_preferences() TO anon; 