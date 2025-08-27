// frontend/src/pages/LoginPage.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { useToast } from '../contexts/ToastContext';

const LoginPage = () => {
    const { isDarkMode } = useTheme();
    const { showToast } = useToast();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await axios.post('https://quran-app-bms.vercel.app/api/v1/auth/login', {
                username,
                password,
            });
            localStorage.setItem('token', response.data.token);
            showToast('تم تسجيل الدخول بنجاح', 'success');
            navigate('/admin');
        } catch (error) {
            console.error('Error logging in:', error);
            showToast('حدث خطأ أثناء تسجيل الدخول', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={`
            min-h-screen transition-all duration-500
            ${isDarkMode 
                ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900' 
                : 'bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50'
            }
        `}>
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-md mx-auto mt-20">
                    {/* Header */}
                    <div className="text-center mb-12">
                        <div className="text-6xl mb-4">🔐</div>
                        <h2 className={`
                            text-4xl font-bold mb-4 transition-colors duration-500
                            ${isDarkMode ? 'text-slate-100' : 'text-slate-800'}
                        `}>
                            تسجيل الدخول
                        </h2>
                        <p className={`
                            text-lg transition-colors duration-500
                            ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}
                        `}>
                            ادخل إلى لوحة التحكم
                        </p>
                        <div className="w-16 h-1 bg-gradient-to-r from-emerald-500 to-teal-600 mx-auto rounded-full mt-4"></div>
                    </div>

                    {/* Login Form */}
                    <div className={`
                        rounded-3xl p-8 transition-all duration-500 shadow-2xl
                        ${isDarkMode 
                            ? 'bg-slate-800/50 border border-slate-700/50' 
                            : 'bg-white/70 border border-slate-200/50'
                        }
                        backdrop-blur-sm
                    `}>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className={`
                                    block text-sm font-semibold mb-2 transition-colors duration-500
                                    ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}
                                `}>
                                    اسم المستخدم
                                </label>
                                <input
                                    type="text"
                                    placeholder="أدخل اسم المستخدم"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className={`
                                        w-full p-4 rounded-xl border-2 transition-all duration-300
                                        ${isDarkMode 
                                            ? 'bg-slate-700/50 border-slate-600 text-slate-100 placeholder-slate-400 focus:border-emerald-500' 
                                            : 'bg-white/70 border-slate-200 text-slate-800 placeholder-slate-500 focus:border-emerald-500'
                                        }
                                        focus:outline-none focus:ring-4 focus:ring-emerald-500/20
                                    `}
                                    required
                                    disabled={loading}
                                />
                            </div>
                            
                            <div>
                                <label className={`
                                    block text-sm font-semibold mb-2 transition-colors duration-500
                                    ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}
                                `}>
                                    كلمة المرور
                                </label>
                                <input
                                    type="password"
                                    placeholder="أدخل كلمة المرور"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className={`
                                        w-full p-4 rounded-xl border-2 transition-all duration-300
                                        ${isDarkMode 
                                            ? 'bg-slate-700/50 border-slate-600 text-slate-100 placeholder-slate-400 focus:border-emerald-500' 
                                            : 'bg-white/70 border-slate-200 text-slate-800 placeholder-slate-500 focus:border-emerald-500'
                                        }
                                        focus:outline-none focus:ring-4 focus:ring-emerald-500/20
                                    `}
                                    required
                                    disabled={loading}
                                />
                            </div>
                            
                            <button
                                type="submit"
                                disabled={loading}
                                className={`
                                    w-full py-4 px-6 rounded-xl font-semibold text-white transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105
                                    ${loading 
                                        ? 'bg-gray-400 cursor-not-allowed' 
                                        : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700'
                                    }
                                `}
                            >
                                {loading ? (
                                    <div className="flex items-center justify-center">
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white ml-2"></div>
                                        جاري تسجيل الدخول...
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-center">
                                        <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                                        </svg>
                                        تسجيل الدخول
                                    </div>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;