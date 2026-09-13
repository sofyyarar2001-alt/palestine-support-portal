
CREATE POLICY "public can upload complaint files"
ON storage.objects FOR INSERT TO anon, authenticated
WITH CHECK (bucket_id = 'complaint-files');

CREATE POLICY "admins read complaint files"
ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'complaint-files' AND public.is_active_admin());

CREATE POLICY "admins delete complaint files"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'complaint-files' AND public.is_active_admin());
