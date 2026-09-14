import {
  Link,
  createFileRoute,
  useNavigate,
} from "@tanstack/react-router";

import {
  AlertCircle,
  Loader2,
  LockKeyhole,
  Mail,
} from "lucide-react";

import { useEffect, useState } from "react";

import { BrandLogo } from "@/components/BrandLogo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/login")({
  ssr: false,

  head: () => ({
    meta: [
      {
        title: "دخول المشرفين — متعثرين فلسطين",
      },
      {
        name: "robots",
        content: "noindex",
      },
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

  useEffect(() => {
    let mounted = true;

    async function checkSession() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!mounted || !session?.user) return;

      const { data: profile } = await supabase
        .from("admin_profiles")
        .select("id, full_name, role, is_active")
        .eq("id", session.user.id)
        .maybeSingle();

      if (
        profile &&
        profile.role === "admin" &&
        profile.is_active === true
      ) {
        await navigate({
          to: "/admin",
          replace: true,
        });
      }
    }

    checkSession();

    return () => {
      mounted = false;
    };
  }, [navigate]);

  async function handleLogin(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setError(null);
    setLoading(true);

    try {
      const { data, error: loginError } =
        await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

      if (loginError || !data.user) {
        setError(
          "البريد الإلكتروني أو كلمة المرور غير صحيحة.",
        );
        setLoading(false);
        return;
      }

      const { data: profile, error: profileError } =
        await supabase
          .from("admin_profiles")
          .select("id, full_name, role, is_active")
          .eq("id", data.user.id)
          .maybeSingle();

      if (
        profileError ||
        !profile ||
        profile.role !== "admin" ||
        profile.is_active !== true
      ) {
        await supabase.auth.signOut();

        setError(
          "هذا الحساب غير مصرح له بالدخول.",
        );

        setLoading(false);
        return;
      }

      await navigate({
        to: "/admin",
        replace: true,
      });
    } catch (error) {
      console.error("LOGIN ERROR:", error);

      setError(
        "حدث خطأ أثناء تسجيل الدخول.",
      );

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
        <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8">

          <div className="text-center">
            <BrandLogo className="mx-auto h-14 w-14" />

            <h1 className="mt-4 text-xl font-bold">
              لوحة إدارة الشكاوى
            </h1>

            <p className="mt-2 text-sm text-muted-foreground">
              الدخول مخصّص للمشرفين المصرّح لهم فقط.
            </p>
          </div>

          {error && (
            <div className="mt-6 flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm font-medium text-destructive">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form
            onSubmit={handleLogin}
            className="mt-8 space-y-5"
          >
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium"
              >
                البريد الإلكتروني
              </label>

              <div className="relative">
                <Mail className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(event) =>
                    setEmail(event.target.value)
                  }
                  placeholder="البريد الإلكتروني"
                  autoComplete="username"
                  required
                  className="h-12 pr-10"
                  dir="ltr"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium"
              >
                كلمة المرور
              </label>

              <div className="relative">
                <LockKeyhole className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(event) =>
                    setPassword(event.target.value)
                  }
                  placeholder="كلمة المرور"
                  autoComplete="current-password"
                  required
                  className="h-12 pr-10"
                  dir="ltr"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="h-12 w-full"
            >
              {loading ? (
                <>
                  <Loader2 className="ml-2 h-5 w-5 animate-spin" />
                  جارٍ تسجيل الدخول...
                </>
              ) : (
                "تسجيل الدخول"
              )}
            </Button>
          </form>

          <p className="mt-4 text-center text-sm">
            <Link
              to="/admin/forgot-password"
              className="text-primary hover:underline"
            >
              نسيت كلمة المرور؟
            </Link>
          </p>

          <p className="mt-4 text-center text-sm">
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
