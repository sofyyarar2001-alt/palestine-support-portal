import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { AlertCircle, Loader2, LockKeyhole } from "lucide-react";
import { useState } from "react";

import { BrandLogo } from "@/components/BrandLogo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/login")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "دخول المشرفين — متعثرين فلسطين" },
      { name: "description", content: "صفحة دخول خاصة بمشرفي منصّة متعثرين فلسطين المصرّح لهم." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminLogin,
});

function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      if (signInError) {
        setError("بيانات الدخول غير صحيحة.");
        return;
      }

      const { data: profile } = await supabase
        .from("admin_profiles")
        .select("id, is_active")
        .maybeSingle();

      if (!profile?.is_active) {
        await supabase.auth.signOut();
        setError("هذا الحساب غير مصرّح له بالدخول إلى لوحة الإدارة.");
        return;
      }

      navigate({ to: "/admin", replace: true });
    } catch (err) {
      console.error(err);
      setError("تعذّر تسجيل الدخول حالياً. حاول مرة أخرى.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-secondary/40">
      <div className="flag-bar h-1.5 w-full" />
      <div className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8">
          <div className="text-center">
            <BrandLogo className="mx-auto h-14 w-14" />
            <h1 className="mt-4 text-xl font-bold">لوحة إدارة الشكاوى</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              الدخول مخصّص للمشرفين المصرّح لهم فقط.
            </p>
          </div>

          <form onSubmit={onSubmit} className="mt-8 space-y-5">
            <div>
              <Label className="mb-2 block text-sm font-semibold">البريد الإلكتروني</Label>
              <Input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                required
                dir="ltr"
                className="min-h-12"
                autoComplete="username"
              />
            </div>
            <div>
              <Label className="mb-2 block text-sm font-semibold">كلمة المرور</Label>
              <Input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                required
                dir="ltr"
                className="min-h-12"
                autoComplete="current-password"
              />
            </div>

            {error && (
              <p className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm font-medium text-destructive">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" /> {error}
              </p>
            )}

            <Button type="submit" className="min-h-12 w-full" disabled={loading}>
              {loading ? <Loader2 className="ml-2 h-4 w-4 animate-spin" /> : <LockKeyhole className="ml-2 h-4 w-4" />}
              تسجيل الدخول
            </Button>
          </form>

          <p className="mt-6 text-center text-sm">
            <Link to="/" className="text-muted-foreground hover:text-foreground">
              العودة إلى الموقع
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
