import React from 'react';

function AboutPage({ language }) {
  return (
    <div className="pt-16">
      <section className="py-20 bg-gradient-to-br from-gray-800 to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            {language === 'en' ? 'About VinFast' : 'Về VinFast'}
          </h1>
        </div>
      </section>
    </div>
  );
}

export default AboutPage;