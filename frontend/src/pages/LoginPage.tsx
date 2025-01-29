import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LoginPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [generalError, setGeneralError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const handleLogin = async () => {
        setEmailError('');
        setPasswordError('');
        setGeneralError('');

        let hasError = false;

        if (!email) {
            setEmailError('Email não pode ser vazio.');
            hasError = true;
        } else if (!validateEmail(email)) {
            setEmailError('E-mail com formato inválido.');
            hasError = true;
        }

        if (!password) {
            setPasswordError('Senha não pode ser vazia.');
            hasError = true;
        }

        if (hasError) {
            return;
        }

        try {
            const response = await axios.post('http://localhost:8080/login', { email, password });
            localStorage.setItem('token', response.data.token);
            setSuccess('Login bem sucedido');
            navigate('/');
        } catch (err) {
            if (axios.isAxiosError(err)) {
                if (err.response?.data?.error === "Customer" || err.response?.data?.error === "Password") {
                    setGeneralError('E-mail e/ou senha inválidos.');
                    setPasswordError('E-mail e/ou senha inválidos.');
                } else {
                    setGeneralError('Erro desconhecido.');
                }
            } else {
                setGeneralError('Erro desconhecido.');
            }
            setSuccess('');
        }
    };

    const validateEmail = (email: string) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>
                {generalError && <p className="text-red-500 mb-2">{generalError}</p>}
                {emailError && <p className="text-red-500 mb-2">{emailError}</p>}
                <input
                    type="text"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-2 mb-4 border border-gray-300 rounded"
                />
                {passwordError && <p className="text-red-500 mb-2">{passwordError}</p>}
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-2 mb-4 border border-gray-300 rounded"
                />
                <button
                    onClick={handleLogin}
                    className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                >
                    Login
                </button>
                {success && <p className="mt-4 text-green-500 text-center">{success}</p>}
            </div>
        </div>
    );
};

export default LoginPage;
