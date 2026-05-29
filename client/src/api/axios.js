import axios from "axios";

const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL ||
    "http://localhost:8082/api",
});

// Attach token
api.interceptors.request.use(
  (config) => {
    const userInfo = localStorage.getItem("userInfo");

    if (userInfo) {
      const { token } = JSON.parse(userInfo);
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Handle expired token
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("userInfo");
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default api;