import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import NotFoundPage from './pages/NotFoundPage';
import DualListPage from './pages/DualListPage';
import DocumentsPage from './pages/DocumentsPage';
import ViewDocumentPage from './pages/ViewDocumentPage';
import NotificationsPage from './pages/NotificationsPage';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dual-list" element={<DualListPage />} />
        <Route path="/documents" element={<DocumentsPage />} />
        <Route path="/view-document/:id" element={<ViewDocumentPage />} />
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="/" element={<RegisterPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}

export default App;