-- ==============================================================================
-- KRISHIDRISHTI — MAHARASHTRA-FIRST AGRICULTURAL DATABASE SCHEMA
-- Version: 1.1.0 (Idempotent & Self-Contained)
-- Security: Row Level Security (RLS) on all tables
-- Zero Fake Data Policy: No dummy records or pre-seeded fake users
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==============================================================================
-- 2. FARMER PROFILES TABLE (Linked directly to Supabase Auth)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    phone_number TEXT,
    state TEXT NOT NULL DEFAULT 'Maharashtra',
    district TEXT NOT NULL DEFAULT 'Nashik',
    taluka TEXT NOT NULL DEFAULT 'Dindori',
    village TEXT,
    pincode TEXT,
    primary_soil_type TEXT NOT NULL DEFAULT 'Black Cotton Soil (Regur)',
    total_land_acres NUMERIC(6, 2) NOT NULL DEFAULT 0.0 CHECK (total_land_acres >= 0),
    kisan_reg_id TEXT UNIQUE,
    preferred_language TEXT NOT NULL DEFAULT 'mr' CHECK (preferred_language IN ('mr', 'hi', 'en')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_profiles_location ON public.profiles(state, district, taluka);
CREATE INDEX IF NOT EXISTS idx_profiles_kisan_id ON public.profiles(kisan_reg_id);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "profiles_select_own" ON public.profiles;
CREATE POLICY "profiles_select_own" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "profiles_insert_own" ON public.profiles;
CREATE POLICY "profiles_insert_own" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "profiles_update_own" ON public.profiles;
CREATE POLICY "profiles_update_own" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

-- ==============================================================================
-- 3. FARMS / LAND PARCELS (7/12 Gat No. & Land Holding)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.farms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    farm_name TEXT NOT NULL,
    gat_number TEXT, -- Maharashtra 7/12 Gat Number
    state TEXT NOT NULL DEFAULT 'Maharashtra',
    district TEXT NOT NULL,
    taluka TEXT NOT NULL,
    village TEXT,
    total_acres NUMERIC(6, 2) NOT NULL CHECK (total_acres > 0),
    primary_soil TEXT,
    water_source TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_farms_user ON public.farms(user_id);

ALTER TABLE public.farms ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "farms_select_own" ON public.farms;
CREATE POLICY "farms_select_own" ON public.farms
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "farms_insert_own" ON public.farms;
CREATE POLICY "farms_insert_own" ON public.farms
    FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "farms_update_own" ON public.farms;
CREATE POLICY "farms_update_own" ON public.farms
    FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "farms_delete_own" ON public.farms;
CREATE POLICY "farms_delete_own" ON public.farms
    FOR DELETE USING (auth.uid() = user_id);

-- ==============================================================================
-- 4. ACTIVE CULTIVATION PLOTS TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.plots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    farm_id UUID REFERENCES public.farms(id) ON DELETE SET NULL,
    plot_name TEXT NOT NULL,
    crop_name TEXT NOT NULL,
    variety TEXT,
    area_acres NUMERIC(6, 2) NOT NULL CHECK (area_acres > 0),
    sown_date DATE NOT NULL DEFAULT CURRENT_DATE,
    stage TEXT NOT NULL DEFAULT 'Vegetative',
    health_status TEXT NOT NULL DEFAULT 'Optimal' CHECK (health_status IN ('Optimal', 'Watchlist', 'Attention')),
    water_need TEXT NOT NULL DEFAULT 'Moderate (Drip)',
    target_harvest_days INTEGER NOT NULL DEFAULT 90 CHECK (target_harvest_days > 0),
    next_action TEXT,
    photo_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_plots_user ON public.plots(user_id);
CREATE INDEX IF NOT EXISTS idx_plots_crop ON public.plots(crop_name);

ALTER TABLE public.plots ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "plots_select_own" ON public.plots;
CREATE POLICY "plots_select_own" ON public.plots
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "plots_insert_own" ON public.plots;
CREATE POLICY "plots_insert_own" ON public.plots
    FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "plots_update_own" ON public.plots;
CREATE POLICY "plots_update_own" ON public.plots
    FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "plots_delete_own" ON public.plots;
CREATE POLICY "plots_delete_own" ON public.plots
    FOR DELETE USING (auth.uid() = user_id);

-- ==============================================================================
-- 5. FARM TASKS & OPERATIONS TABLE (CRUD Planner)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.farm_tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    plot_id UUID REFERENCES public.plots(id) ON DELETE SET NULL,
    plot_name TEXT NOT NULL,
    task_description TEXT NOT NULL,
    planned_date DATE NOT NULL,
    priority TEXT NOT NULL DEFAULT 'Medium' CHECK (priority IN ('High', 'Medium', 'Routine')),
    status TEXT NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending', 'Completed')),
    notes TEXT,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_tasks_user_status ON public.farm_tasks(user_id, status);
CREATE INDEX IF NOT EXISTS idx_tasks_date ON public.farm_tasks(planned_date);

ALTER TABLE public.farm_tasks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "tasks_select_own" ON public.farm_tasks;
CREATE POLICY "tasks_select_own" ON public.farm_tasks
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "tasks_insert_own" ON public.farm_tasks;
CREATE POLICY "tasks_insert_own" ON public.farm_tasks
    FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "tasks_update_own" ON public.farm_tasks;
CREATE POLICY "tasks_update_own" ON public.farm_tasks
    FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "tasks_delete_own" ON public.farm_tasks;
CREATE POLICY "tasks_delete_own" ON public.farm_tasks
    FOR DELETE USING (auth.uid() = user_id);

-- ==============================================================================
-- 6. DIAGNOSTIC SCAN HISTORY (AI Crop Doctor Results)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.diagnostic_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    plot_id UUID REFERENCES public.plots(id) ON DELETE SET NULL,
    case_reference TEXT NOT NULL,
    crop_name TEXT NOT NULL,
    disease_name TEXT NOT NULL,
    scientific_name TEXT,
    severity TEXT NOT NULL DEFAULT 'Moderate' CHECK (severity IN ('Mild', 'Moderate', 'Severe')),
    confidence_score NUMERIC(5, 2) CHECK (confidence_score >= 0 AND confidence_score <= 100),
    image_url TEXT,
    treatment_summary TEXT,
    status TEXT NOT NULL DEFAULT 'Active' CHECK (status IN ('Active', 'Treated', 'Under Watch', 'Resolved')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_diagnostics_user ON public.diagnostic_history(user_id);
CREATE INDEX IF NOT EXISTS idx_diagnostics_case ON public.diagnostic_history(case_reference);

ALTER TABLE public.diagnostic_history ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "diag_select_own" ON public.diagnostic_history;
CREATE POLICY "diag_select_own" ON public.diagnostic_history
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "diag_insert_own" ON public.diagnostic_history;
CREATE POLICY "diag_insert_own" ON public.diagnostic_history
    FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "diag_update_own" ON public.diagnostic_history;
CREATE POLICY "diag_update_own" ON public.diagnostic_history
    FOR UPDATE USING (auth.uid() = user_id);

-- ==============================================================================
-- 7. RECENT ACTIVITIES & FARM LOG (Kisan Bahi Audit Trail)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.farm_activity_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    plot_id UUID REFERENCES public.plots(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    log_type TEXT NOT NULL CHECK (log_type IN ('soil', 'disease', 'irrigation', 'fertilizer', 'harvest')),
    description TEXT NOT NULL,
    lab_id TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_activity_logs_user ON public.farm_activity_logs(user_id, created_at DESC);

ALTER TABLE public.farm_activity_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "logs_select_own" ON public.farm_activity_logs;
CREATE POLICY "logs_select_own" ON public.farm_activity_logs
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "logs_insert_own" ON public.farm_activity_logs;
CREATE POLICY "logs_insert_own" ON public.farm_activity_logs
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ==============================================================================
-- 8. AUTOMATIC PROFILE CREATION TRIGGER ON AUTH SIGNUP
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name, kisan_reg_id, phone_number, preferred_language)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'full_name', 'Progressive Kisan'),
        COALESCE(NEW.raw_user_meta_data->>'kisan_reg_id', 'MH-NSK-' || TO_CHAR(NOW(), 'YYYY') || '-' || LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0')),
        NEW.raw_user_meta_data->>'phone_number',
        COALESCE(NEW.raw_user_meta_data->>'preferred_language', 'mr')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
