import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { formatTime12Hour } from '../utils/timeUtils';

const PrayerTimes = () => {
    const { isDarkMode } = useTheme();
    const [prayerTimes, setPrayerTimes] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [location, setLocation] = useState({ city: '', country: '' });

    useEffect(() => {
        const fetchPrayerTimes = async () => {
            try {
                setLoading(true);
                setError(null);

                // Get user's location
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(
                        async (position) => {
                            const { latitude, longitude } = position.coords;
                            
                            try {
                                // Fetch prayer times using Aladhan API
                                const response = await fetch(
                                    `https://api.aladhan.com/v1/timings?latitude=${latitude}&longitude=${longitude}&method=5`
                                );
                                
                                if (!response.ok) {
                                    throw new Error('فشل في جلب مواقيت الصلاة');
                                }
                                
                                const data = await response.json();
                                
                                if (data.code === 200) {
                                    setPrayerTimes(data.data.timings);
                                    setLocation({
                                        city: data.data.meta.timezone || 'موقعك',
                                        country: ''
                                    });
                                } else {
                                    throw new Error('فشل في جلب مواقيت الصلاة');
                                }
                            } catch (apiError) {
                                console.error('Prayer times API error:', apiError);
                                setError('فشل في جلب مواقيت الصلاة. يرجى المحاولة مرة أخرى.');
                            }
                        },
                        (geoError) => {
                            console.error('Geolocation error:', geoError);
                            setError('يرجى السماح بالوصول إلى الموقع الجغرافي لعرض مواقيت الصلاة.');
                        }
                    );
                } else {
                    setError('المتصفح لا يدعم تحديد الموقع الجغرافي.');
                }
            } catch (error) {
                console.error('Error fetching prayer times:', error);
                setError('حدث خطأ في جلب مواقيت الصلاة.');
            } finally {
                setLoading(false);
            }
        };

        fetchPrayerTimes();
    }, []);

    const prayerNames = {
        Fajr: 'الفجر',
        Dhuhr: 'الظهر',
        Asr: 'العصر',
        Maghrib: 'المغرب',
        Isha: 'العشاء'
    };

    const prayerIcons = {
        Fajr: '🌅',
        Dhuhr: '☀️',
        Asr: '🌤️',
        Maghrib: '🌅',
        Isha: '🌙'
    };

    if (loading) {
        return (
            <div className={`
                p-8 rounded-3xl shadow-2xl backdrop-blur-lg transition-all duration-500
                ${isDarkMode 
                    ? 'bg-slate-800/70 border border-slate-700' 
                    : 'bg-white/70 border border-slate-200'
                }
            `}>
                <div className="flex flex-col items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mb-4"></div>
                    <p className={`text-lg ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                        جاري تحميل مواقيت الصلاة...
                    </p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={`
                p-8 rounded-3xl shadow-2xl backdrop-blur-lg transition-all duration-500
                ${isDarkMode 
                    ? 'bg-slate-800/70 border border-slate-700' 
                    : 'bg-white/70 border border-slate-200'
                }
            `}>
                <div className="text-center py-8">
                    <div className="text-5xl mb-4">⚠️</div>
                    <p className="text-red-500 text-lg mb-4">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className={`
                            px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105
                            ${isDarkMode 
                                ? 'bg-emerald-600 hover:bg-emerald-700 text-white' 
                                : 'bg-emerald-500 hover:bg-emerald-600 text-white'
                            }
                        `}
                    >
                        إعادة المحاولة
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className={`
            p-6 md:p-8 rounded-3xl shadow-2xl backdrop-blur-lg transition-all duration-500
            ${isDarkMode 
                ? 'bg-slate-800/70 border border-slate-700' 
                : 'bg-white/70 border border-slate-200'
            }
        `}>
            {/* Header */}
            <div className="text-center mb-8">
                <h4 className={`
                    text-2xl md:text-3xl font-bold mb-2 transition-colors duration-500
                    ${isDarkMode ? 'text-emerald-300' : 'text-emerald-700'}
                `}>
                    🕌 مواقيت الصلاة اليوم
                </h4>
                <p className={`
                    text-sm md:text-base transition-colors duration-500
                    ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}
                `}>
                    {location.city} • {new Date().toLocaleDateString('ar-SA', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                    })}
                </p>
            </div>

            {/* Prayer Times Grid */}
            {prayerTimes && (
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-6">
                    {Object.entries(prayerNames).map(([englishName, arabicName]) => (
                        <div
                            key={englishName}
                            className={`
                                p-4 md:p-6 rounded-2xl text-center transition-all duration-300 hover:scale-105
                                ${isDarkMode 
                                    ? 'bg-slate-700/50 hover:bg-slate-700/70' 
                                    : 'bg-white/50 hover:bg-white/70'
                                }
                                shadow-lg hover:shadow-xl
                            `}
                        >
                            <div className="text-3xl md:text-4xl mb-2">
                                {prayerIcons[englishName]}
                            </div>
                            <h5 className={`
                                text-lg md:text-xl font-bold mb-2 transition-colors duration-500
                                ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}
                            `}>
                                {arabicName}
                            </h5>
                            <p className={`
                                text-xl md:text-2xl font-mono font-bold transition-colors duration-500
                                ${isDarkMode ? 'text-emerald-300' : 'text-emerald-600'}
                            `}>
                                {formatTime12Hour(prayerTimes[englishName])}
                            </p>
                        </div>
                    ))}
                </div>
            )}

            {/* Footer */}
            <div className={`
                mt-8 pt-6 border-t text-center transition-colors duration-500
                ${isDarkMode ? 'border-slate-700' : 'border-slate-200'}
            `}>
                <p className={`
                    text-sm transition-colors duration-500
                    ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}
                `}>
                    المواقيت محسوبة حسب موقعك الجغرافي 
                </p>
            </div>
        </div>
    );
};

export default PrayerTimes;
