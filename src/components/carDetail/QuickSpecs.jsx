// src/components/carDetail/QuickSpecs.jsx
import React from 'react';

const QuickSpecs = ({ specs }) => (
    <div className="max-w-6xl mx-auto px-6 pb-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-8 text-center">
            {specs.map((spec, index) => (
                <div key={index} className="space-y-1">
                    <h3 className="text-sm text-gray-500 font-medium">{spec.label}</h3>
                    <p className="text-lg font-bold text-gray-900">{spec.value}</p>
                </div>
            ))}
        </div>
    </div>
);
export default QuickSpecs;