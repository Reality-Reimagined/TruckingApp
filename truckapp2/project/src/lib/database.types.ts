export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          created_at: string
          email: string
          full_name: string
          company_name: string
          phone: string
          role: 'admin' | 'driver' | 'dispatcher'
        }
        Insert: {
          id: string
          created_at?: string
          email: string
          full_name: string
          company_name: string
          phone: string
          role: 'admin' | 'driver' | 'dispatcher'
        }
        Update: {
          id?: string
          created_at?: string
          email?: string
          full_name?: string
          company_name?: string
          phone?: string
          role?: 'admin' | 'driver' | 'dispatcher'
        }
      }
      vehicles: {
        Row: {
          id: string
          created_at: string
          number: string
          type: string
          status: 'active' | 'maintenance' | 'inactive'
          driver_id: string
          last_maintenance: string
          next_maintenance: string
          location: string
        }
        Insert: {
          id?: string
          created_at?: string
          number: string
          type: string
          status: 'active' | 'maintenance' | 'inactive'
          driver_id: string
          last_maintenance: string
          next_maintenance: string
          location: string
        }
        Update: {
          id?: string
          created_at?: string
          number?: string
          type?: string
          status?: 'active' | 'maintenance' | 'inactive'
          driver_id?: string
          last_maintenance?: string
          next_maintenance?: string
          location?: string
        }
      }
      loads: {
        Row: {
          id: string
          created_at: string
          origin: string
          destination: string
          pickup_date: string
          delivery_date: string
          status: 'available' | 'assigned' | 'in_transit' | 'delivered'
          rate: number
          vehicle_id: string | null
          driver_id: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          origin: string
          destination: string
          pickup_date: string
          delivery_date: string
          status: 'available' | 'assigned' | 'in_transit' | 'delivered'
          rate: number
          vehicle_id?: string | null
          driver_id?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          origin?: string
          destination?: string
          pickup_date?: string
          delivery_date?: string
          status?: 'available' | 'assigned' | 'in_transit' | 'delivered'
          rate?: number
          vehicle_id?: string | null
          driver_id?: string | null
        }
      }
    }
  }
}</content>
<boltAction type="file" filePath="supabase/migrations/20240325000000_initial_schema.sql">-- Create profiles table
CREATE TABLE profiles (
    id UUID REFERENCES auth.users ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    company_name TEXT,
    phone TEXT,
    role TEXT CHECK (role IN ('admin', 'driver', 'dispatcher')),
    PRIMARY KEY (id)
);

-- Create vehicles table
CREATE TABLE vehicles (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    number TEXT UNIQUE NOT NULL,
    type TEXT NOT NULL,
    status TEXT CHECK (status IN ('active', 'maintenance', 'inactive')) DEFAULT 'active',
    driver_id UUID REFERENCES profiles(id),
    last_maintenance TIMESTAMPTZ NOT NULL,
    next_maintenance TIMESTAMPTZ NOT NULL,
    location TEXT
);

-- Create loads table
CREATE TABLE loads (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    origin TEXT NOT NULL,
    destination TEXT NOT NULL,
    pickup_date TIMESTAMPTZ NOT NULL,
    delivery_date TIMESTAMPTZ NOT NULL,
    status TEXT CHECK (status IN ('available', 'assigned', 'in_transit', 'delivered')) DEFAULT 'available',
    rate DECIMAL(10,2) NOT NULL,
    vehicle_id UUID REFERENCES vehicles(id),
    driver_id UUID REFERENCES profiles(id)
);

-- Enable Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE loads ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Public profiles are viewable by everyone."
    ON profiles FOR SELECT
    USING (true);

CREATE POLICY "Users can insert their own profile."
    ON profiles FOR INSERT
    WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile."
    ON profiles FOR UPDATE
    USING (auth.uid() = id);

-- Vehicles policies
CREATE POLICY "Vehicles are viewable by authenticated users."
    ON vehicles FOR SELECT
    USING (auth.role() = 'authenticated');

CREATE POLICY "Only admins can insert vehicles."
    ON vehicles FOR INSERT
    WITH CHECK (EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.id = auth.uid()
        AND profiles.role = 'admin'
    ));

CREATE POLICY "Only admins can update vehicles."
    ON vehicles FOR UPDATE
    USING (EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.id = auth.uid()
        AND profiles.role = 'admin'
    ));

-- Loads policies
CREATE POLICY "Loads are viewable by authenticated users."
    ON loads FOR SELECT
    USING (auth.role() = 'authenticated');

CREATE POLICY "Admins and dispatchers can insert loads."
    ON loads FOR INSERT
    WITH CHECK (EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.id = auth.uid()
        AND profiles.role IN ('admin', 'dispatcher')
    ));

CREATE POLICY "Admins and dispatchers can update loads."
    ON loads FOR UPDATE
    USING (EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.id = auth.uid()
        AND profiles.role IN ('admin', 'dispatcher')
    ));