// frontend/src/pages/EditSheikhPage.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { useToast } from '../contexts/ToastContext';

const EditSheikhPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { isDarkMode } = useTheme();
    const { showToast } = useToast();
    const [formData, setFormData] = useState({
        name: '',
        bio: '',
        photo: '',
    });
    const [loading, setLoading] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchSheikh = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    showToast('يجب تسجيل الدخول أولاً', 'error');
                    setIsLoading(false);
                    return;
                }

                // Validate sheikh ID format
                if (!id || id.length !== 24) {
                    showToast('معرف الشيخ غير صحيح', 'error');
                    setIsLoading(false);
                    return;
                }

                // Try to fetch sheikh data with fallback approach
                let sheikhData = null;
                
                try {
                    // First attempt: Direct sheikh endpoint
                    const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/v1/sheikhs/${id}`, {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        },
                        timeout: 8000
                    });
                    
                    if (response.data && response.data.data) {
                        sheikhData = response.data.data;
                    }
                } catch (directError) {
                    console.log('Direct fetch failed, trying fallback approach...');
                    
                    // Fallback: Get all sheikhs and find the specific one
                    try {
                        const allSheikhsResponse = await axios.get(`${process.env.REACT_APP_API_URL}/api/v1/sheikhs`, {
                            timeout: 8000
                        });
                        
                        if (allSheikhsResponse.data && allSheikhsResponse.data.data) {
                            const targetSheikh = allSheikhsResponse.data.data.find(sheikh => sheikh._id === id);
                            if (targetSheikh) {
                                sheikhData = targetSheikh;
                            } else {
                                throw new Error('Sheikh not found in list');
                            }
                        }
                    } catch (fallbackError) {
                        throw directError; // Throw original error if fallback also fails
                    }
                }
                
                if (sheikhData) {
                    setFormData(sheikhData);
                } else {
                    throw new Error('No sheikh data received');
                }
            } catch (error) {
                console.error('Error fetching sheikh:', error);
                if (error.response?.status === 401) {
                    showToast('انتهت صلاحية جلسة المدير - يرجى تسجيل الدخول مرة أخرى', 'error');
                } else if (error.response?.status === 500) {
                    showToast('خطأ في الخادم - يرجى المحاولة لاحقاً أو التواصل مع المطور', 'error');
                } else if (error.response?.status === 404) {
                    showToast('لم يتم العثور على بيانات هذا الشيخ', 'error');
                } else if (error.code === 'ECONNABORTED') {
                    showToast('انتهت مهلة الاتصال - تحقق من الإنترنت', 'error');
                } else {
                    showToast(`فشل في تحميل بيانات الشيخ: ${error.message}`, 'error');
                }
            } finally {
                setIsLoading(false);
            }
        };

        if (id) {
            fetchSheikh();
        } else {
            setIsLoading(false);
            showToast('معرف الشيخ مفقود', 'error');
        }
    }, [id, showToast]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                showToast('يجب تسجيل الدخول أولاً', 'error');
                return;
            }

            const response = await axios.patch(`${process.env.REACT_APP_API_URL}/api/v1/sheikhs/${id}`, formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            
            showToast('تم تعديل الشيخ بنجاح', 'success');
            navigate('/sheikhs');
        } catch (error) {
            console.error('Error updating sheikh:', error);
            showToast('حدث خطأ أثناء تعديل الشيخ', 'error');
        } finally {
            setLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className={`
                min-h-screen transition-all duration-500 font-cairo
                ${isDarkMode 
                    ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900' 
                    : 'bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50'
                }
            `}>
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="flex justify-center items-center min-h-[400px]">
                        <div className={`
                            animate-spin rounded-full h-16 w-16 border-4 border-t-4
                            ${isDarkMode 
                                ? 'border-slate-700 border-t-emerald-400' 
                                : 'border-emerald-200 border-t-emerald-600'
                            }
                        `}></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={`
            min-h-screen transition-all duration-500 font-cairo
            ${isDarkMode 
                ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900' 
                : 'bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50'
            }
        `}>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <button
                        onClick={() => navigate('/sheikhs')}
                        className={`
                            mb-6 flex items-center px-4 py-2 rounded-xl transition-all duration-300 hover:scale-105
                            ${isDarkMode 
                                ? 'bg-slate-800 text-slate-200 hover:bg-slate-700 border border-slate-600' 
                                : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
                            }
                            shadow-lg hover:shadow-xl
                        `}
                    >
                        <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        العودة إلى القراء
                    </button>
                    
                    <h1 className={`
                        text-3xl sm:text-4xl md:text-5xl font-bold mb-6 text-center
                        bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent
                        ${isDarkMode ? 'from-emerald-400 via-teal-400 to-cyan-400' : ''}
                    `}>
                        تعديل بيانات الشيخ
                    </h1>
                    <div className="w-32 h-1.5 bg-gradient-to-r from-amber-400 via-orange-500 to-amber-600 mx-auto rounded-full shadow-lg"></div>
                </div>

                <div className={`
                    backdrop-blur-sm border-2 rounded-3xl p-8 shadow-2xl transition-all duration-500 max-w-4xl mx-auto
                    ${isDarkMode 
                        ? 'bg-slate-800/70 border-slate-600 shadow-slate-900/50' 
                        : 'bg-white/70 border-emerald-200 shadow-emerald-100/50'
                    }
                `}>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="md:col-span-2">
                                <label className={`
                                    block text-lg font-bold mb-3 transition-colors duration-500
                                    ${isDarkMode ? 'text-emerald-300' : 'text-emerald-800'}
                                `}>
                                    اسم الشيخ
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="اسم الشيخ"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className={`
                                        w-full p-4 border-2 rounded-2xl transition-all duration-300 text-lg font-medium
                                        ${isDarkMode 
                                            ? 'bg-slate-700/80 border-slate-500 text-slate-100 placeholder-slate-400 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/50' 
                                            : 'bg-white/80 border-emerald-200 text-slate-800 placeholder-slate-500 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200'
                                        }
                                    `}
                                    required
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className={`
                                    block text-lg font-bold mb-3 transition-colors duration-500
                                    ${isDarkMode ? 'text-emerald-300' : 'text-emerald-800'}
                                `}>
                                    نبذة عن الشيخ
                                </label>
                                <textarea
                                    name="bio"
                                    placeholder="معلومات عن الشيخ"
                                    value={formData.bio}
                                    onChange={handleChange}
                                    rows={4}
                                    className={`
                                        w-full p-4 border-2 rounded-2xl transition-all duration-300 text-lg font-medium resize-none
                                        ${isDarkMode 
                                            ? 'bg-slate-700/80 border-slate-500 text-slate-100 placeholder-slate-400 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/50' 
                                            : 'bg-white/80 border-emerald-200 text-slate-800 placeholder-slate-500 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200'
                                        }
                                    `}
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className={`
                                    block text-lg font-bold mb-3 transition-colors duration-500
                                    ${isDarkMode ? 'text-emerald-300' : 'text-emerald-800'}
                                `}>
                                    رابط صورة الشيخ
                                </label>
                                <input
                                    type="url"
                                    name="photo"
                                    placeholder="رابط صورة الشيخ"
                                    value={formData.photo}
                                    onChange={handleChange}
                                    className={`
                                        w-full p-4 border-2 rounded-2xl transition-all duration-300 text-lg font-medium
                                        ${isDarkMode 
                                            ? 'bg-slate-700/80 border-slate-500 text-slate-100 placeholder-slate-400 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/50' 
                                            : 'bg-white/80 border-emerald-200 text-slate-800 placeholder-slate-500 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200'
                                        }
                                    `}
                                />
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 pt-6">
                            <button
                                type="button"
                                onClick={() => navigate('/sheikhs')}
                                className={`
                                    flex-1 px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 transform hover:scale-105
                                    ${isDarkMode 
                                        ? 'bg-slate-700 text-slate-200 hover:bg-slate-600 border-2 border-slate-600 hover:border-slate-500' 
                                        : 'bg-slate-200 text-slate-700 hover:bg-slate-300 border-2 border-slate-300 hover:border-slate-400'
                                    }
                                    shadow-lg hover:shadow-xl
                                `}
                            >
                                إلغاء
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className={`
                                    flex-1 px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 transform hover:scale-105 text-white
                                    ${loading 
                                        ? 'bg-gray-400 cursor-not-allowed' 
                                        : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700'
                                    }
                                    shadow-lg hover:shadow-xl
                                `}
                            >
                                {loading ? 'جاري التحديث...' : 'حفظ التعديلات'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditSheikhPage;