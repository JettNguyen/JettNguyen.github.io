import Link from "next/link";

export default function NotFound() {
  return (
    <section className="py-24">
      <div className="container-shell max-w-2xl">
        <div className="card text-center">
          <p className="text-sm text-muted">404</p>
          <h1 className="mt-2 text-2xl font-semibold text-text">Page not found</h1>
          <p className="mt-2 text-sm text-muted">This route does not exist in the current digital lab map.</p>
          <Link href="/" className="mt-4 inline-flex text-sm text-accent-soft hover:text-accent">
            Return home
          </Link>
        </div>
      </div>
    </section>
  );
}
