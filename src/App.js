import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { ToastProvider } from './contexts/ToastContext';
import { AudioProvider } from './contexts/AudioContext';
import ErrorBoundary from './components/ErrorBoundary';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import RecordingsPage from './pages/RecordingsPage';
import SheikhsPage from './pages/SheikhsPage';
import SheikhRecordingsPage from './pages/SheikhRecordingsPage';
import AdminPage from './pages/AdminPage';
import LoginPage from './pages/LoginPage';
import EditRecordingPage from './pages/EditRecordingPage';
import EditSheikhPage from './pages/EditSheikhPage';
import './App.css';

function App() {
    return (
        <ErrorBoundary>
            <ThemeProvider>
                <ToastProvider>
                    <AudioProvider>
                        <div className="App min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-all duration-500">
                            <Navbar />
                            <main className="flex-1">
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
                            </main>
                            <Footer />
                        </div>
                    </AudioProvider>
                </ToastProvider>
            </ThemeProvider>
        </ErrorBoundary>
    );
}

export default App;
