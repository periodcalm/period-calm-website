-- Drop existing table if it exists
DROP TABLE IF EXISTS feedback_submissions CASCADE;

-- Create a clean, simple feedback_submissions table
CREATE TABLE feedback_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- Basic Information
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  age TEXT,
  phone TEXT,
  city TEXT,
  state TEXT,
  
  -- Period Information
  cycle_length TEXT,
  last_period_date TEXT,
  period_regularity TEXT,
  pain_severity TEXT,
  previous_pain_management TEXT,
  
  -- Product Experience
  when_tried TEXT,
  timing_of_use TEXT,
  frequency_of_use TEXT,
  preparation_method TEXT,
  effect_speed TEXT,
  
  -- Ratings (all as integers)
  overall_satisfaction INTEGER DEFAULT 0,
  taste_rating INTEGER DEFAULT 0,
  value_rating INTEGER DEFAULT 0,
  packaging_rating INTEGER DEFAULT 0,
  
  -- Experience Details
  would_drink_again TEXT,
  would_recommend TEXT,
  side_effects TEXT,
  convenience_rating TEXT,
  storage_experience TEXT,
  dosage_followed TEXT,
  
  -- Benefits and Impact (as JSON arrays)
  benefits_experienced JSONB DEFAULT '[]',
  lifestyle_impact JSONB DEFAULT '[]',
  self_care_essentials JSONB DEFAULT '[]',
  
  -- Pricing and Purchase
  budget_range TEXT,
  price_points TEXT,
  purchase_intent TEXT,
  
  -- Community and Engagement
  current_feeling TEXT,
  confidence_boost TEXT,
  face_and_soul_campaign TEXT,
  community_interest TEXT,
  volunteer_interest TEXT,
  testimonial_permission TEXT,
  
  -- Feedback
  improvements TEXT,
  price_feedback TEXT,
  final_thoughts TEXT,
  
  -- Metadata
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  source TEXT DEFAULT 'website',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE feedback_submissions ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations (for now)
CREATE POLICY "Allow all operations on feedback_submissions" ON feedback_submissions
  FOR ALL USING (true);

-- Create indexes for better performance
CREATE INDEX idx_feedback_submissions_email ON feedback_submissions(email);
CREATE INDEX idx_feedback_submissions_submitted_at ON feedback_submissions(submitted_at);
CREATE INDEX idx_feedback_submissions_overall_satisfaction ON feedback_submissions(overall_satisfaction);
CREATE INDEX idx_feedback_submissions_testimonial_permission ON feedback_submissions(testimonial_permission);

-- Insert some test data
INSERT INTO feedback_submissions (
  first_name, last_name, email, age, city, 
  overall_satisfaction, taste_rating, value_rating, packaging_rating,
  benefits_experienced, lifestyle_impact, testimonial_permission,
  would_recommend, final_thoughts
) VALUES 
(
  'Sarah', 'Johnson', 'sarah@example.com', '28', 'Mumbai',
  5, 5, 5, 5,
  '["Cramp relief", "Mood improvement"]',
  '["Could work normally", "Could exercise"]',
  'Yes, with my name',
  'Yes, definitely!',
  'Life-changing relief! I\'ve tried everything for my period pain, but nothing worked like Period Calm. Within 20 minutes, my cramps were completely gone.'
),
(
  'Priya', 'Sharma', 'priya@example.com', '25', 'Delhi',
  5, 4, 5, 4,
  '["Cramp relief", "Better sleep"]',
  '["Could work normally"]',
  'Yes, with my name',
  'Yes, definitely!',
  'Amazing product! No more cramps and mood swings. It\'s now a must-have in my monthly routine.'
),
(
  'Maria', 'Kumar', 'maria@example.com', '30', 'Bangalore',
  4, 5, 4, 5,
  '["Mood improvement"]',
  '["Could exercise"]',
  'Yes, with my name',
  'Yes, probably',
  'Finally found something that actually works! The taste is great and it helps with my mood during periods.'
);

-- Verify the data
SELECT 
  COUNT(*) as total_submissions,
  AVG(overall_satisfaction) as avg_satisfaction,
  COUNT(CASE WHEN would_recommend LIKE '%definitely%' OR would_recommend LIKE '%yes%' THEN 1 END) as would_recommend_count
FROM feedback_submissions; 