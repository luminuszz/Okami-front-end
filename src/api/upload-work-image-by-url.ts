import axios from 'axios'

export interface UploadWorkImageByUrl {
  url: string
  fileType: string
  image: File
}

export async function uploadWorkImageByUrl(params: UploadWorkImageByUrl) {
  await axios.put(params.url, params.image, {
    headers: {
      'Content-Type': params.fileType,
    },
  })
}
