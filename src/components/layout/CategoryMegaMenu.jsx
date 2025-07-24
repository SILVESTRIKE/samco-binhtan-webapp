import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

// Dữ liệu xe (giữ nguyên)
const carData = {
  "Xe khách - Xe buýt": [
    { name: "SAMCO GROWIN LI.29/34", image: "https://samco.com.vn/vnt_upload/product/xe_khach_xe_bus/growin/thumbs/(570x380)_crop_web_Growin.png" },
    { name: "SAMCO ALLERGO SI 29", image: "https://samco.com.vn/vnt_upload/product/xe_khach_xe_bus/thumbs/(570x380)_crop_samco-allergo-2024.jpg" },
    { name: "SAMCO WENDA SD.47", image: "https://samco.com.vn/vnt_upload/product/xe_khach_xe_bus/thumbs/(570x380)_crop_samco_wenda_ksd5.png" },
    { name: "SAMCO NEW FELIX CI", image: "https://samco.com.vn/vnt_upload/product/xe_khach_xe_bus/thumbs/(570x380)_crop_samco-felix-2024.jpg" },
    { name: "SAMCO CITY I.40 DIESEL", image: "https://samco.com.vn/vnt_upload/product/xe_khach_xe_bus/thumbs/(570x380)_crop_product-05.png" },
    { name: "SAMCO CITY I.51 DIESEL", image: "https://samco.com.vn/vnt_upload/product/xe_khach_xe_bus/thumbs/(570x380)_crop_product-05.png" },
    { name: "SAMCO CITY D.60", image: "https://samco.com.vn/vnt_upload/product/xe_khach_xe_bus/D60/thumbs/(570x380)_crop_IMG_8761.jpg" },
  ],
  "Xe chuyên dụng": [
    { name: "Xe ben", image: "https://samco.com.vn/vnt_upload/product/isuzu/xe-ben-samco-isuzu-nqr-5-tan_2.png" },
    { name: "Xe cứu hộ", image: "https://samco.com.vn/vnt_upload/product/cuu-ho-giao-thong/fvr/SAMCO-FVR-1.png" },
  ],
  "Xe du lịch": [
    { name: "SAMCO FELIX Limousine", image: "https://samco.com.vn/vnt_upload/product/limousine/felix/SAMCO-FELIX-LIMOUSINE-1.png" },
  ],
  "Xe tải": [
    { name: "ISUZU N-Series", image: "https://samco.com.vn/vnt_upload/product/isuzu/xe-tai-isuzu-n-series-thung-mui-bat-1.png" },
    { name: "ISUZU F-Series", image: "https://samco.com.vn/vnt_upload/product/isuzu/SAMCO-ISUZU-FRR-MUI-BAT.png" },
  ],
  "Cần cẩu": [
    { name: "Cần cẩu UNIC", image: "https://samco.com.vn/vnt_upload/product/can-cau-unic/urv-340/3_tan/Can-cau-UNIC-URV-343-3-tan-3-khuc.png" },
    { name: "Cần cẩu FASSI", image: "https://samco.com.vn/vnt_upload/product/can-cau-fassi/fassi-f110b/Can-cau-FASSI-F110B.2.22-e-active-5.png" },
  ],
  "Dịch vụ cho thuê": [
    { name: "Cho thuê xe", image: "https://samco.com.vn/vnt_upload/product/dich-vu-cho-thue/CHO-THUE-XE-1.png" },
  ],
};


const categories = Object.keys(carData);

function CategoryMegaMenu({ visible, onClose }) {
  const [activeCategory, setActiveCategory] = useState(categories[0]);

  // Reset về category đầu tiên khi mở menu
  React.useEffect(() => {
    if (visible) {
      setActiveCategory(categories[0]);
    }
  }, [visible]);

  return (
    <AnimatePresence>
      {visible && (
        <>
          {/* Lớp nền mờ để click ra ngoài và đóng menu */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 z-30"
          />

          {/* Nội dung Mega Menu */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed top-16 left-0 w-full bg-white z-40 shadow-xl"
          >
            {/* Desktop Dropdown Layout */}
            <div className="hidden md:block max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="py-5">
                {/* Hàng Danh mục (nằm ngang) */}
                <div className="flex justify-center items-center space-x-8 border-b pb-4 mb-4">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      className={`px-3 py-1 transition-colors duration-200 ${
                        activeCategory === cat
                          ? 'font-bold text-red-600'
                          : 'font-medium text-gray-600 hover:text-blue-600'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                {/* Hàng Sản phẩm (cuộn ngang) */}
                <div className="flex items-start space-x-8 px-4 pb-4 overflow-x-auto whitespace-nowrap">
                  {carData[activeCategory]?.map((car) => (
                    <div key={car.name} className="flex-shrink-0 w-48 text-center group cursor-pointer">
                       <div className="bg-gray-100 rounded-lg overflow-hidden h-32 flex items-center justify-center">
                        <img
                          src={car.image}
                          alt={car.name}
                          className="h-full w-full object-contain group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <p className="mt-2 text-sm font-semibold text-gray-800">{car.name}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Mobile Layout (giữ nguyên) */}
            <div className="md:hidden h-[calc(100vh-4rem)] w-full p-4 overflow-y-auto relative bg-white">
              <button onClick={onClose} className="absolute top-4 right-4 text-gray-600">
                <X size={24} />
              </button>

              <h2 className="text-xl font-bold mb-4">Danh mục sản phẩm</h2>
              <div className="space-y-4">
                {categories.map((cat) => (
                  <div key={cat}>
                    <button
                      onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
                      className="font-semibold w-full text-left flex justify-between items-center text-gray-800"
                    >
                      {cat}
                    </button>
                    {activeCategory === cat && (
                      <div className="grid grid-cols-2 gap-4 mt-3">
                        {carData[cat].map((car) => (
                          <div key={car.name} className="text-center p-2 rounded-lg bg-gray-50">
                            <img src={car.image} alt={car.name} className="h-20 mx-auto object-contain mb-2" />
                            <p className="text-xs font-medium">{car.name}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default CategoryMegaMenu;