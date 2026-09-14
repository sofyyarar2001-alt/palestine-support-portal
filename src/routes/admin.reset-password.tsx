import {
  createFileRoute,
  Link,
  useNavigate,
} from "@tanstack/react-router";

import {
  AlertCircle,
  CheckCircle2,
  Loader2,
  LockKeyhole,
} from "lucide-react";

import { useEffect, useState } from "react";

import { BrandLogo } from "@/components/BrandLogo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute(
  "/admin/reset-password",
)({
  ssr: false,

  head: () => ({
    meta: [
      {
        title: "تغيير كلمة المرور — متعثرين فلسطين",
      },
      {
        name: "robots",
        content: "noindex",
      },
    ],
  }),

  component: ResetPassword,
});

function ResetPassword() {
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [checking, setChecking] = useState(true);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const [error, setError] = useState<string | null>(
    null,
  );

  useEffect(() => {
    let mounted = true;

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (!mounted) return;

        if (
          event === "PASSWORD_RECOVERY" &&
          session?.user
        ) {
          setError(null);
          setChecking(false);
        }
      },
    );

    async function checkSession() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!mounted) return;

      if (!session?.user) {
        setError(
          "رابط تغيير كلمة المرور غير صالح أو انتهت صلاحيته.",
        );
      }

      setChecking(false);
    }

    checkSession();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  async function updatePassword(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setError(null);

    if (password.length < 6) {
      setError(
        "كلمة المرور يجب أن تكون 6 أحرف أو أكثر.",
      );
      return;
    }

    if (password !== confirmPassword) {
      setError(
        "كلمتا المرور غير متطابقتين.",
      );
      return;
    }

    setLoading(true);

    const { error: updateError } =
      await supabase.auth.updateUser({
        password,
      });

    if (updateError) {
      setError(updateError.message);
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);

    await supabase.auth.signOut();
  }

  return (
    <div
      className="flex min-h-screen items-center justify-center bg-secondary/40 px-4"
      dir="rtl"
    >
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8">

        <div className="text-center">
          <BrandLogo className="mx-auto h-14 w-14" />

          <h1 className="mt-4 text-xl font-bold">
            تغيير كلمة المرور
          </h1>

          <p className="mt-2 text-sm text-muted-foreground">
            اختر كلمة مرور جديدة لحساب المشرف.
          </p>
        </div>

        {error && (
          <div className="mt-6 flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
            <AlertCircle className="mt-0.5 h-4 w-4" />
            <span>{error}</span>
          </div>
        )}

        {checking ? (
          <div className="flex justify-center py-10">
            <Loader2 className="h-7 w-7 animate-spin" />
          </div>
        ) : success ? (
          <div className="mt-8 text-center">
            <CheckCircle2 className="mx-auto h-12 w-12 text-green-600" />

            <h2 className="mt-4 font-bold">
              تم تغيير كلمة المرور بنجاح
            </h2>

            <p className="mt-2 text-sm text-muted-foreground">
              يمكنك الآن تسجيل الدخول.
            </p>

            <Button
              className="mt-6 w-full"
              onClick={() =>
                navigate({
                  to: "/admin/login",
                  replace: true,
                })
              }
            >
              تسجيل الدخول
            </Button>
          </div>
        ) : (
          <form
            onSubmit={updatePassword}
            className="mt-8 space-y-5"
          >
            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium"
              >
                كلمة المرور الجديدة
              </label>

              <div className="relative">
                <LockKeyhole className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2" />

                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(event) =>
                    setPassword(event.target.value)
                  }
                  required
                  className="h-12 pr-10"
                  dir="ltr"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="mb-2 block text-sm font-medium"
              >
                تأكيد كلمة المرور
              </label>

              <div className="relative">
                <LockKeyhole className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2" />

                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(event) =>
                    setConfirmPassword(
                      event.target.value,
                    )
                  }
                  required
                  className="h-12 pr-10"
                  dir="ltr"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={
                loading ||
                !password ||
                !confirmPassword
              }
              className="h-12 w-full"
            >
              {loading ? (
                <>
                  <Loader2 className="ml-2 h-5 w-5 animate-spin" />
                  جارٍ الحفظ...
                </>
              ) : (
                "تغيير كلمة المرور"
              )}
            </Button>
          </form>
        )}

        <p className="mt-6 text-center text-sm">
          <Link
            to="/admin/login"
            className="text-muted-foreground hover:text-foreground"
          >
            العودة إلى تسجيل الدخول
          </Link>
        </p>

      </div>
    </div>
  );
}
