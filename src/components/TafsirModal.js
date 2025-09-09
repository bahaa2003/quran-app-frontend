import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';

const TafsirModal = ({ isOpen, onClose, surahNumber, fromAyah, toAyah, surahName }) => {
    const { isDarkMode } = useTheme();
    const [tafsirData, setTafsirData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Fetch Arabic tafsir from spa5k's tafsir API
    const fetchTafsir = async (surahNum, fromAyahNum, toAyahNum) => {
        try {
            setLoading(true);
            setError(null);
            
            const tafsirResults = [];
            
            // Fetch Arabic tafsir for each ayah in the range using spa5k's API
            for (let ayah = fromAyahNum; ayah <= toAyahNum; ayah++) {
                try {
                    // Using spa5k's Arabic Ibn Kathir tafsir API
                    const response = await fetch(
                        `https://cdn.jsdelivr.net/gh/spa5k/tafsir_api@main/tafsir/ar-tafsir-ibn-kathir/${surahNum}/${ayah}.json`,
                        {
                            method: 'GET',
                            headers: {
                                'Accept': 'application/json',
                            }
                        }
                    );
                    
                    if (!response.ok) {
                        console.warn(`Failed to fetch Arabic tafsir for ayah ${ayah}:`, response.status);
                        tafsirResults.push({
                            ayahNumber: ayah,
                            tafsir: 'التفسير غير متوفر حالياً لهذه الآية'
                        });
                        continue;
                    }
                    
                    const data = await response.json();
                    
                    if (data && data.text) {
                        tafsirResults.push({
                            ayahNumber: ayah,
                            tafsir: data.text
                        });
                    } else {
                        tafsirResults.push({
                            ayahNumber: ayah,
                            tafsir: 'التفسير غير متوفر حالياً لهذه الآية'
                        });
                    }
                    
                    // Add delay to respect CDN rate limits
                    if (ayah < toAyahNum) {
                        await new Promise(resolve => setTimeout(resolve, 150));
                    }
                    
                } catch (ayahError) {
                    console.error(`Error fetching tafsir for ayah ${ayah}:`, ayahError);
                    tafsirResults.push({
                        ayahNumber: ayah,
                        tafsir: 'حدث خطأ في تحميل التفسير لهذه الآية'
                    });
                }
            }
            
            setTafsirData(tafsirResults);
            
        } catch (error) {
            console.error('Error fetching tafsir:', error);
            setError('التفسير غير متوفر حالياً. يرجى المحاولة مرة أخرى لاحقاً.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isOpen && surahNumber && fromAyah && toAyah) {
            fetchTafsir(surahNumber, fromAyah, toAyah);
        }
    }, [isOpen, surahNumber, fromAyah, toAyah]);

    // Reset state when modal closes
    useEffect(() => {
        if (!isOpen) {
            setTafsirData(null);
            setError(null);
            setLoading(false);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className={`
                relative max-w-4xl w-full max-h-[90vh] overflow-hidden rounded-3xl shadow-2xl transition-all duration-500
                ${isDarkMode 
                    ? 'bg-slate-800 border border-slate-700' 
                    : 'bg-white border border-slate-200'
                }
            `}>
                {/* Header */}
                <div className={`
                    p-6 border-b transition-colors duration-500
                    ${isDarkMode ? 'border-slate-700 bg-slate-800/50' : 'border-slate-200 bg-slate-50/50'}
                `}>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <div className={`
                                w-10 h-10 rounded-full flex items-center justify-center mr-4 transition-colors duration-500
                                ${isDarkMode ? 'bg-emerald-600' : 'bg-emerald-500'}
                            `}>
                                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                </svg>
                            </div>
                            <div>
                                <h3 className={`
                                    text-2xl font-bold transition-colors duration-500
                                    ${isDarkMode ? 'text-slate-100' : 'text-slate-800'}
                                `}>
                                    📖 التفسير
                                </h3>
                                <p className={`
                                    text-sm transition-colors duration-500
                                    ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}
                                `}>
                                    {surahName} - الآيات {fromAyah} إلى {toAyah}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className={`
                                w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110
                                ${isDarkMode 
                                    ? 'bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-slate-100' 
                                    : 'bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-800'
                                }
                            `}
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
                    {loading && (
                        <div className="flex flex-col items-center justify-center py-16">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mb-4"></div>
                            <p className={`
                                text-lg font-medium transition-colors duration-500
                                ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}
                            `}>
                                جاري تحميل التفسير...
                            </p>
                        </div>
                    )}

                    {error && (
                        <div className="text-center py-8">
                            <p className="text-red-500 text-lg">{error}</p>
                        </div>
                    )}

                    {tafsirData && !loading && !error && (
                        <div className="space-y-6">
                            {tafsirData.map((item, index) => (
                                <div key={index} className={`
                                    p-6 rounded-xl border transition-all duration-300
                                    ${isDarkMode 
                                        ? 'bg-slate-700/50 border-slate-600' 
                                        : 'bg-white/70 border-slate-200'
                                    }
                                `}>
                                    <h4 className={`
                                        text-lg font-bold mb-4 flex items-center
                                        ${isDarkMode ? 'text-emerald-300' : 'text-emerald-700'}
                                    `}>
                                        <span className="ml-2">📖</span>
                                        الآية {item.ayahNumber}
                                    </h4>
                                    <div className={`
                                        text-lg leading-loose font-amiri text-right
                                        ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}
                                    `} 
                                    style={{ 
                                        direction: 'rtl', 
                                        lineHeight: '2.2',
                                        wordSpacing: '2px'
                                    }}>
                                        {item.tafsir}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                {tafsirData && !loading && !error && (
                    <div className={`
                        p-4 border-t text-center transition-colors duration-500
                        ${isDarkMode ? 'border-slate-700 bg-slate-800/50' : 'border-slate-200 bg-slate-50/50'}
                    `}>
                        <p className={`
                            text-sm transition-colors duration-500
                            ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}
                        `}>
                            التفسير من تفسير ابن كثير (النسخة العربية)
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TafsirModal;
