import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "../contexts/ThemeContext";
import Logo from "./Logo";

const Navbar = () => {
  const navigate = useNavigate();
  const { isDarkMode, toggleDarkMode } = useTheme();
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
    <nav className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 dark:from-emerald-800 dark:via-teal-800 dark:to-cyan-800 shadow-lg transition-all duration-300">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <button
          onClick={toggleMenu}
          type="button"
          className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-white rounded-xl md:hidden hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/30 transition-all duration-300"
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

        <Link to="/" className="group">
          <div className="transform group-hover:scale-105 transition-all duration-300">
            <Logo size="navbar" className="text-white group-hover:brightness-110" />
          </div>
        </Link>

        <div className="flex items-center space-x-4">
          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-xl bg-white/20 hover:bg-white/30 text-white transition-all duration-300 hidden md:block"
            title={isDarkMode ? "تبديل إلى الوضع النهاري" : "تبديل إلى الوضع الليلي"}
          >
            {isDarkMode ? (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd"/>
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"/>
              </svg>
            )}
          </button>

          <div
            className={`${
              isMenuOpen ? "block" : "hidden"
            } w-full md:block md:w-auto`}
            id="navbar-default"
          >
            <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border border-white/20 rounded-xl bg-white/10 backdrop-blur-sm md:flex-row md:space-x-6 rtl:space-x-reverse md:mt-0 md:border-0 md:bg-transparent">
              <li>
                <Link
                  to="/"
                  className="block py-2 px-4 text-white rounded-xl hover:bg-white/20 md:hover:bg-white/20 md:border-0 md:hover:text-amber-200 md:p-2 ml-2 transition-all duration-300 font-semibold"
                >
                  🏠 الرئيسية
                </Link>
              </li>
              <li>
                <Link
                  to="/sheikhs"
                  className="block py-2 px-4 text-white rounded-xl hover:bg-white/20 md:hover:bg-white/20 md:border-0 md:hover:text-amber-200 md:p-2 transition-all duration-300 font-semibold"
                >
                  👥 القراء
                </Link>
              </li>
              <li>
                <Link
                  to="/recordings"
                  className="block py-2 px-4 text-white rounded-xl hover:bg-white/20 md:hover:bg-white/20 md:border-0 md:hover:text-amber-200 md:p-2 transition-all duration-300 font-semibold"
                >
                  🎧 التسجيلات
                </Link>
              </li>
              {isAuthenticated && (
                <li>
                  <Link
                    to="/admin"
                    className="block py-2 px-4 text-white rounded-xl hover:bg-white/20 md:hover:bg-white/20 md:border-0 md:hover:text-amber-200 md:p-2 transition-all duration-300 font-semibold"
                  >
                    ⚙️ لوحة التحكم
                  </Link>
                </li>
              )}
              {isAuthenticated ? (
                <li>
                  <button
                    onClick={handleLogout}
                    className="block py-2 px-4 text-white rounded-xl hover:bg-red-500/20 md:hover:bg-red-500/20 md:border-0 md:hover:text-red-200 md:p-2 transition-all duration-300 font-semibold"
                  >
                    🚪 تسجيل الخروج
                  </button>
                </li>
              ) : (
                <li>
                  {/* <Link
                    to="/login"
                    className="block py-2 px-4 text-white rounded-xl hover:bg-white/20 md:hover:bg-white/20 md:border-0 md:hover:text-amber-200 md:p-2 transition-all duration-300 font-semibold"
                  >
                    🔑 تسجيل الدخول
                  </Link> */}
                </li>
              )}
              
              {/* Mobile Dark Mode Toggle */}
              <li className="md:hidden">
                <button
                  onClick={toggleDarkMode}
                  className="block py-2 px-4 text-white rounded-xl hover:bg-white/20 transition-all duration-300 font-semibold w-full text-right"
                >
                  {isDarkMode ? "☀️ الوضع النهاري" : "🌙 الوضع الليلي"}
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;