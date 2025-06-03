import { supabase } from '../supabase';
import { Database } from '../database.types';

type Profile = Database['public']['Tables']['user_profiles']['Row'];
type ProfileUpdate = Database['public']['Tables']['user_profiles']['Update'];

export const profilesApi = {
  async getProfile(userId: string) {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) throw error;
    return data as Profile;
  },

  async updateProfile(userId: string, profile: ProfileUpdate) {
    const { data, error } = await supabase
      .from('user_profiles')
      .update(profile)
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    return data as Profile;
  },

  async createProfile(profile: Profile) {
    const { data, error } = await supabase
      .from('user_profiles')
      .insert(profile)
      .select()
      .single();

    if (error) throw error;
    return data as Profile;
  },
}; 