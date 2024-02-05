import { ImagePlus } from 'lucide-react'
import { useFormContext } from 'react-hook-form'

import { EditWorkForm } from '@/pages/app/works/edit-work-form'

import { Input } from '../../../components/ui/input'

export function ImageSelector() {
  const { watch, register } = useFormContext<EditWorkForm>()

  const imageData = watch('imageFile') as unknown as FileList

  const defaultImageUrl = watch('imageUrl')

  const imageUrl = imageData?.length
    ? URL.createObjectURL(imageData[0])
    : defaultImageUrl

  return (
    <label htmlFor="fileInput" className="relative cursor-pointer">
      <ImagePlus className="absolute right-1 top-2 text-muted" />
      <img
        src={imageUrl}
        alt="image"
        className="size-full rounded bg-contain"
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
