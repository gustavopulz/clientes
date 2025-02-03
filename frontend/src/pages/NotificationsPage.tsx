import React, { useState, useEffect } from 'react';
import { FaBell, FaPlus, FaEye } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import axios from 'axios';

const NotificationsPage: React.FC = () => {
    const [recordsPerPage, setRecordsPerPage] = useState(10);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [notificationData, setNotificationData] = useState({
        title: '',
        message: '',
        date: '',
        accessLevel: 'all'
    });
    const [currentPage, setCurrentPage] = useState(1);
    const isAdmin = true;
    const navigate = useNavigate();
    const [readNotifications, setReadNotifications] = useState(0);
    const [pendingNotifications, setPendingNotifications] = useState(0);
    const [unrequestedNotifications, setUnrequestedNotifications] = useState(0);

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/notifications');
            setNotifications(response.data);
            calculateStatistics(response.data);
        } catch (error) {
            console.error('Error fetching notifications:', error);
        }
    };

    const calculateStatistics = (notifications: any[]) => {
        const read = notifications.filter(n => n.status === 'read').length;
        const pending = notifications.filter(n => n.status === 'pending').length;
        const unrequested = notifications.filter(n => n.status === 'unrequested').length;
        setReadNotifications(read);
        setPendingNotifications(pending);
        setUnrequestedNotifications(unrequested);
    };

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setNotificationData({ ...notificationData, [name]: value });
    };

    const handleSave = async () => {
        console.log('Saving notification...');
        try {
            await axios.post('http://localhost:8080/api/notifications', notificationData);
            console.log('Notification saved successfully');
            closeModal();
            fetchNotifications();
        } catch (error) {
            console.error('Error saving notification:', error);
            if (axios.isAxiosError(error) && error.response) {
                console.error('Response data:', error.response.data);
            }
        }
    };

    const handleView = (notificationId: string) => {
        navigate(`/view-notification?id=${notificationId}`);
    };

    const indexOfLastRecord = currentPage * recordsPerPage;
    const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
    const currentRecords = notifications.slice(indexOfFirstRecord, indexOfLastRecord);

    const totalPages = Math.ceil(notifications.length / recordsPerPage);

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    return (
        <div className="w-full">
            <Header />
            <div className="w-full min-h-screen bg-gray-900 flex flex-col items-center px-4">
                <div className="w-full mt-5">
                    <div className="w-full p-4 text-white text-center rounded mb-4" style={{ backgroundColor: '#032846' }}>
                        <div className="flex flex-col items-center">
                            <div className="flex justify-center items-center text-blue-300">
                                <FaBell className="mr-2" size={32} />
                                <h2 className="text-2xl font-medium">NOTIFICAÇÕES</h2>
                            </div>
                            <p>Gerenciamento de notificações enviadas para sua conta</p>
                        </div>
                    </div>

                    <div className="w-full border p-4 text-white rounded mb-4" style={{ borderColor: '#07223c' }}>
                        <button className="cursor-pointer flex items-center bg-[#043359] text-white p-2 mb-5">
                            <FaBell size={16} className="mr-2" />
                            Voltar
                        </button>
                        <div className="w-full text-center p-4 text-white rounded mb-4" style={{ background: '#07223c' }}>
                            <h2 className="text-2xl font-medium text-center">Estatística de Notificações</h2>
                            <div className="flex justify-around mt-10">
                                <div className="flex flex-col items-center text-center">
                                    <div className="flex items-center mb-2 text-blue-300">
                                        <FaBell className="mr-2" size={32} />
                                        <p className="text-3xl"><strong>{notifications.length}</strong></p>
                                    </div>
                                    <p className="text-white">Total de notificações</p>
                                </div>
                                <div className="relative flex items-center">
                                    <div className="w-px bg-[#1b3d5d]" style={{ height: '60px' }}></div>
                                </div>
                                <div className="flex flex-col items-center text-center">
                                    <div className="flex items-center mb-2 text-green-400">
                                        <FaBell className="mr-2" size={32} />
                                        <p className="text-3xl"><strong>{readNotifications}</strong></p>
                                    </div>
                                    <p className="text-white">Cientes</p>
                                </div>
                                <div className="relative flex items-center">
                                    <div className="w-px bg-[#1b3d5d]" style={{ height: '60px' }}></div>
                                </div>
                                <div className="flex flex-col items-center text-center">
                                    <div className="flex items-center mb-2 text-orange-400">
                                        <FaBell className="mr-2" size={32} />
                                        <p className="text-3xl"><strong>{pendingNotifications}</strong></p>
                                    </div>
                                    <p className="text-white">Pendente(s) de Confirmação de Leitura</p>
                                </div>
                                <div className="relative flex items-center">
                                    <div className="w-px bg-[#1b3d5d]" style={{ height: '60px' }}></div>
                                </div>
                                <div className="flex flex-col items-center text-center">
                                    <div className="flex items-center mb-2 text-gray-400">
                                        <FaBell className="mr-2" size={32} />
                                        <p className="text-3xl"><strong>{unrequestedNotifications}</strong></p>
                                    </div>
                                    <p className="text-white">Confirmação não solicitada</p>
                                </div>
                            </div>
                        </div>
                        <div style={{ height: "50px" }} />
                        <div className="flex justify-between items-center mb-4">
                            <div className="flex items-center">
                                <select
                                    value={recordsPerPage}
                                    onChange={(e) => setRecordsPerPage(Number(e.target.value))}
                                    className="cursor-pointer p-1 rounded border pr-3" style={{ background: '#1b3d5d', borderColor: '#1b3d5d' }}>
                                    {
                                        [10, 20, 30, 40, 50, 100].map(num => (
                                            <option key={num} value={num}>{num}</option>
                                        ))
                                    }
                                </select>
                                <label className="text-white ml-2">Registros por página</label>
                            </div>
                            {isAdmin && (
                                <button onClick={openModal} className="cursor-pointer flex items-center bg-blue-500 text-white p-2 rounded mx-4">
                                    <FaPlus className="mr-2" />
                                    Nova notificação
                                </button>
                            )}
                            <div className="flex items-center">
                                <label className="text-white mr-2">Pesquisar:</label>
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="p-1 rounded border" style={{ background: '#1b3d5d', borderColor: '#1b3d5d', color: 'white' }} />
                            </div>
                        </div>

                        <table className="w-full rounded">
                            <thead>
                                <tr>
                                    <th className="p-2 border pr-90 text-start" style={{ borderColor: '#1b3d5d', background: "#0b3f69" }}>Título</th>
                                    <th className="p-2 border" style={{ borderColor: '#1b3d5d', background: "#0b3f69" }}>Mensagem</th>
                                    <th className="p-2 border" style={{ borderColor: '#1b3d5d', background: "#0b3f69" }}>Data</th>
                                    <th className="p-2 border" style={{ borderColor: '#1b3d5d', background: "#0b3f69" }}>Visualizar</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentRecords.map((notification: any) => (
                                    <tr key={notification.id}>
                                        <td className="p-2 border" style={{ borderColor: '#1b3d5d' }}>{notification.title}</td>
                                        <td className="p-2 border" style={{ borderColor: '#1b3d5d' }}>{notification.message}</td>
                                        <td className="p-2 border text-center" style={{ borderColor: '#1b3d5d' }}>{new Date(notification.date).toLocaleDateString()}</td>
                                        <td className="p-2 border text-center" style={{ borderColor: '#1b3d5d' }}>
                                            <button onClick={() => handleView(notification.id)} className="text-blue-500">
                                                <FaEye />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        <div className="flex justify-between items-center mt-4">
                            <span className="text-white">
                                Mostrando {indexOfFirstRecord + 1} até {Math.min(indexOfLastRecord, notifications.length)} de {notifications.length} registros
                            </span>
                            <div className="flex">
                                <button onClick={handlePreviousPage} disabled={currentPage === 1} className="cursor-pointer bg-blue-500 text-white p-2 rounded mr-2">
                                    Anterior
                                </button>
                                <button onClick={handleNextPage} disabled={currentPage === totalPages} className="cursor-pointer bg-blue-500 text-white p-2 rounded">
                                    Próximo
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div >

            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-4 rounded">
                        <h2 className="text-xl mb-4">Nova Notificação</h2>
                        <div className="mb-2">
                            <label className="block mb-1">Título</label>
                            <input type="text" name="title" value={notificationData.title} onChange={handleInputChange} className="w-full p-2 border rounded" />
                        </div>
                        <div className="mb-2">
                            <label className="block mb-1">Mensagem</label>
                            <input type="text" name="message" value={notificationData.message} onChange={handleInputChange} className="w-full p-2 border rounded" />
                        </div>
                        <div className="mb-2">
                            <label className="block mb-1">Data</label>
                            <input type="date" name="date" value={notificationData.date} onChange={handleInputChange} className="w-full p-2 border rounded" />
                        </div>
                        <div className="mb-2">
                            <label className="block mb-1">Quem pode acessar</label>
                            <select name="accessLevel" value={notificationData.accessLevel} onChange={handleInputChange} className="w-full p-2 border rounded">
                                <option value="all">Todos</option>
                                <option value="admin">Admin</option>
                                <option value="user">User</option>
                            </select>
                        </div>
                        <div className="flex justify-end">
                            <button onClick={closeModal} className="bg-red-500 text-white p-2 rounded mr-2">Cancelar</button>
                            <button onClick={handleSave} className="bg-blue-500 text-white p-2 rounded">Salvar</button>
                        </div>
                    </div>
                </div>
            )}
        </div >
    );
};

export default NotificationsPage;
