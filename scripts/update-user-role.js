const { createClient } = require('@supabase/supabase-js');

// Your actual Supabase project URL and service role key
const SUPABASE_URL = 'https://edgzhwizsoekokurqsqx.supabase.co';
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVkZ3pod2l6c29la29rdXJxc3F4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MzA5NjA1MSwiZXhwIjoyMDY4NjcyMDUxfQ.o_lrvA7p7K__oJ7VV4yxzdsHBUSnYG_NuCNHnRLDb3U';

// The user's email and the role you want to set
const userEmail = 'testuser@gmail.com';
const newRole = 'USER';

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

async function updateUserRoleByEmail(email, role) {
  // 1. Find the user by email
  const { data: users, error: findError } = await supabase.auth.admin.listUsers();
  if (findError) throw findError;

  const user = users.users.find(u => u.email === email);
  if (!user) {
    console.error('User not found:', email);
    return;
  }

  // 2. Update the user_metadata (raw_user_meta_data)
  const { data, error } = await supabase.auth.admin.updateUserById(user.id, {
    user_metadata: { ...user.user_metadata, role }
  });

  if (error) {
    console.error('Error updating user:', error);
  } else {
    console.log(`Successfully updated ${email} to role: ${role}`);
  }
}

updateUserRoleByEmail(userEmail, newRole)
  .catch(console.error); 