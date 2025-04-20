import axios from "axios";

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

const options = {
  baseURL: backendUrl,
  withCredentials: true,
  timeout: 10000,
};

const API = axios.create(options);

export const APIRefresh = axios.create(options);
APIRefresh.interceptors.response.use((response) => response);

API.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const { data, status } = error.response;
    if (data.errorCode === "AUTH_TOKEN_NOT_FOUND" && status === 401) {
      try {
        await APIRefresh.get("/auth/refresh");
        return APIRefresh(error.config);
      } catch (error) {
        window.location.href = "/";
      }
    }
    return Promise.reject({
      ...data,
    });
  }
);
export default API;
