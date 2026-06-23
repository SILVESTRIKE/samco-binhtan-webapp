// src/api/mockCarApi.js

// Dữ liệu giả lập cho nhiều xe
const carDatabase = {
    'herio-green': {
        id: 'herio-green',
        name: 'HERIO GREEN',
        images: [
            'https://xekhach-bacviet.vn/wp-content/uploads/2024/11/hyundai-solti-dl-e5-mau-den-6.jpg',
            'https://static.automotor.vn/w640/images/upload/2024/11/05/pin-the-ran-xe-dien-vneconomyautomotive.jpeg',
            'https://xekhach-bacviet.vn/wp-content/uploads/2024/11/hyundai-solti-dl-e5-mau-den-6.jpg',
        ],
        quickSpecs: [
            { label: 'Kích thước tổng thể (mm)', value: '3967 x 1723 x 1579' },
            { label: 'Chiều dài cơ sở', value: '2514 mm' },
            { label: 'Khoảng sáng gầm xe', value: '160 mm' },
            { label: 'Công suất tối đa', value: '100 kW' },
        ],
        fullSpecs: [
            { category: "Kích thước tổng thể (mm)", value: "3967 x 1723 x 1579", category2: "Chiều dài cơ sở", value2: "2514 mm" },
            { category: "Khoảng sáng gầm xe", value: "160 mm", category2: "Công suất tối đa", value2: "100 kW" },
            // ... thêm các thông số khác
        ],
        disclaimers: [
            'Tính năng và trang bị có thể thay đổi theo từng phiên bản mà không cần báo trước. Vui lòng liên hệ Showroom/Đại lý để biết thêm chi tiết.',
            'Quãng đường di chuyển thực tế có thể khác so với tiêu chuẩn NEDC tùy thuộc vào điều kiện sử dụng thực tế.',
        ],
    },
    'samco-allergo': {
        id: 'samco-allergo',
        name: 'SAMCO ALLERGO 2024',
        images: [
            'https://samco.com.vn/vnt_upload/product/xe_khach_xe_bus/allergo/SAMCO_ALLERGO_2024.jpg',
            'https://samco.com.vn/vnt_upload/product/xe_khach_xe_bus/allergo/SAMCO-ALLERGO-2024-4.png',
        ],
        quickSpecs: [
            { label: 'Số chỗ', value: '29 Chỗ' },
            { label: 'Động cơ', value: 'ISUZU' },
            { label: 'Công suất', value: '150 Ps' },
            { label: 'Tiêu chuẩn khí thải', value: 'EURO V' },
        ],
        fullSpecs: [
            { category: "Kích thước tổng thể (mm)", value: "7780 x 2180 x 3000", category2: "Chiều dài cơ sở", value2: "3845 mm" },
            // ... các thông số khác
        ],
        disclaimers: [
            'Thông số kỹ thuật có thể thay đổi bởi nhà sản xuất mà không cần báo trước.'
        ],
    }
};

// Hàm giả lập việc gọi API, trả về Promise
export const getCarById = (id) => {
    console.log(`Fetching data for car ID: ${id}`);
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (carDatabase[id]) {
                resolve(carDatabase[id]);
            } else {
                reject(new Error('Car not found'));
            }
        }, 500); // Giả lập độ trễ mạng 0.5s
    });
};