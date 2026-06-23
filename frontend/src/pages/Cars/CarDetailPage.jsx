// src/pages/CarDetailPage.jsx

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { request } from '../../api/apiClient';

// Import sub-components
import CarImageSlider from './components/CarImageSlider';
import QuickSpecs from './components/QuickSpecs';
import SpecificationTable from './components/SpecificationTable';
import ActionButtons from './components/ActionButtons';
import DisclaimerNotes from './components/DisclaimerNotes';

const CarDetailPage = () => {
    const { carId } = useParams(); // Get dynamic carId (slug) from route parameter
    const [carData, setCarData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!carId || carId === 'undefined') return;
        
        setLoading(true);
        setError(null);

        // Fetch vehicle details from the public backend endpoint
        request(`/api/products/slug/${carId}`)
            .then(response => {
                if (response && response.data) {
                    const rawProduct = response.data;
                    
                    // Format images
                    const mainImgUrl = rawProduct.main_image?.mediaURL;
                    const galleryUrls = (rawProduct.gallery_images || []).map(img => img.mediaURL);
                    const images = [mainImgUrl, ...galleryUrls].filter(Boolean);

                    // Fallback to placeholder if no images
                    if (images.length === 0) {
                        images.push('https://images.unsplash.com/photo-1563720223185-11003d516935?q=80&w=1200');
                    }

                    // Format quick specifications
                    const quickSpecs = (rawProduct.attributes || []).slice(0, 4).map(attr => ({
                        label: attr.name,
                        value: attr.value
                    }));

                    // Format side-by-side full specifications table
                    const fullSpecs = [];
                    const attrs = rawProduct.attributes || [];
                    for (let i = 0; i < attrs.length; i += 2) {
                        fullSpecs.push({
                            category: attrs[i].name,
                            value: attrs[i].value,
                            category2: attrs[i + 1] ? attrs[i + 1].name : '',
                            value2: attrs[i + 1] ? attrs[i + 1].value : ''
                        });
                    }

                    // Disclaimers fallback
                    const disclaimers = rawProduct.disclaimers || [
                        'Tính năng và trang bị có thể thay đổi theo từng phiên bản mà không cần báo trước. Vui lòng liên hệ Showroom/Đại lý để biết thêm chi tiết.',
                        'Quãng đường di chuyển thực tế có thể khác tùy thuộc vào điều kiện sử dụng thực tế.'
                    ];

                    setCarData({
                        id: rawProduct._id,
                        name: rawProduct.name,
                        images,
                        quickSpecs,
                        fullSpecs,
                        disclaimers
                    });
                } else {
                    setError('Không thể xử lý thông tin sản phẩm.');
                }
            })
            .catch(err => {
                setError(err.message || 'Lỗi kết nối máy chủ.');
            })
            .finally(() => {
                setLoading(false);
            });

    }, [carId]); // Re-run effect when carId parameter changes

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-32 space-y-4">
                <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-gray-500 text-sm">Đang tải dữ liệu xe...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-32 max-w-md mx-auto px-4">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-50 text-red-500 mb-4">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">Tải dữ liệu thất bại</h3>
                <p className="text-gray-500 text-sm mb-6">{error}</p>
            </div>
        );
    }

    if (!carData) {
        return (
            <div className="text-center py-32 text-gray-500">
                Không tìm thấy xe phù hợp.
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto bg-white pt-20">
            <CarImageSlider images={carData.images} />
            
            <div className="text-center py-8">
                <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">{carData.name}</h1>
                <div className="w-12 h-1 bg-blue-600 mx-auto mt-4 rounded-full"></div>
            </div>

            <QuickSpecs specs={carData.quickSpecs} />
            
            <SpecificationTable specifications={carData.fullSpecs} />

            <ActionButtons />

            <DisclaimerNotes notes={carData.disclaimers} />
        </div>
    );
};

export default CarDetailPage;