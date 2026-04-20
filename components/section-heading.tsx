type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  description: string;
};

export function SectionHeading({
  eyebrow,
  title,
  description
}: SectionHeadingProps) {
  return (
    <div className="max-w-3xl">
      <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand-600">
        {eyebrow}
      </p>
      <h2 className="mt-3 text-3xl font-semibold text-ink">{title}</h2>
      <p className="mt-3 text-slate-600">{description}</p>
    </div>
  );
}
