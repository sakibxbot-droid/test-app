
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { loginAdmin } from '../../../services/mockApi';

const AdminLoginPage: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            const adminUser = await loginAdmin(username, password);
            if (adminUser) {
                login(adminUser);
                navigate('/admin/dashboard');
            }
        } catch (err) {
            setError((err as Error).message);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-brand-bg p-4">
            <div className="w-full max-w-sm bg-brand-surface rounded-lg shadow-lg p-8">
                <h2 className="text-2xl font-bold text-center text-brand-secondary mb-6">Admin Login</h2>
                {error && <div className="bg-red-500/20 text-red-400 p-3 rounded-md mb-4 text-center">{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <input
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary"
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-brand-primary text-white font-bold py-3 rounded-lg hover:bg-brand-primary-variant transition-colors"
                    >
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AdminLoginPage;
