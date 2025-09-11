import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

const Footer = () => {
    const { isDarkMode } = useTheme();
    const currentYear = new Date().getFullYear();

    return (
        <footer className={`
            mt-auto border-t transition-all duration-500
            ${isDarkMode 
                ? 'bg-slate-900/80 border-slate-700 text-slate-300' 
                : 'bg-white/80 border-slate-200 text-slate-700'
            }
            backdrop-blur-sm
        `}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="text-center space-y-4">
                    {/* Project Name */}
                    <div>
                        <h3 className={`
                            text-2xl md:text-3xl font-bold mb-2 transition-colors duration-500
                            ${isDarkMode ? 'text-emerald-300' : 'text-emerald-700'}
                        `}>
                            🕌 روح القرآن
                        </h3>
                        <p className={`
                            text-sm md:text-base transition-colors duration-500
                            ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}
                        `}>
                            منصة لنشر تلاوات وتفاسير القرآن الكريم
                        </p>
                    </div>

                    {/* Divider */}
                    <div className={`
                        w-24 h-px mx-auto transition-colors duration-500
                        ${isDarkMode ? 'bg-slate-700' : 'bg-slate-300'}
                    `}></div>

                    {/* Copyright */}
                    <div className={`
                        text-xs md:text-sm transition-colors duration-500
                        ${isDarkMode ? 'text-slate-500' : 'text-slate-500'}
                    `}>
                        <p>
                            © {currentYear} روح القرآن. جميع الحقوق محفوظة.
                        </p>
                        <p className="mt-1">
                            All rights reserved.
                        </p>
                    </div>

                    {/* Additional Info */}
                    <div className={`
                        text-xs transition-colors duration-500
                        ${isDarkMode ? 'text-slate-600' : 'text-slate-400'}
                    `}>
                        <p>
                            بارك الله فيكم وجعل هذا العمل في ميزان حسناتنا
                        </p>
                        <p  className="mt-2">
                        Develop & Design <a href="https://www.linkedin.com/in/bahaa-mohammed-929636205/" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">BAHAA MOHAMMED</a> © Copyright
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
