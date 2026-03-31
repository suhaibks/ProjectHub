import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { to: '/dashboard', label: 'Overview' },
  { to: '/dashboard/clients', label: 'Clients' },
  { to: '/dashboard/projects', label: 'Projects' },
  { to: '/dashboard/payments', label: 'Payments' },
];

export default function Sidebar() {
  const { logout } = useAuth();

  return (
    <aside className="w-full border-r border-slate-200 bg-white p-3 md:w-64">
      <nav className="space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/dashboard'}
            className={({ isActive }) =>
              `block rounded-md px-3 py-2 text-sm ${
                isActive ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>

      <button
        type="button"
        onClick={logout}
        className="mt-5 w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-700 hover:bg-slate-100"
      >
        Logout
      </button>
    </aside>
  );
}
