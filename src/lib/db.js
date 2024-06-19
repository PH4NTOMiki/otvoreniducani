import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_KEY } from '$env/static/public';
import { createClient } from '@supabase/supabase-js';
export const db = createClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_KEY);