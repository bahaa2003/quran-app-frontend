import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import UnifiedAudioPlayer from '../components/UnifiedAudioPlayer';
import QuranTextDisplay from '../components/QuranTextDisplay';
import { useTheme } from '../contexts/ThemeContext';
import { useToast } from '../contexts/ToastContext';

const SheikhRecordingsPage = () => {
    const { sheikhId } = useParams();
    const { isDarkMode } = useTheme();
    const { showToast } = useToast();
    const [recordings, setRecordings] = useState([]);
    const [filteredRecordings, setFilteredRecordings] = useState([]);
    const [sheikh, setSheikh] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const isAuthenticated = !!localStorage.getItem('token');

    useEffect(() => {
        const fetchRecordings = async () => {
            try {
                const response = await axios.get(`https://quran-app-bms.vercel.app/api/v1/recordings/sheikh/${sheikhId}`);
                const sortedRecordings = response.data.data.recordings.sort((a, b) => new Date(b.date) - new Date(a.date));
                setRecordings(sortedRecordings);
                setFilteredRecordings(sortedRecordings);
                if (sortedRecordings.length > 0) {
                    setSheikh(sortedRecordings[0].sheikh);
                }
            } catch (error) {
                console.error('Error fetching recordings:', error);
                showToast('حدث خطأ في تحميل التسجيلات', 'error');
            } finally {
                setLoading(false);
            }
        };

        fetchRecordings();
    }, [sheikhId, showToast]);

    useEffect(() => {
        if (searchQuery) {
            const filtered = recordings.filter((recording) =>
                recording.title.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setFilteredRecordings(filtered);
        } else {
            setFilteredRecordings(recordings);
        }
    }, [searchQuery, recordings]);

    const handleDelete = async (id) => {
        const isConfirmed = window.confirm('هل أنت متأكد من حذف التسجيل؟');
        if (!isConfirmed) return;

        try {
            const token = localStorage.getItem('token');
            await axios.delete(`https://quran-app-bms.vercel.app/api/v1/recordings/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setRecordings(recordings.filter((recording) => recording._id !== id));
            setFilteredRecordings(filteredRecordings.filter((recording) => recording._id !== id));
            showToast('تم حذف التسجيل بنجاح', 'success');
        } catch (error) {
            console.error('Error deleting recording:', error);
            showToast('حدث خطأ أثناء حذف التسجيل', 'error');
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
                        جاري تحميل تسجيلات الشيخ...
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
                        👨‍🏫 تسجيلات الشيخ {sheikh?.name}
                    </h1>
                    <div className="w-32 h-1.5 bg-gradient-to-r from-amber-400 via-orange-500 to-amber-600 mx-auto rounded-full shadow-lg"></div>
                </div>

                {/* حقل البحث */}
                <div className={`
                    backdrop-blur-sm border-2 rounded-3xl p-6 mb-8 shadow-2xl transition-all duration-500
                    ${isDarkMode 
                        ? 'bg-slate-800/70 border-slate-600 shadow-slate-900/50' 
                        : 'bg-white/70 border-emerald-200 shadow-emerald-100/50'
                    }
                `}>
                    <div className="relative">
                        <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                            <svg className={`w-6 h-6 transition-colors duration-500 ${isDarkMode ? 'text-emerald-400' : 'text-emerald-500'}`} fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"/>
                            </svg>
                        </div>
                        <input
                            type="text"
                            placeholder="🔍 ابحث عن تسجيل..."
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
                            <div className="text-6xl mb-6">🎵</div>
                            <h3 className={`
                                text-2xl font-bold mb-4 transition-colors duration-500
                                ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}
                            `}>
                                لا توجد تسجيلات لهذا الشيخ
                            </h3>
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
                                                className={`
                                                    px-4 py-2 rounded-xl font-medium transition-all duration-300 transform hover:scale-105
                                                    ${isDarkMode 
                                                        ? 'bg-blue-600 hover:bg-blue-500 text-white' 
                                                        : 'bg-blue-500 hover:bg-blue-600 text-white'
                                                    }
                                                `}
                                            >
                                                ✏️ تعديل
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(recording._id)}
                                                className={`
                                                    px-4 py-2 rounded-xl font-medium transition-all duration-300 transform hover:scale-105
                                                    ${isDarkMode 
                                                        ? 'bg-red-600 hover:bg-red-500 text-white' 
                                                        : 'bg-red-500 hover:bg-red-600 text-white'
                                                    }
                                                `}
                                            >
                                                🗑️ حذف
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
                                
                                {/* تخطيط متجاوب للمشغل والنص القرآني */}
                                <div className="flex flex-col">
                                    {/* النص القرآني - فوق المشغل على الديسكتوب */}
                                    {recording.surah && recording.fromAyah && recording.toAyah && (
                                        <div className="order-1 md:order-1">
                                            <QuranTextDisplay 
                                                surahNumber={recording.surahNumber}
                                                fromAyah={recording.fromAyah}
                                                toAyah={recording.toAyah}
                                                recordingId={recording._id}
                                            />
                                        </div>
                                    )}

                                    {/* مشغل الصوت الموحد */}
                                    <div className="order-2 md:order-2 mb-8">
                                        <UnifiedAudioPlayer 
                                            src={recording.audio_file} 
                                            recordingId={recording._id}
                                            title={recording.title}
                                            showDownload={true}
                                            downloadUrl={recording.audio_file}
                                            isLiveRadio={false}
                                            className="mb-4"
                                        />
                                    </div>
                                </div>

                                {/* أزرار التحكم */}
                                <div className="flex flex-wrap gap-4 mt-6">
                                    <a
                                        href={recording.audio_file}
                                        download
                                        className={`
                                            px-6 py-3 rounded-2xl font-bold transition-all duration-300 transform hover:scale-105 shadow-lg
                                            ${isDarkMode 
                                                ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white shadow-green-900/50' 
                                                : 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-green-200/50'
                                            }
                                        `}
                                    >
                                        📥 تحميل
                                    </a>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default SheikhRecordingsPage;
