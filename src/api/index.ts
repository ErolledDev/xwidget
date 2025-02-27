import { supabase } from '../lib/supabase';

// API handler for widget settings
export async function getWidgetSettings(uid: string) {
  try {
    const { data, error } = await supabase
      .from('widget_settings')
      .select('*')
      .eq('user_id', uid)
      .single();
      
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching widget settings:', error);
    throw error;
  }
}

// API handler for auto replies
export async function getAutoReplies(uid: string) {
  try {
    const { data, error } = await supabase
      .from('auto_replies')
      .select('*')
      .eq('user_id', uid);
      
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching auto replies:', error);
    throw error;
  }
}