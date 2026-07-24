import api, { unwrap } from './http';
export const getCsrf = () => api.get('/auth/csrf');
export const login = async (data) => unwrap(await api.post('/auth/login', data));
export const logout = async () => api.post('/auth/logout');
export const logoutAll = async () => api.post('/auth/logout-all');
export const getCurrentUser = async () => unwrap(await api.get('/me'));
