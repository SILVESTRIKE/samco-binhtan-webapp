import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Battery, Zap, Users, Wrench, Car } from 'lucide-react';
import { request } from '../../api/apiClient';
import HeroBanner from './components/HeroBanner';
import HeroContent from './components/HeroContent';
import FamilySection from './components/FamilySection';
import NewsArticles from './components/NewsArticles';
import Newsletter from './components/Newsletter';

function HomePage({ language = 'vi' }) {
  const navigate = useNavigate();
  const [slider1Data, setSlider1Data] = useState([]);
  const [newsList, setNewsList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Static translations
  const content = {
    en: {
      hero: {
        explore: "Explore Vehicle",
        testDrive: "Book Test Drive"
      },
      family1: {
        title: "Explore the Samco Family",
        subtitle: "Samco's design language blends powerful lines, luxurious strokes, and a formidable presence.",
        quality: "The perfect blend of premium quality & comfort",
        description: "Samco vehicles are equipped with human-centered technology that seamlessly improves the experience by focusing on you.",
        features: [
          { text: 'Advanced Safety Features', icon: Shield },
          { text: 'Superior Durability', icon: Battery },
          { text: 'Powerful Performance', icon: Zap }
        ]
      },
      family2: {
        title: "Uncompromising Service",
        subtitle: "Dedicated to providing the best ownership experience.",
        quality: "Professional, Fast, and Reliable",
        description: "Our service centers are equipped with modern technology and staffed by certified technicians to keep your vehicle in top condition.",
        features: [
          { text: 'Genuine Parts', icon: Wrench },
          { text: 'Expert Technicians', icon: Users },
          { text: 'Nationwide Network', icon: Car }
        ]
      },
      news: {
        title: "Latest Samco News",
        subtitle: "Stay updated with the latest developments and innovations from Samco"
      },
      newsletter: {
        title: "Join Our Community",
        description: "Sign up here to find out more about the exceptional features crafted into every Samco and our mission for a better future.",
        placeholder: "Enter your email",
        button: "Subscribe"
      }
    },
    vi: {
      hero: {
        explore: "Khám phá xe",
        testDrive: "Đăng ký lái thử"
      },
      family1: {
        title: "Khám phá gia đình Samco",
        subtitle: "Ngôn ngữ thiết kế của Samco pha trộn đường nét mạnh mẽ, nét sang trọng và sự hiện diện uy lực.",
        quality: "Sự pha trộn hoàn hảo giữa chất lượng cao cấp và sự thoải mái",
        description: "Xe Samco được trang bị công nghệ lấy con người làm trung tâm, cải thiện liền mạch trải nghiệm bằng cách tập trung vào bạn.",
        features: [
          { text: 'Tính năng an toàn tiên tiến', icon: Shield },
          { text: 'Độ bền vượt trội', icon: Battery },
          { text: 'Hiệu suất mạnh mẽ', icon: Zap }
        ]
      },
      family2: {
        title: "Dịch vụ không giới hạn",
        subtitle: "Tận tâm mang lại trải nghiệm sở hữu tốt nhất.",
        quality: "Chuyên nghiệp, Nhanh chóng và Tin cậy",
        description: "Trung tâm dịch vụ của chúng tôi được trang bị công nghệ hiện đại và đội ngũ kỹ thuật viên được chứng nhận để giữ cho chiếc xe của bạn luôn ở trạng thái tốt nhất.",
        features: [
          { text: 'Phụ tùng chính hãng', icon: Wrench },
          { text: 'Kỹ thuật viên chuyên nghiệp', icon: Users },
          { text: 'Mạng lưới toàn quốc', icon: Car }
        ]
      },
      news: {
        title: "Tin tức Samco mới nhất",
        subtitle: "Cập nhật những phát triển và đổi mới mới nhất từ Samco"
      },
      newsletter: {
        title: "Tham gia cuộc cách mạng",
        description: "Đăng ký tại đây để tìm hiểu thêm về các tính năng đặc biệt được tích hợp vào mỗi chiếc VinFast và sứ mệnh thúc đẩy thế giới chuyển sang xe điện.",
        placeholder: "Nhập email của bạn",
        button: "Đăng ký"
      }
    }
  };

  // Default hardcoded slider datasets as clean fallback references
  const defaultSlider1 = [
    { title: "SAMCO GROWIN 2024", subtitle: "Sang trọng trên mọi hành trình", image: "https://samco.com.vn/vnt_upload/weblink/Banner_Trang_chu/5_xe_SAMCO-01.png", exploreText: "Chi tiết", testDriveText: "Lái thử", slug: "herio-green" },
    { title: "SAMCO ALLERGO MỚI", subtitle: "Mạnh mẽ, bền bỉ và hiệu quả", image: "https://samco.com.vn/vnt_upload/news/2025/DaihoiDang20252030/thumbs/770_crop__10.jpg", exploreText: "Chi tiết", testDriveText: "Lái thử", slug: "samco-allergo" }
  ];

  const slider2_Data = [
    { title: "Ưu đãi dịch vụ Hè 2025", subtitle: "Bảo dưỡng toàn diện, sẵn sàng cho mọi chuyến đi.", image: "https://xekhach-bacviet.vn/wp-content/uploads/2024/11/hyundai-solti-dl-e5-mau-den-6.jpg", exploreText: "Xem chi tiết", testDriveText: "Đặt lịch" },
    { title: "Phụ tùng chính hãng", subtitle: "Đảm bảo hiệu suất và an toàn tối đa.", image: "https://samco.com.vn/vnt_upload/product/03_2017/thumbs/(600x400)_crop_prod6.jpg", exploreText: "Tìm hiểu", testDriveText: "Tư vấn" },
  ];

  const slider3_Data = [
    { image: "https://xekhach-bacviet.vn/wp-content/uploads/2024/09/3-1.jpg", exploreText: "Các dòng xe tải", testDriveText: "Báo giá" },
    { image: "https://samco.com.vn/vnt_upload/product/Quan_Ly_danh_muc/xe_chuyen_dung/thumbs/(570x380)_crop_xe_san_khau_1.jpg", exploreText: "Xe chuyên dụng", testDriveText: "Tìm đại lý" }
  ];

  const defaultNews = [
    {
      title: "VinFast mở rộng mạng lưới showroom toàn quốc",
      summary: "Công ty tiếp tục đầu tư mở rộng hệ thống showroom và trung tâm dịch vụ để phục vụ khách hàng tốt hơn.",
      image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600&h=400&fit=crop",
      category: "Kinh doanh",
      date: "24/07/2025",
      author: "VinFast News",
      readTime: "3 phút đọc",
      link: "#"
    },
    {
      title: "Công nghệ pin mới cho phạm vi hoạt động lớn hơn",
      summary: "VinFast công bố công nghệ pin thế hệ mới với khả năng tăng phạm vi hoạt động lên đến 500km.",
      image: "https://static.automotor.vn/w640/images/upload/2024/11/05/pin-the-ran-xe-dien-vneconomyautomotive.jpeg",
      category: "Công nghệ",
      date: "23/07/2025",
      author: "Tech Team",
      readTime: "5 phút đọc",
      link: "#"
    }
  ];

  useEffect(() => {
    const fetchHomepageData = async () => {
      try {
        // 1. Fetch sliders from backend API
        const slidersResponse = await request('/api/products/homepage-sliders');
        if (slidersResponse && slidersResponse.carSliderItems) {
          const mappedSliders = slidersResponse.carSliderItems.map(item => {
            // Find slug from detailUrl (format is /products/:slug)
            const slug = item.detailUrl ? item.detailUrl.split('/').pop() : 'herio-green';
            return {
              title: item.name,
              subtitle: item.priceDisplay,
              image: item.productImageUrl || 'https://samco.com.vn/vnt_upload/weblink/Banner_Trang_chu/5_xe_SAMCO-01.png',
              exploreText: language === 'vi' ? 'Chi tiết' : 'Explore',
              testDriveText: language === 'vi' ? 'Lái thử' : 'Test Drive',
              slug
            };
          });
          setSlider1Data(mappedSliders.length > 0 ? mappedSliders : defaultSlider1);
        } else {
          setSlider1Data(defaultSlider1);
        }
      } catch (err) {
        console.error('Error fetching homepage sliders, loading fallbacks:', err);
        setSlider1Data(defaultSlider1);
      }

      try {
        // 2. Fetch news cards from backend API
        const newsResponse = await request('/api/intro-cards');
        if (newsResponse && newsResponse.data) {
          const mappedNews = newsResponse.data.map(item => ({
            title: item.title,
            summary: item.description || 'Thông số chi tiết và ưu đãi đặc biệt trong tháng dành cho dòng sản phẩm mới tại Showroom SAMCO.',
            image: item.image?.mediaURL || 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600&h=400&fit=crop',
            category: item.tags?.[0] || 'Tin tức',
            date: new Date(item.createdAt || Date.now()).toLocaleDateString('vi-VN'),
            author: 'SAMCO Binh Tan',
            readTime: '3 phút đọc',
            link: item.articleURL || '#'
          }));
          setNewsList(mappedNews.length > 0 ? mappedNews : defaultNews);
        } else {
          setNewsList(defaultNews);
        }
      } catch (err) {
        console.error('Error fetching homepage news, loading fallbacks:', err);
        setNewsList(defaultNews);
      } finally {
        setLoading(false);
      }
    };

    fetchHomepageData();
  }, [language]);

  const handleExploreClick = (slug) => {
    if (slug && slug !== '#') {
      navigate(`/vehicles/${slug}`);
    } else {
      navigate('/vehicles');
    }
  };

  const handleTestDriveClick = (slug) => {
    navigate('/contact');
  };

  const handleNewsletterSubmit = async (email) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (email.includes('test@')) {
          reject(new Error('Test email rejected'));
        } else {
          resolve({ success: true });
        }
      }, 1000);
    });
  };

  return (
    <div>
      {/* SLIDER 1: Custom banner using backend products */}
      {slider1Data.length > 0 && (
        <HeroBanner slides={slider1Data} minHeight="100vh">
          {(activeSlide) => (
            <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 mt-auto pb-24 text-left">
              <HeroContent 
                slide={activeSlide} 
                textAlignment="left" 
                onExplore={() => handleExploreClick(activeSlide.slug)} 
                onTestDrive={() => handleTestDriveClick(activeSlide.slug)} 
              />
            </div>
          )}
        </HeroBanner>
      )}

      {/* SLIDER 2: Dynamic Center alignment Promotion banner */}
      <HeroBanner slides={slider2_Data} imageOverlay={true} minHeight="80vh">
        {(activeSlide) => (
          <div className="max-w-3xl mx-auto w-full px-4 sm:px-6 lg:px-8 mt-auto pb-24 text-center">
            <HeroContent 
              slide={activeSlide} 
              textAlignment="center" 
              onExplore={() => navigate('/service')} 
              onTestDrive={() => navigate('/contact')} 
            />
          </div>
        )}
      </HeroBanner>

      {/* SLIDER 3: Minimalist Button only slider */}
      <HeroBanner slides={slider3_Data} imageOverlay={true} minHeight="75vh">
        {(activeSlide) => (
          <div className="w-full mt-auto pb-24 flex justify-center px-4">
            <HeroContent
              slide={{ exploreText: activeSlide.exploreText, testDriveText: activeSlide.testDriveText }}
              onExplore={() => navigate('/vehicles')}
              onTestDrive={() => navigate('/contact')}
            />
          </div>
        )}
      </HeroBanner>

      {/* Family/Brand Promise Section 1 */}
      <FamilySection
        title={content[language].family1.title}
        subtitle={content[language].family1.subtitle}
        qualityTitle={content[language].family1.quality}
        description={content[language].family1.description}
        image="https://samco.com.vn/vnt_upload/product/xe_khach_xe_bus/thumbs/(570x380)_crop_samco_wenda_ksd5.png"
        features={content[language].family1.features}
        contentPosition="left"
        backgroundColor="bg-gray-50"
        showFeatures={true}
      />
      
      {/* Family/Brand Promise Section 2 */}
      <FamilySection
        title={content[language].family2.title}
        subtitle={content[language].family2.subtitle}
        qualityTitle={content[language].family2.quality}
        description={content[language].family2.description}
        image="https://samco.com.vn/vnt_upload/product/xe_tai/isuzu/thumbs/(600x400)_crop_28137199168_6c9e65aa49_o.png"
        features={content[language].family2.features}
        contentPosition="right"
        backgroundColor="bg-white"
        showFeatures={true}
      />

      {/* News Articles Section */}
      <NewsArticles
        title={content[language].news.title}
        subtitle={content[language].news.subtitle}
        articles={newsList.length > 0 ? newsList : defaultNews}
        layout="2-2"
        backgroundColor="bg-white"
        showReadMore={true}
        showAuthor={true}
        showDate={true}
        showReadTime={true}
      />

      {/* Newsletter Section */}
      <Newsletter
        title={content[language].newsletter.title}
        description={content[language].newsletter.description}
        placeholderText={content[language].newsletter.placeholder}
        buttonText={content[language].newsletter.button}
        backgroundColor="bg-blue-600"
        textColor="text-white"
        onSubmit={handleNewsletterSubmit}
        showIcon={true}
        layout="center"
      />
    </div>
  );
}

export default HomePage;