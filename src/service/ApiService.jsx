// apiService.js
import axios from 'axios';

const apiUrl = import.meta.env.VITE_SERVER_URL;
const host = import.meta.env.VITE_SERVER_HOST;
const prefix = import.meta.env.VITE_SERVER_PREFIX;

// Tạo instance Axios với cấu hình mặc định
const apiClient = axios.create({
    baseURL: `${apiUrl}:${host}/${prefix}`, // API base URL
    timeout: 20000, // Thời gian chờ request (ms)
    headers: {
        'Content-Type': 'application/json', // Mặc định là JSON
    },
});

// Interceptor để xử lý response
apiClient.interceptors.response.use(
    (response) => response.data, // Trả về data trực tiếp
    (error) => {
        // Xử lý lỗi chi tiết hơn
        if (error.code === 'ECONNABORTED') {
            console.error('Request timeout!');
        } else if (error.response) {
            console.error(`API Error: ${error.response.status} - ${error.response.data}`);
        } else {
            console.error('Network Error:', error.message);
        }
        return Promise.reject(error); // Đẩy lỗi để các hàm gọi có thể catch
    }
);

// Các phương thức gọi API tái sử dụng
const apiService = {
    get: (url, params = {}) => apiClient.get(url, { params }),
    post: (url, data) => apiClient.post(url, data),
    put: (url, data) => apiClient.put(url, data),
    delete: (url, params = {}) => apiClient.delete(url, { params }),
    postFormData: (url, data) => apiClient.post(url, data, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    }),
    putFormData: (url, data) => apiClient.put(url, data, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    }),
};

export default apiService;
