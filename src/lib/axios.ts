import axios, { AxiosError, AxiosRequestConfig } from 'axios'

export const okamiHttpGateway = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
})

export const isUnauthorizedError = (error: AxiosError): boolean =>
  [403, 401].includes(error.response?.status || 0)

export const customInstance = <T>(
  config: AxiosRequestConfig,
  options?: AxiosRequestConfig,
): Promise<T> => {
  const controller = new AbortController()

  const promise = okamiHttpGateway({
    ...config,
    ...options,
    signal: controller.signal,
  }).then(({ data }) => data)

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  promise.cancel = () => {
    controller.abort()
  }

  return promise
}
