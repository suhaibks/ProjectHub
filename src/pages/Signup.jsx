import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Signup() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (!form.name.trim() || !form.email.trim() || !form.password.trim()) {
      setError('Name, email, and password are required.');
      return;
    }

    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      setSubmitting(true);
      await signup({ name: form.name, email: form.email.trim(), password: form.password });
      navigate('/dashboard', { replace: true });
    } catch (authError) {
      setError(authError?.message || 'Failed to create account.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <form onSubmit={handleSubmit} className="w-full max-w-sm rounded-xl bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-900">Create account</h1>
        <p className="mt-1 text-sm text-slate-500">Start managing projects in minutes.</p>

        <div className="mt-5 space-y-4">
          <label className="block text-sm">
            <span className="mb-1 block text-slate-700">Name</span>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full rounded-md border border-slate-300 px-3 py-2 outline-none ring-slate-200 focus:ring"
              placeholder="Jane Doe"
            />
          </label>

          <label className="block text-sm">
            <span className="mb-1 block text-slate-700">Email</span>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full rounded-md border border-slate-300 px-3 py-2 outline-none ring-slate-200 focus:ring"
              placeholder="you@example.com"
            />
          </label>

          <label className="block text-sm">
            <span className="mb-1 block text-slate-700">Password</span>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="w-full rounded-md border border-slate-300 px-3 py-2 outline-none ring-slate-200 focus:ring"
              placeholder="At least 6 characters"
            />
          </label>

          <label className="block text-sm">
            <span className="mb-1 block text-slate-700">Confirm password</span>
            <input
              type="password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              className="w-full rounded-md border border-slate-300 px-3 py-2 outline-none ring-slate-200 focus:ring"
              placeholder="Re-enter password"
            />
          </label>
        </div>

        {error && <p className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="mt-5 w-full rounded-md bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-700 disabled:opacity-60"
        >
          {submitting ? 'Creating account...' : 'Sign up'}
        </button>

        <p className="mt-4 text-center text-sm text-slate-600">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-slate-900 underline">
            Log in
          </Link>
        </p>
      </form>
    </div>
  );
}
