import { okamiHttpGateway } from '@/lib/axios'

export async function uploadWorkImage(data: FormData) {
  await okamiHttpGateway.post(
    `/work/upload-work-image/${data.get('id')}`,
    data,
    {
      headers: { 'Content-Type': 'multipart/form-data' },
    },
  )
}
