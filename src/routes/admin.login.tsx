import {
  Link,
  createFileRoute,
  useNavigate,
} from "@tanstack/react-router";

import {
  AlertCircle,
  Loader2,
} from "lucide-react";

import { useEffect, useState } from "react";

import { BrandLogo } from "@/components/BrandLogo";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/login")({
  ssr: false,

  head: () => ({
    meta: [
      {
        title: "دخول المشرفين — متعثرين فلسطين",
      },
      {
        name: "description",
        content: "دخول مشرفي منصة متعثرين فلسطين.",
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

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function checkSession() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!mounted || !session?.user) {
        return;
      }

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

  async function signInWithGoogle() {
    setError(null);
    setLoading(true);

    try {
      const redirectTo =
        `${window.location.origin}/admin/login`;

      const { error: oauthError } =
        await supabase.auth.signInWithOAuth({
          provider: "google",
          options: {
            redirectTo,
          },
        });

      if (oauthError) {
        console.error("GOOGLE LOGIN ERROR:", oauthError);

        setError(
          oauthError.message ||
            "تعذر بدء تسجيل الدخول باستخدام Google.",
        );

        setLoading(false);
      }
    } catch (err) {
      console.error("GOOGLE LOGIN UNEXPECTED ERROR:", err);

      setError(
        "حدث خطأ أثناء الاتصال بخدمة Google.",
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

          <Button
            type="button"
            onClick={signInWithGoogle}
            disabled={loading}
            className="mt-8 min-h-12 w-full"
          >
            {loading ? (
              <>
                <Loader2 className="ml-2 h-5 w-5 animate-spin" />
                جارٍ الاتصال بـ Google...
              </>
            ) : (
              <>
                <svg
                  className="ml-2 h-5 w-5"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fill="currentColor"
                    d="M21.35 12.27c0-.78-.07-1.54-.22-2.27H12v4.3h5.22a4.46 4.46 0 0 1-1.94 2.93v2.44h3.14c1.84-1.69 2.93-4.18 2.93-7.4Z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 21.75c2.63 0 4.84-.87 6.45-2.35l-3.14-2.44c-.87.58-1.98.92-3.31.92-2.54 0-4.69-1.72-5.46-4.03H3.3v2.52A9.74 9.74 0 0 0 12 21.75Z"
                  />
                  <path
                    fill="currentColor"
                    d="M6.54 13.85a5.84 5.84 0 0 1 0-3.7V7.63H3.3a9.75 9.75 0 0 0 0 8.74l3.24-2.52Z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 6.12c1.43 0 2.71.49 3.72 1.45l2.79-2.79C16.83 3.24 14.62 2.25 12 2.25a9.74 9.74 0 0 0-8.7 5.38l3.24 2.52C7.31 7.84 9.46 6.12 12 6.12Z"
                  />
                </svg>

                تسجيل الدخول باستخدام Google
              </>
            )}
          </Button>

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
