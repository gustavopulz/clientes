import React, { useState, useRef, FormEvent, useEffect } from 'react';
import axios from 'axios';
import { FiTrash } from 'react-icons/fi';
import { api } from '../services/api';
import { useNavigate } from 'react-router-dom';

interface CustomerProps {
    id: string;
    name: string;
    email: string;
    password: string;
    status: boolean;
    created_at: string;
}

const RegisterPage: React.FC = () => {
    const [customers, setCustomers] = useState<CustomerProps[]>([]);
    const [success, setSuccess] = useState('');
    const [nameError, setNameError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [generalError, setGeneralError] = useState('');
    const nameRef = useRef<HTMLInputElement | null>(null);
    const emailRef = useRef<HTMLInputElement | null>(null);
    const passwordRef = useRef<HTMLInputElement | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
        } else {
            loadCustomers();
        }
    }, []);

    async function loadCustomers() {
        const response = await api.get('/customers');
        setCustomers(response.data);
    }

    async function handleSubmit(event: FormEvent) {
        event.preventDefault();

        setNameError('');
        setEmailError('');
        setPasswordError('');
        setGeneralError('');

        if (!nameRef.current?.value) {
            setNameError('Nome não pode ser vazio.');
        }
        if (!emailRef.current?.value) {
            setEmailError('Email não pode ser vazio.');
        }
        if (!passwordRef.current?.value) {
            setPasswordError('Senha não pode ser vazia.');
        }

        if (nameError || emailError || passwordError) {
            return;
        }

        try {
            const response = await api.post('/customer', {
                name: nameRef.current?.value,
                email: emailRef.current?.value,
                password: passwordRef.current?.value
            });

            setCustomers(allCustomers => [...allCustomers, response.data]);

            if (nameRef.current) nameRef.current.value = '';
            if (emailRef.current) emailRef.current.value = '';
            if (passwordRef.current) passwordRef.current.value = '';
            setSuccess('Usuário registrado com sucesso!');
        } catch (err) {
            if (axios.isAxiosError(err)) {
                if (err.response?.data?.message === "Usuário já existe" || err.response?.data?.message === "Email já cadastrado") {
                    setGeneralError('Já existe um cadastro com este usuário e/ou e-mail.');
                } else {
                    setGeneralError(err.response?.data?.message || 'Erro desconhecido.');
                }
            } else {
                setGeneralError('Erro desconhecido.');
            }
            setSuccess('');
        }
    }

    async function handleDelete(id: string) {
        try {
            await api.delete("/customer", { params: { id: id } });
            const allCustomers = customers.filter((customer) => customer.id !== id);
            setCustomers(allCustomers);
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <div className="w-full min-h-screen bg-gray-900 flex justify-center px-4">
            <main className="my-10 w-full md:max-w-2xl">
                <h1 className="text-4xl font-medium text-white">Cadastro</h1>

                <RegisterForm
                    nameRef={nameRef}
                    emailRef={emailRef}
                    passwordRef={passwordRef}
                    handleSubmit={handleSubmit}
                    nameError={nameError}
                    emailError={emailError}
                    passwordError={passwordError}
                    generalError={generalError}
                />

                {success && <p style={{ color: 'green' }}>{success}</p>}

                <section className="flex flex-col">
                    <h1 className="text-4xl font-medium text-white">Clientes</h1>
                    {customers.map((customer) => (
                        <article key={customer.id} className="w-full bg-white rounded p-2 mt-5 relative hover:scale-105 duration-200">
                            <p><span className="font-medium">Nome:</span> {customer.name}</p>
                            <p><span className="font-medium">Email:</span> {customer.email}</p>
                            <p><span className="font-medium">Status:</span> {customer.status ? "ATIVO" : "INATIVO"}</p>
                            <button onClick={() => handleDelete(customer.id)} className="bg-red-500 cursor-pointer w-7 h-7 flex items-center justify-center rounded-lg absolute -right-2 -top-2">
                                <FiTrash size={18} color="FFF" />
                            </button>
                        </article>
                    ))}
                </section>
            </main>
        </div>
    );
};

const RegisterForm: React.FC<{
    nameRef: React.RefObject<HTMLInputElement>;
    emailRef: React.RefObject<HTMLInputElement>;
    passwordRef: React.RefObject<HTMLInputElement>;
    handleSubmit: (event: FormEvent) => void;
    nameError: string;
    emailError: string;
    passwordError: string;
    generalError: string;
}> = ({ nameRef, emailRef, passwordRef, handleSubmit, nameError, emailError, passwordError, generalError }) => {
    return (
        <form className="flex flex-col my-6" onSubmit={handleSubmit}>
            {generalError && <p className="text-red-500 mb-2">{generalError}</p>}
            {nameError && <p className="text-red-500 mb-2">{nameError}</p>}
            <label className="font-medium text-white">Nome:</label>
            <input ref={nameRef} className="bg-white w-full mb-5 p-2 rounded" type="text" placeholder="Digite um nome completo..." />
            {emailError && <p className="text-red-500 mb-2">{emailError}</p>}
            <label className="font-medium text-white">Email:</label>
            <input ref={emailRef} className="bg-white w-full mb-5 p-2 rounded" type="email" placeholder="email@email.com" />
            {passwordError && <p className="text-red-500 mb-2">{passwordError}</p>}
            <label className="font-medium text-white">Senha:</label>
            <input ref={passwordRef} className="bg-white w-full mb-5 p-2 rounded" type="password" placeholder="Digite uma senha..." />
            <input className="cursor-pointer w-full p-2 bg-green-500 rounded font-medium" type="submit" value="Cadastrar" />
        </form>
    );
};

export default RegisterPage;
