import React from 'react';
import { FiChevronDown } from 'react-icons/fi';

const Header: React.FC = () => {
    return (
        <header style={{ background: "#041c34" }} className="text-white p-4 flex justify-between items-center">
            <div className="flex items-center">
                <img src="./public/logo-sim-blue.png" alt="Logo" className="h-10 mr-4" />
                <nav className="flex space-x-4">
                    <a href="/webmail" className="hover:underline">Webmail</a>
                    <div className="relative group">
                        <button className="hover:underline flex items-center">
                            Antispam <FiChevronDown className="ml-1" />
                        </button>
                        <div className="absolute hidden bg-gray-700 text-white mt-0 rounded shadow-lg group-hover:flex flex-col whitespace-nowrap">
                            <a href="/" className="block px-4 py-2 hover:bg-gray-600">Quarentena</a>
                            <a href="/" className="block px-4 py-2 hover:bg-gray-600">Remetentes Confiáveis</a>
                            <a href="/" className="block px-4 py-2 hover:bg-gray-600">Vazamento de Senha</a>
                        </div>
                    </div>
                    <a href="/documents" className="hover:underline">Documentos</a>
                    <a href="/notifications" className="hover:underline">Notificações</a>
                    <a href="/email-test" className="hover:underline">Teste de e-mail</a>
                </nav>
            </div>
        </header>
    );
};

export default Header;
