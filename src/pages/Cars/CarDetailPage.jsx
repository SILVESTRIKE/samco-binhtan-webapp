import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const VinFastHerioGreen = () => {
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

    // Dữ liệu thông số kỹ thuật
    const specifications = [
        {
            category: "Kích thước tổng thể (mm)",
            value: "3967 x 1723 x 1579",
            category2: "Chiều dài cơ sở",
            value2: "2514 mm"
        },
        {
            category: "Khoảng sáng gầm xe",
            value: "160 mm",
            category2: "Công suất tối đa",
            value2: "100 kW"
        },
        {
            category: "Mô men xoắn cực đại",
            value: "135 Nm",
            category2: "Quãng đường hoạt động",
            value2: "Tùy chọn"
        },
        {
            category: "Hệ thống phanh trước",
            value: "Đĩa thông (10%-70%)",
            category2: "Dung lượng pin khả dụng",
            value2: "37.23 kWh"
        },
        {
            category: "Hệ thống phanh sau",
            value: "Đĩa/Đĩa",
            category2: "Loại pin",
            value2: "LiFePO4"
        },
        {
            category: "Hệ thống treo trước",
            value: "FWD/Cầu trước",
            category2: "Sạc pin",
            value2: "8 socket"
        },
        {
            category: "Hệ thống phanh handbrake",
            value: "Đĩa/Đĩa",
            category2: "Kiểu thùng xe phong cách",
            value2: "Bi-halogen, projector"
        },
        {
            category: "Hệ thống đèn led",
            value: "16 inch",
            category2: "Hệ thống lái",
            value2: "Chỉnh cơ"
        },
        {
            category: "Hệ thống đèn phụ trước và sau của",
            value: "Chính cơ",
            category2: "Cửa kính",
            value2: "Chỉnh cơ 6 hướng"
        },
        {
            category: "",
            value: "8 inch",
            category2: "Số túi khí",
            value2: "2 túi"
        }
    ];

    return (
        <div className="max-w-7xl mx-auto bg-white">
            {/* Phần hình ảnh xe với navigation */}
            <div className="relative bg-gray-50 py-8">
                <div className="relative max-w-4xl mx-auto">
                    {/* Navigation buttons */}
                    <button
                        onClick={prevImage}
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 bg-gray-300 hover:bg-gray-400 rounded-full p-3 transition-all duration-200"
                    >
                        <ChevronLeft className="w-6 h-6 text-gray-600" />
                    </button>

                    <button
                        onClick={nextImage}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 bg-gray-300 hover:bg-gray-400 rounded-full p-3 transition-all duration-200"
                    >
                        <ChevronRight className="w-6 h-6 text-gray-600" />
                    </button>

                    {/* Hình ảnh xe */}
                    <div className="px-16">
                        <img
                            src={carImages[currentImageIndex]}
                            alt="VinFast Herio Green"
                            className="w-full h-auto object-cover"
                        />
                    </div>
                </div>
            </div>

            {/* Tên xe */}
            <div className="text-center py-6">
                <h1 className="text-3xl font-bold text-gray-800">
                    HERIO GREEN
                </h1>
            </div>

            {/* Thông số nhanh 4 cột */}
            <div className="max-w-6xl mx-auto px-6 pb-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                    <div className="space-y-2">
                        <h3 className="text-sm text-gray-500 font-medium">Kích thước tổng thể (mm)</h3>
                        <p className="text-lg font-bold text-gray-900">3967 x 1723 x 1579</p>
                    </div>
                    <div className="space-y-2">
                        <h3 className="text-sm text-gray-500 font-medium">Chiều dài cơ sở</h3>
                        <p className="text-lg font-bold text-gray-900">2514 mm</p>
                    </div>
                    <div className="space-y-2">
                        <h3 className="text-sm text-gray-500 font-medium">Khoảng sáng gầm xe</h3>
                        <p className="text-lg font-bold text-gray-900">160 mm</p>
                    </div>
                    <div className="space-y-2">
                        <h3 className="text-sm text-gray-500 font-medium">Công suất tối đa</h3>
                        <p className="text-lg font-bold text-gray-900">100 kW</p>
                    </div>
                </div>
            </div>

            {/* Bảng thông số kỹ thuật */}
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                {specifications.map((spec, index) => (
                    <div
                        key={index}
                        className="grid grid-cols-2 md:grid-cols-4 border-b border-gray-200 last:border-b-0"
                    >
                        <div className="p-4 border-r border-gray-200">
                            <span className="text-xs font-medium text-gray-500 uppercase">{spec.category}</span>
                            <p className="text-sm font-semibold text-gray-900">{spec.value}</p>
                        </div>
                        <div className="p-4 border-r border-gray-200">
                            <span className="text-xs font-medium text-gray-500 uppercase">{spec.category2}</span>
                            <p className="text-sm font-semibold text-gray-900">{spec.value2}</p>
                        </div>
                    </div>
                ))}
            </div>


            {/* Buttons */}
            <div className="max-w-4xl mx-auto px-6 pb-12">
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50 font-semibold py-3 px-8 rounded transition-all duration-200">
                        TƯ VẤN/ĐĂNG KÝ
                    </button>
                    <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded transition-colors duration-200">
                        ĐẶT CỌC
                    </button>
                </div>
            </div>

            {/* Ghi chú */}
            <div className="max-w-6xl mx-auto px-6 pb-8">
                <div className="bg-gray-50 p-6 rounded-lg">
                    <p className="text-sm text-gray-600 font-semibold mb-3">(*) Lưu ý:</p>
                    <ul className="space-y-2 text-sm text-gray-600">
                        <li>• Tính năng và trang bị có thể thay đổi theo từng phiên bản mà không cần báo trước. Vui lòng liên hệ Showroom/Đại lý để biết thêm chi tiết.</li>
                        <li>• Quãng đường di chuyển được đo theo tiêu chuẩn của châu Âu (NEDC). Quãng đường di chuyển thực tế có thể khác so với tiêu chuẩn NEDC tùy thuộc vào điều kiện sử dụng thực tế như: lối lái xe của người sử dụng, điều kiện thời tiết, tình trạng xe, cấu hình đường, tốc độ di chuyển, nhiệt độ môi trường, áp suất lốp, tải trọng xe, sử dụng điều hòa, v.v.</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default VinFastHerioGreen;