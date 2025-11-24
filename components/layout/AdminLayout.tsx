
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const navLinkClass = ({ isActive }: { isActive: boolean }): string =>
    `flex items-center p-3 my-1 rounded-lg transition-colors duration-200 ${
      isActive ? 'bg-brand-primary text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
    }`;

  return (
    <div className="flex h-screen bg-brand-bg text-brand-text">
      <aside className="w-64 bg-brand-surface flex flex-col p-4">
        <h1 className="text-2xl font-bold mb-8 text-center text-brand-secondary">Adept Play Admin</h1>
        <nav className="flex-grow">
          <NavLink to="/admin/dashboard" className={navLinkClass}><i className="fas fa-tachometer-alt w-6 mr-3"></i>Dashboard</NavLink>
          <NavLink to="/admin/tournaments" className={navLinkClass}><i className="fas fa-trophy w-6 mr-3"></i>Tournaments</NavLink>
          <NavLink to="/admin/users" className={navLinkClass}><i className="fas fa-users w-6 mr-3"></i>Users</NavLink>
          <NavLink to="/admin/settings" className={navLinkClass}><i className="fas fa-cog w-6 mr-3"></i>Settings</NavLink>
        </nav>
        <button
          onClick={handleLogout}
          className="w-full bg-brand-danger text-white font-bold py-2 px-4 rounded-lg hover:bg-red-700 transition-colors"
        >
          <i className="fas fa-sign-out-alt mr-2"></i>Logout
        </button>
      </aside>
      <main className="flex-1 overflow-y-auto p-6">
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;
