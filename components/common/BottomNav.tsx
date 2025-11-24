
import React from 'react';
import { NavLink } from 'react-router-dom';

const BottomNav: React.FC = () => {
  const navLinkClass = ({ isActive }: { isActive: boolean }): string =>
    `flex flex-col items-center justify-center w-full transition-colors duration-200 ${isActive ? 'text-brand-secondary' : 'text-brand-text-secondary hover:text-brand-text'}`;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-brand-surface p-2 flex justify-around items-center border-t border-gray-700 shadow-lg z-10">
      <NavLink to="/" end className={navLinkClass}>
        <i className="fa-solid fa-house text-xl mb-1"></i>
        <span className="text-xs">Home</span>
      </NavLink>
      <NavLink to="/my-tournaments" className={navLinkClass}>
        <i className="fa-solid fa-trophy text-xl mb-1"></i>
        <span className="text-xs">My Tournaments</span>
      </NavLink>
      <NavLink to="/wallet" className={navLinkClass}>
        <i className="fa-solid fa-wallet text-xl mb-1"></i>
        <span className="text-xs">Wallet</span>
      </NavLink>
      <NavLink to="/profile" className={navLinkClass}>
        <i className="fa-solid fa-user text-xl mb-1"></i>
        <span className="text-xs">Profile</span>
      </NavLink>
    </nav>
  );
};

export default BottomNav;
