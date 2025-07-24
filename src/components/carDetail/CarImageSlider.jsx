// src/components/carDetail/CarImageSlider.jsx
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const CarImageSlider = ({ images }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const nextImage = () => setCurrentIndex((prev) => (prev + 1) % images.length);
    const prevImage = () => setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);

    return (
        <div className="relative bg-gray-50 py-8">
            <div className="relative max-w-4xl mx-auto">
                <button onClick={prevImage} className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/50 hover:bg-white/80 backdrop-blur-sm rounded-full p-3 transition-all">
                    <ChevronLeft className="w-6 h-6 text-gray-800" />
                </button>
                <button onClick={nextImage} className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/50 hover:bg-white/80 backdrop-blur-sm rounded-full p-3 transition-all">
                    <ChevronRight className="w-6 h-6 text-gray-800" />
                </button>
                <div className="px-16">
                    <img src={images[currentIndex]} alt="Car" className="w-full h-auto object-contain max-h-[450px]" />
                </div>
            </div>
        </div>
    );
};
export default CarImageSlider;