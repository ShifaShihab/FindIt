/*
  # FindIt Lost and Found Management System - Database Schema

  ## Overview
  This migration creates the complete database schema for the FindIt application,
  including user management, item tracking, and category organization.

  ## New Tables

  ### 1. `profiles`
  Extends Supabase auth.users with additional user information
  - `id` (uuid, primary key, references auth.users)
  - `email` (text, unique, not null)
  - `full_name` (text)
  - `phone` (text)
  - `is_admin` (boolean, default false)
  - `created_at` (timestamptz, default now())
  - `updated_at` (timestamptz, default now())

  ### 2. `categories`
  Item categories for classification
  - `id` (uuid, primary key)
  - `name` (text, unique, not null)
  - `description` (text)
  - `created_at` (timestamptz, default now())

  ### 3. `items`
  Lost and found items
  - `id` (uuid, primary key)
  - `user_id` (uuid, references profiles)
  - `category_id` (uuid, references categories)
  - `type` (text, 'lost' or 'found')
  - `title` (text, not null)
  - `description` (text, not null)
  - `location` (text, not null)
  - `date_reported` (date, not null)
  - `status` (text, 'open', 'matched', 'closed', default 'open')
  - `image_url` (text)
  - `contact_info` (text)
  - `created_at` (timestamptz, default now())
  - `updated_at` (timestamptz, default now())

  ## Security

  ### Row Level Security (RLS)
  - All tables have RLS enabled
  - Users can read all items
  - Users can only create/update/delete their own items
  - Admins have full access to all records
  - Public read access to categories

  ## Policies

  ### profiles table
  1. Users can view all profiles (for contact purposes)
  2. Users can insert their own profile
  3. Users can update their own profile
  4. Admins can update any profile

  ### categories table
  1. Anyone can view categories
  2. Only admins can create categories
  3. Only admins can update categories
  4. Only admins can delete categories

  ### items table
  1. Anyone can view all items (public search)
  2. Authenticated users can create items
  3. Users can update their own items
  4. Users can delete their own items
  5. Admins can update any item
  6. Admins can delete any item
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  full_name text,
  phone text,
  is_admin boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  description text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Create items table
CREATE TABLE IF NOT EXISTS items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  category_id uuid REFERENCES categories(id) ON DELETE SET NULL,
  type text NOT NULL CHECK (type IN ('lost', 'found')),
  title text NOT NULL,
  description text NOT NULL,
  location text NOT NULL,
  date_reported date NOT NULL DEFAULT CURRENT_DATE,
  status text DEFAULT 'open' CHECK (status IN ('open', 'matched', 'closed')),
  image_url text,
  contact_info text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE items ENABLE ROW LEVEL SECURITY;

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_items_user_id ON items(user_id);
CREATE INDEX IF NOT EXISTS idx_items_category_id ON items(category_id);
CREATE INDEX IF NOT EXISTS idx_items_type ON items(type);
CREATE INDEX IF NOT EXISTS idx_items_status ON items(status);
CREATE INDEX IF NOT EXISTS idx_items_date_reported ON items(date_reported DESC);

-- Profiles policies
CREATE POLICY "Users can view all profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Admins can update any profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

-- Categories policies
CREATE POLICY "Anyone can view categories"
  ON categories FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can create categories"
  ON categories FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

CREATE POLICY "Admins can update categories"
  ON categories FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

CREATE POLICY "Admins can delete categories"
  ON categories FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

-- Items policies
CREATE POLICY "Anyone can view items"
  ON items FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can create items"
  ON items FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own items"
  ON items FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own items"
  ON items FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can update any item"
  ON items FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

CREATE POLICY "Admins can delete any item"
  ON items FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

-- Insert default categories
INSERT INTO categories (name, description) VALUES
  ('Electronics', 'Phones, laptops, tablets, and other electronic devices'),
  ('Personal Items', 'Wallets, bags, keys, and personal belongings'),
  ('Documents', 'IDs, passports, certificates, and important papers'),
  ('Clothing', 'Jackets, shoes, hats, and other clothing items'),
  ('Accessories', 'Jewelry, watches, glasses, and accessories'),
  ('Books & Stationery', 'Books, notebooks, pens, and stationery items'),
  ('Sports Equipment', 'Sports gear, gym equipment, and athletic items'),
  ('Other', 'Items that don''t fit other categories')
ON CONFLICT (name) DO NOTHING;

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_items_updated_at ON items;
CREATE TRIGGER update_items_updated_at
  BEFORE UPDATE ON items
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
