import { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';

const navItems = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/dashboard/clients', label: 'Clients' },
  { to: '/dashboard/projects', label: 'Projects' },
  { to: '/dashboard/payments', label: 'Payments' },
];

export default function Dashboard() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="dashboard-shell">
      <button
        className="sidebar-toggle"
        onClick={() => setIsOpen((open) => !open)}
        type="button"
      >
        ☰
      </button>

      <aside className={`dashboard-sidebar ${isOpen ? 'open' : ''}`}>
        <h2>ProjectHub</h2>
        <nav>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/dashboard'}
              className={({ isActive }) => (isActive ? 'active-link' : '')}
              onClick={() => setIsOpen(false)}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <main className="dashboard-content" onClick={() => isOpen && setIsOpen(false)}>
        <Outlet />
      </main>

      <style>{`
        .dashboard-shell {
          display: grid;
          grid-template-columns: 280px 1fr;
          min-height: 100vh;
          background: #f5f6fa;
        }

        .sidebar-toggle {
          display: none;
          position: fixed;
          top: 12px;
          left: 12px;
          z-index: 20;
          border: none;
          border-radius: 8px;
          background: #111827;
          color: #fff;
          padding: 8px 10px;
          cursor: pointer;
        }

        .dashboard-sidebar {
          background: #111827;
          color: #fff;
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .dashboard-sidebar nav {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .dashboard-sidebar a {
          color: #d1d5db;
          text-decoration: none;
          padding: 10px 12px;
          border-radius: 8px;
        }

        .dashboard-sidebar a.active-link {
          background: #1f2937;
          color: #fff;
          font-weight: 600;
        }

        .dashboard-content {
          padding: 24px;
        }

        @media (max-width: 900px) {
          .dashboard-shell {
            grid-template-columns: 1fr;
          }

          .sidebar-toggle {
            display: block;
          }

          .dashboard-sidebar {
            position: fixed;
            top: 0;
            left: -100%;
            width: 260px;
            height: 100vh;
            z-index: 15;
            transition: left 0.2s ease;
          }

          .dashboard-sidebar.open {
            left: 0;
          }

          .dashboard-content {
            padding-top: 56px;
          }
        }
      `}</style>
    </div>
  );
}
