import React from 'react';
import { X } from 'lucide-react';

function LoginModal({ onClose }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Đăng nhập</h2>
          <button onClick={onClose}>
            <X size={24} />
          </button>
        </div>
        <p className="text-gray-600 mb-6">
          Để thuận tiện theo dõi đơn hàng và dễ dàng thanh toán online. 
          Quý khách vui lòng đăng nhập/ đăng ký trước khi mua hàng.
        </p>
        <div className="space-y-4">
          <input 
            type="email" 
            placeholder="Email"
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input 
            type="password" 
            placeholder="Mật khẩu"
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors">
            Đăng nhập
          </button>
          <div className="text-center">
            <a href="#" className="text-blue-600 hover:underline">Đăng ký tài khoản</a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginModal;