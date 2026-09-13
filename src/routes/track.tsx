import { createFileRoute } from "@tanstack/react-router";
import { AlertCircle, CheckCircle2, Circle, Loader2, Search } from "lucide-react";
import { useState } from "react";

import { PageHeader } from "@/components/PageHeader";
import { PublicLayout } from "@/components/PublicLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { trackComplaint, type TrackResult } from "@/lib/complaints";
import { STATUS_LABELS, STATUS_ORDER, formatArabicDate, type ComplaintStatus } from "@/lib/site";

export const Route = createFileRoute("/track")({
  head: () => ({
    meta: [
      { title: "متابعة شكوى — متعثرين فلسطين" },
      {
        name: "description",
        content: "تابع حالة شكوتك بالرقم المرجعي وآخر 4 أرقام من رقم هاتفك، دون كشف أي بيانات شخصية.",
      },
      { property: "og:title", content: "متابعة شكوى — متعثرين فلسطين" },
      { property: "og:description", content: "تابع مسار شكوتك من الاستلام حتى الإغلاق." },
    ],
  }),
  component: TrackPage,
});

function TrackPage() {
  const [reference, setReference] = useState("");
  const [last4, setLast4] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<TrackResult | null>(null);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setResult(null);

    if (!/^MP-\d{4}-[A-Za-z0-9]{6,12}$/.test(reference.trim())) {
      setError("صيغة الرقم المرجعي غير صحيحة. المثال: MP-2026-A1B2C3D4");
      return;
    }
    if (!/^\d{4}$/.test(last4.trim())) {
      setError("أدخل آخر ٤ أرقام من رقم الهاتف.");
      return;
    }

    setLoading(true);
    try {
      const data = await trackComplaint(reference, last4);
      if (!data.found) {
        setError("لا توجد شكوى مطابقة. تأكد من الرقم المرجعي وآخر ٤ أرقام من الهاتف.");
      } else {
        setResult(data);
      }
    } catch (err) {
      console.error(err);
      setError("تعذّر جلب حالة الشكوى حالياً. حاول لاحقاً أو تواصل معنا عبر واتساب.");
    } finally {
      setLoading(false);
    }
  }

  const currentIndex = result?.status ? STATUS_ORDER.indexOf(result.status) : -1;

  return (
    <PublicLayout>
      <PageHeader
        title="متابعة شكوى"
        description="أدخل الرقم المرجعي وآخر ٤ أرقام من هاتفك. تظهر حالة الشكوى فقط دون أي بيانات شخصية."
      />

      <div className="mx-auto w-full max-w-2xl px-4 py-12">
        <form onSubmit={onSubmit} className="rounded-xl border border-border bg-card p-6">
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Label className="mb-2 block text-sm font-semibold">
                الرقم المرجعي <span className="text-destructive">*</span>
              </Label>
              <Input
                value={reference}
                onChange={(e) => setReference(e.target.value.toUpperCase())}
                placeholder="MP-2026-A1B2C3D4"
                className="min-h-12 tracking-widest"
                dir="ltr"
              />
            </div>
            <div>
              <Label className="mb-2 block text-sm font-semibold">
                آخر ٤ أرقام من الهاتف <span className="text-destructive">*</span>
              </Label>
              <Input
                value={last4}
                onChange={(e) => setLast4(e.target.value.replace(/\D/g, "").slice(0, 4))}
                inputMode="numeric"
                placeholder="1234"
                className="min-h-12 tracking-widest"
                dir="ltr"
              />
            </div>
            <div className="flex items-end">
              <Button type="submit" className="min-h-12 w-full" disabled={loading}>
                {loading ? <Loader2 className="ml-2 h-4 w-4 animate-spin" /> : <Search className="ml-2 h-4 w-4" />}
                استعلام
              </Button>
            </div>
          </div>

          {error && (
            <p className="mt-5 flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm font-medium text-destructive">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" /> {error}
            </p>
          )}
        </form>

        {result?.found && (
          <div className="mt-8 rounded-xl border border-border bg-card p-6">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4">
              <div>
                <p className="text-xs text-muted-foreground">الرقم المرجعي</p>
                <p className="font-display text-lg font-bold tracking-widest" dir="ltr">
                  {result.reference}
                </p>
              </div>
              <span className="rounded-full bg-primary/10 px-4 py-1.5 text-sm font-bold text-primary">
                {STATUS_LABELS[result.status as ComplaintStatus]}
              </span>
            </div>

            <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-xs text-muted-foreground">التصنيف</dt>
                <dd className="font-medium">{result.category}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">تاريخ التقديم</dt>
                <dd className="font-medium">{formatArabicDate(result.created_at)}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">آخر تحديث</dt>
                <dd className="font-medium">{formatArabicDate(result.updated_at)}</dd>
              </div>
            </dl>

            <h2 className="mt-8 text-base font-bold">مسار الحالة</h2>
            <ol className="mt-4 space-y-0">
              {STATUS_ORDER.map((status, i) => {
                const reached = i <= currentIndex;
                const at = result.history?.find((h) => h.to_status === status)?.created_at;
                return (
                  <li key={status} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      {reached ? (
                        <CheckCircle2 className="h-6 w-6 text-primary" />
                      ) : (
                        <Circle className="h-6 w-6 text-border" />
                      )}
                      {i < STATUS_ORDER.length - 1 && (
                        <span className={`w-0.5 flex-1 ${i < currentIndex ? "bg-primary" : "bg-border"}`} />
                      )}
                    </div>
                    <div className="pb-6">
                      <p className={`font-semibold ${reached ? "" : "text-muted-foreground"}`}>
                        {STATUS_LABELS[status]}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {at ? formatArabicDate(at) : reached ? "—" : "لم يتم بعد"}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ol>

            <p className="rounded-lg bg-secondary/50 p-4 text-xs leading-relaxed text-muted-foreground">
              لأسباب تتعلق بالخصوصية، لا تُعرض في هذه الصفحة البيانات الشخصية ولا المرفقات ولا الملاحظات
              الداخلية الخاصة بالمراجعة.
            </p>
          </div>
        )}
      </div>
    </PublicLayout>
  );
}
