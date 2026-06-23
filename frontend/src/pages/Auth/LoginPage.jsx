import React, { useState } from 'react';
import { X, Mail, Lock, User, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

function LoginModal({ onClose }) {
  const { login, register } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  
  // Form Fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Status
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleToggleMode = () => {
    setIsRegister(!isRegister);
    setErrorMsg('');
    setSuccessMsg('');
    setEmail('');
    setPassword('');
    setUsername('');
    setConfirmPassword('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    // Validation
    if (!email || !password) {
      setErrorMsg('Vui lòng điền đầy đủ email và mật khẩu');
      return;
    }

    if (isRegister) {
      if (!username) {
        setErrorMsg('Vui lòng nhập tên người dùng');
        return;
      }
      if (password !== confirmPassword) {
        setErrorMsg('Mật khẩu nhập lại không khớp');
        return;
      }
    }

    setIsLoading(true);

    try {
      if (isRegister) {
        // Register API call
        const response = await register(username, email, password);
        if (response.success) {
          setSuccessMsg('Đăng ký tài khoản thành công! Bạn có thể đăng nhập ngay.');
          // Auto switch to login after 2 seconds
          setTimeout(() => {
            setIsRegister(false);
            setErrorMsg('');
            setSuccessMsg('');
            setPassword('');
            setConfirmPassword('');
          }, 2000);
        } else {
          setErrorMsg(response.message || 'Đăng ký không thành công');
        }
      } else {
        // Login API call
        const response = await login(email, password);
        if (response.success) {
          onClose();
        }
      }
    } catch (err) {
      setErrorMsg(err.message || 'Có lỗi xảy ra, vui lòng thử lại');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all border border-gray-100 animate-scale-in">
        {/* Header decoration bar */}
        <div className="h-1.5 bg-gradient-to-r from-blue-600 to-indigo-600"></div>

        <div className="p-6 sm:p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              {isRegister ? 'Đăng ký tài khoản' : 'Đăng nhập'}
            </h2>
            <button 
              onClick={onClose} 
              className="text-gray-400 hover:text-gray-600 transition-colors p-1.5 hover:bg-gray-100 rounded-full"
            >
              <X size={20} />
            </button>
          </div>

          <p className="text-gray-500 text-sm mb-6">
            {isRegister 
              ? 'Tạo tài khoản mới để trải nghiệm đầy đủ các tính năng lái thử và đặt cọc xe điện.'
              : 'Đăng nhập tài khoản để theo dõi lịch sử lái thử, đặt cọc xe và nhận ưu đãi từ SAMCO.'}
          </p>

          {/* Feedback alerts */}
          {errorMsg && (
            <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-xl text-red-700 text-sm flex items-start gap-2.5">
              <AlertCircle size={18} className="mt-0.5 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-4 p-3 bg-emerald-50 border border-emerald-100 rounded-xl text-emerald-700 text-sm flex items-start gap-2.5">
              <CheckCircle2 size={18} className="mt-0.5 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegister && (
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                  <User size={18} />
                </span>
                <input 
                  type="text" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Họ và tên"
                  disabled={isLoading}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                  required
                />
              </div>
            )}

            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                <Mail size={18} />
              </span>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Địa chỉ Email"
                disabled={isLoading}
                className="w-full pl-10 pr-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                required
              />
            </div>

            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                <Lock size={18} />
              </span>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mật khẩu"
                disabled={isLoading}
                className="w-full pl-10 pr-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                required
              />
            </div>

            {isRegister && (
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                  <Lock size={18} />
                </span>
                <input 
                  type="password" 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Nhập lại mật khẩu"
                  disabled={isLoading}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                  required
                />
              </div>
            )}

            {!isRegister && (
              <div className="text-right">
                <a href="#" className="text-xs text-blue-600 hover:text-blue-700 transition-colors">
                  Quên mật khẩu?
                </a>
              </div>
            )}

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-xl transition-all duration-200 text-sm flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-blue-500/10 disabled:opacity-75 disabled:pointer-events-none active:scale-[0.98]"
            >
              {isLoading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Đang xử lý...
                </>
              ) : (
                isRegister ? 'Đăng ký' : 'Đăng nhập'
              )}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-gray-100 text-center text-sm text-gray-500">
            {isRegister ? (
              <p>
                Đã có tài khoản?{' '}
                <button 
                  onClick={handleToggleMode} 
                  className="text-blue-600 hover:text-blue-700 font-medium hover:underline focus:outline-none"
                >
                  Đăng nhập ngay
                </button>
              </p>
            ) : (
              <p>
                Chưa có tài khoản?{' '}
                <button 
                  onClick={handleToggleMode} 
                  className="text-blue-600 hover:text-blue-700 font-medium hover:underline focus:outline-none"
                >
                  Đăng ký miễn phí
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginModal;