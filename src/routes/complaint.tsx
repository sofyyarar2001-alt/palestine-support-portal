import { Link, createFileRoute } from "@tanstack/react-router";
import { AlertCircle, CheckCircle2, Copy, FileText, Loader2, Paperclip, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { PublicLayout } from "@/components/PublicLayout";
import { SignaturePad } from "@/components/SignaturePad";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  newComplaintFolder,
  submitComplaint,
  uploadComplaintFile,
  uploadSignature,
  type ComplaintFormValues,
} from "@/lib/complaints";
import { COMPLAINT_CATEGORIES, SITE } from "@/lib/site";

export const Route = createFileRoute("/complaint")({
  head: () => ({
    meta: [
      { title: "تقديم شكوى — متعثرين فلسطين" },
      {
        name: "description",
        content: "قدّم شكوتك عبر خمس خطوات: البيانات الشخصية، تفاصيل الشكوى، المرفقات، التوقيع الإلكتروني، ثم المراجعة.",
      },
      { property: "og:title", content: "تقديم شكوى — متعثرين فلسطين" },
      { property: "og:description", content: "نموذج شكوى إلكتروني موثّق مع مرفقات وتوقيع." },
    ],
  }),
  component: ComplaintPage,
});

const STEP_TITLES = ["البيانات الشخصية", "تفاصيل الشكوى", "المرفقات", "التوقيع الإلكتروني", "المراجعة والإرسال"];

const EMPTY: ComplaintFormValues = {
  full_name: "",
  national_id: "",
  phone: "",
  email: "",
  city: "",
  address: "",
  category: COMPLAINT_CATEGORIES[0],
  respondent_name: "",
  subject: "",
  details: "",
  amount: "",
};

const MAX_FILES = 6;
const MAX_SIZE = 20 * 1024 * 1024;

type Errors = Partial<Record<keyof ComplaintFormValues | "signature" | "terms", string>>;

function ComplaintPage() {
  const [step, setStep] = useState(1);
  const [values, setValues] = useState<ComplaintFormValues>(EMPTY);
  const [files, setFiles] = useState<File[]>([]);
  const [signature, setSignature] = useState<string | null>(null);
  const [agreed, setAgreed] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ reference: string; offline: boolean } | null>(null);

  const set = (key: keyof ComplaintFormValues, v: string) => {
    setValues((prev) => ({ ...prev, [key]: v }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const digits = useMemo(() => values.phone.replace(/\D/g, ""), [values.phone]);

  function validate(current: number): boolean {
    const e: Errors = {};
    if (current === 1) {
      if (values.full_name.trim().length < 3) e.full_name = "أدخل الاسم الكامل (٣ أحرف على الأقل).";
      if (!/^\d{6,12}$/.test(values.national_id.trim()))
        e.national_id = "رقم الهوية يجب أن يكون بين ٦ و١٢ رقماً.";
      if (digits.length < 9) e.phone = "أدخل رقم هاتف صحيحاً (٩ أرقام على الأقل).";
      if (values.email.trim() && !/^\S+@\S+\.\S+$/.test(values.email.trim()))
        e.email = "صيغة البريد الإلكتروني غير صحيحة.";
      if (values.city.trim().length < 2) e.city = "أدخل المدينة أو المحافظة.";
    }
    if (current === 2) {
      if (!values.category) e.category = "اختر تصنيف الشكوى.";
      if (values.subject.trim().length < 5) e.subject = "أدخل موضوعاً واضحاً (٥ أحرف على الأقل).";
      if (values.details.trim().length < 20) e.details = "اشرح شكوتك بما لا يقل عن ٢٠ حرفاً.";
      if (values.amount.trim() && !/^\d+(\.\d{1,2})?$/.test(values.amount.trim()))
        e.amount = "أدخل المبلغ بالأرقام فقط.";
    }
    if (current === 4 && !signature) e.signature = "التوقيع الإلكتروني مطلوب للمتابعة.";
    if (current === 5 && !agreed) e.terms = "يجب الموافقة على الشروط والأحكام وسياسة الخصوصية.";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function next() {
    if (!validate(step)) {
      toast.error("يرجى تصحيح الحقول المطلوبة.");
      return;
    }
    setStep((s) => Math.min(5, s + 1));
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function back() {
    setErrors({});
    setStep((s) => Math.max(1, s - 1));
  }

  function addFiles(list: FileList | null) {
    if (!list) return;
    const incoming = Array.from(list);
    const accepted: File[] = [];
    for (const file of incoming) {
      if (file.size > MAX_SIZE) {
        toast.error(`الملف "${file.name}" أكبر من ٢٠ ميغابايت.`);
        continue;
      }
      accepted.push(file);
    }
    setFiles((prev) => [...prev, ...accepted].slice(0, MAX_FILES));
    if (files.length + accepted.length > MAX_FILES) {
      toast.error(`يمكن إرفاق ${MAX_FILES} ملفات كحد أقصى.`);
    }
  }

  async function handleSubmit() {
    if (!validate(5)) return;
    setSubmitting(true);
    try {
      const folder = newComplaintFolder();
      const uploaded = [];
      for (const file of files) {
        try {
          uploaded.push(await uploadComplaintFile(folder, file));
        } catch (error) {
          console.error("upload failed", error);
          toast.error(`لم يتم رفع الملف "${file.name}".`);
        }
      }
      let signaturePath: string | null = null;
      if (signature) {
        try {
          signaturePath = await uploadSignature(folder, signature);
        } catch (error) {
          console.error("signature upload failed", error);
        }
      }
      const res = await submitComplaint({ values, attachments: uploaded, signaturePath });
      setResult(res);
      if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      console.error(error);
      toast.error("تعذّر إرسال الشكوى، يرجى المحاولة مرة أخرى.");
    } finally {
      setSubmitting(false);
    }
  }

  if (result) {
    return (
      <PublicLayout compactFloating>
        <div className="mx-auto w-full max-w-2xl px-4 py-16 text-center">
          <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
            <CheckCircle2 className="h-8 w-8" />
          </span>
          <h1 className="mt-6 text-2xl font-bold sm:text-3xl">تم استلام شكوتك بنجاح</h1>
          <p className="mt-3 text-muted-foreground">
            احتفظ بالرقم المرجعي التالي، فهو وسيلتك لمتابعة حالة الشكوى.
          </p>
          <div className="mt-6 rounded-xl border border-border bg-card p-6">
            <p className="text-xs text-muted-foreground">الرقم المرجعي</p>
            <p className="mt-2 font-display text-2xl font-bold tracking-widest" dir="ltr">
              {result.reference}
            </p>
            <Button
              type="button"
              variant="outline"
              className="mt-4 min-h-11"
              onClick={() => {
                navigator.clipboard?.writeText(result.reference);
                toast.success("تم نسخ الرقم المرجعي.");
              }}
            >
              <Copy className="ml-1 h-4 w-4" /> نسخ الرقم
            </Button>
          </div>

          {result.offline && (
            <p className="mt-5 rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
              تعذّر حفظ الشكوى في النظام حالياً. يرجى إرسال الرقم المرجعي وتفاصيل شكوتك عبر واتساب حتى نضمن
              تسجيلها.
            </p>
          )}

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link
              to="/track"
              className="inline-flex min-h-12 items-center justify-center rounded-lg bg-primary px-6 py-3 text-sm font-bold text-primary-foreground"
            >
              متابعة الشكوى
            </Link>
            <a
              href={SITE.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-12 items-center justify-center rounded-lg border border-border px-6 py-3 text-sm font-bold hover:bg-secondary"
            >
              تواصل عبر واتساب
            </a>
          </div>
        </div>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout compactFloating>
      <div className="mx-auto w-full max-w-3xl px-4 py-10">
        <h1 className="text-2xl font-bold sm:text-3xl">تقديم شكوى</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          الخطوة {step} من 5 — {STEP_TITLES[step - 1]}
        </p>

        <ol className="mt-6 flex gap-1.5">
          {STEP_TITLES.map((title, i) => (
            <li key={title} className="flex-1">
              <div
                className={`h-1.5 rounded-full ${i + 1 <= step ? "bg-primary" : "bg-border"}`}
                aria-hidden="true"
              />
              <span className="mt-2 hidden text-xs text-muted-foreground sm:block">{title}</span>
            </li>
          ))}
        </ol>

        <div className="mt-8 rounded-xl border border-border bg-card p-5 sm:p-7">
          {step === 1 && (
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="الاسم الكامل" required error={errors.full_name} className="sm:col-span-2">
                <Input
                  value={values.full_name}
                  onChange={(e) => set("full_name", e.target.value)}
                  placeholder="مثال: محمد أحمد عبد الله"
                  className="min-h-12"
                  autoComplete="name"
                />
              </Field>
              <Field label="رقم الهوية" required error={errors.national_id}>
                <Input
                  value={values.national_id}
                  onChange={(e) => set("national_id", e.target.value.replace(/\D/g, ""))}
                  inputMode="numeric"
                  placeholder="٩ أرقام"
                  className="min-h-12"
                  dir="ltr"
                />
              </Field>
              <Field label="رقم الهاتف" required error={errors.phone}>
                <Input
                  value={values.phone}
                  onChange={(e) => set("phone", e.target.value)}
                  inputMode="tel"
                  placeholder="05XXXXXXXX"
                  className="min-h-12"
                  dir="ltr"
                  autoComplete="tel"
                />
              </Field>
              <Field label="البريد الإلكتروني (اختياري)" error={errors.email}>
                <Input
                  value={values.email}
                  onChange={(e) => set("email", e.target.value)}
                  type="email"
                  placeholder="name@example.com"
                  className="min-h-12"
                  dir="ltr"
                  autoComplete="email"
                />
              </Field>
              <Field label="المدينة / المحافظة" required error={errors.city}>
                <Input
                  value={values.city}
                  onChange={(e) => set("city", e.target.value)}
                  placeholder="مثال: غزة"
                  className="min-h-12"
                />
              </Field>
              <Field label="العنوان التفصيلي (اختياري)" className="sm:col-span-2">
                <Input
                  value={values.address}
                  onChange={(e) => set("address", e.target.value)}
                  placeholder="الحي، الشارع، علامة مميزة"
                  className="min-h-12"
                />
              </Field>
            </div>
          )}

          {step === 2 && (
            <div className="grid gap-5">
              <Field label="تصنيف الشكوى" required error={errors.category}>
                <select
                  value={values.category}
                  onChange={(e) => set("category", e.target.value)}
                  className="min-h-12 w-full rounded-md border border-input bg-background px-3 text-base"
                >
                  {COMPLAINT_CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="اسم المشتكى عليه (اختياري)">
                <Input
                  value={values.respondent_name}
                  onChange={(e) => set("respondent_name", e.target.value)}
                  placeholder="الشخص أو الجهة"
                  className="min-h-12"
                />
              </Field>
              <Field label="موضوع الشكوى" required error={errors.subject}>
                <Input
                  value={values.subject}
                  onChange={(e) => set("subject", e.target.value)}
                  placeholder="عنوان قصير يوضح الشكوى"
                  className="min-h-12"
                />
              </Field>
              <Field label="المبلغ المتعلق بالشكوى (اختياري)" error={errors.amount}>
                <Input
                  value={values.amount}
                  onChange={(e) => set("amount", e.target.value)}
                  inputMode="decimal"
                  placeholder="بالشيكل"
                  className="min-h-12"
                  dir="ltr"
                />
              </Field>
              <Field label="تفاصيل الشكوى" required error={errors.details}>
                <Textarea
                  value={values.details}
                  onChange={(e) => set("details", e.target.value)}
                  rows={8}
                  placeholder="اشرح ما حدث بالتسلسل: التواريخ، المبالغ، الوعود، وأي تفاصيل مهمة."
                  className="text-base"
                />
                <p className="mt-1 text-xs text-muted-foreground">
                  {values.details.trim().length} حرف — الحد الأدنى ٢٠ حرفاً.
                </p>
              </Field>
            </div>
          )}

          {step === 3 && (
            <div>
              <h2 className="text-lg font-bold">المرفقات الداعمة</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                أرفق إثباتات تحويل، شيكات، عقود، أو صور محادثات. حتى {MAX_FILES} ملفات، وبحد أقصى ٢٠ ميغابايت
                للملف. المرفقات اختيارية لكنها تسرّع المراجعة كثيراً.
              </p>

              <label className="mt-5 flex min-h-32 cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border bg-secondary/30 p-6 text-center transition hover:border-primary">
                <Paperclip className="h-6 w-6 text-primary" />
                <span className="text-sm font-semibold">اختر الملفات</span>
                <span className="text-xs text-muted-foreground">صور أو PDF</span>
                <input
                  type="file"
                  multiple
                  accept="image/*,application/pdf"
                  className="hidden"
                  onChange={(e) => {
                    addFiles(e.target.files);
                    e.target.value = "";
                  }}
                />
              </label>

              {files.length > 0 && (
                <ul className="mt-5 space-y-2">
                  {files.map((file, i) => (
                    <li
                      key={`${file.name}-${i}`}
                      className="flex items-center justify-between gap-3 rounded-lg border border-border p-3"
                    >
                      <span className="flex min-w-0 items-center gap-2">
                        <FileText className="h-4 w-4 shrink-0 text-muted-foreground" />
                        <span className="truncate text-sm">{file.name}</span>
                      </span>
                      <span className="flex items-center gap-3">
                        <span className="whitespace-nowrap text-xs text-muted-foreground">
                          {(file.size / 1024 / 1024).toFixed(2)} م.ب
                        </span>
                        <button
                          type="button"
                          onClick={() => setFiles((prev) => prev.filter((_, idx) => idx !== i))}
                          aria-label={`حذف ${file.name}`}
                          className="flex h-9 w-9 items-center justify-center rounded-md text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {step === 4 && (
            <div>
              <h2 className="text-lg font-bold">التوقيع الإلكتروني</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                بتوقيعك أدناه تقرّ بأن جميع البيانات والمرفقات صحيحة، وتتحمّل المسؤولية القانونية عنها.
              </p>
              <div className="mt-5">
                <SignaturePad
                  value={signature}
                  onChange={(v) => {
                    setSignature(v);
                    setErrors((prev) => ({ ...prev, signature: undefined }));
                  }}
                />
              </div>
              {errors.signature && <ErrorText>{errors.signature}</ErrorText>}
            </div>
          )}

          {step === 5 && (
            <div>
              <h2 className="text-lg font-bold">مراجعة الشكوى قبل الإرسال</h2>
              <dl className="mt-5 divide-y divide-border rounded-lg border border-border">
                {[
                  ["الاسم الكامل", values.full_name],
                  ["رقم الهوية", values.national_id],
                  ["رقم الهاتف", values.phone],
                  ["البريد الإلكتروني", values.email || "—"],
                  ["المدينة", values.city],
                  ["العنوان", values.address || "—"],
                  ["التصنيف", values.category],
                  ["المشتكى عليه", values.respondent_name || "—"],
                  ["الموضوع", values.subject],
                  ["المبلغ", values.amount || "—"],
                  ["المرفقات", files.length ? `${files.length} ملف` : "لا يوجد"],
                  ["التوقيع", signature ? "تم التوقيع" : "غير موقّع"],
                ].map(([label, value]) => (
                  <div key={label} className="grid gap-1 p-3 sm:grid-cols-[10rem_1fr]">
                    <dt className="text-xs font-semibold text-muted-foreground">{label}</dt>
                    <dd className="break-words text-sm">{value}</dd>
                  </div>
                ))}
                <div className="grid gap-1 p-3 sm:grid-cols-[10rem_1fr]">
                  <dt className="text-xs font-semibold text-muted-foreground">التفاصيل</dt>
                  <dd className="whitespace-pre-wrap text-sm leading-relaxed">{values.details}</dd>
                </div>
              </dl>

              <label className="mt-6 flex cursor-pointer items-start gap-3 rounded-lg border border-border bg-secondary/30 p-4">
                <Checkbox
                  checked={agreed}
                  onCheckedChange={(v) => {
                    setAgreed(Boolean(v));
                    setErrors((prev) => ({ ...prev, terms: undefined }));
                  }}
                  className="mt-0.5 h-5 w-5"
                />
                <span className="text-sm leading-relaxed">
                  أقرّ بأن جميع البيانات صحيحة، وأوافق على{" "}
                  <Link to="/terms" className="font-semibold underline">
                    الشروط والأحكام
                  </Link>{" "}
                  و
                  <Link to="/privacy" className="font-semibold underline">
                    سياسة الخصوصية
                  </Link>
                  . <span className="text-destructive">(مطلوب)</span>
                </span>
              </label>
              {errors.terms && <ErrorText>{errors.terms}</ErrorText>}
            </div>
          )}

          <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
            <Button
              type="button"
              variant="outline"
              className="min-h-12"
              onClick={back}
              disabled={step === 1 || submitting}
            >
              السابق
            </Button>
            {step < 5 ? (
              <Button type="button" className="min-h-12 sm:px-8" onClick={next}>
                التالي
              </Button>
            ) : (
              <Button type="button" className="min-h-12 sm:px-8" onClick={handleSubmit} disabled={submitting}>
                {submitting && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
                إرسال الشكوى
              </Button>
            )}
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          بياناتك تُعالج بسرية تامة ولا تُنشر. اقرأ{" "}
          <Link to="/privacy" className="underline">
            سياسة الخصوصية
          </Link>
          .
        </p>
      </div>
    </PublicLayout>
  );
}

function Field({
  label,
  required,
  error,
  className = "",
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={className}>
      <Label className="mb-2 block text-sm font-semibold">
        {label} {required && <span className="text-destructive">*</span>}
      </Label>
      {children}
      {error && <ErrorText>{error}</ErrorText>}
    </div>
  );
}

function ErrorText({ children }: { children: React.ReactNode }) {
  return (
    <p className="mt-2 flex items-center gap-1.5 text-sm font-medium text-destructive">
      <AlertCircle className="h-4 w-4" /> {children}
    </p>
  );
}
