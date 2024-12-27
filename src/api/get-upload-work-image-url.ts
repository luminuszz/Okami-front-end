// /work/upload/get-upload-url

import { okamiHttpGateway } from '@/lib/axios'

export interface GetUploadWorkImageUrlParams {
  workId: string
  fileType: string
  fileName: string
}

export interface GetUploadWorkImageUrlResponse {
  filename: string
  url: string
}

export async function getUploadWorkImageUrl({
  fileName,
  fileType,
  workId,
}: GetUploadWorkImageUrlParams) {
  const { data } = await okamiHttpGateway.post<GetUploadWorkImageUrlResponse>(
    '/work/upload/get-upload-url',
    {
      fileName,
      fileType,
      workId,
    },
  )

  return data
}
