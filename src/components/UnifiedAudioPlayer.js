// frontend/src/components/UnifiedAudioPlayer.js
import React, { useRef, useEffect, useState } from 'react';
import { useAudio } from '../contexts/AudioContext';
import { useTheme } from '../contexts/ThemeContext';

const UnifiedAudioPlayer = ({ 
    src, 
    recordingId, 
    title = "",
    showDownload = true,
    downloadUrl = null,
    isLiveRadio = false,
    className = "" 
}) => {
    const audioRef = useRef(null);
    const progressRef = useRef(null);
    const volumeRef = useRef(null);
    const { currentlyPlaying, isPlaying, playAudio, pauseAudio, stopAudio } = useAudio();
    const { isDarkMode } = useTheme();
    
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [volume, setVolume] = useState(0.8);
    const [isDragging, setIsDragging] = useState(false);
    const [isVolumeDragging, setIsVolumeDragging] = useState(false);
    const [showVolumeSlider, setShowVolumeSlider] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const isCurrentlyPlaying = currentlyPlaying === recordingId;

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const updateTime = () => {
            if (!isDragging) {
                setCurrentTime(audio.currentTime);
            }
        };
        const updateDuration = () => setDuration(audio.duration || 0);
        const handleEnded = () => {
            stopAudio();
            setCurrentTime(0);
        };
        const handleLoadStart = () => setIsLoading(true);
        const handleCanPlay = () => setIsLoading(false);
        const handleWaiting = () => setIsLoading(true);
        const handlePlaying = () => setIsLoading(false);

        audio.addEventListener('timeupdate', updateTime);
        audio.addEventListener('loadedmetadata', updateDuration);
        audio.addEventListener('durationchange', updateDuration);
        audio.addEventListener('ended', handleEnded);
        audio.addEventListener('loadstart', handleLoadStart);
        audio.addEventListener('canplay', handleCanPlay);
        audio.addEventListener('waiting', handleWaiting);
        audio.addEventListener('playing', handlePlaying);
        audio.volume = volume;

        return () => {
            audio.removeEventListener('timeupdate', updateTime);
            audio.removeEventListener('loadedmetadata', updateDuration);
            audio.removeEventListener('durationchange', updateDuration);
            audio.removeEventListener('ended', handleEnded);
            audio.removeEventListener('loadstart', handleLoadStart);
            audio.removeEventListener('canplay', handleCanPlay);
            audio.removeEventListener('waiting', handleWaiting);
            audio.removeEventListener('playing', handlePlaying);
        };
    }, [isDragging, volume, stopAudio, recordingId]);

    useEffect(() => {
        const audio = audioRef.current;
        if (audio) {
            audio.volume = volume;
        }
    }, [volume]);

    const handlePlayToggle = () => {
        const audio = audioRef.current;
        if (!audio) return;
        
        if (isCurrentlyPlaying && isPlaying) {
            if (isLiveRadio) {
                stopAudio(); // Live radio stops instead of pause
            } else {
                pauseAudio(); // Regular recordings can pause
            }
        } else {
            playAudio(audio, recordingId);
        }
    };

    const handleStop = () => {
        const audio = audioRef.current;
        if (!audio) return;
        stopAudio();
        audio.currentTime = 0;
        setCurrentTime(0);
    };

    const handleSeek = (e) => {
        const audio = audioRef.current;
        const progressBar = progressRef.current;
        if (!audio || !progressBar || !duration || isLiveRadio) return;

        const rect = progressBar.getBoundingClientRect();
        // Always use LTR direction for progress bar (left = start, right = end)
        const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
        const newTime = percent * duration;
        
        if (newTime >= 0 && newTime <= duration) {
            audio.currentTime = newTime;
            setCurrentTime(newTime);
        }
    };

    const handleVolumeChange = (e) => {
        const volumeBar = volumeRef.current;
        if (!volumeBar) return;

        const rect = volumeBar.getBoundingClientRect();
        // Always use LTR direction for volume (left = low, right = high)
        const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
        setVolume(percent);
    };

    const handleProgressMouseDown = (e) => {
        if (isLiveRadio) return; // No seeking for live radio
        setIsDragging(true);
        handleSeek(e);
    };

    const handleVolumeMouseDown = (e) => {
        setIsVolumeDragging(true);
        handleVolumeChange(e);
    };

    const handleMouseMove = (e) => {
        if (isDragging && !isLiveRadio) {
            handleSeek(e);
        }
        if (isVolumeDragging) {
            handleVolumeChange(e);
        }
    };

    const handleMouseUp = () => {
        setIsDragging(false);
        setIsVolumeDragging(false);
    };

    useEffect(() => {
        if (isDragging || isVolumeDragging) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
            return () => {
                document.removeEventListener('mousemove', handleMouseMove);
                document.removeEventListener('mouseup', handleMouseUp);
            };
        }
    }, [isDragging, isVolumeDragging, isLiveRadio]);

    const handleDownload = () => {
        if (downloadUrl || src) {
            const link = document.createElement('a');
            link.href = downloadUrl || src;
            link.download = title || 'recording.mp3';
            link.target = '_blank';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    const formatTime = (time) => {
        if (isNaN(time)) return '0:00';
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    return (
        <div className={`
            backdrop-blur-sm border rounded-xl p-3 shadow-lg transition-all duration-300
            ${isDarkMode 
                ? 'bg-slate-900/95 border-slate-700' 
                : 'bg-white/95 border-slate-200'
            }
            ${className}
        `}>
            <audio ref={audioRef} src={src} preload="metadata" crossOrigin="anonymous" />
            
            {/* Unified Audio Controls */}
            <div className="flex items-center gap-3">
                {/* Download Button */}
                {showDownload && !isLiveRadio && (
                    <button
                        onClick={handleDownload}
                        className={`
                            w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-105 flex-shrink-0
                            ${isDarkMode 
                                ? 'bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white' 
                                : 'bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-800'
                            }
                        `}
                        title="تحميل التسجيل"
                    >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                    </button>
                )}

                {/* Progress Bar - Always LTR */}
                <div className="flex-1 mx-2" dir="ltr">
                    {!isLiveRadio ? (
                        <>
                            <div 
                                ref={progressRef}
                                className={`
                                    w-full h-1.5 rounded-full cursor-pointer transition-all duration-200 relative overflow-hidden
                                    ${isDarkMode ? 'bg-slate-600 hover:bg-slate-500' : 'bg-slate-300 hover:bg-slate-400'}
                                `}
                                onMouseDown={handleProgressMouseDown}
                                onClick={handleSeek}
                            >
                                <div 
                                    className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-150"
                                    style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
                                ></div>
                                
                                {/* Progress thumb */}
                                <div 
                                    className={`
                                        absolute top-1/2 transform -translate-y-1/2 w-3 h-3 rounded-full shadow-lg transition-all duration-150
                                        bg-white border-2 border-emerald-500
                                        ${isDragging ? 'scale-125' : 'hover:scale-110'}
                                    `}
                                    style={{ 
                                        left: `calc(${duration ? (currentTime / duration) * 100 : 0}% - 6px)`,
                                        opacity: duration ? 1 : 0
                                    }}
                                ></div>
                            </div>
                            
                            <div className={`
                                flex justify-between text-xs mt-1 font-medium
                                ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}
                            `}>
                                <span>{formatTime(currentTime)}</span>
                                <span>{formatTime(duration)}</span>
                            </div>
                        </>
                    ) : (
                        <div className="text-center">
                            <div className={`
                                text-sm font-medium
                                ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}
                            `}>
                                {isCurrentlyPlaying ? '🔴 بث مباشر' : '📻 إذاعة القرآن الكريم'}
                            </div>
                        </div>
                    )}
                </div>

                {/* Dynamic Play/Stop Button */}
                <button
                    onClick={handlePlayToggle}
                    disabled={isLoading}
                    className={`
                        w-10 h-10 rounded-full flex items-center justify-center text-white transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg flex-shrink-0
                        ${isCurrentlyPlaying && isPlaying
                            ? (isLiveRadio ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700' : 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600')
                            : 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600'
                        }
                        ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
                    `}
                >
                    {isLoading ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    ) : isCurrentlyPlaying && isPlaying ? (
                        isLiveRadio ? (
                            // Stop Icon for live radio
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z" clipRule="evenodd" />
                            </svg>
                        ) : (
                            // Pause Icon for recordings
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                        )
                    ) : (
                        // Play Icon
                        <svg className="w-5 h-5 ml-0.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                        </svg>
                    )}
                </button>

                {/* Volume Control */}
                <div className="relative flex-shrink-0">
                    <button
                        onClick={() => setShowVolumeSlider(!showVolumeSlider)}
                        className={`
                            w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-105
                            ${isDarkMode 
                                ? 'bg-slate-700 hover:bg-slate-600 text-slate-300' 
                                : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                            }
                        `}
                    >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.824L4.168 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.168l4.215-3.824a1 1 0 011.617.824zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
                        </svg>
                    </button>
                    
                    {/* Volume Slider */}
                    {showVolumeSlider && (
                        <div className={`
                            absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 p-3 rounded-xl shadow-xl border z-20
                            ${isDarkMode 
                                ? 'bg-slate-800 border-slate-700' 
                                : 'bg-white border-slate-200'
                            }
                        `}>
                            <div className="w-20 h-1.5" dir="ltr">
                                <div 
                                    ref={volumeRef}
                                    className={`
                                        w-full h-full rounded-full cursor-pointer transition-all duration-200 relative overflow-hidden
                                        ${isDarkMode ? 'bg-slate-600' : 'bg-slate-300'}
                                    `}
                                    onMouseDown={handleVolumeMouseDown}
                                    onClick={handleVolumeChange}
                                >
                                    <div 
                                        className="h-full rounded-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-150"
                                        style={{ width: `${volume * 100}%` }}
                                    ></div>
                                    
                                    <div 
                                        className={`
                                            absolute top-1/2 transform -translate-y-1/2 w-3 h-3 rounded-full shadow-lg transition-all duration-150
                                            bg-white border-2 border-blue-500
                                            ${isVolumeDragging ? 'scale-125' : 'hover:scale-110'}
                                        `}
                                        style={{ left: `calc(${volume * 100}% - 6px)` }}
                                    ></div>
                                </div>
                            </div>
                            <div className={`text-xs text-center mt-1 font-medium ${
                                isDarkMode ? 'text-slate-300' : 'text-slate-600'
                            }`}>
                                {Math.round(volume * 100)}%
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UnifiedAudioPlayer;
