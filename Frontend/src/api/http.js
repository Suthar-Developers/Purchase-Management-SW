import axios from 'axios';
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';
const api = axios.create({ baseURL: API_BASE_URL, timeout: 30000, withCredentials: true });
const csrf = () => document.cookie.split('; ').find((row) => row.startsWith('pm_csrf='))?.split('=')[1];
api.interceptors.request.use((config) => { if (!['get','head','options'].includes((config.method || 'get').toLowerCase())) { const token=csrf(); if(token) config.headers['x-csrf-token']=decodeURIComponent(token); } return config; });
let refreshing = false; let queue=[];
const flush=(error)=>{queue.forEach(({resolve,reject})=>error?reject(error):resolve());queue=[];};
api.interceptors.response.use((response)=>response,async(error)=>{const original=error.config; if(error.response?.status===401 && !original?._retry && !original?.url?.includes('/auth/refresh')){ if(refreshing)return new Promise((resolve,reject)=>queue.push({resolve,reject})).then(()=>api(original)); original._retry=true; refreshing=true; try{await api.post('/auth/refresh');flush();return api(original);}catch(refreshError){flush(refreshError);window.dispatchEvent(new Event('auth:expired'));return Promise.reject(refreshError);}finally{refreshing=false;} }return Promise.reject(error);});
export const unwrap=(response)=>response.data?.data ?? response.data; export default api;
