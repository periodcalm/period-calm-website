-- Allow admins to select all profiles using JWT claim
CREATE POLICY "Allow admins to read all profiles via JWT"
ON profiles
FOR SELECT
USING (auth.jwt() ->> 'role' = 'ADMIN'); 