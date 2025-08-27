// frontend/src/components/QuranTextDisplay.js
import React, { useState, useEffect, useRef } from 'react';
import { quranApi } from '../services/quranApi';
import { useAudio } from '../contexts/AudioContext';
import { useTheme } from '../contexts/ThemeContext';

const QuranTextDisplay = ({ surahNumber, fromAyah, toAyah, recordingId }) => {
    const [quranData, setQuranData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [currentAyahIndex, setCurrentAyahIndex] = useState(0);
    const { currentlyPlaying, isPlaying, currentTime, duration } = useAudio();
    const { isDarkMode } = useTheme();
    const containerRef = useRef(null);

    // Only show text when this specific recording is playing
    const shouldShowText = currentlyPlaying === recordingId && isPlaying;

    // Calculate current ayah based on audio progress with slower, more accurate timing
    useEffect(() => {
        if (shouldShowText && quranData && duration > 0) {
            const progress = currentTime / duration;
            const totalAyahs = quranData.ayahs.length;
            // Slower progression - each ayah gets more time
            const adjustedProgress = Math.pow(progress, 0.8); // Slower curve
            const newIndex = Math.floor(adjustedProgress * totalAyahs);
            const clampedIndex = Math.min(newIndex, totalAyahs - 1);
            
            if (clampedIndex !== currentAyahIndex) {
                setCurrentAyahIndex(clampedIndex);
                // Smooth scroll to current ayah
                setTimeout(() => {
                    const currentAyahElement = containerRef.current?.querySelector(`[data-ayah-index="${clampedIndex}"]`);
                    if (currentAyahElement) {
                        currentAyahElement.scrollIntoView({ 
                            behavior: 'smooth', 
                            block: 'center' 
                        });
                    }
                }, 100);
            }
        }
    }, [currentTime, duration, shouldShowText, quranData, currentAyahIndex]);

    useEffect(() => {
        if (!surahNumber) {
            setQuranData(null);
            return;
        }

        const fetchQuranText = async () => {
            setLoading(true);
            setError(null);
            
            try {
                let data;
                if (fromAyah && toAyah) {
                    data = await quranApi.getAyahs(surahNumber, fromAyah, toAyah);
                } else {
                    data = await quranApi.getSurah(surahNumber);
                }
                setQuranData(data);
                setCurrentAyahIndex(0);
            } catch (err) {
                setError('فشل في تحميل النص القرآني');
                console.error('Error fetching Quran text:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchQuranText();
    }, [surahNumber, fromAyah, toAyah]);

    // Reset ayah index when playback stops
    useEffect(() => {
        if (!shouldShowText) {
            setCurrentAyahIndex(0);
        }
    }, [shouldShowText]);

    // Don't render anything if audio is not playing
    if (!shouldShowText) return null;

    return (
        <div className={`
            w-full transition-all duration-500 mb-6
            ${isDarkMode 
                ? 'bg-gradient-to-br from-slate-800/60 via-slate-700/40 to-slate-800/60 border-slate-600' 
                : 'bg-gradient-to-br from-white/80 via-emerald-50/60 to-white/80 border-emerald-200'
            }
            backdrop-blur-sm border-2 rounded-2xl shadow-xl
        `}>
            {/* Header */}
            <div className={`
                px-6 py-3 border-b flex items-center justify-center text-center
                ${isDarkMode 
                    ? 'border-slate-700/50 bg-slate-800/30' 
                    : 'border-emerald-200/50 bg-emerald-50/30'
                }
            `}>
                <div className="flex items-center gap-3">
                    <div className={`
                        w-2 h-2 rounded-full animate-pulse
                        ${isDarkMode ? 'bg-emerald-400' : 'bg-emerald-600'}
                    `}></div>
                    <h4 className={`
                        text-lg font-bold transition-colors duration-300
                        ${isDarkMode ? 'text-emerald-300' : 'text-emerald-700'}
                    `}>
                        النص القرآني الكريم
                    </h4>
                    {quranData && (
                        <div className={`
                            text-sm font-medium px-2 py-1 rounded-full
                            ${isDarkMode 
                                ? 'bg-emerald-500/20 text-emerald-300' 
                                : 'bg-emerald-100 text-emerald-700'
                            }
                        `}>
                            {currentAyahIndex + 1}/{quranData.ayahs.length}
                        </div>
                    )}
                    <div className={`
                        w-2 h-2 rounded-full animate-pulse
                        ${isDarkMode ? 'bg-emerald-400' : 'bg-emerald-600'}
                    `}></div>
                </div>
            </div>

            {/* Content */}
            <div ref={containerRef} className={`
                overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-emerald-500 scrollbar-track-transparent
                ${/* Desktop: max-height for scrolling, Mobile: full height */ ''}
                max-h-64 md:max-h-80
            `}>
                {loading && (
                    <div className="text-center py-6">
                        <div className={`
                            inline-block animate-spin rounded-full h-8 w-8 border-3 border-t-3
                            ${isDarkMode 
                                ? 'border-slate-700 border-t-emerald-400' 
                                : 'border-emerald-200 border-t-emerald-600'
                            }
                        `}></div>
                        <p className={`
                            mt-3 text-sm font-medium
                            ${isDarkMode ? 'text-emerald-400' : 'text-emerald-700'}
                        `}>
                            جاري تحميل النص الكريم...
                        </p>
                    </div>
                )}
                
                {error && (
                    <div className="text-center py-6">
                        <p className={`
                            text-sm font-medium
                            ${isDarkMode ? 'text-red-400' : 'text-red-600'}
                        `}>
                            {error}
                        </p>
                    </div>
                )}
                
                {quranData && !loading && !error && (
                    <div className="space-y-2">
                        {quranData.ayahs.map((ayah, index) => {
                            const isCurrentAyah = index === currentAyahIndex;
                            return (
                                <div 
                                    key={ayah.number}
                                    data-ayah-index={index}
                                    className={`
                                        p-4 rounded-xl transition-all duration-300 border text-center
                                        ${isCurrentAyah 
                                            ? isDarkMode
                                                ? 'bg-gradient-to-r from-emerald-900/60 to-teal-900/60 border-emerald-400/50 shadow-lg shadow-emerald-400/10'
                                                : 'bg-gradient-to-r from-emerald-100/80 to-teal-100/80 border-emerald-400/50 shadow-lg shadow-emerald-200/20'
                                            : isDarkMode 
                                                ? 'bg-slate-800/20 border-slate-700/30 hover:bg-slate-800/30' 
                                                : 'bg-white/30 border-emerald-100/30 hover:bg-white/50'
                                        }
                                        backdrop-blur-sm
                                    `}
                                >
                                    <div className="flex items-center justify-center gap-4">
                                        <div className={`
                                            flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs transition-all duration-300
                                            ${isCurrentAyah 
                                                ? 'bg-gradient-to-r from-amber-500 to-orange-500 shadow-lg animate-pulse' 
                                                : isDarkMode 
                                                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600' 
                                                    : 'bg-gradient-to-r from-emerald-700 to-teal-700'
                                            }
                                        `}>
                                            {ayah.numberInSurah}
                                        </div>
                                        
                                        <p className={`
                                            text-lg leading-relaxed text-center font-amiri flex-1 transition-all duration-300
                                            ${isCurrentAyah 
                                                ? isDarkMode ? 'text-emerald-100 font-semibold text-xl' : 'text-emerald-900 font-semibold text-xl'
                                                : isDarkMode ? 'text-slate-200' : 'text-gray-800'
                                            }
                                        `} 
                                        style={{
                                            lineHeight: '2.2', 
                                            fontFamily: 'Amiri, serif', 
                                            fontSize: isCurrentAyah ? '1.3rem' : '1.1rem',
                                            direction: 'rtl',
                                            textAlign: 'center'
                                        }}>
                                            {ayah.text}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default QuranTextDisplay;
