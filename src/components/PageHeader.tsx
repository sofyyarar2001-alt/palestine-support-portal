export function PageHeader({ title, description }: { title: string; description?: string }) {
  return (
    <section className="hero-pattern border-b border-border bg-secondary/30">
      <div className="mx-auto w-full max-w-4xl px-4 py-12 text-center sm:py-16">
        <h1 className="text-3xl font-bold sm:text-4xl">{title}</h1>
        {description && (
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground">
            {description}
          </p>
        )}
      </div>
    </section>
  );
}
