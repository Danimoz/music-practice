import { clearAuthTokens, getAccessToken, getRefreshToken, storeAuthTokens } from '@/lib/authStorage';
import axios from 'axios';
import { Alert } from 'react-native';

const apiClient = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add a request interceptor to include the token in headers
apiClient.interceptors.request.use(
  async(config) => {
    const token = await getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
)

// Add a response interceptor to handle errors globally
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = await getRefreshToken(); 

      if (refreshToken) {
        try {
          const response = await axios.post(`${process.env.EXPO_PUBLIC_API_URL}/auth/refresh`, { refreshToken });
          const newAccessToken = response.data.accessToken;

          if (newAccessToken) {
            await storeAuthTokens(newAccessToken, refreshToken);
            apiClient.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
            originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
            return apiClient(originalRequest);
          }
        } catch (refreshError) {
          console.error('Refresh token failed:', refreshError);
          await clearAuthTokens();
          Alert.alert('Session expired', 'Please log in again.');
          //  redirect to login screen or handle logout

        }
      } else {
        await clearAuthTokens();
        Alert.alert('Session expired', 'Please log in again.');
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;