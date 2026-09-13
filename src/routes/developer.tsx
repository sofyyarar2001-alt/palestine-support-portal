import { createFileRoute } from "@tanstack/react-router";
import { Instagram } from "lucide-react";

import { PublicLayout } from "@/components/PublicLayout";
import { SITE } from "@/lib/site";

export const Route = createFileRoute("/developer")({
  head: () => ({
    meta: [
      { title: "المطوّر — أف تسعين | F90 Web Development" },
      {
        name: "description",
        content: "تم تطوير موقع متعثرين فلسطين بواسطة أف تسعين — F90 Web Development. تصميم وتطوير مواقع احترافية.",
      },
      { property: "og:title", content: "أف تسعين — F90 Web Development" },
      { property: "og:description", content: "تم تطوير هذا الموقع بواسطة أف تسعين." },
    ],
  }),
  component: Developer,
});

function Developer() {
  return (
    <PublicLayout>
      <section className="flex min-h-[72vh] items-center justify-center bg-ink px-4 py-20 text-center">
        <div className="w-full max-w-xl">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-white/50">Development</p>
          <h1 className="mt-6 font-display text-3xl font-bold text-white sm:text-4xl">
            تم تطوير هذا الموقع بواسطة {SITE.developer}
          </h1>
          <p className="mt-4 text-lg tracking-[0.2em] text-white/70" dir="ltr">
            {SITE.developerLatin}
          </p>
          <div className="mx-auto mt-10 h-px w-24 bg-white/20" />
          <p className="mt-8 text-sm leading-relaxed text-white/60">
            تصميم وتطوير مواقع وتطبيقات ويب بمعايير احترافية: أداء عالٍ، تجربة استخدام واضحة، وحماية للبيانات.
          </p>
          <a
            href={SITE.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-white/25 px-7 py-3 text-sm font-semibold text-white transition hover:bg-white hover:text-ink"
          >
            <Instagram className="h-4 w-4" />
            <span dir="ltr">@f90.xd</span>
          </a>
        </div>
      </section>
    </PublicLayout>
  );
}
