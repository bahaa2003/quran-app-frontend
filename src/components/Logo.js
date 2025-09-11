import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

const Logo = ({ size = 'medium', className = '' }) => {
    const { isDarkMode } = useTheme();
    
    if (size === 'navbar') {
        return (
            <div className={`flex items-center ${className}`} role="img" aria-label="روح القرآن Logo">
                <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    viewBox="0 0 280 60" 
                    className="h-20 w-auto transition-all duration-300"
                >
                    <defs>
                        <linearGradient id="navbarGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" style={{stopColor: isDarkMode ? '#34d399' : '#e0f7fa'}} />
                            <stop offset="50%" style={{stopColor: isDarkMode ? '#2dd4bf' : '#b2ebf2'}} />
                            <stop offset="100%" style={{stopColor: isDarkMode ? '#22d3ee' : '#80deea'}} />
                        </linearGradient>
                        <style>{`
                            @import url('https://fonts.googleapis.com/css2?family=Reem+Kufi:wght@400;500;600;700&display=swap');
                            .kufi-text { 
                                font-family: 'Reem Kufi', 'Amiri Quran', 'Amiri', serif; 
                                font-weight: 600; 
                                font-size: 24px; 
                                fill: url(#navbarGradient); 
                                text-anchor: middle; 
                                dominant-baseline: central;
                                letter-spacing: 2px;
                            }
                            .geometric-accent { 
                                fill: url(#navbarGradient); 
                                opacity: 0.3;
                            }
                        `}</style>
                    </defs>
                    
                    {/* Minimal geometric decoration - left side */}
                    <g transform="translate(20, 30)">
                        <rect className="geometric-accent" x="-2" y="-8" width="4" height="16" rx="2"/>
                        <rect className="geometric-accent" x="-8" y="-4" width="4" height="8" rx="2"/>
                        <rect className="geometric-accent" x="4" y="-4" width="4" height="8" rx="2"/>
                    </g>
                    
                    {/* Arabic Text: روح القرآن */}
                    <text className="kufi-text" x="140" y="30">روح القرآن</text>
                    
                    {/* Minimal geometric decoration - right side */}
                    <g transform="translate(260, 30)">
                        <rect className="geometric-accent" x="-2" y="-8" width="4" height="16" rx="2"/>
                        <rect className="geometric-accent" x="-8" y="-4" width="4" height="8" rx="2"/>
                        <rect className="geometric-accent" x="4" y="-4" width="4" height="8" rx="2"/>
                    </g>
                </svg>
            </div>
        );
    }

    if (size === 'hero') {
        return (
            <div className={`flex items-center justify-center ${className}`} role="img" aria-label="روح القرآن Logo">
                <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    viewBox="0 0 500 120" 
                    className="w-full max-w-lg md:max-w-xl lg:max-w-2xl h-auto transition-all duration-300"
                >
                    <defs>
                        <linearGradient id="heroGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" style={{stopColor: isDarkMode ? '#34d399' : '#059669'}} />
                            <stop offset="50%" style={{stopColor: isDarkMode ? '#2dd4bf' : '#0d9488'}} />
                            <stop offset="100%" style={{stopColor: isDarkMode ? '#22d3ee' : '#0891b2'}} />
                        </linearGradient>
                        <style>{`
                            @import url('https://fonts.googleapis.com/css2?family=Reem+Kufi:wght@400;500;600;700&display=swap');
                            .hero-kufi-text { 
                                font-family: 'Reem Kufi', 'Amiri Quran', 'Amiri', serif; 
                                font-weight: 700; 
                                font-size: 48px; 
                                fill: url(#heroGradient); 
                                text-anchor: middle; 
                                dominant-baseline: central;
                                letter-spacing: 3px;
                            }
                            .hero-geometric { 
                                fill: url(#heroGradient); 
                                opacity: 0.2;
                            }
                            .hero-accent { 
                                fill: url(#heroGradient); 
                                opacity: 0.4;
                            }
                        `}</style>
                    </defs>
                    
                    {/* Left geometric pattern */}
                    <g transform="translate(60, 60)">
                        <rect className="hero-geometric" x="-3" y="-20" width="6" height="40" rx="3"/>
                        <rect className="hero-geometric" x="-15" y="-12" width="6" height="24" rx="3"/>
                        <rect className="hero-geometric" x="9" y="-12" width="6" height="24" rx="3"/>
                        <circle className="hero-accent" cx="0" cy="-25" r="3"/>
                        <circle className="hero-accent" cx="0" cy="25" r="3"/>
                    </g>
                    
                    {/* Arabic Text: روح القرآن */}
                    <text className="hero-kufi-text" x="250" y="60">روح القرآن</text>
                    
                    {/* Right geometric pattern */}
                    <g transform="translate(440, 60)">
                        <rect className="hero-geometric" x="-3" y="-20" width="6" height="40" rx="3"/>
                        <rect className="hero-geometric" x="-15" y="-12" width="6" height="24" rx="3"/>
                        <rect className="hero-geometric" x="9" y="-12" width="6" height="24" rx="3"/>
                        <circle className="hero-accent" cx="0" cy="-25" r="3"/>
                        <circle className="hero-accent" cx="0" cy="25" r="3"/>
                    </g>
                    
                    {/* Subtle underline decoration */}
                    <rect className="hero-accent" x="150" y="85" width="200" height="2" rx="1"/>
                </svg>
            </div>
        );
    }

    // Fallback for other sizes
    return (
        <div className={`flex items-center justify-center ${className}`} role="img" aria-label="روح القرآن Logo">
            <span className={`font-bold ${isDarkMode ? 'text-emerald-300' : 'text-emerald-700'}`} style={{fontFamily: 'Reem Kufi, Amiri Quran, Amiri, serif'}}>
                روح القرآن
            </span>
        </div>
    );
};

export default Logo;
