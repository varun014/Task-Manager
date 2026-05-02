import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      <section className="w-full max-w-lg rounded-2xl border border-teal-100 bg-white p-8 text-center shadow-card">
        <p className="text-sm font-semibold uppercase tracking-widest text-coral">404</p>
        <h1 className="mt-2 text-3xl font-bold text-ink">Page Not Found</h1>
        <p className="mt-2 text-sm text-slate-600">The page you are looking for does not exist.</p>
        <Link
          to="/dashboard"
          className="mt-5 inline-block rounded-xl bg-sea px-4 py-2 text-sm font-semibold text-white hover:bg-teal-700"
        >
          Go to Dashboard
        </Link>
      </section>
    </main>
  );
};

export default NotFoundPage;
