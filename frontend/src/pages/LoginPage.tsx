import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ReCAPTCHA from 'react-google-recaptcha';

const LoginPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [generalError, setGeneralError] = useState('');
    const [success, setSuccess] = useState('');
    const [isRequestAccess, setIsRequestAccess] = useState(false);
    const [fullName, setFullName] = useState('');
    const [company, setCompany] = useState('');
    const [corporateEmail, setCorporateEmail] = useState('');
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [captchaValue, setCaptchaValue] = useState<string | null>(null);
    const [focusedInput, setFocusedInput] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const [items, setItems] = useState<any[]>([]);
    const [hasMore, setHasMore] = useState(true);
    const observer = useRef<IntersectionObserver | null>(null);

    type LastItemRefCallback = (node: HTMLDivElement | null) => void;

    const lastItemRef: LastItemRefCallback = useCallback((node) => {
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && hasMore) {
                loadMoreItems();
            }
        });
        if (node) observer.current.observe(node);
    }, [hasMore]);

    const loadMoreItems = async () => {
        try {
            const response = await axios.get('http://localhost:8080/items', {
                params: { offset: items.length, limit: 10 }
            });
            setItems((prevItems) => [...prevItems, ...response.data.items]);
            setHasMore(response.data.hasMore);
        } catch (err) {
            console.error('Erro ao carregar mais itens:', err);
        }
    };

    useEffect(() => {
        loadMoreItems();
    }, []);

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
            console.log('Login response:', response.data);
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('role', response.data.role);
            console.log('Stored role:', response.data.role);
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

    const handleCaptchaChange = (value: string | null) => {
        setCaptchaValue(value);
    };

    const handleRequestAccess = () => {
        if (!captchaValue) {
            alert('Por favor, complete o captcha.');
            return;
        }
        console.log('Solicitação de acesso enviada:', { fullName, company, corporateEmail, termsAccepted });
    };

    const handleFocus = (inputName: string) => {
        setFocusedInput(inputName);
    };

    const handleBlur = () => {
        setFocusedInput(null);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900 p-10">
            <div className={`bg-white rounded-lg shadow-lg max-w-180`}>
                <div className="flex flex-col md:flex-row">
                    <div className="bg-blue-500 w-full md:w-100 text-white p-8 rounded-t-lg md:rounded-l-lg md:rounded-tr-none flex flex-col justify-center">
                        <h1 className="text-2xl font-bold mb-6 text-center">{!isRequestAccess ? 'Entrar' : 'Solicitar Acesso'}</h1>
                        <p className="mb-4 -mt-5 text-center">{!isRequestAccess ? 'Bem-vindo de volta! Por favor, faça login para continuar.' : 'Preencha os dados abaixo para solicitar acesso.'}</p>
                    </div>
                    <div className="w-full p-10">
                        {!isRequestAccess ? (
                            <>
                                {generalError && <p className="text-red-500 mb-2">{generalError}</p>}
                                {emailError && <p className="text-red-500 mb-2">{emailError}</p>}
                                <div className="relative mb-4">
                                    <input
                                        type="text"
                                        value={email}
                                        name="email"
                                        onChange={(e) => setEmail(e.target.value)}
                                        onFocus={() => handleFocus('email')}
                                        onBlur={handleBlur}
                                        className="w-full p-2 border border-gray-300 rounded peer"
                                    />
                                    <label
                                        onClick={() => (document.querySelector('input[name="email"]') as HTMLInputElement)?.focus()}
                                        className={`cursor-text absolute left-2 transition-all duration-300 ease-in-out peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-focus:-top-6 peer-focus:-ml-1 peer-focus:text-base ${focusedInput === 'email' || email ? '-top-6 -ml-1 text-base' : 'text-gray-500 top-2 text-base'}`}
                                    >
                                        E-mail
                                    </label>
                                </div>
                                {passwordError && <p className="text-red-500 mb-2">{passwordError}</p>}
                                <div className="relative mb-4 mt-6">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        name="password"
                                        onChange={(e) => setPassword(e.target.value)}
                                        onFocus={() => handleFocus('password')}
                                        onBlur={handleBlur}
                                        className="w-full p-2 border border-gray-300 rounded peer"
                                    />
                                    <label
                                        onClick={() => (document.querySelector('input[name="password"]') as HTMLInputElement)?.focus()}
                                        className={`cursor-text absolute left-2 transition-all duration-300 ease-in-out peer-placeholder-shown:text-base peer-focus:-top-6 peer-focus:-ml-1 peer-focus:text-base ${focusedInput === 'password' || password ? '-top-6 -ml-1 text-base' : 'text-gray-500 top-2 text-base'}`}
                                    >
                                        Senha

                                    </label>
                                    <button className="w-full cursor-pointer text-sm text-left hover:text-blue-600 ml-1 -mt-10">
                                        Esqueceu sua senha? Clique aqui para recupera-la.
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="cursor-pointer absolute right-2 top-2"
                                    >
                                        {showPassword ? "🙈" : "👁️"}
                                    </button>
                                </div>

                                <button
                                    onClick={handleLogin}
                                    className="w-full cursor-pointer bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                                >
                                    Login
                                </button>

                                <button
                                    onClick={() => setIsRequestAccess(true)}
                                    className="w-full cursor-pointer hover:text-blue-600 mt-4"
                                >
                                    <span className="text-blue-500 font-bold">NÃO É CADASTRADO AINDA?</span><br />
                                    Clique aqui para solicitar seu acesso.
                                </button>
                                {success && <p className="mt-4 text-green-500 text-center">{success}</p>}
                            </>
                        ) : (
                            <>
                                <div className="relative mb-4">
                                    <input
                                        type="text"
                                        name="fullName"
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                        onFocus={() => handleFocus('fullName')}
                                        onBlur={handleBlur}
                                        className="w-full p-2 border border-gray-300 rounded peer" />
                                    <label
                                        onClick={() => (document.querySelector('input[name="fullName"]') as HTMLInputElement)?.focus()}
                                        className={`cursor-text absolute left-2 transition-all duration-300 ease-in-out peer-placeholder-shown:text-base peer-focus:-top-6 peer-focus:-ml-1 peer-focus:text-base ${focusedInput === 'fullName' || fullName ? '-top-6 -ml-1 text-base' : 'text-gray-500 top-2 text-base'}`} >
                                        Nome Completo
                                    </label>
                                </div>
                                <div className="relative mb-4 mt-6">
                                    <input
                                        type="text"
                                        name="company"
                                        value={company}
                                        onChange={(e) => setCompany(e.target.value)}
                                        onFocus={() => handleFocus('company')}
                                        onBlur={handleBlur}
                                        className="w-full p-2 border border-gray-300 rounded peer"
                                    />
                                    <label
                                        onClick={() => (document.querySelector('input[name="company"]') as HTMLInputElement)?.focus()}
                                        className={`cursor-text absolute left-2 transition-all duration-300 ease-in-out peer-placeholder-shown:text-base peer-focus:-top-6 peer-focus:-ml-1 peer-focus:text-base ${focusedInput === 'company' || company ? '-top-6 -ml-1 text-base' : 'text-gray-500 top-2 text-base'}`}
                                    >
                                        Empresa
                                    </label>
                                </div>
                                <div className="relative mb-4 mt-6">
                                    <input
                                        type="email"
                                        name="corporateEmail"
                                        value={corporateEmail}
                                        onChange={(e) => setCorporateEmail(e.target.value)}
                                        onFocus={() => handleFocus('corporateEmail')}
                                        onBlur={handleBlur}
                                        className="w-full p-2 border border-gray-300 rounded peer"
                                    />
                                    <label
                                        onClick={() => (document.querySelector('input[name="corporateEmail"]') as HTMLInputElement)?.focus()}
                                        className={`cursor-text absolute left-2 transition-all duration-300 ease-in-out peer-placeholder-shown:text-base peer-focus:-top-6 peer-focus:-ml-1 peer-focus:text-base ${focusedInput === 'corporateEmail' || corporateEmail ? '-top-6 -ml-1 text-base' : 'text-gray-500 top-2 text-base'}`}
                                    >
                                        E-mail Corporativo
                                    </label>
                                </div>
                                <ReCAPTCHA
                                    sitekey="6Lf01s4qAAAAADLX6Aeb0cOQReiJ8THXrOXMckqV"
                                    onChange={handleCaptchaChange}
                                    className="mb-4"
                                />
                                <div className="flex items-center mb-4">
                                    <label className="align-middle">
                                        <input
                                            type="checkbox"
                                            checked={termsAccepted}
                                            onChange={(e) => setTermsAccepted(e.target.checked)}
                                            className="mr-2 align-middle"
                                        />
                                        Declaro que li e concordo com os termos e condições de uso</label>
                                </div>
                                <button
                                    onClick={handleRequestAccess}
                                    className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                                >
                                    Enviar Solicitação
                                </button>
                                <button
                                    onClick={() => setIsRequestAccess(false)}
                                    className="w-full cursor-pointer hover:text-blue-600 mt-4"
                                >
                                    <span className="text-blue-500 font-bold">JÁ TEM UM CADASTRO?</span><br />
                                    Clique aqui para voltar ao login.
                                </button>
                            </>
                        )}
                        <div>
                            {items.map((item, index) => (
                                <div key={index} ref={index === items.length - 1 ? lastItemRef : null}>
                                    {item.name}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
};

export default LoginPage;
