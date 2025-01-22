import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'; // استيراد Link من react-router-dom

const RecordingsPage = () => {
    const [recordings, setRecordings] = useState([]);
    const [filteredRecordings, setFilteredRecordings] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const isAuthenticated = !!localStorage.getItem('token'); 

    useEffect(() => {
        const fetchRecordings = async () => {
            try {
                const response = await axios.get('https://quran-app-bms.vercel.app/api/v1/recordings');
                const sortedRecordings = response.data.data.sort((a, b) => new Date(b.date) - new Date(a.date)); // ترتيب من الأحدث إلى الأقدم
                setRecordings(sortedRecordings);
                setFilteredRecordings(sortedRecordings);
            } catch (error) {
                console.error('Error fetching recordings:', error);
            }
        };

        fetchRecordings();
    }, []);

    useEffect(() => {
        let filtered = recordings;

        if (selectedCategory !== 'all') {
            filtered = filtered.filter((recording) => recording.category === selectedCategory);
        }

        if (searchQuery) {
            filtered = filtered.filter(
                (recording) =>
                    recording.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    recording.sheikh.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        setFilteredRecordings(filtered);
    }, [selectedCategory, searchQuery, recordings]);

    const handleDelete = async (id) => {
        const isConfirmed = window.confirm('هل أنت متأكد من حذف التسجيل؟');
        if (!isConfirmed) return;

        try {
            const token = localStorage.getItem('token');
            await axios.delete(`https://quran-app-bms.vercel.app/api/v1/recordings/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setRecordings(recordings.filter((recording) => recording._id !== id)); // تحديث القائمة بعد الحذف
            alert('تم حذف التسجيل بنجاح');
        } catch (error) {
            console.error('Error deleting recording:', error);
            alert('حدث خطأ أثناء حذف التسجيل');
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h2 className="text-3xl font-amiri text-gray-800 mb-8">التسجيلات</h2>

            {/* فلتر التصنيف */}
            <div className="mb-6">
                <label htmlFor="category" className="block text-lg font-amiri text-gray-800 mb-2">
                    اختر التصنيف:
                </label>
                <select
                    id="category"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                >
                    <option value="all">الكل</option>
                    <option value="general">عام</option>
                    <option value="ramadan">رمضان</option>
                    <option value="featured">مميز</option>
                </select>
            </div>

            {/* حقل البحث */}
            <div className="mb-6">
                <input
                    type="text"
                    placeholder="ابحث عن تسجيل أو شيخ..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                />
            </div>

            {/* عرض التسجيلات */}
            <div className="space-y-6">
                {filteredRecordings.map((recording) => (
                    <div key={recording._id} className="bg-gray-50 p-6 rounded-lg shadow-md">
                        <div className="flex justify-between items-start mb-4">
                            <h3 className="text-xl font-amiri text-gray-800">{recording.title}</h3>
                        </div>
                        <p className="text-gray-600 mb-4">{recording.description}</p>
                        <div className="flex space-x-4 text-right mb-3">
                            <p className="text-gray-600 mx-6">
                                <strong>الشيخ:</strong> {recording.sheikh.name}
                            </p>
                            <p className="text-gray-600 mx-6">
                                <strong>التصنيف:</strong> {recording.category === 'ramadan' ? 'رمضان' : recording.category === 'featured' ? 'مميز' : 'عام'}
                            </p>
                            {recording.category === 'ramadan' && (
                                <p className="text-gray-600 mx-6">
                                    <strong>العام:</strong> {recording.year}
                                </p>
                            )}
                        </div>
                        <audio controls src={`${recording.audio_file}`} className="w-full mb-4">
                            Your browser does not support the audio element.
                        </audio>
                        <div className="flex space-x-2">
                            <a
                                href={`${recording.audio_file}`}
                                download
                                className="bg-green-700 text-white px-4 py-2 rounded-lg hover:bg-green-800 transition duration-300 flex-1 text-center ml-4"
                            >
                                تحميل
                            </a>
                            {isAuthenticated && (
                                <>
                                    {/* استخدام Link بدلًا من <a> */}
                                    <Link
                                        to={`/edit-recording/${recording._id}`}
                                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-300"
                                    >
                                        تعديل
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(recording._id)}
                                        className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition duration-300"
                                    >
                                        حذف
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RecordingsPage;
