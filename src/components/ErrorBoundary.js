import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        this.setState({
            error: error,
            errorInfo: errorInfo
        });
    }

    render() {
        if (this.state.hasError) {
            return <ErrorFallback error={this.state.error} />;
        }

        return this.props.children;
    }
}

const ErrorFallback = ({ error }) => {
    // Use system preference for dark mode since we can't access ThemeContext
    const isDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

    return (
        <div className={`
            min-h-screen flex items-center justify-center p-4 transition-all duration-500
            ${isDarkMode 
                ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900' 
                : 'bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50'
            }
        `}>
            <div className={`
                max-w-lg w-full text-center backdrop-blur-sm border-2 rounded-3xl p-12 shadow-2xl transition-all duration-500
                ${isDarkMode 
                    ? 'bg-slate-800/70 border-slate-600 shadow-slate-900/50' 
                    : 'bg-white/70 border-red-200 shadow-red-100/50'
                }
            `}>
                <div className="text-6xl mb-6">⚠️</div>
                <h2 className={`
                    text-3xl font-bold mb-6 transition-colors duration-500
                    ${isDarkMode ? 'text-red-300' : 'text-red-600'}
                `}>
                    حدث خطأ غير متوقع
                </h2>
                <p className={`
                    text-lg mb-8 leading-relaxed transition-colors duration-500
                    ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}
                `}>
                    نعتذر عن هذا الخطأ. يرجى إعادة تحميل الصفحة أو المحاولة مرة أخرى لاحقاً.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                        onClick={() => window.location.reload()}
                        className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-8 py-4 rounded-2xl transition-all duration-300 shadow-2xl hover:shadow-emerald-300/50 transform hover:scale-105 active:scale-95 text-lg font-bold"
                    >
                        🔄 إعادة تحميل الصفحة
                    </button>
                    <button
                        onClick={() => window.history.back()}
                        className={`
                            border-3 px-8 py-4 rounded-2xl transition-all duration-300 shadow-2xl transform hover:scale-105 active:scale-95 text-lg font-bold
                            ${isDarkMode 
                                ? 'bg-slate-800/50 text-emerald-400 border-emerald-400 hover:bg-emerald-400 hover:text-slate-900 hover:shadow-emerald-400/50' 
                                : 'bg-white text-emerald-600 border-emerald-600 hover:bg-emerald-600 hover:text-white hover:shadow-emerald-300/50'
                            }
                        `}
                    >
                        ↩️ العودة للخلف
                    </button>
                </div>
                {process.env.NODE_ENV === 'development' && error && (
                    <details className={`
                        mt-8 p-4 rounded-xl text-left transition-colors duration-500
                        ${isDarkMode ? 'bg-slate-700/50' : 'bg-red-50'}
                    `}>
                        <summary className={`
                            cursor-pointer font-bold mb-2 transition-colors duration-500
                            ${isDarkMode ? 'text-red-300' : 'text-red-600'}
                        `}>
                            تفاصيل الخطأ (للمطورين)
                        </summary>
                        <pre className={`
                            text-sm overflow-auto transition-colors duration-500
                            ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}
                        `}>
                            {error.toString()}
                        </pre>
                    </details>
                )}
            </div>
        </div>
    );
};

export default ErrorBoundary;
