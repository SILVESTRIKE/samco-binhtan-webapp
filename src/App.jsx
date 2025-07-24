import { useState } from 'react'
import './assets/styles/index.css';
import viteLogo from '/vite.svg'
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import HomePage from './pages/HomePage/HomePage';
import VehiclesPage from './pages/SimpleVehiclesPage';
import ChargingPage from './pages/ChargingStationPage/ChargingStationPage';
import ServicePage from './pages/HomePage/ServicesSection';
import AboutPage from './pages/AboutPage/AboutPage';
import ContactPage from './pages/HomePage/ContactForm';


function App() {
  const [language, setLanguage] = useState('en');
  const [currentPage, setCurrentPage] = useState('home');

  const renderPage = () => {
    switch(currentPage) {
      case 'home':
        return <HomePage language={language} />;
      case 'vehicles':
      case 'vf3':
      case 'vf6':
      case 'vf7':
      case 'vf8':
      case 'vf9':
      case 'escooter':
        return <VehiclesPage language={language} />;
      case 'charging':
        return <ChargingPage language={language} />;
      case 'service':
        return <ServicePage language={language} />;
      case 'about':
        return <AboutPage language={language} />;
      case 'contact':
        return <ContactPage language={language} />;
      default:
        return <HomePage language={language} />;
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <Header 
        language={language} 
        setLanguage={setLanguage}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
      
      {renderPage()}
      
      <Footer language={language} />
    </div>
  );
};

export default App;