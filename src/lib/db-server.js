import { PUBLIC_SUPABASE_URL } from '$env/static/public';
import { SUPABASE_PRIVATE_KEY } from '$env/static/private';
import { createClient } from '@supabase/supabase-js';

export const db = createClient(PUBLIC_SUPABASE_URL, SUPABASE_PRIVATE_KEY);