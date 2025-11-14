-- Add optional phone column to profiles (idempotent)
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS phone TEXT;

-- Allow public (anon) to read rows for providers
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'profiles'
      AND policyname = 'Public can view providers'
  ) THEN
    CREATE POLICY "Public can view providers"
      ON public.profiles
      FOR SELECT
      USING (user_type = 'provider');
  END IF;
END
$$;

