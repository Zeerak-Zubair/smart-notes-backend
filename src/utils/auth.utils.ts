import { supabase } from '../config/supabase';

export async function getAuthenticatedUser(token: string): Promise<string | null> {
  try {
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      console.error('[getAuthenticatedUser] Error fetching user:', error);
      return null;
    }

    return user.id;
  } catch (error) {
    console.error('[getAuthenticatedUser] Unexpected error:', error);
    return null;
  }
}
