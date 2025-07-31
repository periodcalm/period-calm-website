-- Create feedback_submissions table
CREATE TABLE IF NOT EXISTS feedback_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  age TEXT,
  email TEXT NOT NULL,
  phone TEXT,
  city TEXT,
  state TEXT,
  instagram TEXT,
  cycle_length TEXT,
  last_period_date TEXT,
  period_regularity TEXT,
  previous_pain_management TEXT,
  pain_severity TEXT,
  when_tried TEXT,
  timing_of_use TEXT,
  frequency_of_use TEXT,
  preparation_method TEXT,
  effect_speed TEXT,
  overall_satisfaction INTEGER,
  would_drink_again TEXT,
  benefits_experienced TEXT[],
  side_effects TEXT,
  taste_rating INTEGER,
  value_rating INTEGER,
  packaging_rating INTEGER,
  convenience_rating TEXT,
  storage_experience TEXT,
  dosage_followed TEXT,
  budget_range TEXT,
  price_points TEXT,
  purchase_intent TEXT,
  lifestyle_impact TEXT[],
  self_care_essentials TEXT[],
  current_feeling TEXT,
  confidence_boost TEXT,
  face_and_soul_campaign TEXT,
  community_interest TEXT,
  volunteer_interest TEXT,
  testimonial_permission TEXT,
  improvements TEXT,
  would_recommend TEXT,
  price_feedback TEXT,
  final_thoughts TEXT,
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  source TEXT DEFAULT 'website',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE feedback_submissions ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations (for now, we can restrict later)
CREATE POLICY "Allow all operations on feedback_submissions" ON feedback_submissions
  FOR ALL USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_feedback_submissions_email ON feedback_submissions(email);
CREATE INDEX IF NOT EXISTS idx_feedback_submissions_submitted_at ON feedback_submissions(submitted_at);
CREATE INDEX IF NOT EXISTS idx_feedback_submissions_overall_satisfaction ON feedback_submissions(overall_satisfaction); 