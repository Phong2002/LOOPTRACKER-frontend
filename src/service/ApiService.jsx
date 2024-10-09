// apiService.js
import axios from 'axios';

const apiUrl = import.meta.env.VITE_SERVER_URL;
const host = import.meta.env.VITE_SERVER_HOST;
const prefix = import.meta.env.VITE_SERVER_PREFIX;

// Tạo một instance axios để có thể sử dụng lại và cấu hình tùy chỉnh
const apiClient = axios.create({
    baseURL: `${apiUrl}:${host}/${prefix}`, // API base URL (thay thế với URL thật của bạn)
    timeout: 10000, // Thời gian chờ request (ms)
    headers: {
        'Content-Type': 'application/json', // Có thể tùy chỉnh loại content
        // Authorization: `Bearer ${token}` // Có thể set token authorization nếu cần
    },
});

// Tạo một phương thức dùng để bắt lỗi response
apiClient.interceptors.response.use(
    (response) => {
        // Xử lý response thành công
        return response.data; // Trả về dữ liệu từ response
    },
    (error) => {
        // Xử lý response khi gặp lỗi
        console.error('API call failed', error);
        return Promise.reject(error); // Trả về lỗi để phía sử dụng có thể catch được
    }
);

// Tạo các phương thức gọi API có thể tái sử dụng
const apiService = {
    get: (url, params = {}) => apiClient.get(url, { params }), // Không cần try/catch
    post: (url, data) => apiClient.post(url, data), // Không cần try/catch
    put: (url, data) => apiClient.put(url, data), // Không cần try/catch
    delete: (url) => apiClient.delete(url), // Không cần try/catch
};

export default apiService;
