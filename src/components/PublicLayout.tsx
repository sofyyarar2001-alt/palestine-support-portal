import { Link } from "@tanstack/react-router";
import { Menu } from "lucide-react";
import { useState, type ReactNode } from "react";

import { BrandLogo } from "@/components/BrandLogo";
import { FloatingContact } from "@/components/FloatingContact";
import { SITE } from "@/lib/site";

const NAV = [
  { to: "/", label: "الرئيسية" },
  { to: "/complaint", label: "تقديم شكوى" },
  { to: "/track", label: "متابعة شكوى" },
  { to: "/about", label: "من نحن" },
  { to: "/faq", label: "الأسئلة الشائعة" },
  { to: "/contact", label: "اتصل بنا" },
] as const;

export function PublicLayout({
  children,
  compactFloating = false,
}: {
  children: ReactNode;
  compactFloating?: boolean;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-col">
      <div className="flag-bar h-1.5 w-full" />
      <header className="sticky top-0 z-30 border-b border-border/70 bg-background/95 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-3">
          <Link to="/" className="flex items-center gap-3" onClick={() => setOpen(false)}>
            <BrandLogo className="h-11 w-11 shrink-0" />
            <span className="leading-tight">
              <span className="block text-lg font-bold">{SITE.name}</span>
              <span className="block text-[11px] text-muted-foreground">منصّة تقديم ومتابعة الشكاوى</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-1 lg:flex">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                activeProps={{ className: "bg-secondary text-secondary-foreground" }}
                className="rounded-md px-3 py-2 text-sm font-medium text-foreground/80 transition hover:bg-secondary hover:text-secondary-foreground"
              >
                {item.label}
              </Link>
            ))}
            <Link
              to="/complaint"
              className="mr-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
            >
              قدّم شكوتك
            </Link>
          </nav>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label="القائمة"
            aria-expanded={open}
            className="flex h-11 w-11 items-center justify-center rounded-md border border-border lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>

        {open && (
          <nav className="border-t border-border bg-background lg:hidden">
            <div className="mx-auto grid w-full max-w-6xl gap-1 px-4 py-3">
              {NAV.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setOpen(false)}
                  className="rounded-md px-3 py-3 text-base font-medium hover:bg-secondary"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </nav>
        )}
      </header>

      <main className="flex-1">{children}</main>

      <footer className="mt-16 border-t border-border bg-secondary/40">
        <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-3">
              <BrandLogo className="h-10 w-10" />
              <span className="font-bold">{SITE.name}</span>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              {SITE.tagline}. منصّة مستقلة لتنظيم استلام الشكاوى ومتابعتها، وليست جهة حكومية أو رسمية.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-bold">روابط سريعة</h3>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li><Link to="/complaint" className="hover:text-foreground">تقديم شكوى</Link></li>
              <li><Link to="/track" className="hover:text-foreground">متابعة شكوى</Link></li>
              <li><Link to="/faq" className="hover:text-foreground">الأسئلة الشائعة</Link></li>
              <li><Link to="/about" className="hover:text-foreground">من نحن</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-bold">سياسات</h3>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li><Link to="/terms" className="hover:text-foreground">الشروط والأحكام</Link></li>
              <li><Link to="/privacy" className="hover:text-foreground">سياسة الخصوصية</Link></li>
              <li><Link to="/developer" className="hover:text-foreground">المطوّر</Link></li>
              <li><Link to="/admin/login" className="hover:text-foreground">دخول المشرفين</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-bold">تواصل معنا</h3>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li>
                <a href={SITE.whatsappUrl} target="_blank" rel="noopener noreferrer" className="hover:text-foreground" dir="ltr">
                  {SITE.whatsappNumber}
                </a>
              </li>
              <li>
                <a href={SITE.facebookUrl} target="_blank" rel="noopener noreferrer" className="hover:text-foreground">
                  صفحة فيسبوك
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-border/70 py-4 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} {SITE.name} — جميع الحقوق محفوظة · تطوير{" "}
          <Link to="/developer" className="font-semibold text-foreground hover:underline">
            {SITE.developer}
          </Link>
        </div>
      </footer>

      <FloatingContact compact={compactFloating} />
    </div>
  );
}
