import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/authContext';
import '../styles/Layout.css';

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Dashboard', roles: ['administrator', 'registrar', 'instructor', 'student'] },
  { to: '/students', label: 'Students', roles: ['administrator', 'registrar', 'instructor'] },
  { to: '/programs', label: 'Programs', roles: ['administrator', 'registrar'] },
  { to: '/courses', label: 'Courses', roles: ['administrator', 'registrar'] },
  { to: '/academic-terms', label: 'Academic Terms', roles: ['administrator', 'registrar'] },
  { to: '/course-offerings', label: 'Course Offerings', roles: ['administrator', 'registrar', 'instructor'] },
  { to: '/enrollments', label: 'Enrollments', roles: ['administrator', 'registrar'] },
  { to: '/grades', label: 'Grades', roles: ['administrator', 'registrar', 'instructor'] },
  { to: '/my-profile', label: 'My Profile', roles: ['student'] },
  { to: '/my-enrollments', label: 'My Enrollments', roles: ['student'] },
  { to: '/my-grades', label: 'My Grades', roles: ['student'] },
  { to: '/my-academic-record', label: 'My Academic Record', roles: ['student'] },
];

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const visibleItems = NAV_ITEMS.filter((item) => item.roles.includes(user?.role));

  async function handleLogout() {
    await logout();
    navigate('/login');
  }

  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="sidebar-header">
          <h2>SIMS</h2>
        </div>
        <nav className="sidebar-nav">
          {visibleItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <div className="main-area">
        <header className="topbar">
          <div className="user-info">
            <span className="user-name">{user?.name}</span>
            <span className="user-role">{user?.role}</span>
          </div>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </header>

        <main className="content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}