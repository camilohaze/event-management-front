import axios, { InternalAxiosRequestConfig } from "axios";

const HTTP = axios.create({
  timeout: 5000,
  cancelToken: axios.CancelToken.source().token,
});

HTTP.defaults.headers.post["Content-Type"] = "application/json";
HTTP.defaults.headers.post["X-Goog-Api-Key"] = "AIzaSyBYR3AiWWQlQ7U2PrtisorppjIqIHbq-Ok";
HTTP.defaults.headers.post.Accept = "application/json";
HTTP.defaults.timeout = 3000;

const API = axios.create({
  baseURL: "http://localhost:3000",
  timeout: 5000,
  cancelToken: axios.CancelToken.source().token,
  withCredentials: true,
});

API.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
API.defaults.headers.post.Accept = "application/json";
API.defaults.timeout = 3000;

API.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    return config;
  },
  async (error) => {
    return Promise.reject(error);
  }
);

API.interceptors.response.use(
  async (response) => {
    return response;
  },
  async (error) => {
    const { config, response } = error;

    if (response && response.status === 401) {
      await API.post('/refresh');

      return axios.request(config);
    }

    return Promise.reject(error);
  }
);

export { API, HTTP };
