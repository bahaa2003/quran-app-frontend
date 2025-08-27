// frontend/src/contexts/AudioContext.js
import React, { createContext, useContext, useRef, useState, useCallback } from 'react';

const AudioContext = createContext();

export const useAudio = () => {
    const context = useContext(AudioContext);
    if (!context) {
        throw new Error('useAudio must be used within an AudioProvider');
    }
    return context;
};

export const AudioProvider = ({ children }) => {
    const [currentlyPlaying, setCurrentlyPlaying] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(0.7);
    const currentAudioRef = useRef(null);
    const eventListenersRef = useRef(new Map());

    const removeEventListeners = useCallback((audioElement) => {
        const listeners = eventListenersRef.current.get(audioElement);
        if (listeners) {
            Object.entries(listeners).forEach(([event, handler]) => {
                audioElement.removeEventListener(event, handler);
            });
            eventListenersRef.current.delete(audioElement);
        }
    }, []);

    const addEventListeners = useCallback((audioElement) => {
        const handleEnded = () => {
            setCurrentlyPlaying(null);
            setIsPlaying(false);
            setCurrentTime(0);
            currentAudioRef.current = null;
        };

        const handlePause = () => {
            setIsPlaying(false);
        };

        const handlePlay = () => {
            setIsPlaying(true);
        };

        const handleTimeUpdate = () => {
            setCurrentTime(audioElement.currentTime);
        };

        const handleLoadedMetadata = () => {
            setDuration(audioElement.duration);
        };

        const handleError = (e) => {
            console.error('Audio error:', e);
            setCurrentlyPlaying(null);
            setIsPlaying(false);
            currentAudioRef.current = null;
        };

        const listeners = {
            ended: handleEnded,
            pause: handlePause,
            play: handlePlay,
            timeupdate: handleTimeUpdate,
            loadedmetadata: handleLoadedMetadata,
            error: handleError,
        };

        Object.entries(listeners).forEach(([event, handler]) => {
            audioElement.addEventListener(event, handler);
        });

        eventListenersRef.current.set(audioElement, listeners);
    }, []);

    const playAudio = useCallback((audioElement, recordingId) => {
        try {
            // Stop any currently playing audio
            if (currentAudioRef.current && currentAudioRef.current !== audioElement) {
                removeEventListeners(currentAudioRef.current);
                currentAudioRef.current.pause();
                currentAudioRef.current.currentTime = 0;
            }

            // Set the new audio as current
            currentAudioRef.current = audioElement;
            setCurrentlyPlaying(recordingId);
            
            // Set volume
            audioElement.volume = volume;
            
            // Add event listeners
            addEventListeners(audioElement);

            // Play the audio
            const playPromise = audioElement.play();
            if (playPromise !== undefined) {
                playPromise.catch(error => {
                    console.error('Error playing audio:', error);
                    setCurrentlyPlaying(null);
                    setIsPlaying(false);
                });
            }
        } catch (error) {
            console.error('Error in playAudio:', error);
            setCurrentlyPlaying(null);
            setIsPlaying(false);
        }
    }, [volume, addEventListeners, removeEventListeners]);

    const pauseAudio = useCallback(() => {
        if (currentAudioRef.current) {
            currentAudioRef.current.pause();
        }
    }, []);

    const stopAudio = useCallback(() => {
        if (currentAudioRef.current) {
            removeEventListeners(currentAudioRef.current);
            currentAudioRef.current.pause();
            currentAudioRef.current.currentTime = 0;
            setCurrentlyPlaying(null);
            setIsPlaying(false);
            setCurrentTime(0);
            currentAudioRef.current = null;
        }
    }, [removeEventListeners]);

    const seekTo = useCallback((time) => {
        if (currentAudioRef.current) {
            currentAudioRef.current.currentTime = time;
            setCurrentTime(time);
        }
    }, []);

    const setAudioVolume = useCallback((newVolume) => {
        setVolume(newVolume);
        if (currentAudioRef.current) {
            currentAudioRef.current.volume = newVolume;
        }
    }, []);

    const value = {
        currentlyPlaying,
        isPlaying,
        currentTime,
        duration,
        volume,
        playAudio,
        pauseAudio,
        stopAudio,
        seekTo,
        setVolume: setAudioVolume,
    };

    return (
        <AudioContext.Provider value={value}>
            {children}
        </AudioContext.Provider>
    );
};
