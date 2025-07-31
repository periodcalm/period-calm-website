-- Enable Row Level Security on profiles table
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Allow users to select their own profile
CREATE POLICY "Allow users to read their own profile"
ON profiles
FOR SELECT
USING (auth.uid() = id);

-- Allow admins to select all profiles
CREATE POLICY "Allow admins to read all profiles"
ON profiles
FOR SELECT
USING (EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'ADMIN')); 