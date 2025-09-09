import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useTheme } from '../contexts/ThemeContext';
import { useToast } from '../contexts/ToastContext';

const SheikhsPage = () => {
  const { isDarkMode } = useTheme();
  const { showToast } = useToast();
  const [sheikhs, setSheikhs] = useState([]);
  const [filteredSheikhs, setFilteredSheikhs] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const isAuthenticated = !!localStorage.getItem("token");

  useEffect(() => {
    const fetchSheikhs = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/v1/sheikhs`
        );
        setSheikhs(response.data.data);
        setFilteredSheikhs(response.data.data);
      } catch (error) {
        console.error("Error fetching sheikhs:", error);
        showToast('حدث خطأ في تحميل القراء', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchSheikhs();
  }, [showToast]);

  useEffect(() => {
    const filtered = sheikhs.filter((sheikh) =>
      sheikh.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredSheikhs(filtered);
  }, [searchQuery, sheikhs]);

  const handleDelete = async (id) => {
    const isConfirmed = window.confirm("هل أنت متأكد من حذف الشيخ؟");
    if (!isConfirmed) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${process.env.REACT_APP_API_URL}/api/v1/sheikhs/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSheikhs(sheikhs.filter((sheikh) => sheikh._id !== id));
      setFilteredSheikhs(filteredSheikhs.filter((sheikh) => sheikh._id !== id));
      showToast('تم حذف الشيخ بنجاح', 'success');
    } catch (error) {
      console.error("Error deleting sheikh:", error);
      showToast('حدث خطأ أثناء حذف الشيخ', 'error');
    }
  };

  if (loading) {
    return (
      <div className={`
        min-h-screen transition-all duration-500
        ${isDarkMode 
          ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900' 
          : 'bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50'
        }
      `}>
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-emerald-600"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`
      min-h-screen transition-all duration-500
      ${isDarkMode 
        ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900' 
        : 'bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50'
      }
    `}>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className={`
            text-4xl md:text-5xl font-bold mb-6 transition-colors duration-500
            ${isDarkMode ? 'text-slate-100' : 'text-slate-800'}
          `}>
            🕌 القراء
          </h2>
          <p className={`
            text-xl md:text-2xl transition-colors duration-500
            ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}
          `}>
            تصفح مجموعة من أفضل قراء القرآن الكريم
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-emerald-500 to-teal-600 mx-auto rounded-full mt-4"></div>
        </div>

        {/* Search Field */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative">
            <input
              type="text"
              placeholder="ابحث عن شيخ..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`
                w-full p-4 pr-12 rounded-2xl border-2 transition-all duration-300
                ${isDarkMode 
                  ? 'bg-slate-800/50 border-slate-700 text-slate-100 placeholder-slate-400 focus:border-emerald-500' 
                  : 'bg-white/70 border-slate-200 text-slate-800 placeholder-slate-500 focus:border-emerald-500'
                }
                backdrop-blur-sm focus:outline-none focus:ring-4 focus:ring-emerald-500/20
              `}
            />
            <svg className={`
              absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5
              ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}
            `} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Sheikhs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredSheikhs.map((sheikh) => (
            <div key={sheikh._id} className={`
              group relative overflow-hidden rounded-3xl transition-all duration-500 hover:scale-105
              ${isDarkMode 
                ? 'bg-slate-800/50 border border-slate-700/50' 
                : 'bg-white/70 border border-slate-200/50'
              }
              backdrop-blur-sm shadow-xl hover:shadow-2xl
            `}>
              <div className="relative overflow-hidden rounded-t-3xl">
                <img
                  src={sheikh.photo}
                  alt={sheikh.name}
                  className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              
              <div className="p-6">
                <h3 className={`
                  text-2xl font-bold mb-3 transition-colors duration-500
                  ${isDarkMode ? 'text-slate-100' : 'text-slate-800'}
                `}>
                  {sheikh.name}
                </h3>
                <p className={`
                  text-base mb-6 line-clamp-3 transition-colors duration-500
                  ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}
                `}>
                  {sheikh.bio}
                </p>
                
                <div className="flex flex-col gap-3">
                  <Link
                    to={`/sheikh/${sheikh._id}`}
                    className="group/btn bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-6 py-3 rounded-xl hover:from-emerald-700 hover:to-teal-700 transition-all duration-300 text-center font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    <span className="flex items-center justify-center">
                      <svg className="w-5 h-5 ml-2 group-hover/btn:animate-pulse" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z"/>
                      </svg>
                      استمع إلى التسجيلات
                    </span>
                  </Link>
                  
                  {isAuthenticated && (
                    <div className="flex gap-2">
                      <Link
                        to={`/edit-sheikh/${sheikh._id}`}
                        className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 text-center font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
                      >
                        تعديل
                      </Link>
                      <button
                        onClick={() => handleDelete(sheikh._id)}
                        className="flex-1 bg-gradient-to-r from-red-600 to-pink-600 text-white px-4 py-2 rounded-xl hover:from-red-700 hover:to-pink-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
                      >
                        حذف
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredSheikhs.length === 0 && !loading && (
          <div className="text-center py-16">
            <div className={`
              text-6xl mb-4
              ${isDarkMode ? 'text-slate-600' : 'text-slate-400'}
            `}>
              🔍
            </div>
            <h3 className={`
              text-2xl font-bold mb-2 transition-colors duration-500
              ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}
            `}>
              لا توجد نتائج
            </h3>
            <p className={`
              text-lg transition-colors duration-500
              ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}
            `}>
              جرب البحث بكلمات مختلفة
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SheikhsPage;
