
import React from 'react';
import Header from '../common/Header';
import BottomNav from '../common/BottomNav';

const UserLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex flex-col h-full w-full bg-brand-bg">
      <Header />
      <main className="flex-grow overflow-y-auto pb-20">
        {children}
      </main>
      <BottomNav />
    </div>
  );
};

export default UserLayout;
