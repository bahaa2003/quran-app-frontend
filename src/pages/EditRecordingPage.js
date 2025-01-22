import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const EditRecordingPage = () => {
    const { id } = useParams();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        is_ramadan: false,
        is_featured: false,
        sheikh: '',
        category: 'general',
        year: '',
        audio_file: null,
    });

    const [sheikhs, setSheikhs] = useState([]);

    useEffect(() => {
        const fetchRecording = async () => {
            try {
                const response = await axios.get(`https://quran-app-bms.vercel.app/api/v1/recordings/${id}`);
                setFormData(response.data.data);
            } catch (error) {
                console.error('Error fetching recording:', error);
            }
        };

        const fetchSheikhs = async () => {
            try {
                const response = await axios.get('https://quran-app-bms.vercel.app/api/v1/sheikhs');
                setSheikhs(response.data.data);
            } catch (error) {
                console.error('Error fetching sheikhs:', error);
            }
        };

        fetchRecording();
        fetchSheikhs();
    }, [id]);

    const handleChange = (e) => {
        const { name, value, type, checked, files } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : type === 'file' ? files[0] : value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const data = new FormData();
        data.append('title', formData.title);
        data.append('description', formData.description);
        data.append('is_ramadan', formData.is_ramadan);
        data.append('is_featured', formData.is_featured);
        data.append('sheikh', formData.sheikh);
        data.append('category', formData.category);
        data.append('year', formData.year);
        if (formData.audio_file) {
            data.append('audio_file', formData.audio_file);
        }

        for (let [key, value] of data.entries()) {
            console.log(key, value);
        }

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                alert('يجب تسجيل الدخول أولاً');
                return;
            }

            const response = await axios.patch(`https://quran-app-bms.vercel.app/api/v1/recordings/${id}`, data, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log('Recording updated:', response.data);
            alert('تم تعديل التسجيل بنجاح');
        } catch (error) {
            console.error('Error updating recording:', error);
            alert('حدث خطأ أثناء تعديل التسجيل');
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h2 className="text-3xl font-amiri text-gray-800 mb-8">تعديل تسجيل</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="text"
                    name="title"
                    placeholder="عنوان التسجيل"
                    value={formData.title}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                    required
                />
                <textarea
                    name="description"
                    placeholder="وصف التسجيل"
                    value={formData.description}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                ></textarea>
                <label className="flex items-center space-x-2">
                    <input
                        type="checkbox"
                        name="is_ramadan"
                        checked={formData.is_ramadan}
                        onChange={handleChange}
                        className="form-checkbox"
                    />
                    <span>تسجيل رمضاني</span>
                </label>
                <label className="flex items-center space-x-2">
                    <input
                        type="checkbox"
                        name="is_featured"
                        checked={formData.is_featured}
                        onChange={handleChange}
                        className="form-checkbox"
                    />
                    <span>تسجيل مميز</span>
                </label>
                <select
                    name="sheikh"
                    value={formData.sheikh}
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
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                    required
                >
                    <option value="general">عام</option>
                    <option value="ramadan">رمضان</option>
                    <option value="featured">مميز</option>
                </select>
                <input
                    type="number"
                    name="year"
                    placeholder="السنة"
                    value={formData.year}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                />
                <input
                    type="file"
                    name="audio_file"
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                />
                <button
                    type="submit"
                    className="bg-green-700 text-white px-6 py-2 rounded-lg hover:bg-green-800 transition duration-300"
                >
                    تعديل تسجيل
                </button>
            </form>
        </div>
    );
};

export default EditRecordingPage;