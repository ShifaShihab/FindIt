import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  phone: string | null;
  is_admin: boolean;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
}

export interface Item {
  id: string;
  user_id: string;
  category_id: string | null;
  type: 'lost' | 'found';
  title: string;
  description: string;
  location: string;
  date_reported: string;
  status: 'open' | 'matched' | 'closed';
  image_url: string | null;
  contact_info: string | null;
  created_at: string;
  updated_at: string;
  profiles?: Profile;
  categories?: Category;
}
