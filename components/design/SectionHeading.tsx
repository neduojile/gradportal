interface SectionHeadingProps {
  badge?: string;
  title: string;
  description: string;
  center?: boolean;
}

export default function SectionHeading({
  badge,
  title,
  description,
  center = true,
}: SectionHeadingProps) {
  return (
    <div
      className={`mb-20 ${
        center ? "text-center" : ""
      }`}
    >
      {badge && (
        <span className="inline-flex rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-600">
          {badge}
        </span>
      )}

      <h2 className="mt-6 text-4xl font-black tracking-tight text-slate-900 md:text-5xl">
        {title}
      </h2>

      <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-slate-500">
        {description}
      </p>
    </div>
  );
}