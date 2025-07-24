// src/App.jsx

import { Routes, Route } from 'react-router-dom';
import './assets/styles/index.css';

// Layout
import RootLayout from './components/layout/RootLayout';

// Pages
import HomePage from './pages/HomePage/HomePage';
import VehiclesPage from './pages/SimpleVehiclesPage';
import CarDetailPage from './pages/Cars/CarDetailPage'; // Trang chi tiết xe
import ChargingPage from './pages/ChargingStationPage/ChargingStationPage';
import ServicePage from './pages/HomePage/ServicesSection';
import AboutPage from './pages/AboutPage/AboutPage';
import ContactPage from './pages/HomePage/ContactForm';

function App() {
  // Toàn bộ state và logic render cũ đã được router xử lý!

  return (
    <Routes>
      {/* Tất cả các trang sẽ dùng chung một layout */}
      <Route path="/" element={<RootLayout />}>
        
        {/* Trang chủ */}
        <Route index element={<HomePage />} />
        
        {/* Các trang tĩnh */}
        <Route path="vehicles" element={<VehiclesPage />} />
        <Route path="charging" element={<ChargingPage />} />
        <Route path="service" element={<ServicePage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="contact" element={<ContactPage />} />
        
        {/* Route động cho trang chi tiết xe */}
        {/* Dấu ':' cho biết `carId` là một tham số động trên URL */}
        <Route path="vehicles/:carId" element={<CarDetailPage />} />

        {/* Route mặc định nếu không tìm thấy, có thể tạo trang 404 */}
        <Route path="*" element={<HomePage />} /> 
      </Route>
    </Routes>
  );
};

export default App;