import axios from 'axios'

import {
  GetAuthTokenInput,
  getUserDetailsSchema,
  GetUserDetailsSchemaType,
  getWorksResponse,
  MarkWorkReadInput,
} from './schemas'

export const okamiHttpGateway = axios.create({
  baseURL: 'http://localhost:3000',
})

okamiHttpGateway.interceptors.request.use((config) => {
  const tokenOrNull = localStorage.getItem('@okami-web:token')

  if (tokenOrNull) {
    config.headers.Authorization = `Bearer ${tokenOrNull}`
  }

  return config
})

export const getAuthToken = async (payload: GetAuthTokenInput) => {
  const { data } = await okamiHttpGateway.post<{ token: string }>(
    '/auth/login',
    payload,
  )

  return {
    token: data.token,
  }
}

export const getUserDetails = async () => {
  const { data } =
    await okamiHttpGateway.get<GetUserDetailsSchemaType>('/auth/user/me')

  return getUserDetailsSchema.parse(data)
}

export const fetchWorksWithFilter = async (filter: string) => {
  const { data } = await okamiHttpGateway.get(
    `/work/fetch-for-workers-${filter}`,
  )

  return getWorksResponse.parse(data)
}

export const markWorkAsRead = async ({
  chapter,
  workId,
}: MarkWorkReadInput) => {
  await okamiHttpGateway.patch(`/work/${workId}/update-chapter`, {
    chapter,
  })
}
