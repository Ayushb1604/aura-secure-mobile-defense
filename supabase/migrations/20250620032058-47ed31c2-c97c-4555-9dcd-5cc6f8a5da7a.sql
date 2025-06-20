
-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create enum types
CREATE TYPE user_role AS ENUM ('admin', 'premium_user', 'free_user');
CREATE TYPE threat_type AS ENUM ('malware', 'phishing', 'suspicious_activity', 'network_anomaly');
CREATE TYPE threat_status AS ENUM ('active', 'resolved', 'investigating');
CREATE TYPE mfa_type AS ENUM ('sms', 'email', 'authenticator');

-- User profiles table (extends auth.users)
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  full_name text,
  role user_role DEFAULT 'free_user',
  subscription_tier text DEFAULT 'free',
  subscription_expires_at timestamp with time zone,
  device_id text,
  last_active timestamp with time zone DEFAULT now(),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- MFA settings table
CREATE TABLE public.mfa_settings (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  mfa_type mfa_type NOT NULL,
  is_enabled boolean DEFAULT false,
  phone_number text,
  backup_codes text[], -- encrypted backup codes
  secret_key text, -- for authenticator apps
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Threat detection logs
CREATE TABLE public.threat_logs (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  threat_type threat_type NOT NULL,
  threat_status threat_status DEFAULT 'active',
  threat_data jsonb NOT NULL, -- encrypted threat details
  severity_level integer CHECK (severity_level BETWEEN 1 AND 10),
  source_ip inet,
  device_fingerprint text,
  resolved_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Secure file vault
CREATE TABLE public.secure_files (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  file_name text NOT NULL,
  file_size bigint,
  mime_type text,
  encryption_key_hash text NOT NULL, -- hash of encryption key
  storage_path text NOT NULL,
  is_deleted boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Privacy settings
CREATE TABLE public.privacy_settings (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  vpn_enabled boolean DEFAULT false,
  ad_blocker_enabled boolean DEFAULT true,
  tracker_blocker_enabled boolean DEFAULT true,
  secure_dns_enabled boolean DEFAULT true,
  data_collection_consent boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- VPN sessions
CREATE TABLE public.vpn_sessions (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  server_location text NOT NULL,
  connected_at timestamp with time zone DEFAULT now(),
  disconnected_at timestamp with time zone,
  bytes_transferred bigint DEFAULT 0,
  is_active boolean DEFAULT true
);

-- Audit trail for security events
CREATE TABLE public.security_audit (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  event_type text NOT NULL,
  event_data jsonb NOT NULL,
  ip_address inet,
  user_agent text,
  created_at timestamp with time zone DEFAULT now()
);

-- Threat patterns for AI detection
CREATE TABLE public.threat_patterns (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  pattern_name text NOT NULL,
  pattern_data jsonb NOT NULL,
  confidence_score decimal(3,2),
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mfa_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.threat_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.secure_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.privacy_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vpn_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.security_audit ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can view own MFA settings" ON public.mfa_settings
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own threat logs" ON public.threat_logs
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can view own secure files" ON public.secure_files
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own privacy settings" ON public.privacy_settings
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own VPN sessions" ON public.vpn_sessions
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own security audit" ON public.security_audit
  FOR SELECT USING (auth.uid() = user_id);

-- Admin policies
CREATE POLICY "Admins can view all threat logs" ON public.threat_logs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can manage threat patterns" ON public.threat_patterns
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Triggers for automatic profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name'
  );
  
  -- Create default privacy settings
  INSERT INTO public.privacy_settings (user_id)
  VALUES (new.id);
  
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Indexes for performance
CREATE INDEX idx_threat_logs_user_id ON public.threat_logs(user_id);
CREATE INDEX idx_threat_logs_created_at ON public.threat_logs(created_at);
CREATE INDEX idx_threat_logs_status ON public.threat_logs(threat_status);
CREATE INDEX idx_secure_files_user_id ON public.secure_files(user_id);
CREATE INDEX idx_vpn_sessions_user_id ON public.vpn_sessions(user_id);
CREATE INDEX idx_security_audit_user_id ON public.security_audit(user_id);
CREATE INDEX idx_security_audit_created_at ON public.security_audit(created_at);
