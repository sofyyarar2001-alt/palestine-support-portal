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
      {
        name: "description",
        content: "صفحة دخول خاصة بمشرفي منصّة متعثرين فلسطين.",
      },
      {
        name: "robots",
        content: "noindex,nofollow",
      },
    ],
  }),

  component: AdminLogin,
});

function AdminLogin() {
  const navigate = useNavigate();

  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (loading) return;

    setError(null);
    setLoading(true);

    try {
      const cleanPhone = phone.replace(/\s+/g, "").trim();

      if (!cleanPhone || !password) {
        setError("أدخل رقم الهاتف وكلمة المرور.");
        return;
      }

      /*
       * الحسابات الفعلية موجودة في Supabase Auth.
       * لا توجد أسماء مستخدمين أو كلمات مرور داخل الكود.
       *
       * Supabase يحتاج صيغة email للدخول.
       * نستخدم عنوانًا داخليًا مبنيًا على رقم الهاتف.
       */
      const loginEmail = `${cleanPhone}@admins.local`;

      const { data, error: signInError } =
        await supabase.auth.signInWithPassword({
          email: loginEmail,
          password,
        });

      if (signInError || !data.user) {
        setError("بيانات الدخول غير صحيحة.");
        return;
      }

      /*
       * مهم:
       * لا نستخدم maybeSingle() هنا.
       * نبحث عن ملف المشرف المرتبط بالمستخدم الحالي فقط.
       */
      const { data: profile, error: profileError } = await supabase
        .from("admin_profiles")
        .select("id, email, full_name, is_active")
        .eq("id", data.user.id)
        .maybeSingle();

      if (profileError || !profile || !profile.is_active) {
        await supabase.auth.signOut();

        setError(
          "هذا الحساب غير مصرّح له بالدخول إلى لوحة الإدارة.",
        );

        return;
      }

      await navigate({
        to: "/admin",
        replace: true,
      });
    } catch (error) {
      console.error("Admin login error:", error);

      setError("تعذّر تسجيل الدخول حالياً. حاول مرة أخرى.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="flex min-h-screen flex-col bg-secondary/40"
      dir="rtl"
    >
      <div className="flag-bar h-1.5 w-full" />

      <div className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 shadow-sm">

          <div className="text-center">
            <BrandLogo className="mx-auto h-14 w-14" />

            <h1 className="mt-4 text-xl font-bold">
              لوحة إدارة الشكاوى
            </h1>

            <p className="mt-2 text-sm text-muted-foreground">
              الدخول مخصّص للمشرفين المصرّح لهم فقط.
            </p>
          </div>

          <form
            onSubmit={onSubmit}
            className="mt-8 space-y-5"
            autoComplete="off"
          >

            <div>
              <Label
                htmlFor="admin-phone"
                className="mb-2 block text-sm font-semibold"
              >
                رقم الهاتف
              </Label>

              <Input
                id="admin-phone"
                value={phone}
                onChange={(event) => {
                  setPhone(event.target.value);
                  setError(null);
                }}
                type="tel"
                inputMode="tel"
                required
                dir="ltr"
                className="min-h-12"
                autoComplete="off"
                name="admin-login-phone"
              />
            </div>

            <div>
              <Label
                htmlFor="admin-password"
                className="mb-2 block text-sm font-semibold"
              >
                كلمة المرور
              </Label>

              <Input
                id="admin-password"
                value={password}
                onChange={(event) => {
                  setPassword(event.target.value);
                  setError(null);
                }}
                type="password"
                required
                dir="ltr"
                className="min-h-12"
                autoComplete="new-password"
                name="admin-login-password"
              />
            </div>

            {error && (
              <div
                role="alert"
                className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm font-medium text-destructive"
              >
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />

                <span>{error}</span>
              </div>
            )}

            <Button
              type="submit"
              className="min-h-12 w-full"
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="ml-2 h-4 w-4 animate-spin" />
              ) : (
                <LockKeyhole className="ml-2 h-4 w-4" />
              )}

              {loading ? "جاري الدخول..." : "تسجيل الدخول"}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm">
            <Link
              to="/"
              className="text-muted-foreground hover:text-foreground"
            >
              العودة إلى الموقع
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
                }
