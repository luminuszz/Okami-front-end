import axios, { AxiosError } from 'axios'

export const okamiHttpGateway = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
})

okamiHttpGateway.interceptors.request.use((config) => {
  const tokenOrNull = localStorage.getItem('@okami-web:token')

  if (tokenOrNull) {
    config.headers.Authorization = `Bearer ${tokenOrNull}`
  }

  return config
})

export const isUnauthorizedError = (error: AxiosError): boolean =>
  [401, 403].includes(error.response?.status || 0)
