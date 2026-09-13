
REVOKE ALL ON FUNCTION public.set_updated_at() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.log_status_change() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.is_active_admin() FROM PUBLIC, anon;
