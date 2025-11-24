
import React, { useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import AuthPage from './components/pages/AuthPage';
import HomePage from './components/pages/user/HomePage';
import MyTournamentsPage from './components/pages/user/MyTournamentsPage';
import WalletPage from './components/pages/user/WalletPage';
import ProfilePage from './components/pages/user/ProfilePage';
import UserLayout from './components/layout/UserLayout';
import AdminLoginPage from './components/pages/admin/AdminLoginPage';
import AdminDashboardPage from './components/pages/admin/AdminDashboardPage';
import AdminLayout from './components/layout/AdminLayout';
import AdminTournamentsPage from './components/pages/admin/AdminTournamentsPage';
import AdminManageTournamentPage from './components/pages/admin/AdminManageTournamentPage';
import AdminUsersPage from './components/pages/admin/AdminUsersPage';
import AdminSettingsPage from './components/pages/admin/AdminSettingsPage';
import InstallPage from './components/pages/InstallPage';

// ProtectedRoute component for user routes
const UserProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user, loading } = useAuth();
    if (loading) return <div className="flex justify-center items-center h-screen bg-brand-bg">Loading...</div>;
    return user && user.role === 'user' ? <>{children}</> : <Navigate to="/login" />;
};

// ProtectedRoute component for admin routes
const AdminProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user, loading } = useAuth();
    if (loading) return <div className="flex justify-center items-center h-screen bg-brand-bg">Loading...</div>;
    return user && user.role === 'admin' ? <>{children}</> : <Navigate to="/admin/login" />;
};


const App: React.FC = () => {
    useEffect(() => {
        const handleContextMenu = (e: MouseEvent) => e.preventDefault();
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && (e.key === '+' || e.key === '-' || e.key === '=')) {
                e.preventDefault();
            }
        };
        const handleWheel = (e: WheelEvent) => {
            if (e.ctrlKey || e.metaKey) {
                e.preventDefault();
            }
        };

        document.addEventListener('contextmenu', handleContextMenu);
        document.addEventListener('keydown', handleKeyDown);
        document.addEventListener('wheel', handleWheel, { passive: false });

        document.body.style.userSelect = 'none';
        document.body.style.webkitUserSelect = 'none';

        return () => {
            document.removeEventListener('contextmenu', handleContextMenu);
            document.removeEventListener('keydown', handleKeyDown);
            document.removeEventListener('wheel', handleWheel);
        };
    }, []);

    return (
        <AuthProvider>
            <div className="h-screen w-screen overflow-hidden select-none">
                <HashRouter>
                    <Routes>
                        {/* Public Routes */}
                        <Route path="/login" element={<AuthPage />} />
                        <Route path="/install" element={<InstallPage />} />
                        <Route path="/admin/login" element={<AdminLoginPage />} />

                        {/* User Routes */}
                        <Route path="/" element={<UserProtectedRoute><UserLayout><HomePage /></UserLayout></UserProtectedRoute>} />
                        <Route path="/my-tournaments" element={<UserProtectedRoute><UserLayout><MyTournamentsPage /></UserLayout></UserProtectedRoute>} />
                        <Route path="/wallet" element={<UserProtectedRoute><UserLayout><WalletPage /></UserLayout></UserProtectedRoute>} />
                        <Route path="/profile" element={<UserProtectedRoute><UserLayout><ProfilePage /></UserLayout></UserProtectedRoute>} />

                        {/* Admin Routes */}
                        <Route path="/admin" element={<AdminProtectedRoute><AdminLayout><AdminDashboardPage /></AdminLayout></AdminProtectedRoute>} />
                        <Route path="/admin/dashboard" element={<AdminProtectedRoute><AdminLayout><AdminDashboardPage /></AdminLayout></AdminProtectedRoute>} />
                        <Route path="/admin/tournaments" element={<AdminProtectedRoute><AdminLayout><AdminTournamentsPage /></AdminLayout></AdminProtectedRoute>} />
                        <Route path="/admin/manage-tournament/:id" element={<AdminProtectedRoute><AdminLayout><AdminManageTournamentPage /></AdminLayout></AdminProtectedRoute>} />
                        <Route path="/admin/users" element={<AdminProtectedRoute><AdminLayout><AdminUsersPage /></AdminLayout></AdminProtectedRoute>} />
                        <Route path="/admin/settings" element={<AdminProtectedRoute><AdminLayout><AdminSettingsPage /></AdminLayout></AdminProtectedRoute>} />
                        
                        <Route path="*" element={<Navigate to="/" />} />
                    </Routes>
                </HashRouter>
            </div>
        </AuthProvider>
    );
};

export default App;
