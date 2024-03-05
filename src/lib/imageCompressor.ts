import ImageCompressor from 'compressorjs'

export async function compressImageAsync(file: File) {
  const results = await new Promise((resolve, reject) => {
    // eslint-disable-next-line no-new
    new ImageCompressor(file, {
      convertSize: 0,
      resize: 'contain',
      quality: 0.7,
      success: resolve,
      error: reject,
    })
  })

  return results as File
}
