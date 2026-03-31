import { useAuth } from '../context/AuthContext';

export default function Topbar() {
  const { user, logout } = useAuth();

  return (
    <header className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3">
      <div>
        <h1 className="text-lg font-semibold text-slate-900">ProjectHub</h1>
        <p className="text-xs text-slate-500">{user?.email}</p>
      </div>
      <button
        type="button"
        onClick={logout}
        className="rounded-md bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-700"
      >
        Logout
      </button>
    </header>
  );
}
