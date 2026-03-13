export function SiteFooter() {
  return (
    <footer className="border-t border-line/80 bg-ink/70 py-8">
      <div className="container-shell flex flex-wrap items-center justify-between gap-2 text-sm text-muted">
        <p>© {new Date().getFullYear()} Jett Nguyen</p>
        <p>Built as a static Next.js export for GitHub Pages.</p>
      </div>
    </footer>
  );
}
