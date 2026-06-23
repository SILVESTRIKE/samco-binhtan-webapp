import React, { useState } from 'react';
import { Mail, CheckCircle, AlertCircle } from 'lucide-react';

function Newsletter({ 
  title,
  description,
  backgroundColor = "bg-blue-600",
  textColor = "text-white",
  placeholderText = "Nhập email của bạn",
  buttonText = "Đăng ký",
  onSubmit,
  showIcon = true,
  layout = "center" // "center", "left", "right"
}) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // 'idle', 'loading', 'success', 'error'
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) {
      setStatus('error');
      setMessage('Vui lòng nhập email');
      return;
    }

    if (!isValidEmail(email)) {
      setStatus('error');
      setMessage('Email không hợp lệ');
      return;
    }

    setStatus('loading');
    
    try {
      if (onSubmit) {
        await onSubmit(email);
      }
      
      setStatus('success');
      setMessage('Đăng ký thành công!');
      setEmail('');
      
      // Reset status after 3 seconds
      setTimeout(() => {
        setStatus('idle');
        setMessage('');
      }, 3000);
      
    } catch (error) {
      setStatus('error');
      setMessage('Có lỗi xảy ra, vui lòng thử lại');
      
      // Reset status after 3 seconds
      setTimeout(() => {
        setStatus('idle');
        setMessage('');
      }, 3000);
    }
  };

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const getLayoutClass = () => {
    switch(layout) {
      case 'left':
        return 'text-left';
      case 'right':
        return 'text-right';
      case 'center':
      default:
        return 'text-center';
    }
  };

  const getContentMaxWidth = () => {
    switch(layout) {
      case 'left':
      case 'right':
        return 'max-w-2xl';
      case 'center':
      default:
        return 'max-w-4xl mx-auto';
    }
  };

  return (
    <section className={`py-20 ${backgroundColor}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`${getContentMaxWidth()} ${getLayoutClass()}`}>
          {/* Icon */}
          {showIcon && (
            <div className={`mb-8 ${layout === 'center' ? 'flex justify-center' : ''}`}>
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                <Mail className="w-8 h-8 text-white" />
              </div>
            </div>
          )}
          
          {/* Title */}
          <h2 className={`text-4xl md:text-5xl font-bold ${textColor} mb-6`}>
            {title}
          </h2>
          
          {/* Description */}
          <p className={`text-xl mb-8 ${textColor === 'text-white' ? 'text-blue-100' : 'text-gray-600'}`}>
            {description}
          </p>
          
          {/* Newsletter Form */}
          <form onSubmit={handleSubmit}>
            <div className={`flex flex-col sm:flex-row gap-4 ${layout === 'center' ? 'max-w-md mx-auto' : 'max-w-md'}`}>
              <div className="flex-1">
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={placeholderText}
                  disabled={status === 'loading'}
                  className={`
                    w-full px-4 py-3 rounded-lg text-gray-900 placeholder-gray-500 
                    border-2 border-transparent focus:outline-none focus:ring-2 focus:ring-white 
                    transition-all duration-300
                    ${status === 'error' ? 'border-red-300 bg-red-50' : 'bg-white'}
                    ${status === 'loading' ? 'opacity-50 cursor-not-allowed' : ''}
                  `}
                />
              </div>
              
              <button 
                type="submit"
                disabled={status === 'loading'}
                className={`
                  px-8 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105
                  ${backgroundColor === 'bg-blue-600' 
                    ? 'bg-white text-blue-600 hover:bg-gray-100' 
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                  }
                  ${status === 'loading' 
                    ? 'opacity-50 cursor-not-allowed transform-none' 
                    : ''
                  }
                  flex items-center justify-center gap-2
                `}
              >
                {status === 'loading' && (
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                )}
                {buttonText}
              </button>
            </div>
          </form>
          
          {/* Status Message */}
          {message && (
            <div className={`mt-4 flex items-center gap-2 ${getLayoutClass()} ${layout === 'center' ? 'justify-center' : ''}`}>
              {status === 'success' && <CheckCircle className="w-5 h-5 text-green-400" />}
              {status === 'error' && <AlertCircle className="w-5 h-5 text-red-400" />}
              <span className={`
                ${status === 'success' ? 'text-green-400' : ''}
                ${status === 'error' ? 'text-red-400' : ''}
                ${status === 'idle' ? textColor : ''}
              `}>
                {message}
              </span>
            </div>
          )}
          
          {/* Privacy Notice */}
          <p className={`text-sm mt-6 ${textColor === 'text-white' ? 'text-blue-200' : 'text-gray-500'}`}>
            Bằng cách đăng ký, bạn đồng ý với{' '}
            <a href="#" className="underline hover:no-underline">
              Điều khoản dịch vụ
            </a>{' '}
            và{' '}
            <a href="#" className="underline hover:no-underline">
              Chính sách bảo mật
            </a>{' '}
            của chúng tôi.
          </p>
        </div>
      </div>
    </section>
  );
}

export default Newsletter;