import React, { useState, useEffect } from 'react';
import { FaFilePdf, FaFileContract, FaPlus, FaEye } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import axios from 'axios';
import { FaHistory } from 'react-icons/fa';

const DocumentsPage: React.FC = () => {
    const [recordsPerPage, setRecordsPerPage] = useState(10);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [documents, setDocuments] = useState([]);
    const [documentData, setDocumentData] = useState({
        name: '',
        criticidade: 'Crítico',
        dataDisponibilizacao: '',
        file: null as File | null,
        accessLevel: 'all'
    });
    const [currentPage, setCurrentPage] = useState(1);
    const isAdmin = true;
    const navigate = useNavigate();

    useEffect(() => {
        fetchDocuments();
    }, []);

    const fetchDocuments = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/documents');
            setDocuments(response.data);
        } catch (error) {
            console.error('Error fetching documents:', error);
        }
    };

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setDocumentData({ ...documentData, [name]: value });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setDocumentData({ ...documentData, file: e.target.files[0] });
        }
    };

    const handleSave = async () => {
        console.log('Saving document...');
        const formData = new FormData();
        formData.append('name', documentData.name);
        formData.append('criticidade', documentData.criticidade);
        formData.append('dataDisponibilizacao', documentData.dataDisponibilizacao);
        formData.append('file', documentData.file as Blob);
        formData.append('accessLevel', documentData.accessLevel);

        for (let [key, value] of formData.entries()) {
            console.log(`${key}: ${value}`);
        }

        try {
            await axios.post('http://localhost:8080/api/documents', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            console.log('Document saved successfully');
            closeModal();
            fetchDocuments();
        } catch (error) {
            console.error('Error saving document:', error);
            if (axios.isAxiosError(error) && error.response) {
                console.error('Response data:', error.response.data);
            }
        }
    };

    const handleView = (fileUrl: string) => {
        navigate(`/view-document?fileUrl=${encodeURIComponent(fileUrl)}`);
    };

    const indexOfLastRecord = currentPage * recordsPerPage;
    const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
    const currentRecords = documents.slice(indexOfFirstRecord, indexOfLastRecord);

    const totalPages = Math.ceil(documents.length / recordsPerPage);

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
                                <FaFilePdf className="mr-2" size={32} />
                                <h2 className="text-2xl font-medium">DOCUMENTOS</h2>
                            </div>
                            <p>Gerenciamento de documentos disponibilizados para sua conta</p>
                        </div>
                    </div>

                    <div className="w-full border p-4 text-white rounded mb-4" style={{ borderColor: '#07223c' }}>
                        <button className="flex items-center bg-[#043359] text-white p-2 mb-5">
                            <FaHistory size={16} className="mr-2" />
                            Voltar
                        </button>
                        <div className="w-full text-center p-4 text-white rounded mb-4" style={{ background: '#07223c' }}>
                            <h2 className="text-2xl font-medium text-center">Estatística de Confirmação de Leitura de Documentos</h2>
                            <div className="flex justify-around mt-10">
                                <div className="flex flex-col items-center ml-30 text-center">
                                    <div className="flex items-center mb-2 text-blue-300">
                                        <FaFilePdf className="mr-2" size={32} />
                                        <p className="text-3xl"><strong>{documents.length}</strong></p>
                                    </div>
                                    <p className="text-white">Total de documentos</p>
                                </div>
                                <div className="flex ml-30 flex-col items-center text-center border-l border-r px-50" style={{ borderColor: '#1b3d5d' }}>
                                    <div className="flex items-center mb-2 text-green-500">
                                        <FaFileContract className="mr-2" size={32} />
                                        <p className="text-3xl"><strong>0</strong></p>
                                    </div>
                                    <p className="text-white">Ciente</p>
                                </div>
                                <div className="flex flex-col mr-30 items-center text-center">
                                    <div className="flex items-center mb-2 text-orange-500">
                                        <FaFileContract className="mr-2" size={32} />
                                        <p className="text-3xl"><strong>0</strong></p>
                                    </div>
                                    <p className="text-white">Pendente(s) de Confirmação de Leitura</p>
                                </div>
                            </div>
                        </div>
                        <div style={{ height: "50px" }} />
                        <div className="flex justify-between items-center mb-4">
                            <div className="flex items-center">
                                <select
                                    value={recordsPerPage}
                                    onChange={(e) => setRecordsPerPage(Number(e.target.value))}
                                    className="p-1 rounded border pr-3" style={{ background: '#1b3d5d', borderColor: '#1b3d5d' }}>
                                    {
                                        [10, 20, 30, 40, 50, 100].map(num => (
                                            <option key={num} value={num}>{num}</option>
                                        ))
                                    }
                                </select>
                                <label className="text-white ml-2">Registros por página</label>
                            </div>
                            {isAdmin && (
                                <button onClick={openModal} className="flex items-center bg-blue-500 text-white p-2 rounded mx-4">
                                    <FaPlus className="mr-2" />
                                    Novo documento
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
                                    <th className="p-2 border pr-90 text-start" style={{ borderColor: '#1b3d5d', background: "#0b3f69" }}>Documento</th>
                                    <th className="p-2 border" style={{ borderColor: '#1b3d5d', background: "#0b3f69" }}>Criticidade</th>
                                    <th className="p-2 border" style={{ borderColor: '#1b3d5d', background: "#0b3f69" }}>Status</th>
                                    <th className="p-2 border" style={{ borderColor: '#1b3d5d', background: "#0b3f69" }}>Disponibilizado em</th>
                                    <th className="p-2 border" style={{ borderColor: '#1b3d5d', background: "#0b3f69" }}>Data da Confirmação</th>
                                    <th className="p-2 border" style={{ borderColor: '#1b3d5d', background: "#0b3f69" }}>Visualizar</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentRecords.map((document: any) => (
                                    <tr key={document.id}>
                                        <td className="p-2 border" style={{ borderColor: '#1b3d5d' }}>{document.name}</td>
                                        <td className="p-2 border text-center" style={{ borderColor: '#1b3d5d', backgroundColor: document.criticidade === 'Crítico' ? 'red' : 'transparent' }}>{document.criticidade}</td>
                                        <td className="p-2 border text-center" style={{ borderColor: '#1b3d5d', backgroundColor: document.status === 'Pendente' ? 'orange' : 'transparent' }}>{document.status}</td>
                                        <td className="p-2 border text-center" style={{ borderColor: '#1b3d5d' }}>{new Date(document.dataDisponibilizacao).toLocaleDateString()}</td>
                                        <td className="p-2 border text-center" style={{ borderColor: '#1b3d5d' }}>{document.updatedAt ? new Date(document.updatedAt).toLocaleDateString() : 'N/A'}</td>
                                        <td className="p-2 border text-center" style={{ borderColor: '#1b3d5d' }}>
                                            <button onClick={() => handleView(document.fileUrl)} className="text-blue-500">
                                                <FaEye />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        <div className="flex justify-between items-center mt-4">
                            <span className="text-white">
                                Mostrando {indexOfFirstRecord + 1} até {Math.min(indexOfLastRecord, documents.length)} de {documents.length} registros
                            </span>
                            <div className="flex">
                                <button onClick={handlePreviousPage} disabled={currentPage === 1} className="bg-blue-500 text-white p-2 rounded mr-2">
                                    Anterior
                                </button>
                                <button onClick={handleNextPage} disabled={currentPage === totalPages} className="bg-blue-500 text-white p-2 rounded">
                                    Próximo
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-4 rounded">
                        <h2 className="text-xl mb-4">Novo Documento</h2>
                        <div className="mb-2">
                            <label className="block mb-1">Nome do documento</label>
                            <input type="text" name="name" value={documentData.name} onChange={handleInputChange} className="w-full p-2 border rounded" />
                        </div>
                        <div className="mb-2">
                            <label className="block mb-1">Criticidade</label>
                            <select name="criticidade" value={documentData.criticidade} onChange={handleInputChange} className="w-full p-2 border rounded">
                                <option value="Crítico">Crítico</option>
                                <option value="Médio">Médio</option>
                                <option value="Baixo">Baixo</option>
                            </select>
                        </div>
                        <div className="mb-2">
                            <label className="block mb-1">Data de disponibilização</label>
                            <input type="date" name="dataDisponibilizacao" value={documentData.dataDisponibilizacao} onChange={handleInputChange} className="w-full p-2 border rounded" />
                        </div>
                        <div className="mb-2">
                            <label className="block mb-1">Anexar arquivo</label>
                            <input type="file" name="file" onChange={handleFileChange} className="w-full p-2 border rounded" />
                        </div>
                        <div className="mb-2">
                            <label className="block mb-1">Quem pode acessar</label>
                            <select name="accessLevel" value={documentData.accessLevel} onChange={handleInputChange} className="w-full p-2 border rounded">
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
        </div>
    );
};

export default DocumentsPage;
