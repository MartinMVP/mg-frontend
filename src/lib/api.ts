import axios from 'axios';
import { getCookie } from './cookies';


export const api = axios.create({
baseURL: import.meta.env.VITE_API_URL || '/api',
withCredentials: true
});


api.interceptors.request.use(cfg => {
const t = localStorage.getItem('mg_access');
if (t) cfg.headers = { ...(cfg.headers || {}), Authorization: `Bearer ${t}` };
// Para endpoints que usan cookie (refresh/logout) agregamos x-csrf si existe
const csrf = getCookie('mg_csrf');
if (csrf) cfg.headers = { ...(cfg.headers || {}), 'x-csrf': csrf };
return cfg;
});