import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const isAuthenticated = !!localStorage.getItem("token");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-green-700 border-gray-200">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <button
          onClick={toggleMenu}
          type="button"
          className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-white rounded-lg md:hidden hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
          aria-controls="navbar-default"
          aria-expanded="false"
        >
          <span className="sr-only">Open main menu</span>
          <svg
            className="w-5 h-5"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 17 14"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M1 1h15M1 7h15M1 13h15"
            />
          </svg>
        </button>

        <Link to="/" className="flex items-center space-x-3 ltr:space-x-reverse">
          <span className="self-center text-2xl font-semibold whitespace-nowrap text-white">
            Quran App
          </span>
        </Link>

        <div
          className={`${
            isMenuOpen ? "block" : "hidden"
          } w-full md:block md:w-auto`}
          id="navbar-default"
        >
          <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-green-700 md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 md:bg-green-700">
            <li>
              <Link
                to="/"
                className="block py-2 px-3 text-white rounded hover:bg-green-600 md:hover:bg-transparent md:border-0 md:hover:text-green-300 md:p-0 ml-4"
              >
                الرئيسية
              </Link>
            </li>
            <li>
              <Link
                to="/sheikhs"
                className="block py-2 px-3 text-white rounded hover:bg-green-600 md:hover:bg-transparent md:border-0 md:hover:text-green-300 md:p-0"
              >
                القراء
              </Link>
            </li>
            <li>
              <Link
                to="/recordings"
                className="block py-2 px-3 text-white rounded hover:bg-green-600 md:hover:bg-transparent md:border-0 md:hover:text-green-300 md:p-0"
              >
                التسجيلات
              </Link>
            </li>
            {isAuthenticated && (
              <li>
                <Link
                  to="/admin"
                  className="block py-2 px-3 text-white rounded hover:bg-green-600 md:hover:bg-transparent md:border-0 md:hover:text-green-300 md:p-0"
                >
                  لوحة التحكم
                </Link>
              </li>
            )}
            {isAuthenticated ? (
              <li>
                <button
                  onClick={handleLogout}
                  className="block py-2 px-3 text-white rounded hover:bg-green-600 md:hover:bg-transparent md:border-0 md:hover:text-green-300 md:p-0"
                >
                  تسجيل الخروج
                </button>
              </li>
            ) : (
              <li>
                <Link
                  to="/login"
                  className="block py-2 px-3 text-white rounded hover:bg-green-600 md:hover:bg-transparent md:border-0 md:hover:text-green-300 md:p-0"
                >
                  تسجيل الدخول
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;