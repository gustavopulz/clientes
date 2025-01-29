import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const NotFoundPage: React.FC = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
        }
    }, []);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white">
            <h1 className="text-6xl font-bold mb-4">404</h1>
            <p className="text-2xl mb-8">Página não encontrada</p>
            <Link to="/" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                Voltar para a página inicial
            </Link>
        </div>
    );
};

export default NotFoundPage;
