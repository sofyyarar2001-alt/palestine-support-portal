import { Link, createFileRoute } from "@tanstack/react-router";
import { ClipboardList, FileSearch, Lock, MessageSquare, ShieldCheck, Signature } from "lucide-react";

import { BrandLogo } from "@/components/BrandLogo";
import { PublicLayout } from "@/components/PublicLayout";
import { SITE } from "@/lib/site";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "متعثرين فلسطين — تقديم ومتابعة الشكاوى إلكترونياً" },
      {
        name: "description",
        content:
          "الموقع الرسمي لصفحة متعثرين فلسطين. قدّم شكوتك إلكترونياً مع المرفقات والتوقيع، وتابع حالتها برقم مرجعي بخصوصية تامة.",
      },
      { property: "og:title", content: "متعثرين فلسطين — الموقع الرسمي" },
      {
        property: "og:description",
        content: "قدّم شكوتك إلكترونياً وتابع حالتها برقم مرجعي، بخصوصية وسرية تامة.",
      },
    ],
  }),
  component: Home,
});

const STEPS = [
  { icon: ClipboardList, title: "املأ بياناتك", text: "أدخل بياناتك الشخصية بدقة حتى نتمكن من التحقق من الشكوى ومتابعتها." },
  { icon: FileSearch, title: "اشرح شكوتك", text: "وضّح موضوع الشكوى وتفاصيلها والمبلغ إن وجد، وأرفق ما يدعم روايتك." },
  { icon: Signature, title: "وقّع إلكترونياً", text: "وقّع بإصبعك أو بالفأرة داخل الموقع للإقرار بصحة ما ورد في الشكوى." },
  { icon: ShieldCheck, title: "تابع الحالة", text: "استلم رقماً مرجعياً واستخدمه مع آخر 4 أرقام من هاتفك لمتابعة الحالة." },
];

function Home() {
  return (
    <PublicLayout>
      <section className="hero-pattern border-b border-border">
        <div className="mx-auto grid w-full max-w-6xl items-center gap-10 px-4 py-14 sm:py-20 lg:grid-cols-[1.15fr_0.85fr]">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-semibold text-muted-foreground">
              <Lock className="h-3.5 w-3.5" /> منصّة مستقلة · سرية تامة
            </span>
            <h1 className="mt-5 text-3xl font-extrabold leading-tight sm:text-5xl">
              {SITE.tagline}
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              منصّة إلكترونية لاستلام شكاوى المتعثرين وتنظيمها ومتابعتها خطوة بخطوة. قدّم شكوتك مرة واحدة،
              واحصل على رقم مرجعي تتابع به الحالة في أي وقت دون الحاجة لحساب أو كلمة مرور.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/complaint"
                className="inline-flex h-13 min-h-12 items-center justify-center rounded-lg bg-primary px-7 py-3 text-base font-bold text-primary-foreground transition hover:opacity-90"
              >
                تقديم شكوى
              </Link>
              <Link
                to="/track"
                className="inline-flex min-h-12 items-center justify-center rounded-lg border border-border bg-card px-7 py-3 text-base font-bold transition hover:bg-secondary"
              >
                متابعة شكوى
              </Link>
            </div>
            <p className="mt-5 text-sm text-muted-foreground">
              للاستفسار السريع:{" "}
              <a
                href={SITE.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-foreground underline"
                dir="ltr"
              >
                {SITE.whatsappNumber}
              </a>
            </p>
          </div>

          <div className="relative mx-auto w-full max-w-sm rounded-2xl border border-border bg-card p-8 text-center shadow-sm">
            <BrandLogo className="mx-auto h-28 w-28" />
            <h2 className="mt-4 text-xl font-bold">{SITE.name}</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              شعار مؤقت — قابل للاستبدال بالشعار الرسمي في أي وقت.
            </p>
            <div className="mt-6 grid grid-cols-3 gap-2 text-xs">
              <div className="rounded-lg bg-secondary p-3 font-semibold">استلام</div>
              <div className="rounded-lg bg-secondary p-3 font-semibold">مراجعة</div>
              <div className="rounded-lg bg-secondary p-3 font-semibold">معالجة</div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 py-14">
        <h2 className="text-center text-2xl font-bold sm:text-3xl">كيف يعمل الموقع؟</h2>
        <p className="mx-auto mt-3 max-w-2xl text-center text-muted-foreground">
          أربع خطوات واضحة من لحظة تقديم الشكوى حتى إغلاقها.
        </p>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, i) => (
            <div key={step.title} className="rounded-xl border border-border bg-card p-6">
              <div className="flex items-center justify-between">
                <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <step.icon className="h-5 w-5" />
                </span>
                <span className="font-display text-3xl font-bold text-border">{i + 1}</span>
              </div>
              <h3 className="mt-4 text-lg font-bold">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-border bg-secondary/40">
        <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-14 lg:grid-cols-2">
          <div>
            <h2 className="text-2xl font-bold sm:text-3xl">ما هذه المنصّة؟</h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              منصّة {SITE.name} هي منصّة إلكترونية مستقلة مرتبطة بصفحة "متعثرين فلسطين"، تهدف إلى تنظيم
              استلام الشكاوى وأرشفتها ومتابعتها بشكل موثّق وواضح. المنصّة ليست جهة حكومية ولا قضائية،
              ولا تُصدر أحكاماً أو قرارات ملزمة، بل تعمل على توثيق الشكوى وترتيبها لتسهيل معالجتها.
            </p>
            <ul className="mt-6 space-y-3 text-sm">
              {[
                "تقديم الشكوى مجاناً ومن الهاتف مباشرة.",
                "رقم مرجعي فوري لكل شكوى بصيغة MP-YYYY-XXXXXXXX.",
                "المرفقات والتوقيع محفوظة في مساحة خاصة لا يصل إليها إلا المشرفون.",
                "لا نطلب أي رسوم أو معلومات بنكية أو كلمات مرور.",
              ].map((item) => (
                <li key={item} className="flex gap-2">
                  <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <span className="text-muted-foreground">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-xl border border-border bg-card p-7">
            <h3 className="flex items-center gap-2 text-lg font-bold">
              <Lock className="h-5 w-5 text-primary" /> تنبيه الخصوصية
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              نتعامل مع بياناتك بسرية تامة. لا تُنشر بياناتك الشخصية ولا تفاصيل شكوتك على الصفحة أو لأي طرف
              غير مختص. صفحة المتابعة تُظهر حالة الشكوى فقط، ولا تكشف الاسم أو الهاتف أو الملاحظات الداخلية.
              لمزيد من التفاصيل اقرأ{" "}
              <Link to="/privacy" className="font-semibold text-foreground underline">
                سياسة الخصوصية
              </Link>{" "}
              و{" "}
              <Link to="/terms" className="font-semibold text-foreground underline">
                الشروط والأحكام
              </Link>
              .
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <a
                href={SITE.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-bold text-primary-foreground"
              >
                <MessageSquare className="h-4 w-4" /> واتساب
              </a>
              <a
                href={SITE.facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-12 flex-1 items-center justify-center rounded-lg border border-border px-5 py-3 text-sm font-bold hover:bg-secondary"
              >
                صفحة فيسبوك
              </a>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
