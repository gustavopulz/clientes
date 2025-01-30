import React, { useState } from 'react';
import { FaFilePdf, FaFileContract } from 'react-icons/fa';

const DocumentsPage: React.FC = () => {
    const [recordsPerPage, setRecordsPerPage] = useState(10);

    return (
        <div className="w-full min-h-screen bg-gray-900 flex flex-col items-center px-4">
            <div className="w-full">
                <h1 className="text-4xl font-medium text-center text-white my-10">Documentos</h1>

                <div className="w-full p-4 bg-blue-800 text-white text-center rounded mb-4">
                    <div className="-ml-15 mb-3 flex flex-col items-center">
                        <div className="flex justify-center items-center text-blue-300">
                            <FaFilePdf className="mr-2" size={32} />
                            <h2 className="text-2xl font-medium">DOCUMENTOS</h2>
                        </div>
                        <p>Gerenciamento de documentos disponibilizados para sua conta</p>
                    </div>
                </div>

                <div className="w-full border border-blue-800 p-4 text-white rounded mb-4">
                    <div className="w-full text-center p-4 bg-blue-800 text-white rounded mb-4 pl-50 pr-50">
                        <h2 className="text-2xl font-medium">Estatística de Confirmação de Leitura de Documentos</h2>
                        <div className="flex justify-between mt-10">
                            <div className="flex flex-col items-center text-center">
                                <div className="flex items-center text-blue-300">
                                    <FaFilePdf className="mr-2" size={32} />
                                    <p className="text-3xl"><strong>0</strong></p>
                                </div>
                                <p className="text-white">Total de documentos</p>
                            </div>
                            <div className="flex flex-col items-center text-center border-l border-r border-gray-900 px-30">
                                <div className="flex items-center text-green-500">
                                    <FaFileContract className="mr-2" size={32} />
                                    <p className="text-3xl"><strong>0</strong></p>
                                </div>
                                <p className="text-white">Ciente</p>
                            </div>
                            <div className="flex flex-col items-center text-center">
                                <div className="flex items-center text-orange-500">
                                    <FaFileContract className="mr-2" size={32} />
                                    <p className="text-3xl"><strong>0</strong></p>
                                </div>
                                <p className="text-white">Pendente(s) de Confirmação de Leitura</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end mb-4">
                    <label className="text-white mr-2">Registros por página:</label>
                    <select
                        value={recordsPerPage}
                        onChange={(e) => setRecordsPerPage(Number(e.target.value))}
                        className="p-2 rounded">
                        {
                            [10, 20, 30, 40, 50, 100].map(num => (
                                <option key={num} value={num}>{num}</option>
                            ))
                        }
                    </select>
                </div>
            </div>

            {/* <table className="w-full bg-white rounded">
                <thead>
                    <tr>
                        <th className="p-2 border">Documento</th>
                        <th className="p-2 border">Criticidade</th>
                        <th className="p-2 border">Status</th>
                        <th className="p-2 border">Disponibilizado em</th>
                        <th className="p-2 border">Data da Confirmação</th>
                        <th className="p-2 border">Visualizar</th>
                    </tr>
                </thead>
                <tbody>
        </tbody>
            </table > */}
        </div>
    );
};

export default DocumentsPage;
