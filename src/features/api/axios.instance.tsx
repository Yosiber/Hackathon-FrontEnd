import axios, { type AxiosInstance, type InternalAxiosRequestConfig, type AxiosResponse } from 'axios';

const apiUrl = import.meta.env.VITE_API_URL;

const instance: AxiosInstance = axios.create({
    baseURL: apiUrl,
    withCredentials: true
});

instance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        // Add Necessaries Headers or Tokens here if needed
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export const setupAxiosResponseInterceptor = (
    openRefresh: () => void,
    logout: () => void
): void => {
    instance.interceptors.response.use(
        (response: AxiosResponse) => response,
        (error) => {
            // If Backend returns 401, it means the access token is expired or invalid
            if (error.response?.status === 401) {
                logout();
                openRefresh();
            }
            return Promise.reject(error);
        }
    );
};

export default instance;
