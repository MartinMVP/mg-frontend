import axios from 'axios'
import { getCookie } from './cookies'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  withCredentials: true,
})

api.interceptors.request.use((cfg) => {
  const t = localStorage.getItem('mg_access')

  if (t) {
    cfg.headers.set('Authorization', `Bearer ${t}`)
  }

  const csrf = getCookie('mg_csrf')

  if (csrf) {
    cfg.headers.set('x-csrf', csrf)
  }

  return cfg
})