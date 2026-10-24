import Link from "next/link";

export default function BusinessReviewsPage() {
  return (
    <main className="space-y-6">
      <div>
        <p className="text-sm font-medium text-orange-600">Feedback</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">Reviews</h1>
        <p className="mt-2 text-sm text-slate-500">Manage feedback and improve your candidate experience.</p>
      </div>
      <section className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm sm:p-12">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-50 text-2xl text-orange-600">R</div>
        <h2 className="mt-5 text-xl font-semibold text-slate-900">Reviews are not available yet</h2>
        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
          The current database workflow does not yet provide business reviews. This page is ready for a future feedback and rating system.
        </p>
        <Link href="/business/profile" className="mt-6 inline-flex rounded-xl bg-orange-600 px-5 py-3 text-sm font-semibold text-white hover:bg-orange-700">
          View company profile
        </Link>
      </section>
    </main>
  );
}