import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const SheikhRecordingsPage = () => {
    const { sheikhId } = useParams();
    const [recordings, setRecordings] = useState([]);
    const [filteredRecordings, setFilteredRecordings] = useState([]);
    const [sheikh, setSheikh] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const isAuthenticated = !!localStorage.getItem('token');

    useEffect(() => {
        const fetchRecordings = async () => {
            try {
                const response = await axios.get(`https://quran-app-bms.vercel.app/api/v1/recordings/sheikh/${sheikhId}`);
                const sortedRecordings = response.data.data.recordings.sort((a, b) => new Date(b.date) - new Date(a.date)); // ترتيب من الأحدث إلى الأقدم
                setRecordings(sortedRecordings);
                setFilteredRecordings(sortedRecordings);
                if (sortedRecordings.length > 0) {
                    setSheikh(sortedRecordings[0].sheikh);
                }
            } catch (error) {
                console.error('Error fetching recordings:', error);
            }
        };

        fetchRecordings();
    }, [sheikhId]);

    useEffect(() => {
        if (searchQuery) {
            const filtered = recordings.filter((recording) =>
                recording.title.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setFilteredRecordings(filtered);
        } else {
            setFilteredRecordings(recordings);
        }
    }, [searchQuery, recordings]);

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
            setRecordings(recordings.filter((recording) => recording._id !== id));
            setFilteredRecordings(filteredRecordings.filter((recording) => recording._id !== id));
            alert('تم حذف التسجيل بنجاح');
        } catch (error) {
            console.error('Error deleting recording:', error);
            alert('حدث خطأ أثناء حذف التسجيل');
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h2 className="text-3xl font-amiri text-gray-800 mb-8">تسجيلات : {sheikh?.name}</h2>

            {/* حقل البحث */}
            <div className="mb-6">
                <input
                    type="text"
                    placeholder="ابحث عن تسجيل..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                />
            </div>

            {/* عرض التسجيلات */}
            <div className="space-y-6">
                {filteredRecordings.map((recording) => (
                    <div key={recording._id} className="bg-gray-50 p-6 rounded-lg shadow-md">
                        <h3 className="text-xl font-amiri text-gray-800 mb-2">{recording.title}</h3>
                        <p className="text-gray-600 mb-4">{recording.description}</p>
                        <audio controls src={`${recording.audio_file}`} className="w-full mb-4">
                            Your browser does not support the audio element.
                        </audio>
                        <div className="flex space-x-2">
                            <a
                                href={`${recording.audio_file}`}
                                download
                                className="bg-green-700 text-white px-4 py-2 mx-4 rounded-lg hover:bg-green-800 transition duration-300 flex-1 text-center"
                            >
                                تحميل
                            </a>
                            {isAuthenticated && (
                                <>
                                    <a
                                        href={`/edit-recording/${recording._id}`}
                                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-300"
                                    >
                                        تعديل
                                    </a>
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

export default SheikhRecordingsPage;