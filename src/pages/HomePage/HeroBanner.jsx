import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const VinFastLimoGreen = () => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    // Giả lập nhiều hình ảnh của xe
    const carImages = [
        '/api/placeholder/800/400', // Hình chính
        '/api/placeholder/800/400', // Góc khác
        '/api/placeholder/800/400', // Nội thất
    ];

    const nextImage = () => {
        setCurrentImageIndex((prev) => (prev + 1) % carImages.length);
    };

    const prevImage = () => {
        setCurrentImageIndex((prev) => (prev - 1 + carImages.length) % carImages.length);
    };

    return (
        <div className="max-w-7xl mx-auto bg-white">
            {/* Header với tên xe */}
            <div className="text-center py-8 bg-gradient-to-r from-gray-50 to-white">
                <h1 className="text-6xl font-bold text-gray-300 opacity-60 tracking-widest">
                    LIMO GREEN
                </h1>
            </div>

            {/* Phần hình ảnh xe với navigation */}
            <div className="relative bg-gradient-to-b from-gray-50 to-white py-12">
                <div className="relative max-w-4xl mx-auto">
                    {/* Navigation buttons */}
                    <button
                        onClick={prevImage}
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg transition-all duration-200"
                    >
                        <ChevronLeft className="w-6 h-6 text-gray-600" />
                    </button>

                    <button
                        onClick={nextImage}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg transition-all duration-200"
                    >
                        <ChevronRight className="w-6 h-6 text-gray-600" />
                    </button>

                    {/* Hình ảnh xe */}
                    <div className="relative overflow-hidden rounded-lg">
                        <img
                            src={carImages[currentImageIndex]}
                            alt="VinFast Limo Green"
                            className="w-full h-auto object-cover transition-transform duration-300 hover:scale-105"
                        />
                        {/* Badge trên xe */}
                        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
                            <div className="bg-white px-4 py-2 rounded shadow-lg">
                                <span className="text-sm font-semibold text-gray-800">LIMO GREEN</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Thông số kỹ thuật */}
            <div className="bg-white py-8">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="flex flex-wrap justify-center md:justify-between items-center gap-8 text-center">
                        {/* Dòng xe */}
                        <div className="flex flex-col items-center space-y-1">
                            <h3 className="text-sm text-gray-500 font-medium">Dòng xe</h3>
                            <p className="text-lg font-bold text-gray-900">MPV</p>
                        </div>

                        {/* Số chỗ ngồi */}
                        <div className="flex flex-col items-center space-y-1">
                            <h3 className="text-sm text-gray-500 font-medium">Số chỗ ngồi</h3>
                            <p className="text-lg font-bold text-gray-900">7 chỗ</p>
                        </div>

                        {/* Quãng đường */}
                        <div className="flex flex-col items-center space-y-1">
                            <h3 className="text-sm text-gray-500 font-medium">Quãng đường lên tới</h3>
                            <p className="text-lg font-bold text-gray-900">450 km (NEDC)</p>
                        </div>

                        {/* Giá từ */}
                        <div className="flex flex-col items-center space-y-1">
                            <h3 className="text-sm text-gray-500 font-medium">Giá từ</h3>
                            <p className="text-lg font-bold text-red-600">749.000.000 VNĐ</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Buttons */}
            <div className="bg-white pb-12">
                <div className="max-w-4xl mx-auto px-6">
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200 transform hover:scale-105">
                            ĐẶT CỌC
                        </button>
                        <button className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50 font-semibold py-3 px-8 rounded-lg transition-all duration-200 transform hover:scale-105">
                            XEM CHI TIẾT
                        </button>
                    </div>
                </div>
            </div>

            {/* Floating contact button */}
            <div className="fixed bottom-6 right-6 z-20">
                <button className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition-all duration-200 transform hover:scale-110">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                    </svg>
                </button>
            </div>
        </div>
    );
};

export default VinFastLimoGreen;