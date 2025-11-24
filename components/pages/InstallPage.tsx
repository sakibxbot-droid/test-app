
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { isInstalled, installApp } from '../../services/mockApi';

const InstallPage: React.FC = () => {
    const navigate = useNavigate();
    const [installed, setInstalled] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (isInstalled()) {
            setInstalled(true);
        }
    }, []);

    const handleInstall = () => {
        installApp();
        setMessage('Installation successful! Redirecting to login...');
        setTimeout(() => {
            navigate('/login');
        }, 2000);
    };
    
    const handleResetAndInstall = () => {
        installApp();
        setMessage('App reset successfully! Redirecting to login...');
        setTimeout(() => {
            navigate('/login');
        }, 2000);
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-brand-bg p-4 text-center">
            <div className="w-full max-w-md bg-brand-surface rounded-lg shadow-lg p-8">
                <h1 className="text-3xl font-bold text-brand-secondary mb-4">Adept Play Setup</h1>
                {message ? (
                    <p className="text-brand-success">{message}</p>
                ) : installed ? (
                    <>
                        <p className="text-lg mb-6">Application data is already initialized in your browser.</p>
                        <div className="space-y-4">
                             <button
                                onClick={() => navigate('/login')}
                                className="w-full bg-brand-primary text-white font-bold py-3 rounded-lg hover:bg-brand-primary-variant transition-colors"
                            >
                                Go to Login
                            </button>
                            <button
                                onClick={handleResetAndInstall}
                                className="w-full bg-brand-danger text-white font-bold py-3 rounded-lg hover:bg-red-700 transition-colors"
                            >
                                Reset and Re-install Data
                            </button>
                        </div>
                    </>
                ) : (
                    <>
                        <p className="text-lg mb-6">Welcome! Click the button below to set up the application data in your browser.</p>
                        <button
                            onClick={handleInstall}
                            className="w-full bg-brand-success text-white font-bold py-3 rounded-lg hover:bg-green-600 transition-colors"
                        >
                            <i className="fas fa-download mr-2"></i>Install Now
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default InstallPage;
