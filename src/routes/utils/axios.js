import axios from "axios";

const dataAPI = axios.create({
  baseURL: import.meta.env.VITE_API_SOCK,
});

dataAPI.interceptors.request.use(
  function (config) {
    // Do something before request is sent
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    config.headers["Access-Control-Allow-Origin"] = "*";

    // Check if the data is FormData for multipart form-data
    if (config.data instanceof FormData) {
      config.headers["Content-Type"] = "multipart/form-data";
    } else {
      // Assume other data types are JSON
      config.headers.Accept = "application/json";
      config.headers["Content-Type"] = "application/json";
    }

    // Add CSRF token only for POST requests
    if (config.method === "post") {
      const csrfToken = localStorage.getItem("csrfToken");
      if (csrfToken) {
        config.headers["X-CSRF-Token"] = csrfToken;
      }
    }

    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

// Add a response interceptor
dataAPI.interceptors.response.use(
  function (response) {
    // Any status code that lies within the range of 2xx causes this function to trigger
    // Do something with response data
    return response;
  },
  function (error) {
    // Any status codes that fall outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error);
  }
);

export { dataAPI };
