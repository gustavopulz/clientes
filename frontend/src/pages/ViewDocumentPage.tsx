import React from 'react';
import { useLocation } from 'react-router-dom';

const ViewDocumentPage: React.FC = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const fileUrl = queryParams.get('fileUrl');

    return (
        <div className="w-full min-h-screen bg-gray-900 flex flex-col items-center px-4">
            <div className="w-full mt-5">
                <div className="w-full p-4 text-white text-center rounded mb-4" style={{ backgroundColor: '#032846' }}>
                    <h2 className="text-2xl font-medium">Visualizar Documento</h2>
                </div>
                <div className="w-full border p-4 text-white rounded mb-4" style={{ borderColor: '#07223c' }}>
                    <div className="w-full text-center p-4 text-white rounded mb-4" style={{ background: '#07223c' }}>
                        {fileUrl ? (
                            <iframe
                                src={`http://localhost:8080/uploads/${fileUrl}`}
                                title="Document Viewer"
                                width="100%"
                                height="600px"
                                style={{ border: '1px solid #1b3d5d' }}
                            />
                        ) : (
                            <p>Documento não encontrado.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ViewDocumentPage;
