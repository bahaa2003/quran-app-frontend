// frontend/src/App.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import SheikhsPage from './pages/SheikhsPage';
import RecordingsPage from './pages/RecordingsPage';
import AdminPage from './pages/AdminPage';
//import AddSheikhPage from './pages/AddSheikhPage';
import EditSheikhPage from './pages/EditSheikhPage';
import EditRecordingPage from './pages/EditRecordingPage';
import Navbar from './components/Navbar';
import LoginPage from './pages/LoginPage';
import SheikhRecordingsPage from './pages/SheikhRecordingsPage';

function App() {
    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <div className="flex-grow">
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/sheikhs" element={<SheikhsPage />} />
                    <Route path="/recordings" element={<RecordingsPage />} />
                    <Route path="/admin" element={<AdminPage />} />
                    {/* <Route path="/add-sheikh" element={<AddSheikhPage />} /> */}
                    <Route path="/edit-sheikh/:id" element={<EditSheikhPage />} />
                    <Route path="/edit-recording/:id" element={<EditRecordingPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/" element={<SheikhsPage />} />
                    <Route path="/sheikh/:sheikhId/recordings" element={<SheikhRecordingsPage />} />
                </Routes>
            </div>
            <footer className="bg-green-700 text-white py-4">
                <div className="container mx-auto text-center">
                    <p className="text-sm">© 2025 <a href='https://www.linkedin.com/in/bahaa-mohammed-929636205/'>BAHAA MOHAMMED</a>. جميع الحقوق محفوظة.</p>
                </div>
            </footer>
        </div>
    );
}

export default App;