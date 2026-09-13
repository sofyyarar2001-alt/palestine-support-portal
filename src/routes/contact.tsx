import { createFileRoute } from "@tanstack/react-router";
import { Clock, Facebook, MessageSquare, ShieldAlert } from "lucide-react";

import { PageHeader } from "@/components/PageHeader";
import { PublicLayout } from "@/components/PublicLayout";
import { SITE } from "@/lib/site";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "اتصل بنا — متعثرين فلسطين" },
      {
        name: "description",
        content: "تواصل مع فريق متعثرين فلسطين عبر واتساب +972568000119 أو من خلال صفحتنا على فيسبوك.",
      },
      { property: "og:title", content: "اتصل بنا — متعثرين فلسطين" },
      { property: "og:description", content: "واتساب وفيسبوك: قنوات التواصل الرسمية." },
    ],
  }),
  component: Contact,
});

function Contact() {
  return (
    <PublicLayout>
      <PageHeader
        title="اتصل بنا"
        description="قناتان رسميتان فقط للتواصل. أي حساب آخر يدّعي تمثيلنا لا نتحمّل مسؤوليته."
      />
      <div className="mx-auto w-full max-w-4xl px-4 py-12">
        <div className="grid gap-5 sm:grid-cols-2">
          <a
            href={SITE.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group rounded-xl border border-border bg-card p-7 transition hover:border-primary hover:shadow-sm"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#25D366]/15 text-[#1da851]">
              <MessageSquare className="h-6 w-6" />
            </span>
            <h2 className="mt-4 text-lg font-bold">واتساب</h2>
            <p className="mt-1 text-sm text-muted-foreground">الأسرع للاستفسار عن شكوى قائمة.</p>
            <p className="mt-3 font-semibold" dir="ltr">
              {SITE.whatsappNumber}
            </p>
            <span className="mt-4 inline-flex min-h-11 items-center justify-center rounded-lg bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground">
              فتح محادثة
            </span>
          </a>

          <a
            href={SITE.facebookUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group rounded-xl border border-border bg-card p-7 transition hover:border-primary hover:shadow-sm"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#1877F2]/15 text-[#1877F2]">
              <Facebook className="h-6 w-6" />
            </span>
            <h2 className="mt-4 text-lg font-bold">فيسبوك</h2>
            <p className="mt-1 text-sm text-muted-foreground">صفحة متعثرين فلسطين الرسمية.</p>
            <p className="mt-3 font-semibold">متعثرين فلسطين</p>
            <span className="mt-4 inline-flex min-h-11 items-center justify-center rounded-lg border border-border px-5 py-2.5 text-sm font-bold">
              زيارة الصفحة
            </span>
          </a>
        </div>

        <div className="mt-8 grid gap-5 sm:grid-cols-2">
          <div className="rounded-xl border border-border bg-secondary/40 p-6">
            <h3 className="flex items-center gap-2 font-bold">
              <Clock className="h-5 w-5 text-primary" /> أوقات الرد
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              نحاول الرد على الرسائل بأسرع وقت ممكن. الرسائل التي تتضمّن الرقم المرجعي تُعالج أولاً.
            </p>
          </div>
          <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-6">
            <h3 className="flex items-center gap-2 font-bold text-destructive">
              <ShieldAlert className="h-5 w-5" /> تنبيه أمان
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              لا نطلب أبداً رسوماً أو بيانات بنكية أو رموز تحقّق. أي رسالة تطلب ذلك باسمنا هي محاولة نصب.
            </p>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
