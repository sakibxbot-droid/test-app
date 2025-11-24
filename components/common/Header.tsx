
import React from 'react';
import { useAuth } from '../../context/AuthContext';

const Header: React.FC = () => {
  const { user } = useAuth();

  return (
    <header className="bg-brand-surface p-4 flex justify-between items-center shadow-md sticky top-0 z-10">
      <h1 className="text-xl font-bold text-brand-text">Adept Play</h1>
      {user && user.role === 'user' && (
        <div className="bg-brand-primary/20 text-brand-secondary p-2 rounded-lg font-semibold">
          <i className="fa-solid fa-wallet mr-2"></i>₹{user.walletBalance.toFixed(2)}
        </div>
      )}
    </header>
  );
};

export default Header;
