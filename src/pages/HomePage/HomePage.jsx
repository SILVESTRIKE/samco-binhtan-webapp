import React, { useState, useEffect } from 'react';
import { Shield, Battery, Zap, Users } from 'lucide-react';

function HomePage({ language }) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const content = {
    en: {
      hero: {
        title: "VF 8 Plus",
        subtitle: "Premium Electric Performance",
        description: "Experience the future of electric mobility with cutting-edge technology",
        explore: "Explore Vehicle",
        testDrive: "Book Test Drive"
      },
      family: {
        title: "Explore the VinFast Family",
        subtitle: "VinFast's design language blends sporty curves, luxurious strokes, and formidable presence.",
        quality: "The perfect blend of premium quality & comfort",
        description: "VinFast's EVs are equipped with human-centered tech that seamlessly improves the driving experience by focusing on you."
      },
      experience: {
        title: "VinFast's Experience",
        description: "VinFast, the innovative new electric car company, prioritizes premium craftsmanship and high-quality parts in crafting its EVs.",
        warranty: "10 Year / 125,000 mile warranty",
        charging: "95% EV Charging Station Coverage",
        service: "Outstanding Service"
      },
      newsletter: {
        title: "Join the Charge",
        description: "Sign up here to find out more about the exceptional features crafted into every VinFast and our mission to drive the world to switch to electric vehicles."
      }
    },
    vi: {
      hero: {
        title: "VF 8 Plus",
        subtitle: "Hiệu suất điện cao cấp",
        description: "Trải nghiệm tương lai của xe điện với công nghệ tiên tiến",
        explore: "Khám phá xe",
        testDrive: "Đăng ký lái thử"
      },
      family: {
        title: "Khám phá gia đình VinFast",
        subtitle: "Ngôn ngữ thiết kế của VinFast pha trộn đường cong thể thao, nét sang trọng và sự hiện diện uy lực.",
        quality: "Sự pha trộn hoàn hảo giữa chất lượng cao cấp và sự thoải mái",
        description: "Xe điện VinFast được trang bị công nghệ lấy con người làm trung tâm, cải thiện liền mạch trải nghiệm lái xe."
      },
      experience: {
        title: "Trải nghiệm VinFast",
        description: "VinFast, công ty xe điện tiên phong, ưu tiên tay nghề cao cấp và linh kiện chất lượng cao trong việc chế tạo xe điện.",
        warranty: "Bảo hành 10 năm / 200.000 km",
        charging: "Bao phủ 95% trạm sạc xe điện",
        service: "Dịch vụ xuất sắc"
      },
      newsletter: {
        title: "Tham gia cuộc cách mạng",
        description: "Đăng ký tại đây để tìm hiểu thêm về các tính năng đặc biệt được tích hợp vào mỗi chiếc VinFast và sứ mệnh thúc đẩy thế giới chuyển sang xe điện."
      }
    }
  }

  const heroSlides = [
    {
      title: content[language].hero.title,
      subtitle: content[language].hero.subtitle,
      image: "https://images.unsplash.com/photo-1617788138017-80ad40651399?w=1200&h=800&fit=crop",
      description: content[language].hero.description
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-screen overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroSlides[currentSlide].image}
            alt={heroSlides[currentSlide].title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 hero-overlay"></div>
        </div>

        <div className="relative z-10 h-full flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl">
              <h1 className="text-responsive-xl font-bold text-white mb-6 animate-fade-in-up">
                {heroSlides[currentSlide].title}
              </h1>
              <p className="text-xl md:text-2xl text-gray-200 mb-4 animate-fade-in-up animate-delay-200">
                {heroSlides[currentSlide].subtitle}
              </p>
              <p className="text-lg text-gray-300 mb-8 animate-fade-in-up animate-delay-300">
                {heroSlides[currentSlide].description}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="btn-primary">
                  {content[language].hero.explore}
                </button>
                <button className="btn-outline">
                  {content[language].hero.testDrive}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Brand Promise Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              {content[language].family.title}
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              {content[language].family.subtitle}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <img
                src="https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=600&h=400&fit=crop"
                alt="VinFast Interior"
                className="rounded-2xl shadow-2xl"
              />
            </div>
            <div>
              <h3 className="text-3xl font-bold text-gray-900 mb-6">
                {content[language].family.quality}
              </h3>
              <p className="text-lg text-gray-600 mb-8">
                {content[language].family.description}
              </p>
              <div className="space-y-4">
                <div className="flex items-center">
                  <Shield className="h-6 w-6 text-blue-600 mr-3" />
                  <span className="text-lg font-semibold">{language === 'en' ? 'Advanced Safety Features' : 'Tính năng an toàn tiên tiến'}</span>
                </div>
                <div className="flex items-center">
                  <Battery className="h-6 w-6 text-blue-600 mr-3" />
                  <span className="text-lg font-semibold">{language === 'en' ? 'Long-Range Battery Technology' : 'Công nghệ pin tầm xa'}</span>
                </div>
                <div className="flex items-center">
                  <Zap className="h-6 w-6 text-blue-600 mr-3" />
                  <span className="text-lg font-semibold">{language === 'en' ? 'Fast Charging Capability' : 'Khả năng sạc nhanh'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              {content[language].experience.title}
            </h2>
            <p className="text-xl text-gray-300 max-w-4xl mx-auto">
              {content[language].experience.description}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="h-10 w-10" />
              </div>
              <h3 className="text-2xl font-bold mb-4">{content[language].experience.warranty}</h3>
              <p className="text-gray-300">
                {language === 'en' ? 'Industry-leading warranty coverage for peace of mind' : 'Bảo hành dẫn đầu ngành cho sự an tâm'}
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Zap className="h-10 w-10" />
              </div>
              <h3 className="text-2xl font-bold mb-4">{content[language].experience.charging}</h3>
              <p className="text-gray-300">
                {language === 'en' ? 'Extensive charging network coverage' : 'Mạng lưới trạm sạc bao phủ rộng khắp'}
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="h-10 w-10" />
              </div>
              <h3 className="text-2xl font-bold mb-4">{content[language].experience.service}</h3>
              <p className="text-gray-300">
                {language === 'en' ? 'Premium customer service and support' : 'Dịch vụ khách hàng và hỗ trợ cao cấp'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            {content[language].newsletter.title}
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            {content[language].newsletter.description}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder={language === 'en' ? 'Enter your email' : 'Nhập email của bạn'}
              className="form-input text-gray-900"
            />
            <button className="btn-secondary bg-white text-vinfast-blue-600 hover:bg-gray-100">
              {language === 'en' ? 'Subscribe' : 'Đăng ký'}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;