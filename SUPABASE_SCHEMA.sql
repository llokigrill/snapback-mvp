-- 1. DROP EXISTING TABLES/TYPES TO ENSURE A CLEAN SLATE
DROP TABLE IF EXISTS public.business_campaigns CASCADE;
DROP TABLE IF EXISTS public.proposals CASCADE;
DROP TABLE IF EXISTS public.media_assets CASCADE;
DROP TABLE IF EXISTS public.events CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;
DROP TYPE IF EXISTS user_account_type CASCADE;
DROP TYPE IF EXISTS asset_format_type CASCADE;
DROP TYPE IF EXISTS proposal_status_type CASCADE;

-- 2. CREATE ENUMS
CREATE TYPE user_account_type AS ENUM ('fan', 'athlete', 'business');
CREATE TYPE asset_format_type AS ENUM ('photo', 'video', 'external_link');
CREATE TYPE proposal_status_type AS ENUM ('draft', 'pending', 'accepted', 'rejected');

-- 3. PROFILES TABLE
-- Handles both Fans and Athletes
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    user_type user_account_type Default 'fan',
    avatar_url TEXT,
    school_team TEXT,
    location TEXT,
    social_links JSONB DEFAULT '{}'::JSONB,
    ai_credits INT DEFAULT 3 NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trigger to auto-update the 'updated_at' column
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_modtime
BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE PROCEDURE set_updated_at();

-- User Accounts Sync Trigger (Runs when a user signs up)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, avatar_url)
    VALUES (
        new.id, 
        new.email,
        new.raw_user_meta_data->>'full_name', 
        new.raw_user_meta_data->>'avatar_url'
    );
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 4. EVENTS TABLE
CREATE TABLE public.events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    location TEXT,
    event_date TIMESTAMPTZ NOT NULL,
    teams JSONB DEFAULT '[]'::JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. MEDIA ASSETS TABLE
CREATE TABLE public.media_assets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    fan_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    event_id UUID REFERENCES public.events(id) ON DELETE SET NULL,
    storage_url TEXT NOT NULL,
    asset_type asset_format_type NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. PROPOSALS TABLE (WITH LEGAL SUITE COLUMNS)
CREATE TABLE public.proposals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    fan_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    athlete_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    media_id UUID REFERENCES public.media_assets(id) ON DELETE SET NULL,
    
    status proposal_status_type DEFAULT 'draft',
    merch_title TEXT NOT NULL,
    mockup_url TEXT,
    is_ai_generated BOOLEAN DEFAULT FALSE,
    rev_split_fan INT CHECK (rev_split_fan >= 0 AND rev_split_fan <= 100),
    rev_split_ath INT CHECK (rev_split_ath >= 0 AND rev_split_ath <= 100),
    term_months INT,
    
    -- Legal / Escrow Tracking Strings
    contract_text TEXT,
    copyright_license_text TEXT,
    publicity_release_text TEXT,
    
    -- Signatures
    fan_signature_date TIMESTAMPTZ,
    athlete_signature_date TIMESTAMPTZ,
    signed_at TIMESTAMPTZ,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER update_proposals_modtime
BEFORE UPDATE ON public.proposals
FOR EACH ROW EXECUTE PROCEDURE set_updated_at();

-- 6.5 BUSINESS CAMPAIGNS TABLE
CREATE TABLE public.business_campaigns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    athlete_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    status proposal_status_type DEFAULT 'draft',
    campaign_title TEXT NOT NULL,
    offer_amount DECIMAL(10, 2) NOT NULL,
    deliverables TEXT NOT NULL,
    timeline_days INT NOT NULL,
    contract_text TEXT,
    signed_by_business_at TIMESTAMPTZ,
    signed_by_athlete_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER update_business_campaigns_modtime
BEFORE UPDATE ON public.business_campaigns
FOR EACH ROW EXECUTE PROCEDURE set_updated_at();

-- 7. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.proposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_campaigns ENABLE ROW LEVEL SECURITY;

-- Profiles: Anyone can view, but only users can update their own
CREATE POLICY "Public profile viewing" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Events: Fully public
CREATE POLICY "Public event viewing" ON public.events FOR SELECT USING (true);
CREATE POLICY "Public event insert" ON public.events FOR INSERT WITH CHECK (true);

-- Media Assets: Publicly viewable, only creators can insert/update
CREATE POLICY "Public media viewing" ON public.media_assets FOR SELECT USING (true);
CREATE POLICY "Fans can upload media" ON public.media_assets FOR INSERT WITH CHECK (auth.uid() = fan_id);

-- Proposals: Viewable and updatable only by the specific fan and athlete
CREATE POLICY "Proposals viewable by involved parties" ON public.proposals 
    FOR SELECT USING (auth.uid() = fan_id OR auth.uid() = athlete_id);
CREATE POLICY "Fans can draft proposals" ON public.proposals 
    FOR INSERT WITH CHECK (auth.uid() = fan_id);
CREATE POLICY "Involved parties can update proposals" ON public.proposals 
    FOR UPDATE USING (auth.uid() = fan_id OR auth.uid() = athlete_id);

-- Business Campaigns: Viewable and updatable only by the specific business and athlete
CREATE POLICY "Campaigns viewable by involved parties" ON public.business_campaigns 
    FOR SELECT USING (auth.uid() = business_id OR auth.uid() = athlete_id);
CREATE POLICY "Businesses can draft campaigns" ON public.business_campaigns 
    FOR INSERT WITH CHECK (auth.uid() = business_id);
CREATE POLICY "Involved parties can update campaigns" ON public.business_campaigns 
    FOR UPDATE USING (auth.uid() = business_id OR auth.uid() = athlete_id);
