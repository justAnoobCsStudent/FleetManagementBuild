import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:7000/api/v1",
});

// Axios Request Interceptor
API.interceptors.request.use(async (config) => {
  const token = localStorage.getItem("idToken");
  config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Axios Response Interceptor for Token Refresh
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refreshToken");
        const response = await axios.post(
          `https://securetoken.googleapis.com/v1/token?key=YOUR_FIREBASE_API_KEY`,
          {
            grant_type: "refresh_token",
            refresh_token: refreshToken,
          }
        );

        const { id_token, refresh_token } = response.data;
        localStorage.setItem("idToken", id_token);
        localStorage.setItem("refreshToken", refresh_token);

        // Retry the original request with the new token
        originalRequest.headers.Authorization = `Bearer ${id_token}`;
        return axios(originalRequest);
      } catch (err) {
        console.error("Failed to refresh token:", err);
        localStorage.clear();
        window.location.href = "/"; // Redirect to login
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default API;
