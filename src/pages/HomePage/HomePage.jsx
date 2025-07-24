import React from 'react';
import { Shield, Battery, Zap, Users, Wrench, Car } from 'lucide-react';
import HeroBanner from './components/HeroBanner';
import HeroContent from './components/HeroContent';
import FamilySection from './components/FamilySection';
import NewsArticles from './components/NewsArticles';
import Newsletter from './components/Newsletter';
function HomePage({ language = 'vi' }) {

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
  const slider1_Data = [
    { title: "SAMCO GROWIN 2024", subtitle: "Sang trọng trên mọi hành trình", image: "https://samco.com.vn/vnt_upload/weblink/Banner_Trang_chu/5_xe_SAMCO-01.png", exploreText: "Chi tiết", testDriveText: "Lái thử" },
    { title: "SAMCO ALLERGO MỚI", subtitle: "Mạnh mẽ, bền bỉ và hiệu quả", image: "https://samco.com.vn/vnt_upload/news/2025/DaihoiDang20252030/thumbs/770_crop__10.jpg", exploreText: "Chi tiết", testDriveText: "Lái thử" }
  ];

  // DỮ LIỆU CHO SLIDER 2
  const slider2_Data = [
    { title: "Ưu đãi dịch vụ Hè 2025", subtitle: "Bảo dưỡng toàn diện, sẵn sàng cho mọi chuyến đi.", image: "https://xekhach-bacviet.vn/wp-content/uploads/2024/11/hyundai-solti-dl-e5-mau-den-6.jpg", exploreText: "Xem chi tiết", testDriveText: "Đặt lịch" },
    { title: "Phụ tùng chính hãng", subtitle: "Đảm bảo hiệu suất và an toàn tối đa.", image: "https://samco.com.vn/vnt_upload/product/03_2017/thumbs/(600x400)_crop_prod6.jpg", exploreText: "Tìm hiểu", testDriveText: "Tư vấn" },
  ];

  // DỮ LIỆU CHO SLIDER 3
  const slider3_Data = [
    { image: "https://xekhach-bacviet.vn/wp-content/uploads/2024/09/3-1.jpg", exploreText: "Các dòng xe tải", testDriveText: "Báo giá" },
    { image: "https://samco.com.vn/vnt_upload/product/Quan_Ly_danh_muc/xe_chuyen_dung/thumbs/(570x380)_crop_xe_san_khau_1.jpg", exploreText: "Xe chuyên dụng", testDriveText: "Tìm đại lý" }
  ];
  // Sample news articles
  const newsArticles = [
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
    },
    {
      title: "VinFast hợp tác với các đối tác quốc tế",
      summary: "Những thỏa thuận hợp tác mới giúp VinFast mở rộng ra thị trường châu Âu và Bắc Mỹ.",
      image: "https://images.unsplash.com/photo-1521791136064-7986c2920216?w=600&h=400&fit=crop",
      category: "Đối tác",
      date: "22/07/2025",
      author: "Business Team",
      readTime: "4 phút đọc",
      link: "#"
    },
    {
      title: "Trạm sạc siêu nhanh mới tại các thành phố lớn",
      summary: "Hệ thống trạm sạc siêu nhanh 350kW được lắp đặt tại Hà Nội, TP.HCM và Đà Nẵng.",
      image: "https://images.unsplash.com/photo-1593941707874-ef25b8b4a92b?w=600&h=400&fit=crop",
      category: "Hạ tầng",
      date: "21/07/2025",
      author: "Infrastructure Team",
      readTime: "3 phút đọc",
      link: "#"
    }
  ];

  // Handle newsletter submission
  const handleNewsletterSubmit = async (email) => {
    // Simulate API call
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
  const handleExploreClick = () => console.log("Explore button clicked!");
  const handleTestDriveClick = () => console.log("Test Drive button clicked!");
  return (
    <div>
      {/* SLIDER 1: Nội dung căn trái, đẩy xuống dưới */}
      <HeroBanner slides={slider1_Data} minHeight="100vh">
        {/* {(activeSlide) => (
          // SỬA ĐỔI CHÍNH Ở ĐÂY: Dùng 'mt-auto'
          <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 mt-auto pb-24">
            <HeroContent slide={activeSlide} textAlignment="left" onExplore={handleExploreClick} onTestDrive={handleTestDriveClick} />
          </div>
        )} */}
      </HeroBanner>

      {/* SLIDER 2: Nội dung căn giữa, đẩy xuống dưới */}
      <HeroBanner slides={slider2_Data} imageOverlay={true} minHeight="80vh">
        {(activeSlide) => (
          // SỬA ĐỔI CHÍNH Ở ĐÂY: Dùng 'mt-auto'
          <div className="max-w-3xl mx-auto w-full px-4 sm:px-6 lg:px-8 mt-auto pb-24 text-center">
            <HeroContent slide={activeSlide} textAlignment="center" onExplore={handleExploreClick} onTestDrive={handleTestDriveClick} />
          </div>
        )}
      </HeroBanner>

      {/* SLIDER 3: Chỉ có nút, căn giữa, đẩy xuống dưới */}
      <HeroBanner slides={slider3_Data} imageOverlay={true} minHeight="75vh">
        {(activeSlide) => (
          // SỬA ĐỔI CHÍNH Ở ĐÂY: Dùng 'mt-auto'
          <div className="w-full mt-auto pb-24 flex justify-center px-4">
            <HeroContent
              slide={{ exploreText: activeSlide.exploreText, testDriveText: activeSlide.testDriveText }}
              onExplore={handleExploreClick}
              onTestDrive={handleTestDriveClick}
            />
          </div>
        )}
      </HeroBanner>

      {/* Family/Brand Promise Section */}
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
        articles={newsArticles}
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