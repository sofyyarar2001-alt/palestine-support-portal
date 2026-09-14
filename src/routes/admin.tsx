import {
  Link,
  Outlet,
  createFileRoute,
  redirect,
  useNavigate,
} from "@tanstack/react-router";

import { useQueryClient } from "@tanstack/react-query";

import {
  LayoutDashboard,
  ListOrdered,
  LogOut,
} from "lucide-react";

import { BrandLogo } from "@/components/BrandLogo";

import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin")({
  ssr: false,

  beforeLoad: async ({ location }) => {
    if (location.pathname === "/admin/login") {
      return {
        admin: null,
      };
    }

    const {
      data,
      error,
    } = await supabase.auth.getUser();

    if (error || !data.user) {
      throw redirect({
        to: "/admin/login",
      });
    }

    const {
      data: profile,
      error: profileError,
    } = await supabase
      .from("admin_profiles")
      .select(
        "id, full_name, role, is_active",
      )
      .eq("id", data.user.id)
      .maybeSingle();

    if (
      profileError ||
      !profile ||
      profile.is_active !== true ||
      profile.role !== "admin"
    ) {
      await supabase.auth.signOut();

      throw redirect({
        to: "/admin/login",
      });
    }

    return {
      admin: profile,
    };
  },

  component: AdminLayout,
});

function AdminLayout() {
  const { admin } = Route.useRouteContext();

  const navigate = useNavigate();

  const queryClient = useQueryClient();

  async function signOut() {
    await queryClient.cancelQueries();

    queryClient.clear();

    await supabase.auth.signOut();

    await navigate({
      to: "/admin/login",
      replace: true,
    });
  }

  if (!admin) {
    return <Outlet />;
  }

  return (
    <div
      className="min-h-screen bg-secondary/30"
      dir="rtl"
    >
      <div className="flag-bar h-1.5 w-full" />

      <header className="border-b border-border bg-card">

        <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3">

          <Link
            to="/admin"
            className="flex items-center gap-3"
          >
            <BrandLogo className="h-10 w-10" />

            <span className="leading-tight">
              <span className="block font-bold">
                لوحة الإدارة
              </span>

              <span className="block text-[11px] text-muted-foreground">
                متعثرين فلسطين
              </span>
            </span>
          </Link>

          <nav className="flex items-center gap-1">

            <Link
              to="/admin"
              activeOptions={{
                exact: true,
              }}
              activeProps={{
                className: "bg-secondary",
              }}
              className="inline-flex min-h-11 items-center gap-2 rounded-md px-3 text-sm font-medium hover:bg-secondary"
            >
              <LayoutDashboard className="h-4 w-4" />
              الرئيسية
            </Link>

            <Link
              to="/admin/complaints"
              activeProps={{
                className: "bg-secondary",
              }}
              className="inline-flex min-h-11 items-center gap-2 rounded-md px-3 text-sm font-medium hover:bg-secondary"
            >
              <ListOrdered className="h-4 w-4" />
              الشكاوى
            </Link>

            <button
              type="button"
              onClick={signOut}
              className="inline-flex min-h-11 items-center gap-2 rounded-md px-3 text-sm font-medium text-destructive hover:bg-destructive/10"
            >
              <LogOut className="h-4 w-4" />
              خروج
            </button>

          </nav>
        </div>

        <div className="mx-auto w-full max-w-7xl px-4 pb-2 text-xs text-muted-foreground">
          {admin.full_name || "المشرف"}
        </div>

      </header>

      <main className="mx-auto w-full max-w-7xl px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}
