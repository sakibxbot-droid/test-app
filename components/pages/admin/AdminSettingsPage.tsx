
import React, { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { updateAdminPassword } from '../../../services/mockApi';

const AdminSettingsPage: React.FC = () => {
    const { user } = useAuth();
    const [username, setUsername] = useState(user?.username || '');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleUpdateDetails = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setMessage('Admin details updated successfully! (Mocked)');
        setTimeout(() => setMessage(''), 3000);
    };

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage('');
        setError('');
        if (!user) {
            setError('Admin user not found.');
            return;
        }
        if (!newPassword || !currentPassword) {
            setError('Please fill in all password fields.');
            return;
        }
        try {
            await updateAdminPassword(user.id, currentPassword, newPassword);
            setMessage('Admin password changed successfully!');
            setCurrentPassword('');
            setNewPassword('');
        } catch (err) {
            setError((err as Error).message);
        }
    };

    return (
        <div>
            <h2 className="text-3xl font-bold mb-6">Admin Settings</h2>
            {message && <div className="bg-brand-success/20 text-brand-success p-3 rounded-md mb-4 text-center">{message}</div>}
            {error && <div className="bg-brand-danger/20 text-brand-danger p-3 rounded-md mb-4 text-center">{error}</div>}
            
            <div className="max-w-lg mx-auto">
                <div className="bg-brand-surface p-6 rounded-lg mb-6 shadow-lg">
                    <h3 className="text-xl font-semibold mb-4">Update Info</h3>
                    <form onSubmit={handleUpdateDetails}>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-brand-text-secondary mb-1">Username</label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary"
                            />
                        </div>
                        <button type="submit" className="w-full bg-brand-primary text-white font-bold py-2 rounded-lg hover:bg-brand-primary-variant transition-colors">
                            Save Changes
                        </button>
                    </form>
                </div>

                <div className="bg-brand-surface p-6 rounded-lg shadow-lg">
                    <h3 className="text-xl font-semibold mb-4">Change Password</h3>
                    <form onSubmit={handleChangePassword}>
                        <div className="mb-4">
                            <input type="password" placeholder="Current Password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary" required/>
                        </div>
                        <div className="mb-4">
                            <input type="password" placeholder="New Password" value={newPassword} onChange={e => setNewPassword(e.target.value)} className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary" required/>
                        </div>
                        <button type="submit" className="w-full bg-brand-primary text-white font-bold py-2 rounded-lg hover:bg-brand-primary-variant transition-colors">
                            Update Password
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AdminSettingsPage;
