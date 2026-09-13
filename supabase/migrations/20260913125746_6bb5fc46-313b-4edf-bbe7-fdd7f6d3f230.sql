
CREATE TABLE public.complaints (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reference text NOT NULL UNIQUE,
  full_name text NOT NULL,
  national_id text NOT NULL,
  phone text NOT NULL,
  phone_last4 text NOT NULL,
  email text,
  city text,
  address text,
  category text NOT NULL,
  respondent_name text,
  subject text NOT NULL,
  details text NOT NULL,
  amount numeric,
  status text NOT NULL DEFAULT 'new' CHECK (status IN ('new','in_review','needs_info','processed','closed')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX complaints_status_idx ON public.complaints(status);
CREATE INDEX complaints_created_at_idx ON public.complaints(created_at DESC);

CREATE TABLE public.attachments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  complaint_id uuid NOT NULL REFERENCES public.complaints(id) ON DELETE CASCADE,
  file_name text NOT NULL,
  storage_path text NOT NULL,
  mime_type text,
  size_bytes bigint,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX attachments_complaint_idx ON public.attachments(complaint_id);

CREATE TABLE public.signatures (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  complaint_id uuid NOT NULL REFERENCES public.complaints(id) ON DELETE CASCADE,
  storage_path text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX signatures_complaint_idx ON public.signatures(complaint_id);

CREATE TABLE public.admin_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  email text NOT NULL UNIQUE,
  full_name text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.admin_notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  complaint_id uuid NOT NULL REFERENCES public.complaints(id) ON DELETE CASCADE,
  author_email text NOT NULL,
  note text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX admin_notes_complaint_idx ON public.admin_notes(complaint_id);

CREATE TABLE public.status_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  complaint_id uuid NOT NULL REFERENCES public.complaints(id) ON DELETE CASCADE,
  from_status text,
  to_status text NOT NULL,
  changed_by text,
  note text,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX status_history_complaint_idx ON public.status_history(complaint_id);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.complaints TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.attachments TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.signatures TO authenticated;
GRANT SELECT ON public.admin_profiles TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.admin_notes TO authenticated;
GRANT SELECT, INSERT ON public.status_history TO authenticated;
GRANT ALL ON public.complaints, public.attachments, public.signatures, public.admin_profiles, public.admin_notes, public.status_history TO service_role;

ALTER TABLE public.complaints ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.signatures ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.status_history ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.is_active_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_profiles ap
    WHERE ap.is_active
      AND lower(ap.email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  );
$$;

CREATE POLICY "admins read complaints" ON public.complaints FOR SELECT TO authenticated USING (public.is_active_admin());
CREATE POLICY "admins update complaints" ON public.complaints FOR UPDATE TO authenticated USING (public.is_active_admin()) WITH CHECK (public.is_active_admin());
CREATE POLICY "admins read attachments" ON public.attachments FOR SELECT TO authenticated USING (public.is_active_admin());
CREATE POLICY "admins read signatures" ON public.signatures FOR SELECT TO authenticated USING (public.is_active_admin());
CREATE POLICY "admins read own profile" ON public.admin_profiles FOR SELECT TO authenticated USING (lower(email) = lower(coalesce(auth.jwt() ->> 'email','')));
CREATE POLICY "admins read notes" ON public.admin_notes FOR SELECT TO authenticated USING (public.is_active_admin());
CREATE POLICY "admins add notes" ON public.admin_notes FOR INSERT TO authenticated WITH CHECK (public.is_active_admin());
CREATE POLICY "admins delete notes" ON public.admin_notes FOR DELETE TO authenticated USING (public.is_active_admin());
CREATE POLICY "admins read history" ON public.status_history FOR SELECT TO authenticated USING (public.is_active_admin());
CREATE POLICY "admins add history" ON public.status_history FOR INSERT TO authenticated WITH CHECK (public.is_active_admin());

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER complaints_set_updated_at
BEFORE UPDATE ON public.complaints
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE OR REPLACE FUNCTION public.log_status_change()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.status IS DISTINCT FROM OLD.status THEN
    INSERT INTO public.status_history (complaint_id, from_status, to_status, changed_by)
    VALUES (NEW.id, OLD.status, NEW.status, coalesce(auth.jwt() ->> 'email', 'system'));
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER complaints_log_status
AFTER UPDATE ON public.complaints
FOR EACH ROW EXECUTE FUNCTION public.log_status_change();

CREATE OR REPLACE FUNCTION public.submit_complaint(payload jsonb)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_id uuid;
  v_reference text;
  v_phone text;
  v_att jsonb;
BEGIN
  v_phone := regexp_replace(coalesce(payload ->> 'phone',''), '\D', '', 'g');

  IF length(coalesce(payload ->> 'full_name','')) < 3 THEN RAISE EXCEPTION 'invalid_full_name'; END IF;
  IF length(v_phone) < 7 THEN RAISE EXCEPTION 'invalid_phone'; END IF;
  IF length(coalesce(payload ->> 'details','')) < 20 THEN RAISE EXCEPTION 'invalid_details'; END IF;

  v_reference := 'MP-' || to_char(now(), 'YYYY') || '-' ||
                 upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 8));

  INSERT INTO public.complaints (
    reference, full_name, national_id, phone, phone_last4, email, city, address,
    category, respondent_name, subject, details, amount
  ) VALUES (
    v_reference,
    payload ->> 'full_name',
    coalesce(payload ->> 'national_id',''),
    payload ->> 'phone',
    right(v_phone, 4),
    nullif(payload ->> 'email',''),
    nullif(payload ->> 'city',''),
    nullif(payload ->> 'address',''),
    coalesce(nullif(payload ->> 'category',''), 'أخرى'),
    nullif(payload ->> 'respondent_name',''),
    coalesce(nullif(payload ->> 'subject',''), 'شكوى'),
    payload ->> 'details',
    (nullif(payload ->> 'amount',''))::numeric
  ) RETURNING id INTO v_id;

  FOR v_att IN SELECT * FROM jsonb_array_elements(coalesce(payload -> 'attachments', '[]'::jsonb))
  LOOP
    INSERT INTO public.attachments (complaint_id, file_name, storage_path, mime_type, size_bytes)
    VALUES (v_id, coalesce(v_att ->> 'file_name','ملف'), v_att ->> 'storage_path',
            v_att ->> 'mime_type', (nullif(v_att ->> 'size_bytes',''))::bigint);
  END LOOP;

  IF nullif(payload ->> 'signature_path','') IS NOT NULL THEN
    INSERT INTO public.signatures (complaint_id, storage_path)
    VALUES (v_id, payload ->> 'signature_path');
  END IF;

  INSERT INTO public.status_history (complaint_id, from_status, to_status, changed_by, note)
  VALUES (v_id, NULL, 'new', 'system', 'تم استلام الشكوى');

  RETURN jsonb_build_object('reference', v_reference, 'created_at', now());
END;
$$;

CREATE OR REPLACE FUNCTION public.track_complaint(p_reference text, p_last4 text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  c public.complaints;
  v_history jsonb;
BEGIN
  SELECT * INTO c FROM public.complaints
  WHERE upper(trim(reference)) = upper(trim(p_reference))
    AND phone_last4 = regexp_replace(coalesce(p_last4,''), '\D', '', 'g');

  IF NOT FOUND THEN
    RETURN jsonb_build_object('found', false);
  END IF;

  SELECT coalesce(jsonb_agg(jsonb_build_object(
    'to_status', h.to_status, 'created_at', h.created_at
  ) ORDER BY h.created_at), '[]'::jsonb)
  INTO v_history
  FROM public.status_history h WHERE h.complaint_id = c.id;

  RETURN jsonb_build_object(
    'found', true,
    'reference', c.reference,
    'status', c.status,
    'category', c.category,
    'subject', c.subject,
    'created_at', c.created_at,
    'updated_at', c.updated_at,
    'history', v_history
  );
END;
$$;

REVOKE ALL ON FUNCTION public.submit_complaint(jsonb) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.track_complaint(text, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.submit_complaint(jsonb) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.track_complaint(text, text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.is_active_admin() TO authenticated;

INSERT INTO public.admin_profiles (email, full_name, is_active) VALUES
  ('f90gimme@gmail.com', 'أف تسعين', true),
  ('ararsofy@gmail.com', 'مشرف', true)
ON CONFLICT (email) DO NOTHING;
