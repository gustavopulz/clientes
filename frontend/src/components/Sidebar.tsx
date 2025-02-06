import React, { useState } from 'react';
import { FaHome, FaUser, FaSignOutAlt } from 'react-icons/fa';

const Sidebar: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="flex">
            <div
                onMouseEnter={() => setIsOpen(true)}
                onMouseLeave={() => setIsOpen(false)}
                className={`fixed top-0 left-0 h-full bg-gray-800 text-white transition-transform duration-400 transform ${isOpen ? '' : ''}`}>
                <div className="p-5">
                    <h2 className="text-2xl font-bold">Bar</h2>
                    <ul>
                        <li className="cursor-pointer mt-4 flex items-center">
                            <FaHome onClick={() => { window.location.href = '/dual-list'; }} className={`mr-2 ${isOpen ? '' : 'ml-2'}`} />
                            <a href="/dual-list">
                                <span className={`${isOpen ? 'inline' : 'hidden'}`}>Dual List Page</span>
                            </a>
                        </li>
                        <li className="cursor-pointer mt-4 flex items-center">
                            <FaUser onClick={() => { window.location.href = '/register'; }} className={`mr-2 ${isOpen ? '' : 'ml-2'}`} />
                            <a href="/register">
                                <span className={`${isOpen ? 'inline' : 'hidden'}`}>Register Page</span>
                            </a>
                        </li>
                        <li className="cursor-pointer mt-4 flex items-center">
                            <FaSignOutAlt onClick={() => { window.location.href = '/login'; }} className={`mr-2 ${isOpen ? '' : 'ml-2'}`} />
                            <a href="/login">
                                <span className={`${isOpen ? 'inline' : 'hidden'}`}>Desconectar</span>
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
