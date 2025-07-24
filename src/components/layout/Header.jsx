import React, { useState } from 'react';
import { ChevronDown, Menu, X, Globe } from 'lucide-react';
import CategoryMegaMenu from './CategoryMegaMenu';
import { Link } from 'react-router-dom';

function Header({ language, setLanguage, currentPage, setCurrentPage }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [categoryMenuVisible, setCategoryMenuVisible] = useState(false);

  const menuItems = {
    en: {
      vehicles: 'Vehicles',
      charging: 'Charging',
      service: 'Service',
      about: 'About',
      contact: 'Contact',
      testDrive: 'Test Drive'
    },
    vi: {
      vehicles: 'Xe điện',
      charging: 'Trạm sạc',
      service: 'Dịch vụ',
      about: 'Về Samco',
      contact: 'Liên hệ',
      testDrive: 'Lái thử'
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
                className="flex items-center nav-link"
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

            {/* Language switch + Test drive */}
            <div className="hidden md:flex items-center space-x-4">
              <div className="relative group">
                <button className="flex items-center text-gray-700 hover:text-blue-600">
                  <Globe className="h-4 w-4 mr-1" />
                  {language.toUpperCase()}
                  <ChevronDown className="ml-1 h-3 w-3" />
                </button>
                <div className="absolute top-full right-0 mt-2 w-32 bg-white rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <div className="py-2">
                    <button onClick={() => setLanguage('en')} className="block px-4 py-2 text-sm hover:bg-gray-50 w-full text-left">English</button>
                    <button onClick={() => setLanguage('vi')} className="block px-4 py-2 text-sm hover:bg-gray-50 w-full text-left">Tiếng Việt</button>
                  </div>
                </div>
              </div>
              <button className="btn-primary">{menuItems[language].testDrive}</button>
            </div>

            {/* Mobile Hamburger */}
            <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100">
            <div className="px-4 py-4 space-y-2">
              <button onClick={() => { setCurrentPage('home'); setIsMenuOpen(false); }} className="block text-left w-full">Home</button>
              <button onClick={() => { setCategoryMenuVisible(true); setIsMenuOpen(false); }} className="block text-left w-full">{menuItems[language].vehicles}</button>
              <button onClick={() => { setCurrentPage('charging'); setIsMenuOpen(false); }} className="block text-left w-full">{menuItems[language].charging}</button>
              <button onClick={() => { setCurrentPage('service'); setIsMenuOpen(false); }} className="block text-left w-full">{menuItems[language].service}</button>
              <button onClick={() => { setCurrentPage('about'); setIsMenuOpen(false); }} className="block text-left w-full">{menuItems[language].about}</button>
              <button className="w-full text-left bg-blue-600 text-white px-3 py-2 rounded-md hover:bg-blue-700 transition-colors">
                {menuItems[language].testDrive}
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Mega Menu */}
      <CategoryMegaMenu visible={categoryMenuVisible} onClose={() => setCategoryMenuVisible(false)} />
    </>
  );
}

export default Header;
