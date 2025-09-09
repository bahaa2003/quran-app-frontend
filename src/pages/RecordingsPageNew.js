import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import AudioPlayer from '../components/AudioPlayer';
import QuranTextDisplay from '../components/QuranTextDisplay';
import { useAudio } from '../contexts/AudioContext';
import { useTheme } from '../contexts/ThemeContext';

const RecordingsPage = () => {
    const { isDarkMode, theme } = useTheme();
    const [recordings, setRecordings] = useState([]);
    const [filteredRecordings, setFilteredRecordings] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const isAuthenticated = !!localStorage.getItem('token'); 

    useEffect(() => {
        const fetchRecordings = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/v1/recordings`);
                const sortedRecordings = response.data.data.sort((a, b) => new Date(b.date) - new Date(a.date));
                setRecordings(sortedRecordings);
                setFilteredRecordings(sortedRecordings);
            } catch (error) {
                console.error('Error fetching recordings:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchRecordings();
    }, []);

    useEffect(() => {
        let filtered = recordings;

        if (selectedCategory !== 'all') {
            filtered = filtered.filter((recording) => recording.category === selectedCategory);
        }

        if (searchQuery) {
            filtered = filtered.filter(
                (recording) =>
                    recording.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    recording.sheikh.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    (recording.surah && recording.surah.toLowerCase().includes(searchQuery.toLowerCase()))
            );
        }

        setFilteredRecordings(filtered);
    }, [selectedCategory, searchQuery, recordings]);

    const handleDelete = async (id) => {
        const isConfirmed = window.confirm('هل أنت متأكد من حذف التسجيل؟');
        if (!isConfirmed) return;

        try {
            const token = localStorage.getItem('token');
            await axios.delete(`${process.env.REACT_APP_API_URL}/api/v1/recordings/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setRecordings(recordings.filter((recording) => recording._id !== id));
            alert('تم حذف التسجيل بنجاح');
        } catch (error) {
            console.error('Error deleting recording:', error);
            alert('حدث خطأ أثناء حذف التسجيل');
        }
    };

    if (loading) {
        return (
            <div className={`
                min-h-screen flex items-center justify-center transition-all duration-500
                ${isDarkMode 
                    ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900' 
                    : 'bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50'
                }
            `}>
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-emerald-500 mx-auto mb-4"></div>
                    <p className={`text-xl ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                        جاري تحميل التسجيلات...
                    </p>
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
                    <h1 className={`
                        text-3xl sm:text-4xl md:text-5xl font-bold mb-6 text-center
                        bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent
                        ${isDarkMode ? 'from-emerald-400 via-teal-400 to-cyan-400' : ''}
                    `}>
                        🎵 التسجيلات الصوتية
                    </h1>
                    <p className={`
                        text-xl md:text-2xl mb-6 transition-colors duration-500 text-center
                        ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}
                    `}>
                        استمع إلى مجموعة مختارة من أجمل التلاوات القرآنية
                    </p>
                    <div className="w-32 h-1.5 bg-gradient-to-r from-amber-400 via-orange-500 to-amber-600 mx-auto rounded-full shadow-lg"></div>
                </div>

                {/* فلاتر البحث */}
                <div className={`
                    backdrop-blur-sm border-2 rounded-3xl p-8 mb-12 shadow-2xl transition-all duration-500
                    ${isDarkMode 
                        ? 'bg-slate-800/70 border-slate-600 shadow-slate-900/50' 
                        : 'bg-white/70 border-emerald-200 shadow-emerald-100/50'
                    }
                `}>
                    <div className="grid grid-cols-1 gap-6 mb-6">
                        <div>
                            <label htmlFor="category" className={`
                                flex items-center text-lg font-bold mb-4 transition-colors duration-500
                                ${isDarkMode ? 'text-emerald-300' : 'text-emerald-800'}
                            `}>
                                <svg className="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M3 4a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm2 2V5h1v1H5zM3 13a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1H4a1 1 0 01-1-1v-3zm2 2v-1h1v1H5zM13 3a1 1 0 00-1 1v3a1 1 0 001 1h3a1 1 0 001-1V4a1 1 0 00-1-1h-3zm1 2v1h1V5h-1z" clipRule="evenodd"/>
                                </svg>
                                📂 التصنيف
                            </label>
                            <select
                                id="category"
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className={`
                                    w-full p-4 border-2 rounded-2xl transition-all duration-300 text-lg font-medium
                                    ${isDarkMode 
                                        ? 'bg-slate-700/80 border-slate-500 text-slate-100 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/50' 
                                        : 'bg-white/80 border-emerald-200 text-slate-800 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200'
                                    }
                                `}
                            >
                                <option value="all">🌟 جميع التصنيفات</option>
                                <option value="general">📖 عام</option>
                                <option value="ramadan">🌙 رمضان</option>
                                <option value="featured">⭐ مميز</option>
                            </select>
                        </div>
                    </div>

                    {/* حقل البحث */}
                    <div className="relative">
                        <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                            <svg className={`w-6 h-6 transition-colors duration-500 ${isDarkMode ? 'text-emerald-400' : 'text-emerald-500'}`} fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"/>
                            </svg>
                        </div>
                        <input
                            type="text"
                            placeholder="🔍 ابحث عن تسجيل أو شيخ أو سورة..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className={`
                                w-full p-4 pr-12 border-2 rounded-2xl transition-all duration-300 text-lg font-medium
                                ${isDarkMode 
                                    ? 'bg-slate-700/80 border-slate-500 text-slate-100 placeholder-slate-400 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/50' 
                                    : 'bg-white/80 border-emerald-200 text-slate-800 placeholder-slate-500 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200'
                                }
                            `}
                        />
                    </div>
                </div>

                {/* عرض التسجيلات */}
                <div className="grid grid-cols-1 gap-10">
                    {filteredRecordings.length === 0 ? (
                        <div className={`
                            text-center py-16 backdrop-blur-sm border-2 rounded-3xl shadow-2xl transition-all duration-500
                            ${isDarkMode 
                                ? 'bg-slate-800/70 border-slate-600 shadow-slate-900/50' 
                                : 'bg-white/70 border-emerald-200 shadow-emerald-100/50'
                            }
                        `}>
                            <div className="text-6xl mb-6">🔍</div>
                            <h3 className={`
                                text-2xl font-bold mb-4 transition-colors duration-500
                                ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}
                            `}>
                                لم يتم العثور على تسجيلات
                            </h3>
                            <p className={`
                                text-lg transition-colors duration-500
                                ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}
                            `}>
                                جرب تغيير معايير البحث أو الفلاتر
                            </p>
                        </div>
                    ) : (
                        filteredRecordings.map((recording) => (
                            <div key={recording._id} className={`
                                backdrop-blur-sm border-2 rounded-3xl p-10 shadow-2xl transition-all duration-500 transform hover:scale-[1.02] group
                                ${isDarkMode 
                                    ? 'bg-slate-800/70 border-slate-600 hover:border-emerald-500 shadow-slate-900/50' 
                                    : 'bg-white/80 border-emerald-200 hover:border-emerald-400 shadow-emerald-100/50'
                                }
                            `}>
                                <div className="flex justify-between items-start mb-6">
                                    <h3 className={`
                                        text-3xl font-bold transition-colors duration-300
                                        ${isDarkMode 
                                            ? 'text-emerald-300 group-hover:text-emerald-200' 
                                            : 'text-emerald-800 group-hover:text-emerald-600'
                                        }
                                    `}>
                                        🎵 {recording.title}
                                    </h3>
                                    {isAuthenticated && (
                                        <div className="flex space-x-2">
                                            <Link
                                                to={`/edit-recording/${recording._id}`}
                                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                            >
                                                تعديل
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(recording._id)}
                                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                                            >
                                                حذف
                                            </button>
                                        </div>
                                    )}
                                </div>
                                
                                {recording.description && (
                                    <p className={`
                                        text-lg mb-6 leading-relaxed transition-colors duration-500
                                        ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}
                                    `}>
                                        {recording.description}
                                    </p>
                                )}
                                
                                {/* معلومات القرآن الكريم */}
                                {(recording.surah || recording.fromAyah || recording.toAyah) && (
                                    <div className={`
                                        p-6 rounded-2xl mb-6 border-2 transition-all duration-500
                                        ${isDarkMode 
                                            ? 'bg-emerald-900/30 border-emerald-700 shadow-emerald-900/50' 
                                            : 'bg-emerald-50 border-emerald-200 shadow-emerald-100/50'
                                        }
                                    `}>
                                        <h4 className={`
                                            text-xl font-bold mb-4 flex items-center transition-colors duration-500
                                            ${isDarkMode ? 'text-emerald-300' : 'text-emerald-800'}
                                        `}>
                                            <svg className="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                            </svg>
                                            📖 معلومات القرآن الكريم
                                        </h4>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                            {recording.surah && (
                                                <div className={`
                                                    p-4 rounded-xl transition-colors duration-500
                                                    ${isDarkMode ? 'bg-slate-700/50' : 'bg-white/70'}
                                                `}>
                                                    <span className={`
                                                        font-bold block mb-2 transition-colors duration-500
                                                        ${isDarkMode ? 'text-emerald-300' : 'text-emerald-700'}
                                                    `}>📜 السورة:</span>
                                                    <span className={`
                                                        text-lg transition-colors duration-500
                                                        ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}
                                                    `}>{recording.surah}</span>
                                                </div>
                                            )}
                                            {recording.fromAyah && (
                                                <div className={`
                                                    p-4 rounded-xl transition-colors duration-500
                                                    ${isDarkMode ? 'bg-slate-700/50' : 'bg-white/70'}
                                                `}>
                                                    <span className={`
                                                        font-bold block mb-2 transition-colors duration-500
                                                        ${isDarkMode ? 'text-emerald-300' : 'text-emerald-700'}
                                                    `}>🔢 من الآية:</span>
                                                    <span className={`
                                                        text-lg transition-colors duration-500
                                                        ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}
                                                    `}>{recording.fromAyah}</span>
                                                </div>
                                            )}
                                            {recording.toAyah && (
                                                <div className={`
                                                    p-4 rounded-xl transition-colors duration-500
                                                    ${isDarkMode ? 'bg-slate-700/50' : 'bg-white/70'}
                                                `}>
                                                    <span className={`
                                                        font-bold block mb-2 transition-colors duration-500
                                                        ${isDarkMode ? 'text-emerald-300' : 'text-emerald-700'}
                                                    `}>🔢 إلى الآية:</span>
                                                    <span className={`
                                                        text-lg transition-colors duration-500
                                                        ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}
                                                    `}>{recording.toAyah}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                                
                                {recording.year && (
                                    <div className={`
                                        p-4 rounded-xl border-2 transition-all duration-500 mb-6
                                        ${isDarkMode 
                                            ? 'bg-slate-700/50 border-slate-600 shadow-slate-800/50' 
                                            : 'bg-white/70 border-slate-200 shadow-slate-100/50'
                                        }
                                    `}>
                                        <div className={`
                                            font-bold text-sm mb-2 flex items-center transition-colors duration-500
                                            ${isDarkMode ? 'text-orange-300' : 'text-orange-700'}
                                        `}>
                                            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1z" clipRule="evenodd"/>
                                            </svg>
                                            📅 العام
                                        </div>
                                        <div className={`
                                            text-lg font-semibold transition-colors duration-500
                                            ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}
                                        `}>
                                            {recording.year}
                                        </div>
                                    </div>
                                )}
                                
                                {/* مشغل الصوت */}
                                <div className="mb-8">
                                    <AudioPlayer 
                                        src={recording.audio_file} 
                                        recordingId={recording._id}
                                        className="mb-4"
                                    />
                                </div>

                                {/* عرض النص القرآني */}
                                {recording.surah && recording.fromAyah && recording.toAyah && (
                                    <QuranTextDisplay 
                                        surahNumber={recording.surahNumber}
                                        fromAyah={recording.fromAyah}
                                        toAyah={recording.toAyah}
                                        recordingId={recording._id}
                                    />
                                )}

                                {/* معلومات الشيخ */}
                                <div className={`
                                    p-6 rounded-2xl border-2 transition-all duration-500
                                    ${isDarkMode 
                                        ? 'bg-slate-700/50 border-slate-600 shadow-slate-800/50' 
                                        : 'bg-white/70 border-slate-200 shadow-slate-100/50'
                                    }
                                `}>
                                    <h4 className={`
                                        text-xl font-bold mb-4 flex items-center transition-colors duration-500
                                        ${isDarkMode ? 'text-blue-300' : 'text-blue-800'}
                                    `}>
                                        <svg className="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"/>
                                        </svg>
                                        👨‍🏫 الشيخ
                                    </h4>
                                    <Link 
                                        to={`/sheikh/${recording.sheikh._id}`}
                                        className={`
                                            text-2xl font-bold hover:underline transition-colors duration-300
                                            ${isDarkMode 
                                                ? 'text-blue-300 hover:text-blue-200' 
                                                : 'text-blue-700 hover:text-blue-600'
                                            }
                                        `}
                                    >
                                        {recording.sheikh.name}
                                    </Link>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default RecordingsPage;
