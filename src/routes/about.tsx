import { createFileRoute } from "@tanstack/react-router";

import { PageHeader } from "@/components/PageHeader";
import { PublicLayout } from "@/components/PublicLayout";
import { SITE } from "@/lib/site";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "من نحن — متعثرين فلسطين" },
      {
        name: "description",
        content: "متعثرين فلسطين منصّة إلكترونية مستقلة مرتبطة بالصفحة، غير حكومية، مهمتها تنظيم الشكاوى ومتابعتها.",
      },
      { property: "og:title", content: "من نحن — متعثرين فلسطين" },
      { property: "og:description", content: "منصّة مستقلة غير حكومية لتوثيق الشكاوى ومتابعتها." },
    ],
  }),
  component: About,
});

function About() {
  return (
    <PublicLayout>
      <PageHeader
        title="من نحن"
        description={`${SITE.name} منصّة إلكترونية مستقلة مرتبطة بصفحة "متعثرين فلسطين"، مهمتها تنظيم استلام الشكاوى وتوثيقها ومتابعتها.`}
      />
      <div className="mx-auto w-full max-w-3xl space-y-8 px-4 py-12 leading-relaxed">
        <section>
          <h2 className="text-xl font-bold">هويتنا</h2>
          <p className="mt-3 text-muted-foreground">
            نحن فريق تطوعي يدير صفحة "متعثرين فلسطين" على منصات التواصل. أنشأنا هذا الموقع لأن عدد الرسائل
            الواردة تجاوز قدرة الصفحة على التنظيم، فصار من الضروري وجود مسار واضح: نموذج موحّد، رقم مرجعي،
            ومسار متابعة يعرف صاحب الشكوى من خلاله موقع شكوته.
          </p>
        </section>

        <section className="rounded-xl border border-destructive/30 bg-destructive/5 p-6">
          <h2 className="text-xl font-bold text-destructive">توضيح مهم: نحن جهة غير حكومية</h2>
          <ul className="mt-3 list-inside list-disc space-y-2 text-sm text-muted-foreground">
            <li>هذه المنصّة ليست جهة حكومية ولا قضائية ولا أمنية، ولا تمثّل أي وزارة أو مؤسسة رسمية.</li>
            <li>لا نُصدر أحكاماً ولا قرارات ملزمة، ولا نُنفّذ تحصيلاً للأموال.</li>
            <li>لا نطلب رسوماً مقابل تقديم الشكوى أو متابعتها، ولا نطلب بيانات بنكية أو كلمات مرور.</li>
            <li>الشكوى المقدَّمة هنا لا تُغني عن اللجوء إلى الجهات المختصة عند الحاجة.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold">ماذا نفعل بالشكوى؟</h2>
          <ol className="mt-3 list-inside list-decimal space-y-2 text-muted-foreground">
            <li>نستلم الشكوى ونمنحها رقماً مرجعياً فورياً.</li>
            <li>نراجع البيانات والمرفقات للتأكد من اكتمالها ووضوحها.</li>
            <li>نطلب معلومات إضافية إذا كانت الشكوى ناقصة.</li>
            <li>ننظّم الشكوى ونوثّقها ونتابعها حتى إغلاق الحالة.</li>
          </ol>
        </section>

        <section>
          <h2 className="text-xl font-bold">قيمنا</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            {[
              { t: "السرية", d: "لا نشر لبيانات أي شخص، ولا مشاركة مع أطراف غير مختصة." },
              { t: "الحياد", d: "نتعامل مع كل شكوى كمعلومة تحتاج تحقّقاً، لا كحكم مسبق." },
              { t: "الوضوح", d: "حالة كل شكوى معروفة لصاحبها في أي لحظة." },
            ].map((v) => (
              <div key={v.t} className="rounded-lg border border-border bg-card p-5">
                <h3 className="font-bold">{v.t}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{v.d}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </PublicLayout>
  );
}
