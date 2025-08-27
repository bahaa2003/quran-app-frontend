// frontend/src/components/LiveRadio.js
import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import UnifiedAudioPlayer from './UnifiedAudioPlayer';

const LiveRadio = () => {
    const { isDarkMode } = useTheme();
    const [error, setError] = useState(null);
    const [currentStreamIndex, setCurrentStreamIndex] = useState(0);

    // Optimized stream URLs with fallbacks for faster loading
    const radioStreamUrls = [
        'https://stream.radiojar.com/8s5u5tpdtwzuv',
        'https://qurango.net/radio/tarateel',
        'http://stream.radiojar.com/8s5u5tpdtwzuv'
    ];
    const radioId = 'live-radio-stream';

    // Error handling for stream failures
    const handleStreamError = (errorMessage) => {
        setError(errorMessage);
        if (currentStreamIndex < radioStreamUrls.length - 1) {
            setCurrentStreamIndex(prev => prev + 1);
        }
    };

    return (
        <div className={`
            ${isDarkMode 
                ? 'bg-gradient-to-br from-slate-800 via-slate-700 to-slate-800 border-slate-600' 
                : 'bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 border-emerald-200'
            } 
            border-2 rounded-3xl p-8 shadow-2xl backdrop-blur-sm transition-all duration-500 hover:shadow-3xl
        `}>
            {/* Header */}
            <div className="text-center mb-6">
                <h3 className={`
                    text-3xl font-bold transition-colors duration-300 mb-2
                    ${isDarkMode ? 'text-emerald-300' : 'text-emerald-800'}
                `}>
                    📻 إذاعة القرآن الكريم
                </h3>
                <p className={`
                    text-lg transition-colors duration-300
                    ${isDarkMode ? 'text-slate-300' : 'text-emerald-600'}
                `}>
                    بث مباشر للقرآن الكريم على مدار الساعة
                </p>
            </div>

            {/* Error Message */}
            {error && (
                <div className={`
                    mb-6 p-4 rounded-2xl text-center transition-all duration-300
                    ${isDarkMode 
                        ? 'bg-red-900/30 border-2 border-red-700 text-red-300' 
                        : 'bg-red-50 border-2 border-red-200 text-red-600'
                    }
                `}>
                    <div className="flex items-center justify-center mb-2">
                        <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
                        </svg>
                        <span className="font-semibold">خطأ في البث</span>
                    </div>
                    <p className="text-sm">{error}</p>
                </div>
            )}

            {/* Unified Audio Player */}
            <UnifiedAudioPlayer
                src={radioStreamUrls[currentStreamIndex]}
                recordingId={radioId}
                title="إذاعة القرآن الكريم"
                showDownload={false}
                isLiveRadio={true}
                className="mb-6"
            />
        </div>
    );
};

export default LiveRadio;
