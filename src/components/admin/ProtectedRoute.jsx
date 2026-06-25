import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import adminAPI from '../../utils/adminAPI';

const ProtectedRoute = ({ children }) => {
    const navigate = useNavigate();
    const [checking, setChecking] = useState(true);
    const [allowed, setAllowed]   = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (!token) {
            navigate('/admin/login', { replace: true });
            return;
        }
        adminAPI.verifyToken()
            .then(() => { setAllowed(true); setChecking(false); })
            .catch(() => {
                localStorage.removeItem('authToken');
                navigate('/admin/login', { replace: true });
            });
    }, []);

    if (checking && !allowed) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
                <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return allowed ? children : null;
};

export default ProtectedRoute;

