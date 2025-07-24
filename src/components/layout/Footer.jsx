import React from 'react';
import { Phone, Mail } from 'lucide-react';

function Footer({ language }) {
  const footerContent = {
    en: {
      vehicles: 'Vehicles',
      services: 'Services',
      company: 'Company',
      charging: 'Charging',
      serviceCenters: 'Service Centers',
      warranty: 'Warranty',
      support: 'Support',
      about: 'About VinFast',
      news: 'News',
      careers: 'Careers',
      investors: 'Investor Relations',
      privacy: 'Privacy Policy',
      terms: 'Terms of Service',
      legal: 'Legal',
      description: 'Leading the future of electric mobility with innovative, sustainable, and premium electric vehicles.',
      copyright: '© 2025 VinFast Auto Ltd. All rights reserved.'
    },
    vi: {
      vehicles: 'Xe điện',
      services: 'Dịch vụ',
      company: 'Công ty',
      charging: 'Trạm sạc',
      serviceCenters: 'Trung tâm dịch vụ',
      warranty: 'Bảo hành',
      support: 'Hỗ trợ',
      about: 'Về VinFast',
      news: 'Tin tức',
      careers: 'Tuyển dụng',
      investors: 'Quan hệ nhà đầu tư',
      privacy: 'Chính sách bảo mật',
      terms: 'Điều khoản sử dụng',
      legal: 'Pháp lý',
      description: 'Dẫn đầu tương lai của xe điện với các sản phẩm xe điện cao cấp, bền vững và đổi mới.',
      copyright: '© 2025 VinFast Auto Ltd. Tất cả quyền được bảo lưu.'
    }
  }

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="text-2xl font-bold text-blue-400 mb-6">VinFast</div>
            <p className="text-gray-400 mb-6">
              {footerContent[language].description}
            </p>
            <div className="flex space-x-4">
              <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors cursor-pointer">
                <Phone className="h-5 w-5" />
              </div>
              <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors cursor-pointer">
                <Mail className="h-5 w-5" />
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-6">{footerContent[language].vehicles}</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">VF 3</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">VF 6</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">VF 7</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">VF 8</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">VF 9</a></li>
              {language === 'vi' && <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Xe máy điện</a></li>}
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-6">{footerContent[language].services}</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">{footerContent[language].charging}</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">{footerContent[language].serviceCenters}</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">{footerContent[language].warranty}</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">{footerContent[language].support}</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-6">{footerContent[language].company}</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">{footerContent[language].about}</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">{footerContent[language].news}</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">{footerContent[language].careers}</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">{footerContent[language].investors}</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              {footerContent[language].copyright}
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">{footerContent[language].privacy}</a>
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">{footerContent[language].terms}</a>
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">{footerContent[language].legal}</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;