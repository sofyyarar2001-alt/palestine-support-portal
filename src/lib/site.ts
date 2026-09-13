export const SITE = {
  name: "متعثرين فلسطين",
  tagline: "الموقع الرسمي لصفحة متعثرين فلسطين",
  whatsappNumber: "+972568000119",
  whatsappUrl: "https://wa.me/972568000119",
  facebookUrl: "https://www.facebook.com/share/1bUrp2SxBd/",
  instagramUrl: "https://www.instagram.com/f90.xd/",
  developer: "أف تسعين",
  developerLatin: "F90 Web Development",
} as const;

export type ComplaintStatus = "new" | "in_review" | "needs_info" | "processed" | "closed";

export const STATUS_ORDER: ComplaintStatus[] = [
  "new",
  "in_review",
  "needs_info",
  "processed",
  "closed",
];

export const STATUS_LABELS: Record<ComplaintStatus, string> = {
  new: "تم الاستلام",
  in_review: "قيد المراجعة",
  needs_info: "تحتاج معلومات",
  processed: "تمت المعالجة",
  closed: "مغلقة",
};

export const STATUS_CLASSES: Record<ComplaintStatus, string> = {
  new: "bg-secondary text-secondary-foreground",
  in_review: "bg-gold/25 text-foreground",
  needs_info: "bg-destructive/15 text-destructive",
  processed: "bg-primary/15 text-primary",
  closed: "bg-muted text-muted-foreground",
};

export const COMPLAINT_CATEGORIES = [
  "مبالغ مالية غير مستردة",
  "تأخير في السداد",
  "نصب أو احتيال",
  "خلاف تجاري",
  "شيكات أو كمبيالات",
  "أخرى",
] as const;

export function formatArabicDate(value?: string | null) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("ar", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}
