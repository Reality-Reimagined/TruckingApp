-- Wrap everything in a transaction
BEGIN;

-- Check and drop existing tables and policies
DO $$ 
BEGIN
    -- Drop existing policies
    DROP POLICY IF EXISTS "Companies are viewable by authenticated users" ON companies;
    DROP POLICY IF EXISTS "Companies are insertable by authenticated users" ON companies;
    DROP POLICY IF EXISTS "Loads are viewable by authenticated users" ON loads;
    DROP POLICY IF EXISTS "Loads are insertable by authenticated users" ON loads;
    
    -- Drop existing tables if they exist
    DROP TABLE IF EXISTS invoices CASCADE;
    DROP TABLE IF EXISTS loads CASCADE;
    DROP TABLE IF EXISTS companies CASCADE;
    DROP TABLE IF EXISTS profiles CASCADE;
    DROP TABLE IF EXISTS documents CASCADE;
    DROP TABLE IF EXISTS support_tickets CASCADE;
    DROP TABLE IF EXISTS vehicles CASCADE;
END $$;

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Companies table
CREATE TABLE companies (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users ON DELETE CASCADE,
    name TEXT NOT NULL,
    mc_number TEXT,
    dot_number TEXT,
    ein TEXT,
    address TEXT,
    city TEXT,
    state TEXT,
    zip_code TEXT,
    bank_name TEXT,
    bank_account TEXT,
    bank_routing TEXT,
    payment_terms TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Profiles table (extends Supabase auth.users)
CREATE TABLE profiles (
    id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
    first_name TEXT,
    last_name TEXT,
    phone TEXT,
    cdl_number TEXT,
    cdl_expiry DATE,
    company_logo TEXT,
    company_id UUID REFERENCES companies(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enhanced Loads table
CREATE TABLE loads (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    origin TEXT NOT NULL,
    origin_lat DECIMAL(10,8),
    origin_lng DECIMAL(11,8),
    destination TEXT NOT NULL,
    destination_lat DECIMAL(10,8),
    destination_lng DECIMAL(11,8),
    pickup_date TIMESTAMP WITH TIME ZONE,
    delivery_date TIMESTAMP WITH TIME ZONE,
    status TEXT NOT NULL DEFAULT 'PENDING',
    rate DECIMAL(10,2),
    rate_per_mile DECIMAL(10,2),
    distance DECIMAL(10,2),
    weight DECIMAL(10,2),
    equipment_type TEXT,
    description TEXT,
    special_instructions TEXT,
    broker TEXT,
    contact_name TEXT,
    contact_phone TEXT,
    contact_email TEXT,
    created_by UUID REFERENCES auth.users(id),
    booked_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Invoices table
CREATE TABLE invoices (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    load_id UUID REFERENCES loads(id) ON DELETE SET NULL,
    invoice_number TEXT NOT NULL,
    issue_date DATE NOT NULL,
    due_date DATE NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    tax_rate DECIMAL(5,2),
    tax_amount DECIMAL(10,2),
    total_amount DECIMAL(10,2) NOT NULL,
    status TEXT NOT NULL DEFAULT 'DRAFT',
    notes TEXT,
    payment_terms TEXT,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Documents table
CREATE TABLE documents (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    load_id UUID REFERENCES loads(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    file_path TEXT NOT NULL,
    status TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create triggers for each table
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_companies_updated_at
    BEFORE UPDATE ON companies
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_loads_updated_at
    BEFORE UPDATE ON loads
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_invoices_updated_at
    BEFORE UPDATE ON invoices
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_documents_updated_at
    BEFORE UPDATE ON documents
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();

-- Set up Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE loads ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

-- Create enhanced policies
CREATE POLICY "Users can view their own profile"
    ON profiles FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
    ON profiles FOR UPDATE
    USING (auth.uid() = id);

CREATE POLICY "Companies are viewable by authenticated users"
    ON companies FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Companies are insertable by authenticated users"
    ON companies FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Companies are updatable by owners"
    ON companies FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Loads are viewable by authenticated users"
    ON loads FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Loads are insertable by authenticated users"
    ON loads FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Loads are updatable by creators or bookers"
    ON loads FOR UPDATE
    USING (auth.uid() = created_by OR auth.uid() = booked_by);

CREATE POLICY "Loads are deletable by creators"
    ON loads FOR DELETE
    USING (auth.uid() = created_by AND status = 'PENDING');

CREATE POLICY "Invoices are viewable by company owners"
    ON invoices FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM companies 
        WHERE companies.id = invoices.company_id 
        AND companies.user_id = auth.uid()
    ));

CREATE POLICY "Invoices are insertable by company owners"
    ON invoices FOR INSERT
    WITH CHECK (EXISTS (
        SELECT 1 FROM companies 
        WHERE companies.id = invoices.company_id 
        AND companies.user_id = auth.uid()
    ));

CREATE POLICY "Invoices are updatable by creators"
    ON invoices FOR UPDATE
    USING (created_by = auth.uid());

CREATE POLICY "Users can update their profile with company"
    ON profiles FOR UPDATE
    USING (auth.uid() = id)
    WITH CHECK (
        auth.uid() = id AND
        (company_id IS NULL OR EXISTS (
            SELECT 1 FROM companies 
            WHERE companies.id = company_id 
            AND companies.user_id = auth.uid()
        ))
    );
-- Enable RLS
alter table loads enable row level security;

-- Policy for reading loads (everyone can read)
create policy "Loads are viewable by everyone"
on loads for select
to authenticated
using (true);

-- Policy for inserting loads (authenticated users can create)
create policy "Users can create loads"
on loads for insert
to authenticated
with check (auth.uid() = user_id);

-- Policy for updating loads (only creator can update)
create policy "Users can update their own loads"
on loads for update
to authenticated
using (auth.uid() = user_id);

-- Policy for deleting loads (only creator can delete)
create policy "Users can delete their own loads"
on loads for delete
to authenticated
using (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX idx_loads_status ON loads(status);
CREATE INDEX idx_loads_created_by ON loads(created_by);
CREATE INDEX idx_loads_booked_by ON loads(booked_by);
CREATE INDEX idx_loads_pickup_date ON loads(pickup_date);
CREATE INDEX idx_loads_created_at ON loads(created_at);
CREATE INDEX idx_invoices_company_id ON invoices(company_id);
CREATE INDEX idx_invoices_load_id ON invoices(load_id);
CREATE INDEX idx_invoices_status ON invoices(status);
CREATE INDEX idx_documents_load_id ON documents(load_id);
CREATE INDEX idx_documents_company_id ON documents(company_id);

-- Add tracking functions
CREATE OR REPLACE FUNCTION update_invoice_status()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.paid_at IS NOT NULL AND OLD.paid_at IS NULL THEN
        NEW.status = 'PAID';
    ELSIF NEW.viewed_at IS NOT NULL AND OLD.viewed_at IS NULL THEN
        NEW.status = 'VIEWED';
    ELSIF NEW.due_date < CURRENT_DATE AND NEW.paid_at IS NULL THEN
        NEW.status = 'OVERDUE';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER track_invoice_status
    BEFORE UPDATE ON invoices
    FOR EACH ROW
    EXECUTE FUNCTION update_invoice_status();

CREATE TABLE invoice_templates (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id),
    name TEXT NOT NULL,
    colors JSONB,
    logo JSONB,
    fonts JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Add RLS policy
ALTER TABLE invoice_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own templates"
    ON invoice_templates
    USING (auth.uid() = user_id);

COMMIT;