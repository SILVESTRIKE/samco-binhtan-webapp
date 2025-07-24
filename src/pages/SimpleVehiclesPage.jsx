import React from 'react';

function VehiclesPage({ language }) {
  return (
    <div className="pt-16">
      <section className="py-20 bg-gradient-to-br from-blue-600 to-blue-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            {language === 'en' ? 'Our Electric Vehicle Lineup' : 'Dòng xe điện VinFast'}
          </h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            {language === 'en' 
              ? 'Discover the future of mobility with our comprehensive range of electric vehicles'
              : 'Khám phá tương lai của xe điện với dòng sản phẩm toàn diện của VinFast'
            }
          </p>
        </div>
      </section>
    </div>
  );
}

export default VehiclesPage;