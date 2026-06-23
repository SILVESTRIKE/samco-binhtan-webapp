// src/components/layout/RootLayout.jsx

import React, { useState } from 'react';
import { Outlet } from 'react-router-dom'; // Outlet là nơi nội dung của các trang con sẽ được render
import Header from './Header';
import Footer from './Footer';

const RootLayout = () => {
    const [language, setLanguage] = useState('vi');

    // Chúng ta sẽ quản lý state điều hướng ở cấp cao hơn (App.jsx)
    // Hoặc để Link của router tự xử lý, nên không cần currentPage ở đây nữa.
    
    // Hàm này sẽ được truyền xuống để xử lý việc chọn xe từ MegaMenu
    const handleCarSelection = (carId) => {
        // Trong App.jsx, chúng ta sẽ xử lý việc điều hướng khi hàm này được gọi
        console.log("Layout received car selection:", carId);
    };

    return (
        <div className="min-h-screen bg-white flex flex-col">
            <Header 
                language={language} 
                setLanguage={setLanguage}
                // onCarSelect={handleCarSelection} // Ta sẽ xử lý điều hướng trực tiếp bằng Link
            />
            
            <main className="flex-grow">
                {/* Outlet sẽ render component tương ứng với route hiện tại */}
                <Outlet />
            </main>
            
            <Footer language={language} />
        </div>
    );
};

export default RootLayout;