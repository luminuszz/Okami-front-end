import { useEffect } from 'react'
import { useFormContext } from 'react-hook-form'
import { z } from 'zod'

import { validateFileType } from '@/lib/utils'
import { EditWorkForm } from '@/pages/app/works/edit-work-form'

import { Input } from '../../../components/ui/input'

const parseClipboardFileSchema = z.instanceof(FileList).refine(validateFileType)

interface ImageSelectorProps {
  isRound?: boolean
}

export function ImageSelector({ isRound }: ImageSelectorProps) {
  const { watch, register, setValue } = useFormContext<EditWorkForm>()

  const imageData = watch('imageFile') as unknown as FileList

  const defaultImageUrl = watch('imageUrl')

  const imageUrl = imageData?.length
    ? URL.createObjectURL(imageData[0])
    : defaultImageUrl

  useEffect(() => {
    document.onpaste = (event) => {
      const parsedFileList = parseClipboardFileSchema.safeParse(
        event?.clipboardData?.files,
      )

      if (!parsedFileList.success) return

      setValue('imageFile', parsedFileList.data as any, {
        shouldDirty: true,
      })
    }

    return () => {
      document.onpaste = null

      setValue('imageFile', null)
    }
  }, [])

  return (
    <label htmlFor="fileInput" className="relative cursor-pointer">
      <img
        data-isRound={isRound}
        src={imageUrl}
        alt="image"
        className="size-full rounded bg-contain data-[isRound]:rounded-full"
      />

      <Input
        {...register('imageFile')}
        type="file"
        id="fileInput"
        accept="image/*"
        className="none hidden"
      />
    </label>
  )
}
