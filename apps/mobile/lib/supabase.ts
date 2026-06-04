import 'react-native-url-polyfill/auto';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient, processLock } from '@supabase/supabase-js';
import { AppState, Platform } from 'react-native';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabasePublishableKey = process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

function hasUsableSupabaseValue(value: string | undefined, placeholder: string) {
  return Boolean(value && value.trim() && value !== placeholder && !value.includes('your-project-ref') && !value.includes('your_key_here'));
}

export const hasSupabaseConfig =
  hasUsableSupabaseValue(supabaseUrl, 'https://your-project-ref.supabase.co') &&
  hasUsableSupabaseValue(supabasePublishableKey, 'sb_publishable_your_key_here');

export const supabase = hasSupabaseConfig
  ? createClient(supabaseUrl as string, supabasePublishableKey as string, {
      auth: {
        ...(Platform.OS !== 'web' ? { storage: AsyncStorage } : {}),
        autoRefreshToken: true,
        detectSessionInUrl: false,
        lock: processLock,
        persistSession: true,
      },
    })
  : null;

if (Platform.OS !== 'web' && supabase) {
  AppState.addEventListener('change', (state) => {
    if (state === 'active') {
      supabase.auth.startAutoRefresh();
    } else {
      supabase.auth.stopAutoRefresh();
    }
  });
}
