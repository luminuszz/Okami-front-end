import { useEffect, useMemo } from 'react'
import { useFormContext } from 'react-hook-form'
import { z } from 'zod'

import { Input } from '@/components/ui/input.tsx'
import { EditWorkFormDialog } from '@/pages/app/works/edit-work-form-dialog.tsx'
import { validateFileType } from '@/utils/helpers.ts'

const parseClipboardFileSchema = z.instanceof(FileList).refine(validateFileType)

interface ImageSelectorProps {
  isRound?: boolean
}

export function ImageSelector({ isRound }: ImageSelectorProps) {
  const { watch, register, setValue } = useFormContext<EditWorkFormDialog>()

  const imageData = watch('imageFile') as unknown as FileList

  const defaultImageUrl = watch('imageUrl')

  const imageUrl = useMemo(
    () =>
      imageData?.length ? URL.createObjectURL(imageData[0]) : defaultImageUrl,
    [imageData, defaultImageUrl],
  )

  useEffect(() => {
    document.onpaste = (event) => {
      const parsedFileList = parseClipboardFileSchema.safeParse(
        event?.clipboardData?.files,
      )

      if (!parsedFileList.success) return

      setValue('imageFile', parsedFileList.data as never, {
        shouldDirty: true,
      })
    }

    return () => {
      document.onpaste = null

      setValue('imageFile', null)
    }
  }, [setValue])

  return (
    <label htmlFor="fileInput" className="relative size-full cursor-pointer">
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
