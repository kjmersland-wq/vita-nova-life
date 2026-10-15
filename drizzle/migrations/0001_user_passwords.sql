CREATE TABLE public.user_passwords (email text PRIMARY KEY, hash text NOT NULL, salt text NOT NULL, updated_at timestamptz NOT NULL DEFAULT now());
GRANT ALL ON public.user_passwords TO service_role;
ALTER TABLE public.user_passwords ENABLE ROW LEVEL SECURITY;