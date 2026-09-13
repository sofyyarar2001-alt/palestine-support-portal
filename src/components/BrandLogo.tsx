/**
 * شعار مؤقت لـ "متعثرين فلسطين".
 * لاستبداله بشعار PNG شفاف لاحقاً: استورد الصورة وأعد <img /> بدل الـ SVG أدناه.
 */
export function BrandLogo({ className = "h-12 w-12" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      className={className}
      role="img"
      aria-label="شعار متعثرين فلسطين"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M32 3 57 11v22c0 14-10.5 23.5-25 28C17.5 56.5 7 47 7 33V11L32 3Z"
        fill="oklch(0.42 0.088 158)"
      />
      <path
        d="M32 7.5 52.5 14v19c0 11.6-8.6 19.6-20.5 23.5C20.1 52.6 11.5 44.6 11.5 33V14L32 7.5Z"
        fill="#ffffff"
        fillOpacity="0.96"
      />
      <rect x="21" y="16" width="22" height="27" rx="3" fill="oklch(0.965 0.018 95)" stroke="oklch(0.42 0.088 158)" strokeWidth="1.6" />
      <path d="M25.5 23h13M25.5 28h13M25.5 33h8" stroke="oklch(0.42 0.088 158)" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M22 47h20" stroke="oklch(0.52 0.19 26)" strokeWidth="2.6" strokeLinecap="round" />
      <circle cx="32" cy="43.5" r="2.4" fill="oklch(0.19 0.012 160)" />
    </svg>
  );
}
