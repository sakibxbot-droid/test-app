import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { loginUser, signupUser } from '../../services/mockApi';

const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      if (isLogin) {
        const user = await loginUser(username, password);
        if (user) {
          login(user);
          navigate('/');
        }
      } else {
        await signupUser(username, email, password);
        setSuccess('Signup successful! Please log in.');
        setIsLogin(true);
        setUsername('');
        setEmail('');
        setPassword('');
      }
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-brand-bg p-4">
      <div className="w-full max-w-md bg-brand-surface rounded-lg shadow-lg p-8">
        <div className="flex border-b border-gray-700 mb-6">
          <button
            onClick={() => setIsLogin(true)}
            className={`w-1/2 py-3 text-center font-semibold transition-colors ${isLogin ? 'text-brand-secondary border-b-2 border-brand-secondary' : 'text-brand-text-secondary'}`}
          >
            Login
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`w-1/2 py-3 text-center font-semibold transition-colors ${!isLogin ? 'text-brand-secondary border-b-2 border-brand-secondary' : 'text-brand-text-secondary'}`}
          >
            Sign Up
          </button>
        </div>

        <h2 className="text-2xl font-bold text-center mb-6">{isLogin ? 'Welcome Back!' : 'Create Account'}</h2>

        {error && <div className="bg-brand-danger/20 text-brand-danger p-3 rounded-md mb-4 text-center">{error}</div>}
        {success && <div className="bg-brand-success/20 text-brand-success p-3 rounded-md mb-4 text-center">{success}</div>}

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
          {!isLogin && (
            <div className="mb-4">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary"
                required
              />
            </div>
          )}
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
            {isLogin ? 'Login' : 'Sign Up'}
          </button>
        </form>

      </div>
    </div>
  );
};

export default AuthPage;
