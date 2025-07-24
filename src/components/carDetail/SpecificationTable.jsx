// src/components/carDetail/SpecificationTable.jsx
import React from 'react';

const SpecificationTable = ({ specifications }) => (
    <div className="max-w-6xl mx-auto px-6 pb-12">
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="p-4 bg-gray-50 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-800">Thông số kỹ thuật</h2>
            </div>
            {specifications.map((spec, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 border-b last:border-b-0">
                    <div className="p-4 border-r-0 lg:border-r border-gray-200">
                        <p className="text-sm font-semibold text-gray-800">{spec.category}</p>
                        <p className="text-sm text-gray-600">{spec.value}</p>
                    </div>
                    <div className="p-4 border-t border-r-0 lg:border-r lg:border-t-0 border-gray-200">
                        <p className="text-sm font-semibold text-gray-800">{spec.category2}</p>
                        <p className="text-sm text-gray-600">{spec.value2}</p>
                    </div>
                </div>
            ))}
        </div>
    </div>
);
export default SpecificationTable;