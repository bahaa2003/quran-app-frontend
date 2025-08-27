import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';

const Toast = ({ message, type = 'info', duration = 5000, onClose }) => {
    const { isDarkMode } = useTheme();
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
            setTimeout(onClose, 300); // Wait for animation to complete
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, onClose]);

    const getToastStyles = () => {
        const baseStyles = `
            fixed top-4 right-4 z-50 max-w-sm w-full backdrop-blur-sm border-2 rounded-2xl p-6 shadow-2xl
            transform transition-all duration-300 flex items-center
            ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
        `;

        switch (type) {
            case 'success':
                return `${baseStyles} ${isDarkMode 
                    ? 'bg-emerald-900/80 border-emerald-600 shadow-emerald-900/50' 
                    : 'bg-emerald-50/90 border-emerald-300 shadow-emerald-100/50'
                }`;
            case 'error':
                return `${baseStyles} ${isDarkMode 
                    ? 'bg-red-900/80 border-red-600 shadow-red-900/50' 
                    : 'bg-red-50/90 border-red-300 shadow-red-100/50'
                }`;
            case 'warning':
                return `${baseStyles} ${isDarkMode 
                    ? 'bg-amber-900/80 border-amber-600 shadow-amber-900/50' 
                    : 'bg-amber-50/90 border-amber-300 shadow-amber-100/50'
                }`;
            default:
                return `${baseStyles} ${isDarkMode 
                    ? 'bg-slate-800/80 border-slate-600 shadow-slate-900/50' 
                    : 'bg-white/90 border-slate-300 shadow-slate-100/50'
                }`;
        }
    };

    const getIcon = () => {
        switch (type) {
            case 'success':
                return '✅';
            case 'error':
                return '❌';
            case 'warning':
                return '⚠️';
            default:
                return 'ℹ️';
        }
    };

    const getTextColor = () => {
        if (isDarkMode) {
            switch (type) {
                case 'success':
                    return 'text-emerald-200';
                case 'error':
                    return 'text-red-200';
                case 'warning':
                    return 'text-amber-200';
                default:
                    return 'text-slate-200';
            }
        } else {
            switch (type) {
                case 'success':
                    return 'text-emerald-800';
                case 'error':
                    return 'text-red-800';
                case 'warning':
                    return 'text-amber-800';
                default:
                    return 'text-slate-800';
            }
        }
    };

    return (
        <div className={getToastStyles()}>
            <div className="text-2xl mr-3">{getIcon()}</div>
            <div className="flex-1">
                <p className={`font-semibold text-lg ${getTextColor()}`}>
                    {message}
                </p>
            </div>
            <button
                onClick={() => {
                    setIsVisible(false);
                    setTimeout(onClose, 300);
                }}
                className={`
                    ml-3 p-1 rounded-full transition-colors duration-200
                    ${isDarkMode ? 'hover:bg-slate-700' : 'hover:bg-slate-200'}
                `}
            >
                <svg className={`w-5 h-5 ${getTextColor()}`} fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"/>
                </svg>
            </button>
        </div>
    );
};

// Toast Context for global toast management
const ToastContext = React.createContext();

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const addToast = (message, type = 'info', duration = 5000) => {
        const id = Date.now() + Math.random();
        setToasts(prev => [...prev, { id, message, type, duration }]);
    };

    const removeToast = (id) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    };

    const showSuccess = (message, duration) => addToast(message, 'success', duration);
    const showError = (message, duration) => addToast(message, 'error', duration);
    const showWarning = (message, duration) => addToast(message, 'warning', duration);
    const showInfo = (message, duration) => addToast(message, 'info', duration);

    return (
        <ToastContext.Provider value={{ showSuccess, showError, showWarning, showInfo }}>
            {children}
            <div className="fixed top-0 right-0 z-50 p-4 space-y-4">
                {toasts.map(toast => (
                    <Toast
                        key={toast.id}
                        message={toast.message}
                        type={toast.type}
                        duration={toast.duration}
                        onClose={() => removeToast(toast.id)}
                    />
                ))}
            </div>
        </ToastContext.Provider>
    );
};

export const useToast = () => {
    const context = React.useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};

export default Toast;
