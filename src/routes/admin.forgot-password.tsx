import {
  Link,
  createFileRoute,
} from "@tanstack/react-router";

import {
  AlertCircle,
  CheckCircle2,
  Loader2,
  Mail,
} from "lucide-react";

import { useState } from "react";

import { BrandLogo } from "@/components/BrandLogo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute(
  "/admin/forgot-password",
)({
  ssr: false,

  head: () => ({
    meta: [
      {
        title: "استعادة كلمة المرور — متعثرين فلسطين",
      },
      {
        name: "robots",
        content: "noindex",
      },
    ],
  }),

  component: ForgotPassword,
});

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const [error, setError] = useState<string | null>(
    null,
  );

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setLoading(true);
    setError(null);

    const redirectTo =
      `${window.location.origin}/palestine-support-portal/admin/reset-password`;

    const { error: resetError } =
      await supabase.auth.resetPasswordForEmail(
        email.trim(),
        {
          redirectTo,
        },
      );

    setLoading(false);

    if (resetError) {
      setError(resetError.message);
      return;
    }

    setSent(true);
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
            استعادة كلمة المرور
          </h1>

          <p className="mt-2 text-sm text-muted-foreground">
            أدخل بريد المشرف لإرسال رابط الاستعادة.
          </p>
        </div>

        {error && (
          <div className="mt-6 flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
            <AlertCircle className="mt-0.5 h-4 w-4" />
            <span>{error}</span>
          </div>
        )}

        {sent ? (
          <div className="mt-8 text-center">
            <CheckCircle2 className="mx-auto h-12 w-12 text-green-600" />

            <h2 className="mt-4 font-bold">
              تم إرسال الرابط
            </h2>

            <p className="mt-2 text-sm text-muted-foreground">
              افتح بريدك واضغط رابط تغيير كلمة المرور.
            </p>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
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
                <Mail className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2" />

                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(event) =>
                    setEmail(event.target.value)
                  }
                  required
                  className="h-12 pr-10"
                  dir="ltr"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading || !email.trim()}
              className="h-12 w-full"
            >
              {loading ? (
                <>
                  <Loader2 className="ml-2 h-5 w-5 animate-spin" />
                  جارٍ الإرسال...
                </>
              ) : (
                "إرسال رابط الاستعادة"
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
