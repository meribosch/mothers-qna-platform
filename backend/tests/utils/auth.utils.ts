import { supabase } from '../../src/services/supabase';

export const createTestUser = async () => {
  const testEmail = `test-${Date.now()}@example.com`;
  const testPassword = 'Test123!@#';

  const { data: { user }, error } = await supabase.auth.signUp({
    email: testEmail,
    password: testPassword
  });

  if (error) throw error;

  return {
    user,
    email: testEmail,
    password: testPassword
  };
};

export const loginTestUser = async (email: string, password: string) => {
  const { data: { session }, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) throw error;

  return session;
};

export const deleteTestUser = async (userId: string) => {
  // Note: This requires admin access. You might need to handle this manually
  // or keep track of test users to clean up later
  const { error } = await supabase.auth.admin.deleteUser(userId);
  return { error };
}; 