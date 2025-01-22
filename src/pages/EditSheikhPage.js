// frontend/src/pages/EditSheikhPage.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const EditSheikhPage = () => {
    const { id } = useParams();
    const [formData, setFormData] = useState({
        name: '',
        bio: '',
        photo: '',
    });

    useEffect(() => {
        const fetchSheikh = async () => {
            try {
                const response = await axios.get(`https://quran-app-bms.vercel.app/api/v1/sheikhs/${id}`);
                setFormData(response.data.data);
            } catch (error) {
                console.error('Error fetching sheikh:', error);
            }
        };

        fetchSheikh();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const token = localStorage.getItem('token');
            const response = await axios.patch(`https://quran-app-bms.vercel.app/api/v1/sheikhs/${id}`, formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            console.log('Sheikh updated:', response.data);
            alert('تم تعديل الشيخ بنجاح');
        } catch (error) {
            console.error('Error updating sheikh:', error);
            alert('حدث خطأ أثناء تعديل الشيخ');
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h2 className="text-3xl font-amiri text-gray-800 mb-8">تعديل شيخ</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="text"
                    name="name"
                    placeholder="اسم الشيخ"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                    required
                />
                <textarea
                    name="bio"
                    placeholder="معلومات عن الشيخ"
                    value={formData.bio}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                ></textarea>
                <input
                    type="text"
                    name="photo"
                    placeholder="رابط صورة الشيخ"
                    value={formData.photo}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                />
                <button
                    type="submit"
                    className="bg-green-700 text-white px-6 py-2 rounded-lg hover:bg-green-800 transition duration-300"
                >
                    تعديل شيخ
                </button>
            </form>
        </div>
    );
};

export default EditSheikhPage;