// src/components/carDetail/ActionButtons.jsx
import React from 'react';

const ActionButtons = () => (
    <div className="max-w-4xl mx-auto px-6 pb-12">
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50 font-semibold py-3 px-8 rounded transition-all">TƯ VẤN/ĐĂNG KÝ</button>
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded transition-colors">ĐẶT CỌC</button>
        </div>
    </div>
);
export default ActionButtons;

