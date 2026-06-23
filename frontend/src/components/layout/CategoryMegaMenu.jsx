import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { request } from '../../api/apiClient';

function CategoryMegaMenu({ visible, onClose }) {
  const [carData, setCarData] = useState({});
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch mega menu data dynamically from backend
  useEffect(() => {
    const fetchMegaMenu = async () => {
      try {
        const response = await request('/api/products/mega-menu');
        if (response) {
          setCarData(response);
          const keys = Object.keys(response);
          setCategories(keys);
          if (keys.length > 0) {
            setActiveCategory(keys[0]);
          }
        }
      } catch (err) {
        console.error('Failed to fetch mega menu products:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchMegaMenu();
  }, []);

  // Reset to first category when menu opens
  useEffect(() => {
    if (visible && categories.length > 0) {
      setActiveCategory(categories[0]);
    }
  }, [visible, categories]);

  return (
    <AnimatePresence>
      {visible && (
        <>
          {/* Backdrop blur click out */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 z-30"
          />

          {/* Mega Menu Content */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed top-16 left-0 w-full bg-white z-40 shadow-xl border-b border-gray-100"
          >
            {/* Desktop Dropdown Layout */}
            <div className="hidden md:block max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="py-6">
                {loading ? (
                  <div className="flex justify-center items-center py-12 space-x-3 text-gray-500">
                    <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-sm">Đang tải danh mục sản phẩm...</span>
                  </div>
                ) : categories.length === 0 ? (
                  <div className="text-center py-12 text-gray-500 text-sm">
                    Không tìm thấy danh mục sản phẩm nào.
                  </div>
                ) : (
                  <>
                    {/* Category tabs navigation row */}
                    <div className="flex justify-center items-center space-x-8 border-b pb-4 mb-4">
                      {categories.map((cat) => (
                        <button
                          key={cat}
                          onClick={() => setActiveCategory(cat)}
                          className={`px-3 py-1 transition-colors duration-200 font-semibold border-b-2 outline-none ${
                            activeCategory === cat
                              ? 'border-red-600 text-red-600'
                              : 'border-transparent text-gray-500 hover:text-blue-600'
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>

                    {/* Horizontal products row */}
                    <div className="flex items-start space-x-8 px-4 pb-4 overflow-x-auto whitespace-nowrap scrollbar-thin">
                      {carData[activeCategory]?.map((car, idx) => (
                        <Link 
                          to={`/vehicles/${car.id || ''}`} 
                          key={`${car.id || car.name || idx}-${idx}`} 
                          onClick={onClose}
                          className="flex-shrink-0 w-48 text-center group cursor-pointer"
                        >
                          <div className="bg-gray-50/50 hover:bg-gray-50 border border-gray-100 rounded-xl overflow-hidden h-32 flex items-center justify-center p-4 transition-colors">
                            <img
                              src={car.mediaURL || 'https://images.unsplash.com/photo-1563720223185-11003d516935?q=80&w=1200'}
                              alt={car.name}
                              className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                          <p className="mt-2 text-sm font-semibold text-gray-700 truncate group-hover:text-blue-600 transition-colors">
                            {car.name}
                          </p>
                        </Link>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Mobile Layout */}
            <div className="md:hidden h-[calc(100vh-4rem)] w-full p-4 overflow-y-auto relative bg-white">
              <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1.5 hover:bg-gray-100 rounded-full transition-colors">
                <X size={20} />
              </button>

              <h2 className="text-lg font-bold text-gray-800 mb-4 pt-2">Danh mục sản phẩm</h2>
              
              {loading ? (
                <div className="flex items-center space-x-2 text-gray-500 py-4">
                  <div className="w-4.5 h-4.5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-xs">Đang tải...</span>
                </div>
              ) : categories.length === 0 ? (
                <p className="text-xs text-gray-400 py-4">Không tìm thấy danh mục nào.</p>
              ) : (
                <div className="space-y-4">
                  {categories.map((cat) => (
                    <div key={cat} className="border-b border-gray-50 pb-2">
                      <button
                        onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
                        className={`font-semibold w-full text-left flex justify-between items-center text-sm py-1.5 transition-colors ${
                          activeCategory === cat ? 'text-red-600' : 'text-gray-700 hover:text-blue-600'
                        }`}
                      >
                        <span>{cat}</span>
                        <span>{activeCategory === cat ? '−' : '+'}</span>
                      </button>
                      
                      {activeCategory === cat && (
                        <div className="grid grid-cols-2 gap-3 mt-3">
                          {carData[cat]?.map((car, idx) => (
                            <Link 
                              to={`/vehicles/${car.id || ''}`}
                              key={`${car.id || car.name || idx}-${idx}`}
                              onClick={onClose}
                              className="text-center p-3 rounded-xl bg-gray-50/50 hover:bg-gray-50 border border-gray-100 block cursor-pointer group"
                            >
                              <img 
                                src={car.mediaURL || 'https://images.unsplash.com/photo-1563720223185-11003d516935?q=80&w=1200'} 
                                alt={car.name} 
                                className="h-16 mx-auto object-contain mb-2 group-hover:scale-105 transition-transform duration-300" 
                              />
                              <p className="text-xs font-semibold text-gray-700 truncate">{car.name}</p>
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default CategoryMegaMenu;