import React, { useState } from 'react';
import { ChevronDown, Menu, X, Globe, User, LogOut } from 'lucide-react';
import CategoryMegaMenu from './CategoryMegaMenu';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import LoginModal from '../../pages/Auth/LoginPage';

function Header({ language, setLanguage, currentPage, setCurrentPage }) {
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [categoryMenuVisible, setCategoryMenuVisible] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

  const menuItems = {
    en: {
      vehicles: 'Vehicles',
      charging: 'Charging',
      service: 'Service',
      about: 'About',
      contact: 'Contact',
      testDrive: 'Test Drive',
      login: 'Sign In',
      logout: 'Sign Out'
    },
    vi: {
      vehicles: 'Xe điện',
      charging: 'Trạm sạc',
      service: 'Dịch vụ',
      about: 'Về Samco',
      contact: 'Liên hệ',
      testDrive: 'Lái thử',
      login: 'Đăng nhập',
      logout: 'Đăng xuất'
    }
  };

  return (
    <>
      <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-md z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center cursor-pointer">
              <img
                src="https://samco.com.vn/vnt_upload/weblink/logo.png"
                alt="Samco Logo"
                className="w-20 h-auto object-contain"
              />
            </Link>

            {/* Desktop menu */}
            <div className="hidden md:flex items-center space-x-8">
              <button
                className="flex items-center nav-link cursor-pointer bg-transparent border-0 outline-none"
                onClick={() => setCategoryMenuVisible(true)}
              >
                {menuItems[language].vehicles}
                <ChevronDown className="ml-1 h-4 w-4" />
              </button>
              <Link to="/charging" className="nav-link">{menuItems[language].charging}</Link>
              <Link to="/service" className="nav-link">{menuItems[language].service}</Link>
              <Link to="/about" className="nav-link">{menuItems[language].about}</Link>
              <Link to="/contact" className="nav-link">{menuItems[language].contact}</Link>
            </div>

            {/* Language switch + Auth + Test drive */}
            <div className="hidden md:flex items-center space-x-6">
              {/* Language Selection */}
              <div className="relative group">
                <button className="flex items-center text-gray-700 hover:text-blue-600 transition-colors">
                  <Globe className="h-4 w-4 mr-1" />
                  {language.toUpperCase()}
                  <ChevronDown className="ml-1 h-3 w-3" />
                </button>
                <div className="absolute top-full right-0 mt-2 w-32 bg-white rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 border border-gray-100">
                  <div className="py-2">
                    <button onClick={() => setLanguage('en')} className="block px-4 py-2 text-sm hover:bg-gray-50 w-full text-left transition-colors">English</button>
                    <button onClick={() => setLanguage('vi')} className="block px-4 py-2 text-sm hover:bg-gray-50 w-full text-left transition-colors">Tiếng Việt</button>
                  </div>
                </div>
              </div>

              {/* User Authentication Menu */}
              {user ? (
                <div className="relative">
                  <button 
                    onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                    onBlur={() => setTimeout(() => setIsUserDropdownOpen(false), 200)}
                    className="flex items-center gap-1.5 text-gray-700 hover:text-blue-600 transition-colors font-medium text-sm"
                  >
                    <User size={18} className="text-gray-500" />
                    <span>{user.username}</span>
                    <ChevronDown size={14} />
                  </button>
                  
                  {isUserDropdownOpen && (
                    <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 animate-fade-in z-50">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-xs text-gray-400">Tài khoản</p>
                        <p className="text-sm font-semibold text-gray-700 truncate">{user.email}</p>
                        <span className="inline-block mt-1 px-2 py-0.5 text-[10px] font-bold bg-blue-50 text-blue-600 rounded">
                          {user.role === 'admin' ? 'Quản trị viên' : 'Thành viên'}
                        </span>
                      </div>
                      
                      <button 
                        onClick={logout}
                        className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 text-left transition-colors"
                      >
                        <LogOut size={16} />
                        <span>{menuItems[language].logout}</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button 
                  onClick={() => setIsLoginModalOpen(true)}
                  className="text-gray-700 hover:text-blue-600 transition-colors font-medium text-sm"
                >
                  {menuItems[language].login}
                </button>
              )}

              <button className="btn-primary">{menuItems[language].testDrive}</button>
            </div>

            {/* Mobile Hamburger */}
            <button className="md:hidden p-1.5 hover:bg-gray-100 rounded-lg transition-colors" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 animate-fade-in">
            <div className="px-4 py-4 space-y-3">
              <Link to="/" onClick={() => setIsMenuOpen(false)} className="block text-left w-full text-gray-700 font-medium py-1">Trang chủ</Link>
              <button onClick={() => { setCategoryMenuVisible(true); setIsMenuOpen(false); }} className="block text-left w-full text-gray-700 font-medium py-1">{menuItems[language].vehicles}</button>
              <Link to="/charging" onClick={() => setIsMenuOpen(false)} className="block text-left w-full text-gray-700 font-medium py-1">{menuItems[language].charging}</Link>
              <Link to="/service" onClick={() => setIsMenuOpen(false)} className="block text-left w-full text-gray-700 font-medium py-1">{menuItems[language].service}</Link>
              <Link to="/about" onClick={() => setIsMenuOpen(false)} className="block text-left w-full text-gray-700 font-medium py-1">{menuItems[language].about}</Link>
              <Link to="/contact" onClick={() => setIsMenuOpen(false)} className="block text-left w-full text-gray-700 font-medium py-1">{menuItems[language].contact}</Link>
              
              {user ? (
                <div className="border-t border-gray-100 pt-3 space-y-2">
                  <div className="flex items-center gap-2 px-1 text-gray-700">
                    <User size={18} className="text-gray-400" />
                    <div>
                      <p className="text-sm font-bold">{user.username}</p>
                      <p className="text-xs text-gray-400">{user.email}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => { logout(); setIsMenuOpen(false); }} 
                    className="flex items-center gap-2 w-full text-left px-2 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium"
                  >
                    <LogOut size={16} />
                    <span>{menuItems[language].logout}</span>
                  </button>
                </div>
              ) : (
                <button 
                  onClick={() => { setIsLoginModalOpen(true); setIsMenuOpen(false); }} 
                  className="flex items-center gap-2 w-full text-left px-2 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors font-medium border-t border-gray-100 pt-3"
                >
                  <User size={16} className="text-gray-400" />
                  <span>{menuItems[language].login}</span>
                </button>
              )}

              <button className="w-full text-center bg-blue-600 text-white px-3 py-2.5 rounded-xl hover:bg-blue-700 transition-colors font-medium shadow-md shadow-blue-500/10">
                {menuItems[language].testDrive}
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Mega Menu */}
      <CategoryMegaMenu visible={categoryMenuVisible} onClose={() => setCategoryMenuVisible(false)} />

      {/* Login Modal */}
      {isLoginModalOpen && (
        <LoginModal onClose={() => setIsLoginModalOpen(false)} />
      )}
    </>
  );
}

export default Header;
