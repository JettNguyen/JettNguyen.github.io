import Link from "next/link";

export function PreviewCard({ title, description, href }: { title: string; description: string; href: string }) {
  return (
    <Link
      href={href}
      className="group card block transition duration-300 motion-safe:hover:-translate-y-1 motion-safe:hover:scale-[1.01] hover:border-accent/60 hover:shadow-accent-sm motion-safe:active:scale-[0.99]"
    >
      <h3 className="text-lg font-semibold text-text transition group-hover:text-accent-soft">{title}</h3>
      <p className="mt-2 text-sm text-muted">{description}</p>
      <span className="mt-4 inline-block text-xs font-medium uppercase tracking-[0.15em] text-accent-soft">Explore</span>
    </Link>
  );
}
