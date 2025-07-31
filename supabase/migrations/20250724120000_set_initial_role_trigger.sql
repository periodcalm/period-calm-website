-- Add 'role' column if it does not exist
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS role text DEFAULT 'USER';

-- Function to set initial role
CREATE OR REPLACE FUNCTION set_initial_role()
RETURNS trigger AS $$
BEGIN
  -- If this is the first profile, make it ADMIN
  IF (SELECT count(*) FROM profiles) = 0 THEN
    NEW.role := 'ADMIN';
  ELSE
    NEW.role := 'USER';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop trigger if it exists
DROP TRIGGER IF EXISTS set_initial_role_trigger ON profiles;

-- Create trigger to run before insert
CREATE TRIGGER set_initial_role_trigger
BEFORE INSERT ON profiles
FOR EACH ROW
EXECUTE PROCEDURE set_initial_role(); 