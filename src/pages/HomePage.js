// frontend/src/pages/HomePage.js
import React from 'react';

const HomePage = () => {
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="text-center">
                <h2 className="text-4xl font-amiri text-gray-800 mb-4">استمع إلى القرآن الكريم بأصوات من الجنه</h2>
                <p className="text-gray-600 mb-8">اختر من مجموعة كبيرة من التسجيلات القرآنية المميزة</p>
                <p className="text-gray-600 mb-8">اللهم اجعل القرآن العظيم ربيع قلوبنا، ونور صدورنا، وذهاب همومنا وأحزاننا، اللهم ذكرنا منه ما نسينا، وعلمنا منه ما جهلنا، وارزقنا تلاوته آناء الليل وأطراف النهار.. وارزقنا تدبره والعمل به اللهم أمين وصلي اللهم علي سيد الخلق أجمعين سيدنا محمد عليه افضل الصلاة وأتم التسليم
                </p>
                <a href="/recordings" className="bg-green-700 text-white px-6 py-2 rounded-lg hover:bg-green-800 transition duration-300">
                    استمع الآن
                </a>
            </div>
        </div>
    );
};

export default HomePage;