import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useTheme } from '../contexts/ThemeContext';

const SadaqaJariya = () => {
    const { isDarkMode } = useTheme();
    const [bannerData, setBannerData] = useState({ text: '', isActive: false });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBannerData = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/v1/sadaqa`);
                if (response.data.data && response.data.data.length > 0) {
                    // Get the first active banner
                    const activeBanner = response.data.data.find(item => item.isActive);
                    if (activeBanner) {
                        setBannerData({ text: activeBanner.text, isActive: true });
                    }
                } else {
                    // Fallback banner
                    setBannerData({ 
                        text: 'ادعوا لوالدي بالرحمة والمغفرة - ادعوا لجميع المسلمين بالهداية والتوفيق', 
                        isActive: true 
                    });
                }
            } catch (error) {
                console.error('Error fetching banner data:', error);
                // Fallback banner
                setBannerData({ 
                    text: 'ادعوا لوالدي بالرحمة والمغفرة - ادعوا لجميع المسلمين بالهداية والتوفيق', 
                    isActive: true 
                });
            } finally {
                setLoading(false);
            }
        };

        fetchBannerData();
    }, []);

    if (loading) {
        return null;
    }

    if (!bannerData.isActive || !bannerData.text) {
        return null;
    }

    return (
        <div className={`
            rounded-2xl p-6 mb-8 text-center shadow-lg transition-all duration-300
            ${isDarkMode 
                ? 'bg-gradient-to-r from-amber-800/80 to-orange-800/80 border-2 border-amber-600' 
                : 'bg-gradient-to-r from-amber-100/90 to-orange-100/90 border-2 border-amber-300'
            }
            backdrop-blur-sm hover:shadow-xl transform hover:scale-105
        `}>
            <div className="flex items-center justify-center mb-3">
                <div className={`
                    w-3 h-3 rounded-full mr-3 animate-pulse
                    ${isDarkMode ? 'bg-amber-400' : 'bg-amber-600'}
                `}></div>
                <h3 className={`
                    text-xl font-bold transition-colors duration-300
                    ${isDarkMode ? 'text-amber-200' : 'text-amber-800'}
                `}>
                    💝 صدقة جارية
                </h3>
                <div className={`
                    w-3 h-3 rounded-full ml-3 animate-pulse
                    ${isDarkMode ? 'bg-amber-400' : 'bg-amber-600'}
                `}></div>
            </div>
            
            <p className={`
                text-lg leading-relaxed font-medium transition-colors duration-300
                ${isDarkMode ? 'text-amber-100' : 'text-amber-900'}
            `} style={{fontFamily: 'Amiri, serif'}}>
                {bannerData.text}
            </p>
            
            <div className={`
                w-24 h-1 mx-auto mt-4 rounded-full
                ${isDarkMode 
                    ? 'bg-gradient-to-r from-amber-400 to-orange-400' 
                    : 'bg-gradient-to-r from-amber-600 to-orange-600'
                }
            `}></div>
        </div>
    );
};

export default SadaqaJariya;
