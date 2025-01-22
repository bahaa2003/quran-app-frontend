import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom"; // استيراد Link من react-router-dom

const SheikhsPage = () => {
  const [sheikhs, setSheikhs] = useState([]);
  const [filteredSheikhs, setFilteredSheikhs] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const isAuthenticated = !!localStorage.getItem("token");

  useEffect(() => {
    const fetchSheikhs = async () => {
      try {
        const response = await axios.get(
          "https://quran-app-bms.vercel.app/api/v1/sheikhs"
        );
        setSheikhs(response.data.data);
        setFilteredSheikhs(response.data.data);
      } catch (error) {
        console.error("Error fetching sheikhs:", error);
      }
    };

    fetchSheikhs();
  }, []);

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
      await axios.delete(`https://quran-app-bms.vercel.app/api/v1/sheikhs/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSheikhs(sheikhs.filter((sheikh) => sheikh._id !== id));
      alert("تم حذف الشيخ بنجاح");
    } catch (error) {
      console.error("Error deleting sheikh:", error);
      alert("حدث خطأ أثناء حذف الشيخ");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-amiri text-gray-800 mb-8">القراء</h2>

      {/* حقل البحث */}
      <input
        type="text"
        placeholder="ابحث عن شيخ..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded-lg mb-8"
      />

      {/* عرض الشيوخ */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSheikhs.map((sheikh) => (
          <div key={sheikh._id} className="bg-gray-50 p-6 rounded-lg shadow-md">
            <img
              src={sheikh.photo}
              alt={sheikh.name}
              className="w-full h-48 object-cover rounded-lg mb-4"
            />
            <h3 className="text-xl font-amiri text-gray-800 mb-2">
              {sheikh.name}
            </h3>
            <p className="text-gray-600 mb-4">{sheikh.bio}</p>
            <div className="flex space-x-2">
              {/* استخدام Link بدلًا من <a> */}
              <Link
                to={`/sheikh/${sheikh._id}/recordings`}
                className="bg-green-700 text-white px-4 py-2 rounded-lg hover:bg-green-800 transition duration-300 flex-1 text-center ml-4"
              >
                استمع إلى التسجيلات
              </Link>
              {isAuthenticated && (
                <>
                  <Link
                    to={`/edit-sheikh/${sheikh._id}`}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-300"
                  >
                    تعديل
                  </Link>
                  <button
                    onClick={() => handleDelete(sheikh._id)}
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

export default SheikhsPage;