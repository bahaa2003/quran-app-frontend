import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import RecordingsPage from './pages/RecordingsPage';
import SheikhsPage from './pages/SheikhsPage';
import SheikhRecordingsPage from './pages/SheikhRecordingsPage';
import LoginPage from './pages/LoginPage';
import AdminPage from './pages/AdminPage';
import EditRecordingPage from './pages/EditRecordingPage';
import EditSheikhPage from './pages/EditSheikhPage';
import { AudioProvider } from './contexts/AudioContext';
import { ThemeProvider } from './contexts/ThemeContext';
import ErrorBoundary from './components/ErrorBoundary';
import { ToastProvider } from './contexts/ToastContext';

function App() {
    return (
        <ErrorBoundary>
            <ThemeProvider>
                <ToastProvider>
                    <AudioProvider>
                        <div className="App min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-all duration-500">
                            <Navbar />
                            <Routes>
                                <Route path="/" element={<HomePage />} />
                                <Route path="/recordings" element={<RecordingsPage />} />
                                <Route path="/sheikhs" element={<SheikhsPage />} />
                                <Route path="/sheikh/:sheikhId" element={<SheikhRecordingsPage />} />
                                <Route path="/login" element={<LoginPage />} />
                                <Route path="/admin" element={<AdminPage />} />
                                <Route path="/edit-recording/:id" element={<EditRecordingPage />} />
                                <Route path="/edit-sheikh/:id" element={<EditSheikhPage />} />
                            </Routes>
                        </div>
                    </AudioProvider>
                </ToastProvider>
            </ThemeProvider>
        </ErrorBoundary>
    );
}

export default App;
