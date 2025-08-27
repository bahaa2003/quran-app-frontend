import React from 'react';
import { Link } from 'react-router-dom';
import LiveRadio from '../components/LiveRadio';
import SadaqaJariya from '../components/SadaqaJariya';
import { useTheme } from '../contexts/ThemeContext';

const HomePage = () => {
    const { isDarkMode, theme } = useTheme();

    return (
        <div className={`
            min-h-screen transition-all duration-500
            ${isDarkMode 
                ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900' 
                : 'bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50'
            }
        `}>
            {/* Hero Section */}
            <div className="container mx-auto px-4 py-16">
                <div className="text-center mb-20">
                    {/* Main Title */}
                    <div className="mb-12">
                        <div className="relative mb-8">
                            <h1 className={`
                                text-6xl md:text-7xl lg:text-8xl font-bold mb-6 transition-all duration-500
                                bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent
                                ${isDarkMode ? 'from-emerald-400 via-teal-400 to-cyan-400' : ''}
                            `}>
                                منصة القرآن الكريم
                            </h1>
                            {/* Decorative Elements */}
                            <div className="absolute -top-4 -right-4 w-8 h-8 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full opacity-70 animate-pulse"></div>
                            <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full opacity-70 animate-pulse" style={{animationDelay: '0.5s'}}></div>
                        </div>
                        <div className="w-32 h-1.5 bg-gradient-to-r from-amber-400 via-orange-500 to-amber-600 mx-auto rounded-full mb-8 shadow-lg"></div>
                    </div>
                    
                    <h2 className={`
                        text-4xl md:text-5xl lg:text-6xl font-bold mb-8 leading-relaxed transition-colors duration-500
                        ${isDarkMode ? 'text-slate-100' : 'text-slate-800'}
                    `} style={{fontFamily: 'Amiri, serif'}}>
                        استمع إلى القرآن الكريم بأصوات من الجنة
                    </h2>
                    
                    <p className={`
                        text-xl md:text-2xl mb-12 max-w-5xl mx-auto leading-relaxed transition-colors duration-500
                        ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}
                    `}>
                        اختر من مجموعة كبيرة من التسجيلات القرآنية المميزة بأصوات أشهر القراء في العالم الإسلامي
                    </p>
                    
                    {/* Islamic Quote */}
                    <div className={`
                        backdrop-blur-sm border-2 rounded-3xl p-10 mb-16 max-w-6xl mx-auto shadow-2xl transition-all duration-500
                        ${isDarkMode 
                            ? 'bg-slate-800/70 border-slate-600 shadow-slate-900/50' 
                            : 'bg-white/70 border-emerald-200 shadow-emerald-100/50'
                        }
                    `}>
                        <div className="flex items-center justify-center mb-6">
                            <div className={`
                                w-12 h-12 rounded-full flex items-center justify-center mr-4 transition-colors duration-500
                                ${isDarkMode ? 'bg-emerald-600' : 'bg-emerald-500'}
                            `}>
                                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                </svg>
                            </div>
                            <h3 className={`
                                text-2xl font-bold transition-colors duration-500
                                ${isDarkMode ? 'text-emerald-300' : 'text-emerald-700'}
                            `}>
                                دعاء من القلب
                            </h3>
                        </div>
                        <p className={`
                            text-xl md:text-2xl leading-loose transition-colors duration-500
                            ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}
                        `} style={{fontFamily: 'Amiri, serif', lineHeight: '2.2'}}>
                            اللهم اجعل القرآن العظيم ربيع قلوبنا، ونور صدورنا، وذهاب همومنا وأحزاننا، 
                            اللهم ذكرنا منه ما نسينا، وعلمنا منه ما جهلنا، وارزقنا تلاوته آناء الليل وأطراف النهار.. 
                            وارزقنا تدبره والعمل به اللهم أمين وصلي اللهم علي سيد الخلق أجمعين سيدنا محمد عليه افضل الصلاة وأتم التسليم
                        </p>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-8">
                        <Link
                            to="/recordings"
                            className="group bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-10 py-5 rounded-2xl transition-all duration-300 shadow-2xl hover:shadow-emerald-300/50 transform hover:scale-105 active:scale-95 text-xl font-bold flex items-center"
                        >
                            <svg className="w-6 h-6 mr-3 group-hover:animate-pulse" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z"/>
                            </svg>
                            استمع الآن
                        </Link>
                        <Link
                            to="/sheikhs"
                            className={`
                                group border-3 px-10 py-5 rounded-2xl transition-all duration-300 shadow-2xl transform hover:scale-105 active:scale-95 text-xl font-bold flex items-center
                                ${isDarkMode 
                                    ? 'bg-slate-800/50 text-emerald-400 border-emerald-400 hover:bg-emerald-400 hover:text-slate-900 hover:shadow-emerald-400/50' 
                                    : 'bg-white text-emerald-600 border-emerald-600 hover:bg-emerald-600 hover:text-white hover:shadow-emerald-300/50'
                                }
                            `}
                        >
                            <svg className="w-6 h-6 mr-3 group-hover:animate-bounce" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"/>
                            </svg>
                            تصفح القراء
                        </Link>
                    </div>
                </div>

                {/* Sadaqa Jariya Section */}
                <div className="mb-24">
                    <div className="max-w-4xl mx-auto">
                        <SadaqaJariya />
                    </div>
                </div>

                {/* Live Radio Section */}
                <div className="mb-24">
                    <div className="text-center mb-12">
                        <h3 className={`
                            text-4xl md:text-5xl font-bold mb-6 transition-colors duration-500
                            ${isDarkMode ? 'text-slate-100' : 'text-slate-800'}
                        `}>
                            📻 البث المباشر
                        </h3>
                        <p className={`
                            text-xl md:text-2xl transition-colors duration-500
                            ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}
                        `}>
                            استمع إلى إذاعة القرآن الكريم على مدار الساعة
                        </p>
                        <div className="w-24 h-1 bg-gradient-to-r from-red-500 to-red-600 mx-auto rounded-full mt-4"></div>
                    </div>
                    <div className="max-w-3xl mx-auto">
                        <LiveRadio />
                    </div>
                </div>

                {/* Features Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-24">
                    {/* Feature 1 */}
                    <div className={`
                        backdrop-blur-sm border-2 rounded-3xl p-10 text-center shadow-2xl transition-all duration-500 transform hover:scale-105 hover:rotate-1 group
                        ${isDarkMode 
                            ? 'bg-slate-800/70 border-slate-600 hover:border-emerald-500 shadow-slate-900/50' 
                            : 'bg-white/70 border-emerald-200 hover:border-emerald-400 shadow-emerald-100/50'
                        }
                    `}>
                        <div className="w-20 h-20 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-8 group-hover:animate-pulse shadow-2xl">
                            <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z"/>
                            </svg>
                        </div>
                        <h4 className={`
                            text-2xl font-bold mb-6 transition-colors duration-500
                            ${isDarkMode ? 'text-slate-100' : 'text-slate-800'}
                        `}>
                            🎵 تسجيلات عالية الجودة
                        </h4>
                        <p className={`
                            text-lg leading-relaxed transition-colors duration-500
                            ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}
                        `}>
                            استمع إلى القرآن الكريم بجودة صوتية عالية وواضحة مع تقنيات التسجيل المتطورة
                        </p>
                    </div>

                    {/* Feature 2 */}
                    <div className={`
                        backdrop-blur-sm border-2 rounded-3xl p-10 text-center shadow-2xl transition-all duration-500 transform hover:scale-105 hover:-rotate-1 group
                        ${isDarkMode 
                            ? 'bg-slate-800/70 border-slate-600 hover:border-amber-500 shadow-slate-900/50' 
                            : 'bg-white/70 border-emerald-200 hover:border-amber-400 shadow-emerald-100/50'
                        }
                    `}>
                        <div className="w-20 h-20 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-8 group-hover:animate-pulse shadow-2xl">
                            <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.73 6.974 6 7.5 6A1.5 1.5 0 019 7.5V8a2 2 0 004 0 2 2 0 011.523-1.943A5.977 5.977 0 0116 10c0 3.314-2.686 6-6 6s-6-2.686-6-6a4.75 4.75 0 01.332-1.973z" clipRule="evenodd"/>
                            </svg>
                        </div>
                        <h4 className={`
                            text-2xl font-bold mb-6 transition-colors duration-500
                            ${isDarkMode ? 'text-slate-100' : 'text-slate-800'}
                        `}>
                            👨‍🎓 قراء مشهورون
                        </h4>
                        <p className={`
                            text-lg leading-relaxed transition-colors duration-500
                            ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}
                        `}>
                            مجموعة مختارة من أشهر قراء القرآن الكريم في العالم الإسلامي بأصواتهم المميزة
                        </p>
                    </div>

                    {/* Feature 3 */}
                    <div className={`
                        backdrop-blur-sm border-2 rounded-3xl p-10 text-center shadow-2xl transition-all duration-500 transform hover:scale-105 hover:rotate-1 group
                        ${isDarkMode 
                            ? 'bg-slate-800/70 border-slate-600 hover:border-cyan-500 shadow-slate-900/50' 
                            : 'bg-white/70 border-emerald-200 hover:border-cyan-400 shadow-emerald-100/50'
                        }
                    `}>
                        <div className="w-20 h-20 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-8 group-hover:animate-pulse shadow-2xl">
                            <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm2 2V5h1v1H5zM3 13a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1H4a1 1 0 01-1-1v-3zm2 2v-1h1v1H5zM13 3a1 1 0 00-1 1v3a1 1 0 001 1h3a1 1 0 001-1V4a1 1 0 00-1-1h-3zm1 2v1h1V5h-1z" clipRule="evenodd"/>
                                <path d="M11 4a1 1 0 10-2 0v1a1 1 0 002 0V4zM10 7a1 1 0 011 1v1h2a1 1 0 110 2h-3a1 1 0 01-1-1V8a1 1 0 011-1zM16 12a1 1 0 100-2 1 1 0 000 2zM12 13a1 1 0 011-1h2a1 1 0 110 2h-2a1 1 0 01-1-1zM16 16a1 1 0 100-2 1 1 0 000 2zM16 20a1 1 0 100-2 1 1 0 000 2zM12 17a1 1 0 011-1h2a1 1 0 110 2h-2a1 1 0 01-1-1z"/>
                            </svg>
                        </div>
                        <h4 className={`
                            text-2xl font-bold mb-6 transition-colors duration-500
                            ${isDarkMode ? 'text-slate-100' : 'text-slate-800'}
                        `}>
                            🔍 تصنيف متقدم
                        </h4>
                        <p className={`
                            text-lg leading-relaxed transition-colors duration-500
                            ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}
                        `}>
                            تصفح التسجيلات حسب السورة والآيات والمناسبة والقارئ مع نظام بحث متطور
                        </p>
                    </div>
                </div>

                {/* Call to Action */}
                <div className={`
                    text-center rounded-3xl p-16 shadow-2xl transition-all duration-500 relative overflow-hidden
                    ${isDarkMode 
                        ? 'bg-gradient-to-r from-emerald-700 to-teal-700' 
                        : 'bg-gradient-to-r from-emerald-600 to-teal-600'
                    }
                `}>
                    <div className="absolute inset-0 bg-black/10"></div>
                    <div className="relative z-10 text-white">
                        <h3 className="text-4xl md:text-5xl font-bold mb-6">ابدأ رحلتك مع القرآن الكريم</h3>
                        <p className="text-xl md:text-2xl mb-10 opacity-90 max-w-3xl mx-auto leading-relaxed">
                            انضم إلى آلاف المستمعين واستمتع بتجربة روحانية فريدة مع أجمل التلاوات
                        </p>
                        <Link
                            to="/recordings"
                            className="bg-white text-emerald-600 px-12 py-6 rounded-2xl hover:bg-gray-100 transition-all duration-300 shadow-2xl hover:shadow-white/30 transform hover:scale-105 active:scale-95 text-xl font-bold inline-flex items-center"
                        >
                            <svg className="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                            </svg>
                            ابدأ الاستماع الآن
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomePage;
