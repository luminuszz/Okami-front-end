export async function compressImageAsync(
  file: File,
  quality = 0.8,
): Promise<File> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => {
      const img = new Image()
      img.src = reader.result as string
      img.onload = () => {
        const canvas = document.createElement('canvas')
        canvas.width = img.width
        canvas.height = img.height
        const ctx = canvas.getContext('2d')
        if (!ctx) {
          reject(new Error('Canvas context not available'))
          return
        }

        ctx.drawImage(img, 0, 0)
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const webpFile = new File(
                [blob],
                file.name.replace(/\.[^.]+$/, '.webp'),
                {
                  type: 'image/webp',
                  lastModified: new Date().getTime(),
                },
              )
              resolve(webpFile)
            } else {
              reject(new Error('Failed to convert to WebP'))
            }
          },
          'image/webp',
          quality,
        )
      }
      img.onerror = reject
    }
    reader.onerror = reject
  })
}
