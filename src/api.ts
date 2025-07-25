import axios, { AxiosError, isAxiosError, isCancel } from 'axios';
import type { AxiosRequestConfig } from 'axios';
import { API_URL } from 'config';
import store from 'store';
import { setAccessToken } from 'store/authSlice';

/* --- 통합 axios 인스턴스 --- */
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

/* --- 요청 인터셉터 --- */
api.interceptors.request.use(
  (config) => {
    const token = store.getState().auth.accessToken;

    if (token) {
      config.headers = config.headers || {};
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

/* --- 중복 리프레시 방지 큐 로직 --- */
let isRefreshing = false;
let failedQueue: { resolve: (value: unknown) => void; reject: (reason?: any) => void; config: AxiosRequestConfig }[] =
  [];

const processQueue = (error: AxiosError | null, token: string | null) => {
  failedQueue.forEach(({ resolve, reject, config }) => {
    if (token) {
      config.headers = config.headers || {};
      config.headers['Authorization'] = `Bearer ${token}`;
      resolve(api(config));
    } else {
      reject(error);
    }
  });
  failedQueue = [];
};

/* --- 응답 인터셉터 --- */
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status === 401 && !originalRequest._retry && !originalRequest.url?.includes('/auth/refresh')) {
      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject, config: originalRequest });
        });
      }

      isRefreshing = true;

      try {
        const response = await axios.post(`${API_URL}/auth/refresh`, null, { withCredentials: true });
        const newToken = response.data.access_token;

        store.dispatch(setAccessToken(newToken));
        processQueue(null, newToken);

        originalRequest.headers = originalRequest.headers || {};
        originalRequest.headers['Authorization'] = `Bearer ${newToken}`;

        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError as AxiosError, null);
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

/* --- 중앙 에러 핸들러 --- */
const handleApiError = (err: unknown, url: string, caller: string) => {
  if (isCancel(err) || (err instanceof DOMException && err.name === 'AbortError')) {
    // 요청이 의도적으로 취소된 경우는 무시
    return;
  }

  if (isAxiosError(err)) {
    console.error(`API Error in ${caller} (${url}):`, err.response?.data || err.message);
  } else {
    console.error(`API Error in ${caller} (${url}):`, err);
  }

  return undefined;
};

// --- API 요청 함수들 (통합) ---

// GET 요청
export const fetcher = (url: string) =>
  api
    .get(url)
    .then((res) => res.data)
    .catch((err) => handleApiError(err, url, 'fetcher'));

export const mapFetcher = (url: string) =>
  api
    .get(url, { responseType: 'arraybuffer' })
    .then((res) => res.data)
    .catch((err) => handleApiError(err, url, 'mapFetcher'));

// POST 요청
export const poster = <T>(url: string, { arg }: { arg: T }) =>
  api
    .post(url, arg)
    .then((res) => res.data)
    .catch((err) => handleApiError(err, url, 'poster'));

export const multipartPoster = (url: string, { arg }: { arg: FormData }) =>
  api
    .post(url, arg, { headers: { 'Content-Type': 'multipart/form-data' } })
    .then((res) => res.data)
    .catch((err) => handleApiError(err, url, 'multipartPoster'));

// PUT 요청
export const updater = <T>(url: string, { arg }: { arg: T }) =>
  api
    .put(url, arg)
    .then((res) => res.data)
    .catch((err) => handleApiError(err, url, 'updater'));

export const multipartUpdater = (url: string, { arg }: { arg: FormData }) =>
  api
    .put(url, arg, { headers: { 'Content-Type': 'multipart/form-data' } })
    .then((res) => res.data)
    .catch((err) => handleApiError(err, url, 'multipartUpdater'));

// DELETE 요청
export const deleter = (url: string) =>
  api
    .delete(url)
    .then((res) => res.data)
    .catch((err) => handleApiError(err, url, 'deleter'));
