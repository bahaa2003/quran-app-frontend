import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useTheme } from '../contexts/ThemeContext';
import { useToast } from '../contexts/ToastContext';
import API_BASE_URL from '../config/api';
import { uploadWithRetry, validateAudioFile } from '../utils/uploadUtils';

const AdminPage = () => {
    const navigate = useNavigate();
    const { isDarkMode } = useTheme();
    const { showSuccess, showError } = useToast();
    
    // State management
    const [loading, setLoading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isUploading, setIsUploading] = useState(false);
    const [activeTab, setActiveTab] = useState('dashboard');
    const [sheikhs, setSheikhs] = useState([]);
    const [recordings, setRecordings] = useState([]);
    const [sadaqaItems, setSadaqaItems] = useState([]);
    
    // Form data states
    const [formData, setFormData] = useState({
        sheikh: '',
        surah: '',
        surahNumber: '',
        fromAyah: '',
        toAyah: '',
        audio_file: null
    });
    
    const [sheikhFormData, setSheikhFormData] = useState({
        name: '',
        bio: '',
        photo: null
    });
    
    const [bannerData, setBannerData] = useState({
        text: '',
        isActive: false
    });

    // Data fetching
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                
                // Fetch recordings
                const recordingsResponse = await axios.get(`${API_BASE_URL}/recordings`);
                setRecordings(recordingsResponse.data.data || []);
                
                // Fetch sheikhs
                const sheikhsResponse = await axios.get(`${API_BASE_URL}/sheikhs`);
                setSheikhs(sheikhsResponse.data.data || []);
                
                // Fetch banner data
                try {
                    const bannerResponse = await axios.get(`${API_BASE_URL}/sadaqa`);
                    if (bannerResponse.data.data) {
                        setBannerData(bannerResponse.data.data);
                    }
                } catch (bannerError) {
                    console.log('Banner data not found, using defaults');
                }
                
            } catch (error) {
                console.error('Error fetching data:', error);
                showError('حدث خطأ في تحميل البيانات');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [showError]);

    // Form handlers
    const handleRecordingSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setIsUploading(true);
        setUploadProgress(0);

        try {
            // Validate audio file first
            if (formData.audio_file) {
                validateAudioFile(formData.audio_file);
            }

            const submitData = new FormData();
            
            Object.keys(formData).forEach(key => {
                if (formData[key] !== null && formData[key] !== '') {
                    submitData.append(key, formData[key]);
                }
            });

            console.log('Starting upload with enhanced retry logic...');
            await uploadWithRetry(submitData, setUploadProgress);

            showSuccess('تم رفع التسجيل بنجاح');
            setFormData({
                sheikh: '',
                surah: '',
                surahNumber: '',
                fromAyah: '',
                toAyah: '',
                audio_file: null
            });
            
            // Refresh recordings list
            const recordingsResponse = await axios.get(`${API_BASE_URL}/recordings`);
            setRecordings(recordingsResponse.data.data);
            
        } catch (error) {
            console.error('Error uploading recording:', error);
            showError('حدث خطأ أثناء رفع التسجيل');
        } finally {
            setLoading(false);
            setIsUploading(false);
            setUploadProgress(0);
        }
    };

    const handleSheikhSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const token = localStorage.getItem('token');
            const submitData = new FormData();
            
            Object.keys(sheikhFormData).forEach(key => {
                if (sheikhFormData[key] !== null && sheikhFormData[key] !== '') {
                    submitData.append(key, sheikhFormData[key]);
                }
            });

            await axios.post(`${API_BASE_URL}/sheikhs`, submitData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });

            showSuccess('تم إضافة الشيخ بنجاح');
            setSheikhFormData({ name: '', bio: '', photo: null });
            
            // Refresh sheikhs list
            const sheikhsResponse = await axios.get(`${API_BASE_URL}/sheikhs`);
            setSheikhs(sheikhsResponse.data.data);
            
        } catch (error) {
            console.error('Error adding sheikh:', error);
            showError('حدث خطأ أثناء إضافة الشيخ');
        } finally {
            setLoading(false);
        }
    };

    const handleBannerSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const token = localStorage.getItem('token');
            
            // First, deactivate all existing banners
            const existingBanners = await axios.get(`${API_BASE_URL}/sadaqa`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            
            if (existingBanners.data.data && existingBanners.data.data.length > 0) {
                // Deactivate all existing banners
                for (const banner of existingBanners.data.data) {
                    await axios.patch(`${API_BASE_URL}/sadaqa/${banner._id}`, 
                        { isActive: false }, 
                        { headers: { 'Authorization': `Bearer ${token}` } }
                    );
                }
            }
            
            // Create new banner
            await axios.post(`${API_BASE_URL}/sadaqa`, {
                text: bannerData.text,
                isActive: bannerData.isActive,
                order: 1
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            showSuccess('تم حفظ بانر الصدقة الجارية بنجاح');
            
        } catch (error) {
            console.error('Error saving banner:', error);
            showError(`حدث خطأ أثناء حفظ البانر: ${error.response?.data?.message || error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteRecording = async (id) => {
        if (!window.confirm('هل أنت متأكد من حذف هذا التسجيل؟')) return;

        try {
            const token = localStorage.getItem('token');
            await axios.delete(`${API_BASE_URL}/recordings/${id}`, {
                headers: { 'Authorization': `Bearer ${token}` },
            });

            showSuccess('تم حذف التسجيل بنجاح');
            setRecordings(recordings.filter(rec => rec._id !== id));
        } catch (error) {
            console.error('Error deleting recording:', error);
            showError('حدث خطأ أثناء حذف التسجيل');
        }
    };

    const handleChange = (e) => {
        const { name, value, type, files } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'file' ? files[0] : value,
        });
    };

    const handleSheikhChange = (e) => {
        const { name, value, type, files } = e.target;
        setSheikhFormData({
            ...sheikhFormData,
            [name]: type === 'file' ? files[0] : value,
        });
    };

    const handleBannerChange = (e) => {
        const { name, value, type, checked } = e.target;
        setBannerData({
            ...bannerData,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    // Render components
    const renderDashboard = () => (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Stats Cards */}
            <div className={`
                p-6 rounded-3xl border-2 transition-all duration-500
                ${isDarkMode 
                    ? 'bg-slate-800/50 border-slate-700' 
                    : 'bg-white/70 border-emerald-200'
                }
                backdrop-blur-sm shadow-xl hover:shadow-2xl transform hover:scale-105
            `}>
                <div className="flex items-center justify-between">
                    <div>
                        <p className={`text-sm font-semibold ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                            إجمالي التسجيلات
                        </p>
                        <p className={`text-3xl font-bold ${isDarkMode ? 'text-slate-100' : 'text-slate-800'}`}>
                            {recordings.length}
                        </p>
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center">
                        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z"/>
                        </svg>
                    </div>
                </div>
            </div>

            <div className={`
                p-6 rounded-3xl border-2 transition-all duration-500
                ${isDarkMode 
                    ? 'bg-slate-800/50 border-slate-700' 
                    : 'bg-white/70 border-blue-200'
                }
                backdrop-blur-sm shadow-xl hover:shadow-2xl transform hover:scale-105
            `}>
                <div className="flex items-center justify-between">
                    <div>
                        <p className={`text-sm font-semibold ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                            عدد القراء
                        </p>
                        <p className={`text-3xl font-bold ${isDarkMode ? 'text-slate-100' : 'text-slate-800'}`}>
                            {sheikhs.length}
                        </p>
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center">
                        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z"/>
                        </svg>
                    </div>
                </div>
            </div>

            <div className={`
                p-6 rounded-3xl border-2 transition-all duration-500
                ${isDarkMode 
                    ? 'bg-slate-800/50 border-slate-700' 
                    : 'bg-white/70 border-purple-200'
                }
                backdrop-blur-sm shadow-xl hover:shadow-2xl transform hover:scale-105
            `}>
                <div className="flex items-center justify-between">
                    <div>
                        <p className={`text-sm font-semibold ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                            حالة البانر
                        </p>
                        <p className={`text-lg font-bold ${bannerData.isActive 
                            ? (isDarkMode ? 'text-green-400' : 'text-green-600')
                            : (isDarkMode ? 'text-red-400' : 'text-red-600')
                        }`}>
                            {bannerData.isActive ? 'نشط' : 'غير نشط'}
                        </p>
                    </div>
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                        bannerData.isActive 
                            ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                            : 'bg-gradient-to-r from-red-500 to-pink-500'
                    }`}>
                        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"/>
                        </svg>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderRecordingForm = () => (
        <div className={`
            rounded-3xl p-8 border-2 transition-all duration-500
            ${isDarkMode 
                ? 'bg-slate-800/50 border-slate-700' 
                : 'bg-white/70 border-emerald-200'
            }
            backdrop-blur-sm shadow-xl
        `}>
            <h3 className={`text-2xl font-bold mb-6 ${isDarkMode ? 'text-slate-100' : 'text-slate-800'}`}>
                رفع تسجيل جديد
            </h3>
            
            <form onSubmit={handleRecordingSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className={`block text-sm font-semibold mb-2 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                            الشيخ
                        </label>
                        <select
                            name="sheikh"
                            value={formData.sheikh}
                            onChange={handleChange}
                            required
                            className={`
                                w-full p-4 rounded-xl border-2 transition-all duration-300
                                ${isDarkMode 
                                    ? 'bg-slate-700/50 border-slate-600 text-slate-100 focus:border-emerald-500' 
                                    : 'bg-white/70 border-slate-200 text-slate-800 focus:border-emerald-500'
                                }
                                focus:outline-none focus:ring-4 focus:ring-emerald-500/20
                            `}
                        >
                            <option value="">اختر الشيخ</option>
                            {sheikhs.map(sheikh => (
                                <option key={sheikh._id} value={sheikh._id}>
                                    {sheikh.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className={`block text-sm font-semibold mb-2 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                            اسم السورة
                        </label>
                        <input
                            type="text"
                            name="surah"
                            value={formData.surah}
                            onChange={handleChange}
                            required
                            placeholder="مثال: الفاتحة"
                            className={`
                                w-full p-4 rounded-xl border-2 transition-all duration-300
                                ${isDarkMode 
                                    ? 'bg-slate-700/50 border-slate-600 text-slate-100 placeholder-slate-400 focus:border-emerald-500' 
                                    : 'bg-white/70 border-slate-200 text-slate-800 placeholder-slate-500 focus:border-emerald-500'
                                }
                                focus:outline-none focus:ring-4 focus:ring-emerald-500/20
                            `}
                        />
                    </div>

                    <div>
                        <label className={`block text-sm font-semibold mb-2 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                            رقم السورة
                        </label>
                        <input
                            type="number"
                            name="surahNumber"
                            value={formData.surahNumber}
                            onChange={handleChange}
                            min="1"
                            max="114"
                            placeholder="1-114"
                            className={`
                                w-full p-4 rounded-xl border-2 transition-all duration-300
                                ${isDarkMode 
                                    ? 'bg-slate-700/50 border-slate-600 text-slate-100 placeholder-slate-400 focus:border-emerald-500' 
                                    : 'bg-white/70 border-slate-200 text-slate-800 placeholder-slate-500 focus:border-emerald-500'
                                }
                                focus:outline-none focus:ring-4 focus:ring-emerald-500/20
                            `}
                        />
                    </div>

                    <div>
                        <label className={`block text-sm font-semibold mb-2 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                            من الآية
                        </label>
                        <input
                            type="number"
                            name="fromAyah"
                            value={formData.fromAyah}
                            onChange={handleChange}
                            min="1"
                            placeholder="رقم الآية"
                            className={`
                                w-full p-4 rounded-xl border-2 transition-all duration-300
                                ${isDarkMode 
                                    ? 'bg-slate-700/50 border-slate-600 text-slate-100 placeholder-slate-400 focus:border-emerald-500' 
                                    : 'bg-white/70 border-slate-200 text-slate-800 placeholder-slate-500 focus:border-emerald-500'
                                }
                                focus:outline-none focus:ring-4 focus:ring-emerald-500/20
                            `}
                        />
                    </div>

                    <div>
                        <label className={`block text-sm font-semibold mb-2 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                            إلى الآية
                        </label>
                        <input
                            type="number"
                            name="toAyah"
                            value={formData.toAyah}
                            onChange={handleChange}
                            min="1"
                            placeholder="رقم الآية"
                            className={`
                                w-full p-4 rounded-xl border-2 transition-all duration-300
                                ${isDarkMode 
                                    ? 'bg-slate-700/50 border-slate-600 text-slate-100 placeholder-slate-400 focus:border-emerald-500' 
                                    : 'bg-white/70 border-slate-200 text-slate-800 placeholder-slate-500 focus:border-emerald-500'
                                }
                                focus:outline-none focus:ring-4 focus:ring-emerald-500/20
                            `}
                        />
                    </div>

                    <div>
                        <label className={`block text-sm font-semibold mb-2 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                            ملف الصوت
                        </label>
                        <input
                            type="file"
                            name="audio_file"
                            onChange={handleChange}
                            accept="audio/*"
                            required
                            className={`
                                w-full p-4 rounded-xl border-2 transition-all duration-300
                                ${isDarkMode 
                                    ? 'bg-slate-700/50 border-slate-600 text-slate-100 focus:border-emerald-500' 
                                    : 'bg-white/70 border-slate-200 text-slate-800 focus:border-emerald-500'
                                }
                                focus:outline-none focus:ring-4 focus:ring-emerald-500/20
                                file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0
                                file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700
                                hover:file:bg-emerald-100
                            `}
                        />
                    </div>
                </div>

                {/* Upload Progress Bar */}
                {isUploading && (
                    <div className="mb-6">
                        <div className="flex items-center justify-between mb-2">
                            <span className={`text-sm font-medium ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                                جاري الرفع...
                            </span>
                            <span className={`text-sm font-bold ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>
                                {uploadProgress}%
                            </span>
                        </div>
                        <div className={`w-full bg-gray-200 rounded-full h-3 overflow-hidden ${isDarkMode ? 'bg-slate-700' : 'bg-gray-200'}`}>
                            <div 
                                className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-300 ease-out"
                                style={{ width: `${uploadProgress}%` }}
                            >
                                <div className="h-full bg-gradient-to-r from-white/20 to-transparent animate-pulse"></div>
                            </div>
                        </div>
                    </div>
                )}

                <button
                    type="submit"
                    disabled={loading || isUploading}
                    className={`
                        w-full py-4 px-6 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105
                        ${loading || isUploading 
                            ? 'bg-gray-400 cursor-not-allowed' 
                            : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700'
                        }
                        text-white shadow-lg hover:shadow-xl
                    `}
                >
                    {isUploading ? `جاري الرفع... ${uploadProgress}%` : loading ? 'جاري المعالجة...' : 'رفع التسجيل'}
                </button>
            </form>
        </div>
    );
    const renderSheikhForm = () => (
        <div className={`
            rounded-3xl p-8 border-2 transition-all duration-500
            ${isDarkMode 
                ? 'bg-slate-800/50 border-slate-700' 
                : 'bg-white/70 border-blue-200'
            }
            backdrop-blur-sm shadow-xl
        `}>
            <h3 className={`text-2xl font-bold mb-6 ${isDarkMode ? 'text-slate-100' : 'text-slate-800'}`}>
                إضافة قارئ جديد
            </h3>
            
            <form onSubmit={handleSheikhSubmit} className="space-y-6">
                <div>
                    <label className={`block text-sm font-semibold mb-2 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                        اسم الشيخ
                    </label>
                    <input
                        type="text"
                        name="name"
                        value={sheikhFormData.name}
                        onChange={handleSheikhChange}
                        required
                        placeholder="مثال: الشيخ عبد الرحمن السديس"
                        className={`
                            w-full p-4 rounded-xl border-2 transition-all duration-300
                            ${isDarkMode 
                                ? 'bg-slate-700/50 border-slate-600 text-slate-100 placeholder-slate-400 focus:border-blue-500' 
                                : 'bg-white/70 border-slate-200 text-slate-800 placeholder-slate-500 focus:border-blue-500'
                            }
                            focus:outline-none focus:ring-4 focus:ring-blue-500/20
                        `}
                    />
                </div>

                <div>
                    <label className={`block text-sm font-semibold mb-2 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                        نبذة عن الشيخ
                    </label>
                    <textarea
                        name="bio"
                        value={sheikhFormData.bio}
                        onChange={handleSheikhChange}
                        rows={4}
                        placeholder="معلومات مختصرة عن الشيخ..."
                        className={`
                            w-full p-4 rounded-xl border-2 transition-all duration-300
                            ${isDarkMode 
                                ? 'bg-slate-700/50 border-slate-600 text-slate-100 placeholder-slate-400 focus:border-blue-500' 
                                : 'bg-white/70 border-slate-200 text-slate-800 placeholder-slate-500 focus:border-blue-500'
                            }
                            focus:outline-none focus:ring-4 focus:ring-blue-500/20
                        `}
                    />
                </div>

                <div>
                    <label className={`block text-sm font-semibold mb-2 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                        صورة الشيخ
                    </label>
                    <input
                        type="file"
                        name="photo"
                        onChange={handleSheikhChange}
                        accept="image/*"
                        required
                        className={`
                            w-full p-4 rounded-xl border-2 transition-all duration-300
                            ${isDarkMode 
                                ? 'bg-slate-700/50 border-slate-600 text-slate-100 focus:border-blue-500' 
                                : 'bg-white/70 border-slate-200 text-slate-800 focus:border-blue-500'
                            }
                            focus:outline-none focus:ring-4 focus:ring-blue-500/20
                            file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0
                            file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700
                            hover:file:bg-blue-100
                        `}
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className={`
                        w-full py-4 px-6 rounded-xl font-semibold text-white transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105
                        ${loading 
                            ? 'bg-gray-400 cursor-not-allowed' 
                            : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700'
                        }
                    `}
                >
                    {loading ? (
                        <div className="flex items-center justify-center">
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white ml-2"></div>
                            جاري الإضافة...
                        </div>
                    ) : (
                        'إضافة القارئ'
                    )}
                </button>
            </form>
        </div>
    );

    const renderBannerForm = () => (
        <div className={`
            rounded-3xl p-8 border-2 transition-all duration-500
            ${isDarkMode 
                ? 'bg-slate-800/50 border-slate-700' 
                : 'bg-white/70 border-purple-200'
            }
            backdrop-blur-sm shadow-xl
        `}>
            <h3 className={`text-2xl font-bold mb-6 ${isDarkMode ? 'text-slate-100' : 'text-slate-800'}`}>
                إدارة بانر الصدقة الجارية
            </h3>
            
            <form onSubmit={handleBannerSubmit} className="space-y-6">
                <div>
                    <label className={`block text-sm font-semibold mb-2 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                        نص البانر
                    </label>
                    <textarea
                        name="text"
                        value={bannerData.text}
                        onChange={handleBannerChange}
                        rows={3}
                        placeholder="نص الصدقة الجارية الذي سيظهر في الصفحة الرئيسية..."
                        className={`
                            w-full p-4 rounded-xl border-2 transition-all duration-300
                            ${isDarkMode 
                                ? 'bg-slate-700/50 border-slate-600 text-slate-100 placeholder-slate-400 focus:border-purple-500' 
                                : 'bg-white/70 border-slate-200 text-slate-800 placeholder-slate-500 focus:border-purple-500'
                            }
                            focus:outline-none focus:ring-4 focus:ring-purple-500/20
                        `}
                    />
                </div>

                <div className="flex items-center space-x-3">
                    <input
                        type="checkbox"
                        name="isActive"
                        checked={bannerData.isActive}
                        onChange={handleBannerChange}
                        className="w-5 h-5 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500 focus:ring-2"
                    />
                    <label className={`text-sm font-semibold ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                        تفعيل البانر
                    </label>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className={`
                        w-full py-4 px-6 rounded-xl font-semibold text-white transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105
                        ${loading 
                            ? 'bg-gray-400 cursor-not-allowed' 
                            : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700'
                        }
                    `}
                >
                    {loading ? (
                        <div className="flex items-center justify-center">
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white ml-2"></div>
                            جاري التحديث...
                        </div>
                    ) : (
                        'تحديث البانر'
                    )}
                </button>
            </form>
        </div>
    );

    // Main render
    if (loading) {
        return (
            <div className={`min-h-screen flex items-center justify-center ${
                isDarkMode 
                    ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900' 
                    : 'bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50'
            }`}>
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-emerald-600 mx-auto mb-4"></div>
                    <p className={`text-lg font-semibold ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                        جاري تحميل لوحة التحكم...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className={`min-h-screen transition-all duration-500 ${
            isDarkMode 
                ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900' 
                : 'bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50'
        }`}>
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className={`text-4xl md:text-5xl font-bold mb-4 ${
                        isDarkMode ? 'text-slate-100' : 'text-slate-800'
                    }`}>
                        لوحة التحكم الإدارية
                    </h1>
                    <p className={`text-lg ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                        إدارة التسجيلات والقراء وبانر الصدقة الجارية
                    </p>
                </div>

                {/* Navigation Tabs */}
                <div className="flex flex-wrap justify-center mb-8 gap-4">
                    {[
                        { id: 'dashboard', label: 'لوحة المعلومات', icon: '📊' },
                        { id: 'recordings', label: 'رفع تسجيل', icon: '🎵' },
                        { id: 'sheikhs', label: 'إضافة قارئ', icon: '👤' },
                        { id: 'banner', label: 'بانر الصدقة', icon: '📢' }
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`
                                px-6 py-3 rounded-2xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105
                                ${activeTab === tab.id
                                    ? (isDarkMode 
                                        ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white' 
                                        : 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white'
                                    )
                                    : (isDarkMode 
                                        ? 'bg-slate-800/50 text-slate-300 hover:bg-slate-700/50' 
                                        : 'bg-white/70 text-slate-700 hover:bg-white/90'
                                    )
                                }
                                backdrop-blur-sm border-2 ${activeTab === tab.id 
                                    ? 'border-emerald-500' 
                                    : (isDarkMode ? 'border-slate-700' : 'border-slate-200')
                                }
                            `}
                        >
                            <span className="mr-2">{tab.icon}</span>
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Content */}
                <div className="space-y-8">
                    {activeTab === 'dashboard' && renderDashboard()}
                    {activeTab === 'recordings' && renderRecordingForm()}
                    {activeTab === 'sheikhs' && renderSheikhForm()}
                    {activeTab === 'banner' && renderBannerForm()}
                </div>

                {/* Recordings List */}
                {activeTab === 'dashboard' && recordings.length > 0 && (
                    <div className={`
                        mt-12 rounded-3xl p-8 border-2 transition-all duration-500
                        ${isDarkMode 
                            ? 'bg-slate-800/50 border-slate-700' 
                            : 'bg-white/70 border-slate-200'
                        }
                        backdrop-blur-sm shadow-xl
                    `}>
                        <h3 className={`text-2xl font-bold mb-6 ${isDarkMode ? 'text-slate-100' : 'text-slate-800'}`}>
                            التسجيلات الحديثة
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {recordings.slice(0, 6).map(recording => (
                                <div
                                    key={recording._id}
                                    className={`
                                        p-6 rounded-2xl border-2 transition-all duration-300 hover:shadow-lg
                                        ${isDarkMode 
                                            ? 'bg-slate-700/50 border-slate-600 hover:border-slate-500' 
                                            : 'bg-white/50 border-slate-200 hover:border-slate-300'
                                        }
                                    `}
                                >
                                    <h4 className={`font-bold text-lg mb-2 ${isDarkMode ? 'text-slate-100' : 'text-slate-800'}`}>
                                        {recording.surah || 'تسجيل صوتي'}
                                    </h4>
                                    <p className={`text-sm mb-2 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                        القارئ: {recording.sheikh?.name || 'غير محدد'}
                                    </p>
                                    {recording.fromAyah && recording.toAyah && (
                                        <p className={`text-sm mb-4 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                            الآيات: {recording.fromAyah} - {recording.toAyah}
                                        </p>
                                    )}
                                    <button
                                        onClick={() => handleDeleteRecording(recording._id)}
                                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                                    >
                                        حذف
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminPage;