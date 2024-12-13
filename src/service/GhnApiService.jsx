// apiService.js
import axios from 'axios';

const apiUrl = import.meta.env.VITE_GHN_API_URL;
const ghnToken = import.meta.env.VITE_GHN_TOKEN

const ghnApiService = {
    get: (url, params = {}) => {
        let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: apiUrl + url,
            headers: {
                token: ghnToken,
                'Content-Type': 'application/json',
            },
            params: params,
        };

        return axios
            .request(config)
            .then((response) => response.data)
            .catch((error) => {
                console.error('Error in API call:', error.response || error.message);
                throw error;
            });
    },
};






export default ghnApiService;
