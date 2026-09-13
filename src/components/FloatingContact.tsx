import { SITE } from "@/lib/site";

export function FloatingContact({ compact = false }: { compact?: boolean }) {
  return (
    <div
      className={`pointer-events-none fixed z-40 flex flex-col gap-3 ${
        compact ? "bottom-3 left-3" : "bottom-5 left-4 sm:bottom-6 sm:left-6"
      }`}
    >
      <a
        href={SITE.whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="تواصل عبر واتساب"
        className="pointer-events-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition hover:scale-105 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      >
        <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor" aria-hidden="true">
          <path d="M17.47 14.38c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.67.15-.2.3-.77.96-.95 1.16-.17.2-.35.22-.65.07-.3-.15-1.27-.47-2.42-1.5-.9-.8-1.5-1.79-1.67-2.09-.17-.3-.02-.46.13-.61.15-.15.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.68-1.62-.93-2.2-.24-.58-.49-.5-.67-.5h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.01-1.04 2.46s1.06 2.86 1.21 3.06c.15.2 2.05 3.28 5.02 4.46 2.47.98 2.97.79 3.51.74.54-.05 1.74-.71 1.99-1.4.25-.69.25-1.28.17-1.4-.07-.12-.27-.2-.57-.35ZM12 22a9.9 9.9 0 0 1-5.05-1.38L3 22l1.42-3.86A9.9 9.9 0 0 1 2 12C2 6.48 6.48 2 12 2s10 4.48 10 10-4.48 10-10 10Z" />
        </svg>
      </a>
      <a
        href={SITE.facebookUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="صفحتنا على فيسبوك"
        className="pointer-events-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#1877F2] text-white shadow-lg transition hover:scale-105 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      >
        <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor" aria-hidden="true">
          <path d="M13.5 21v-7.5h2.6l.4-3h-3V8.6c0-.87.24-1.46 1.48-1.46H17V4.4c-.27-.04-1.2-.12-2.28-.12-2.26 0-3.8 1.38-3.8 3.9v2.32H8.3v3h2.62V21h2.58Z" />
        </svg>
      </a>
    </div>
  );
}
