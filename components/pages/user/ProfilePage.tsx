
import React, { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { updateUserPassword } from '../../../services/mockApi';

const ProfilePage: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState(user?.username || '');
  const [email, setEmail] = useState(user?.email || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleUpdateDetails = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    // Mock API call would go here for username/email
    setMessage('Details updated successfully! (Mocked)');
    setTimeout(() => setMessage(''), 3000);
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setError('');
    if (!user) {
        setError('User not found');
        return;
    }
    if (!currentPassword || !newPassword) {
        setError('Please fill all password fields.');
        return;
    }
    try {
        await updateUserPassword(user.id, currentPassword, newPassword);
        setMessage('Password changed successfully!');
        setCurrentPassword('');
        setNewPassword('');
    } catch (err) {
        setError((err as Error).message);
    }
  };


  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-6">Profile</h2>
      
      {message && <div className="bg-brand-success/20 text-brand-success p-3 rounded-md mb-4 text-center">{message}</div>}
      {error && <div className="bg-brand-danger/20 text-brand-danger p-3 rounded-md mb-4 text-center">{error}</div>}


      <div className="bg-brand-surface p-6 rounded-lg mb-6">
        <h3 className="text-xl font-semibold mb-4">Edit Details</h3>
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
          <div className="mb-4">
            <label className="block text-sm font-medium text-brand-text-secondary mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary"
            />
          </div>
          <button type="submit" className="w-full bg-brand-primary text-white font-bold py-2 rounded-lg hover:bg-brand-primary-variant transition-colors">
            Save Changes
          </button>
        </form>
      </div>

      <div className="bg-brand-surface p-6 rounded-lg mb-6">
        <h3 className="text-xl font-semibold mb-4">Change Password</h3>
        <form onSubmit={handleChangePassword}>
          <div className="mb-4">
            <input type="password" placeholder="Current Password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary" />
          </div>
          <div className="mb-4">
            <input type="password" placeholder="New Password" value={newPassword} onChange={e => setNewPassword(e.target.value)} className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary" />
          </div>
          <button type="submit" className="w-full bg-brand-primary text-white font-bold py-2 rounded-lg hover:bg-brand-primary-variant transition-colors">
            Update Password
          </button>
        </form>
      </div>

      <button
        onClick={handleLogout}
        className="w-full bg-brand-danger text-white font-bold py-3 rounded-lg hover:bg-red-700 transition-colors"
      >
        <i className="fa-solid fa-right-from-bracket mr-2"></i>Logout
      </button>
    </div>
  );
};

export default ProfilePage;
