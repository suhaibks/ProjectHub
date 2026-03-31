import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4 text-center">
      <h1 className="text-3xl font-bold text-slate-900">ProjectHub</h1>
      <p className="mt-2 text-slate-600">Collaborate with your team and track delivery.</p>
      <div className="mt-6 flex gap-3">
        <Link to="/login" className="rounded-md bg-slate-900 px-4 py-2 text-white hover:bg-slate-700">
          Login
        </Link>
        <Link to="/signup" className="rounded-md border border-slate-300 px-4 py-2 text-slate-700 hover:bg-slate-100">
          Signup
        </Link>
      </div>
    </div>
  );
}
