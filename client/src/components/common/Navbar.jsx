import { Link, NavLink } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import Button from './Button';

const navClass = ({ isActive }) =>
  `rounded-lg px-3 py-2 text-sm font-semibold transition ${
    isActive ? 'bg-teal-100 text-sea' : 'text-slate-600 hover:bg-slate-100'
  }`;

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-40 border-b border-teal-100 bg-white/90 backdrop-blur">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-3 md:px-6">
        <div className="flex items-center gap-4">
          <Link to="/dashboard" className="text-xl font-bold text-ink">
            Team Task Manager
          </Link>
          <nav className="hidden items-center gap-2 md:flex">
            <NavLink to="/dashboard" className={navClass}>
              Dashboard
            </NavLink>
            <NavLink to="/projects" className={navClass}>
              Projects
            </NavLink>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <p className="hidden text-sm text-slate-600 sm:block">
            Signed in as <span className="font-semibold text-ink">{user?.name || 'User'}</span>
          </p>
          <Button variant="secondary" onClick={logout}>
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
