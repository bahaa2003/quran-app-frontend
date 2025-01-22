// frontend/src/pages/LoginPage.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('https://quran-app-bms.vercel.app/api/v1/auth/login', {
                username,
                password,
            });
            localStorage.setItem('token', response.data.token);
            navigate('/admin');
        } catch (error) {
            console.error('Error logging in:', error);
            alert('حدث خطأ أثناء تسجيل الدخول');
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h2 className="text-3xl font-amiri text-gray-800 mb-8">تسجيل الدخول</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="text"
                    placeholder="اسم المستخدم"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                    required
                />
                <input
                    type="password"
                    placeholder="كلمة المرور"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                    required
                />
                <button
                    type="submit"
                    className="bg-green-700 text-white px-6 py-2 rounded-lg hover:bg-green-800 transition duration-300"
                >
                    تسجيل الدخول
                </button>
            </form>
        </div>
    );
};

export default LoginPage;