import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { useToast } from '../contexts/ToastContext';

const EditRecordingPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { isDarkMode } = useTheme();
    const { showToast } = useToast();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        sheikh: '',
        category: 'general',
        year: '',
        surah: '',
        surahNumber: '',
        fromAyah: '',
        toAyah: '',
        audio_file: null,
    });

    const [sheikhs, setSheikhs] = useState([]);

    useEffect(() => {
        const fetchRecording = async () => {
            try {
                const response = await axios.get(`https://quran-app-bms.vercel.app/api/v1/recordings/${id}`);
                setFormData(response.data.data);
            } catch (error) {
                console.error('Error fetching recording:', error);
            }
        };

        const fetchSheikhs = async () => {
            try {
                const response = await axios.get('https://quran-app-bms.vercel.app/api/v1/sheikhs');
                setSheikhs(response.data.data);
            } catch (error) {
                console.error('Error fetching sheikhs:', error);
            }
        };

        fetchRecording();
        fetchSheikhs();
    }, [id]);

    const handleChange = (e) => {
        const { name, value, type, checked, files } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : type === 'file' ? files[0] : value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                showToast('يجب تسجيل الدخول أولاً', 'error');
                return;
            }

            // Prepare update data (no FormData for PATCH without file upload)
            const updateData = {
                title: formData.title,
                description: formData.description,
                sheikh: formData.sheikh,
                category: formData.category,
                year: formData.year ? parseInt(formData.year) : undefined,
                surah: formData.surah,
                surahNumber: formData.surahNumber ? parseInt(formData.surahNumber) : undefined,
                fromAyah: formData.fromAyah ? parseInt(formData.fromAyah) : undefined,
                toAyah: formData.toAyah ? parseInt(formData.toAyah) : undefined,
            };

            const response = await axios.patch(`https://quran-app-bms.vercel.app/api/v1/recordings/${id}`, updateData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            
            showToast('تم تعديل التسجيل بنجاح', 'success');
            navigate('/recordings');
        } catch (error) {
            console.error('Error updating recording:', error);
            showToast('حدث خطأ أثناء تعديل التسجيل', 'error');
        }
    };

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
                    <h1 className={`
                        text-3xl sm:text-4xl md:text-5xl font-bold mb-6 text-center
                        bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent
                        ${isDarkMode ? 'from-emerald-400 via-teal-400 to-cyan-400' : ''}
                    `}>
                        ✏️ تعديل التسجيل
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
                            <div>
                                <label className={`
                                    block text-lg font-bold mb-3 transition-colors duration-500
                                    ${isDarkMode ? 'text-emerald-300' : 'text-emerald-800'}
                                `}>
                                    📝 عنوان التسجيل
                                </label>
                                <input
                                    type="text"
                                    name="title"
                                    placeholder="عنوان التسجيل"
                                    value={formData.title}
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

                            <div>
                                <label className={`
                                    block text-lg font-bold mb-3 transition-colors duration-500
                                    ${isDarkMode ? 'text-blue-300' : 'text-blue-800'}
                                `}>
                                    👨‍🏫 الشيخ
                                </label>
                                <select
                                    name="sheikh"
                                    value={formData.sheikh}
                                    onChange={handleChange}
                                    className={`
                                        w-full p-4 border-2 rounded-2xl transition-all duration-300 text-lg font-medium
                                        ${isDarkMode 
                                            ? 'bg-slate-700/80 border-slate-500 text-slate-100 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/50' 
                                            : 'bg-white/80 border-blue-200 text-slate-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
                                        }
                                    `}
                                    required
                                >
                                    <option value="">اختر الشيخ</option>
                                    {sheikhs.map((sheikh) => (
                                        <option key={sheikh._id} value={sheikh._id}>
                                            {sheikh.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className={`
                                block text-lg font-bold mb-3 transition-colors duration-500
                                ${isDarkMode ? 'text-purple-300' : 'text-purple-800'}
                            `}>
                                📄 وصف التسجيل
                            </label>
                            <textarea
                                name="description"
                                placeholder="وصف التسجيل"
                                value={formData.description}
                                onChange={handleChange}
                                rows="4"
                                className={`
                                    w-full p-4 border-2 rounded-2xl transition-all duration-300 text-lg font-medium
                                    ${isDarkMode 
                                        ? 'bg-slate-700/80 border-slate-500 text-slate-100 placeholder-slate-400 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/50' 
                                        : 'bg-white/80 border-purple-200 text-slate-800 placeholder-slate-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-200'
                                    }
                                `}
                            ></textarea>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <label className={`
                                    block text-lg font-bold mb-3 transition-colors duration-500
                                    ${isDarkMode ? 'text-emerald-300' : 'text-emerald-800'}
                                `}>
                                    📖 اسم السورة
                                </label>
                                <input
                                    type="text"
                                    name="surah"
                                    placeholder="اسم السورة"
                                    value={formData.surah}
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

                            <div>
                                <label className={`
                                    block text-lg font-bold mb-3 transition-colors duration-500
                                    ${isDarkMode ? 'text-teal-300' : 'text-teal-800'}
                                `}>
                                    🔢 رقم السورة
                                </label>
                                <input
                                    type="number"
                                    name="surahNumber"
                                    placeholder="رقم السورة (1-114)"
                                    value={formData.surahNumber}
                                    onChange={handleChange}
                                    min="1"
                                    max="114"
                                    className={`
                                        w-full p-4 border-2 rounded-2xl transition-all duration-300 text-lg font-medium
                                        ${isDarkMode 
                                            ? 'bg-slate-700/80 border-slate-500 text-slate-100 placeholder-slate-400 focus:border-teal-400 focus:ring-2 focus:ring-teal-400/50' 
                                            : 'bg-white/80 border-teal-200 text-slate-800 placeholder-slate-500 focus:border-teal-500 focus:ring-2 focus:ring-teal-200'
                                        }
                                    `}
                                />
                            </div>

                            <div>
                                <label className={`
                                    block text-lg font-bold mb-3 transition-colors duration-500
                                    ${isDarkMode ? 'text-orange-300' : 'text-orange-800'}
                                `}>
                                    📅 السنة
                                </label>
                                <input
                                    type="number"
                                    name="year"
                                    placeholder="السنة"
                                    value={formData.year}
                                    onChange={handleChange}
                                    className={`
                                        w-full p-4 border-2 rounded-2xl transition-all duration-300 text-lg font-medium
                                        ${isDarkMode 
                                            ? 'bg-slate-700/80 border-slate-500 text-slate-100 placeholder-slate-400 focus:border-orange-400 focus:ring-2 focus:ring-orange-400/50' 
                                            : 'bg-white/80 border-orange-200 text-slate-800 placeholder-slate-500 focus:border-orange-500 focus:ring-2 focus:ring-orange-200'
                                        }
                                    `}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <label className={`
                                    block text-lg font-bold mb-3 transition-colors duration-500
                                    ${isDarkMode ? 'text-cyan-300' : 'text-cyan-800'}
                                `}>
                                    🔢 من الآية
                                </label>
                                <input
                                    type="number"
                                    name="fromAyah"
                                    placeholder="من الآية"
                                    value={formData.fromAyah}
                                    onChange={handleChange}
                                    min="1"
                                    className={`
                                        w-full p-4 border-2 rounded-2xl transition-all duration-300 text-lg font-medium
                                        ${isDarkMode 
                                            ? 'bg-slate-700/80 border-slate-500 text-slate-100 placeholder-slate-400 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/50' 
                                            : 'bg-white/80 border-cyan-200 text-slate-800 placeholder-slate-500 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200'
                                        }
                                    `}
                                />
                            </div>

                            <div>
                                <label className={`
                                    block text-lg font-bold mb-3 transition-colors duration-500
                                    ${isDarkMode ? 'text-indigo-300' : 'text-indigo-800'}
                                `}>
                                    🔢 إلى الآية
                                </label>
                                <input
                                    type="number"
                                    name="toAyah"
                                    placeholder="إلى الآية"
                                    value={formData.toAyah}
                                    onChange={handleChange}
                                    min="1"
                                    className={`
                                        w-full p-4 border-2 rounded-2xl transition-all duration-300 text-lg font-medium
                                        ${isDarkMode 
                                            ? 'bg-slate-700/80 border-slate-500 text-slate-100 placeholder-slate-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/50' 
                                            : 'bg-white/80 border-indigo-200 text-slate-800 placeholder-slate-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200'
                                        }
                                    `}
                                />
                            </div>

                            <div>
                                <label className={`
                                    block text-lg font-bold mb-3 transition-colors duration-500
                                    ${isDarkMode ? 'text-pink-300' : 'text-pink-800'}
                                `}>
                                    📂 التصنيف
                                </label>
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    className={`
                                        w-full p-4 border-2 rounded-2xl transition-all duration-300 text-lg font-medium
                                        ${isDarkMode 
                                            ? 'bg-slate-700/80 border-slate-500 text-slate-100 focus:border-pink-400 focus:ring-2 focus:ring-pink-400/50' 
                                            : 'bg-white/80 border-pink-200 text-slate-800 focus:border-pink-500 focus:ring-2 focus:ring-pink-200'
                                        }
                                    `}
                                    required
                                >
                                    <option value="general">عام</option>
                                    <option value="ramadan">رمضان</option>
                                    <option value="featured">مميز</option>
                                </select>
                            </div>
                        </div>

                        <div className="flex justify-center pt-6">
                            <button
                                type="submit"
                                className={`
                                    px-12 py-4 rounded-2xl font-bold text-xl transition-all duration-300 transform hover:scale-105 shadow-2xl
                                    ${isDarkMode 
                                        ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-emerald-900/50' 
                                        : 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-emerald-200/50'
                                    }
                                `}
                            >
                                ✅ حفظ التعديلات
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditRecordingPage;