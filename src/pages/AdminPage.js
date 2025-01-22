import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminPage = () => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        sheikh: '',
        category: 'general',
        year: '',
        audio_file: null,
    });

    const [sheikhFormData, setSheikhFormData] = useState({
        name: '',
        bio: '',
        photo: null,
    });

    const [sheikhs, setSheikhs] = useState([]);
    const [showYearField, setShowYearField] = useState(false);
    const [currentView, setCurrentView] = useState('recordings');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const isAuthenticated = !!localStorage.getItem('token');
        if (!isAuthenticated) {
            navigate('/');
        }
    }, [navigate]);

    useEffect(() => {
        const fetchSheikhs = async () => {
            try {
                const response = await axios.get('https://quran-app-bms.vercel.app/api/v1/sheikhs');
                setSheikhs(response.data.data);
            } catch (error) {
                console.error('Error fetching sheikhs:', error);
            }
        };

        fetchSheikhs();
    }, []);

    useEffect(() => {
        if (formData.category === 'ramadan') {
            setShowYearField(true);
        } else {
            setShowYearField(false);
            setFormData((prevFormData) => ({ ...prevFormData, year: '' }));
        }
    }, [formData.category]);

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

    const uploadFileToCloudinary = async (file, resourceType = 'auto') => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET);

        try {
            const response = await fetch(
                `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/${resourceType}/upload`,
                {
                    method: 'POST',
                    body: formData,
                }
            );

            const data = await response.json();
            console.log('Cloudinary response:', data);

            if (data.secure_url) {
                return data.secure_url;
            } else {
                throw new Error('Failed to upload file to Cloudinary');
            }
        } catch (error) {
            console.error('Error uploading file:', error);
            throw error;
        }
    };

    const handleSubmitRecording = async (e) => {
        e.preventDefault();
        setIsLoading(true); 

        try {
            const audioUrl = await uploadFileToCloudinary(formData.audio_file, 'video');

            const data = {
                title: formData.title || 'Untitled',
                description: formData.description || 'No description',
                sheikh: formData.sheikh || 'Unknown',
                category: formData.category,
                year: formData.category === 'ramadan' ? formData.year : undefined,
                audio_file: audioUrl,
            };

            const token = localStorage.getItem('token');
            const response = await axios.post('https://quran-app-bms.vercel.app/api/v1/admin/recordings', data, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            console.log('Recording added:', response.data);
            alert('تمت إضافة التسجيل بنجاح');
        } catch (error) {
            console.error('Error adding recording:', error);
            alert('حدث خطأ أثناء إضافة التسجيل');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmitSheikh = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const photoUrl = await uploadFileToCloudinary(sheikhFormData.photo, 'image');

            const data = {
                name: sheikhFormData.name,
                bio: sheikhFormData.bio,
                photo: photoUrl,
            };

            const token = localStorage.getItem('token');
            const response = await axios.post('https://quran-app-bms.vercel.app/api/v1/sheikhs', data, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            console.log('Sheikh added:', response.data);
            alert('تمت إضافة الشيخ بنجاح');
            setSheikhFormData({ name: '', bio: '', photo: null });
        } catch (error) {
            console.error('Error adding sheikh:', error);
            alert('حدث خطأ أثناء إضافة الشيخ');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h2 className="text-3xl font-amiri text-gray-800 mb-8">لوحة التحكم</h2>
            <div className="flex space-x-4 mb-8">
                <button
                    onClick={() => {
                        setCurrentView('recordings');
                        setFormData({ title: '', description: '', sheikh: '', category: 'general', year: '', audio_file: null });
                    }}
                    className={`ml-4 px-6 py-2 rounded-lg ${currentView === 'recordings' ? 'bg-green-700 text-white' : 'bg-gray-200 text-gray-800'}`}
                >
                    إضافة تسجيل
                </button>
                <button
                    onClick={() => {
                        setCurrentView('sheikhs');
                        setSheikhFormData({ name: '', bio: '', photo: null });
                    }}
                    className={`px-6 py-2 rounded-lg ${currentView === 'sheikhs' ? 'bg-green-700 text-white' : 'bg-gray-200 text-gray-800'}`}
                >
                    إضافة قارئ
                </button>
            </div>
            {isLoading && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <p className="text-lg font-semibold">جاري التحميل...</p>
                    </div>
                </div>
            )}
            {currentView === 'recordings' ? (
                <form onSubmit={handleSubmitRecording} className="space-y-4">
                    <input
                        type="text"
                        name="title"
                        placeholder="عنوان التسجيل"
                        value={formData.title || ''}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded-lg"
                        required
                    />
                    <textarea
                        name="description"
                        placeholder="وصف التسجيل"
                        value={formData.description || ''}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded-lg"
                    ></textarea>
                    <select
                        name="sheikh"
                        value={formData.sheikh || ''}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded-lg"
                        required
                    >
                        <option value="">اختر الشيخ</option>
                        {sheikhs.map((sheikh) => (
                            <option key={sheikh._id} value={sheikh._id}>
                                {sheikh.name}
                            </option>
                        ))}
                    </select>
                    <select
                        name="category"
                        value={formData.category || 'general'}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded-lg"
                        required
                    >
                        <option value="general">عام</option>
                        <option value="ramadan">رمضان</option>
                        <option value="featured">مميز</option>
                    </select>
                    {showYearField && (
                        <input
                            type="number"
                            name="year"
                            placeholder="السنة"
                            value={formData.year || ''}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded-lg"
                            required
                        />
                    )}
                    <input
                        type="file"
                        name="audio_file"
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded-lg"
                        required
                    />
                    <button
                        type="submit"
                        className="bg-green-700 text-white px-6 py-2 rounded-lg hover:bg-green-800 transition duration-300"
                        disabled={isLoading} // تعطيل الزر أثناء التحميل
                    >
                        {isLoading ? 'جاري التحميل...' : 'إضافة تسجيل'}
                    </button>
                </form>
            ) : (
                <form onSubmit={handleSubmitSheikh} className="space-y-4">
                    <input
                        type="text"
                        name="name"
                        placeholder="اسم الشيخ"
                        value={sheikhFormData.name || ''}
                        onChange={handleSheikhChange}
                        className="w-full p-2 border border-gray-300 rounded-lg"
                        required
                    />
                    <textarea
                        name="bio"
                        placeholder="معلومات عن الشيخ"
                        value={sheikhFormData.bio || ''}
                        onChange={handleSheikhChange}
                        className="w-full p-2 border border-gray-300 rounded-lg"
                    ></textarea>
                    <input
                        type="file"
                        name="photo"
                        onChange={handleSheikhChange}
                        className="w-full p-2 border border-gray-300 rounded-lg"
                        required
                    />
                    <button
                        type="submit"
                        className="bg-green-700 text-white px-6 py-2 rounded-lg hover:bg-green-800 transition duration-300"
                        disabled={isLoading}
                    >
                        {isLoading ? 'جاري التحميل...' : 'إضافة قارئ'}
                    </button>
                </form>
            )}
        </div>
    );
};

export default AdminPage;