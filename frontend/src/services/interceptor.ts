import axios from 'axios';
import { toast } from 'react-toastify';
import store from '../redux/store/store';

const apiClient = axios.create({
  baseURL: 'http://localhost:5001/api/v1/', // Change this to your API base URL
  // baseURL: 'http://localhost:5001', // Change this to your API base URL
});

// Interceptor to add the token to every request
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token'); // Get the token from local storage
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`; // Set the Authorization header
    }
    config.headers['credentials'] = "include"
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => response, // Pass through successful responses
  (error) => {
    if (error.response?.status === 401) {
      // Handle 401 errors
      toast.error('Your session has expired. Please log in again.', {
        position: 'top-center',
        autoClose: 3000,
      });
      setTimeout(() => {
        localStorage.removeItem("userInfo");

        // Dispatch logout action to clear Redux state
        // store.dispatch(logout());

        // Redirect to login
        window.location.href = '/login';
      }, 2000);
      // Redirect to login page
      window.location.href = '/login'; // Navigate to login
    }
    return Promise.reject(error); // Reject the error for further handling if needed
  }
)

export default apiClient;
