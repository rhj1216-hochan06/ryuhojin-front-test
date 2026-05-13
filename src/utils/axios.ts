import axios from 'axios';
import { normalizeApiRequestError } from './apiError';

axios.defaults.timeout = 10_000;

axios.interceptors.request.use((config) => {
  config.headers.Accept = 'application/json';
  return config;
});

axios.interceptors.response.use(
  (response) => response,
  (error: unknown) => Promise.reject(normalizeApiRequestError(error)),
);

export default axios;
