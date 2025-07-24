// src/components/HeroContent.jsx

import React from 'react';
import { motion } from 'framer-motion';

function HeroContent({ 
  slide, 
  onExplore, 
  onTestDrive, 
  showButtons = true,
  buttonStyle = 'default',
  textAlignment = 'left',
  maxWidth = 'max-w-2xl'
}) {
  const alignmentClass = {
    left: 'text-left',
    center: 'text-center mx-auto',
    right: 'text-right ml-auto'
  };

  const buttonStyles = {
    default: {
      primary: 'bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-medium transition-all duration-300 transform hover:scale-105',
      secondary: 'border-2 border-white text-white hover:bg-white hover:text-gray-900 px-8 py-4 rounded-lg font-medium transition-all duration-300 transform hover:scale-105'
    },
    rounded: {
      primary: 'bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-full font-medium transition-all duration-300 transform hover:scale-105',
      secondary: 'border-2 border-white text-white hover:bg-white hover:text-gray-900 px-8 py-4 rounded-full font-medium transition-all duration-300 transform hover:scale-105'
    },
    minimal: {
      primary: 'bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white px-8 py-4 rounded-lg font-medium transition-all duration-300',
      secondary: 'border border-white/50 text-white hover:border-white hover:bg-white/10 px-8 py-4 rounded-lg font-medium transition-all duration-300'
    }
  };

  return (
    // Thêm motion.div để mỗi slide có animation riêng
    <motion.div 
        key={slide.title || slide.exploreText} // Dùng key để reset animation khi slide thay đổi
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -30 }}
        transition={{ duration: 0.7 }}
        className={`${maxWidth} ${alignmentClass[textAlignment]}`}
    >
      {/* Title (chỉ hiển thị nếu có) */}
      {slide.title && (
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6">
          {slide.title}
        </h1>
      )}
      
      {/* Subtitle (chỉ hiển thị nếu có) */}
      {slide.subtitle && (
        <p className="text-xl md:text-2xl lg:text-3xl text-gray-200 mb-4">
          {slide.subtitle}
        </p>
      )}
      
      {/* Description (chỉ hiển thị nếu có) */}
      {slide.description && (
        <p className="text-lg md:text-xl text-gray-300 mb-8 leading-relaxed">
          {slide.description}
        </p>
      )}

      {/* Additional Info (chỉ hiển thị nếu có) */}
      {slide.additionalInfo && (
        <div className="mb-8">
          {Array.isArray(slide.additionalInfo) ? (
            <div className="flex flex-wrap gap-6 text-sm md:text-base text-gray-300">
              {slide.additionalInfo.map((info, index) => (
                <div key={index} className="flex items-center gap-2">
                  {info.icon && <info.icon className="w-5 h-5 text-blue-400" />}
                  <span>{info.text}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-300">{slide.additionalInfo}</p>
          )}
        </div>
      )}
      
      {/* Action Buttons */}
      {showButtons && (
        // SỬA ĐỔI CHÍNH Ở ĐÂY: Thêm `justify-center`
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {slide.exploreText && onExplore && (
            <button 
              onClick={onExplore}
              className={buttonStyles[buttonStyle].primary}
            >
              {slide.exploreText}
            </button>
          )}
          
          {slide.testDriveText && onTestDrive && (
            <button 
              onClick={onTestDrive}
              className={buttonStyles[buttonStyle].secondary}
            >
              {slide.testDriveText}
            </button>
          )}
        </div>
      )}

      {/* Price or Special Offer (chỉ hiển thị nếu có) */}
      {slide.price && (
        <div className="mt-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 inline-block">
            <span className="text-2xl font-bold text-white">{slide.price}</span>
            {slide.originalPrice && (
              <span className="text-lg text-gray-300 line-through ml-2">{slide.originalPrice}</span>
            )}
          </div>
        </div>
      )}
    </motion.div>
  );
}

export default HeroContent;