// src/pages/CarDetailPage.jsx

import React, { useState, useEffect } from 'react';
import { getCarById } from '../../api/mockCarApi'; // Đường dẫn tới API giả

// Import các component con
import CarImageSlider from './components/CarImageSlider';
import QuickSpecs from './components/QuickSpecs';
import SpecificationTable from './components/SpecificationTable';
import ActionButtons from './components/ActionButtons';
import DisclaimerNotes from './components/DisclaimerNotes';

// Truyền carId vào đây. Trong một ứng dụng thực tế, bạn sẽ lấy nó từ URL (ví dụ: react-router-dom)
const CarDetailPage = ({ carId = 'herio-green' }) => {
    const [carData, setCarData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        setLoading(true);
        setError(null);

        getCarById(carId)
            .then(data => {
                setCarData(data);
            })
            .catch(err => {
                setError(err.message);
            })
            .finally(() => {
                setLoading(false);
            });

    }, [carId]); // Chạy lại hiệu ứng khi carId thay đổi

    if (loading) {
        return <div className="text-center py-20">Đang tải dữ liệu xe...</div>;
    }

    if (error) {
        return <div className="text-center py-20 text-red-600">Lỗi: {error}</div>;
    }

    if (!carData) {
        return null; // Hoặc hiển thị thông báo "Không tìm thấy xe"
    }

    // Khi đã có dữ liệu, render ra trang hoàn chỉnh
    return (
        <div className="max-w-7xl mx-auto bg-white">
            <CarImageSlider images={carData.images} />
            
            <div className="text-center py-6">
                <h1 className="text-3xl font-bold text-gray-800">{carData.name}</h1>
            </div>

            <QuickSpecs specs={carData.quickSpecs} />
            
            <SpecificationTable specifications={carData.fullSpecs} />

            <ActionButtons />

            <DisclaimerNotes notes={carData.disclaimers} />
        </div>
    );
};

export default CarDetailPage;