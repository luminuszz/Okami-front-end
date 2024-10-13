import { useMutation } from '@tanstack/react-query'
import { clsx } from 'clsx'
import { Heart } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

import { toggleWorkFavorite } from '@/api/toggle-work-favorite.ts'
import { Button } from '@/components/ui/button.tsx'

export interface WorkFavoriteButtonProps {
  initialState: boolean
  workId: string
}

export function WorkFavoriteButton({
  initialState,
  workId,
}: WorkFavoriteButtonProps) {
  const [isFavorite, setIsFavorite] = useState(initialState)

  const { mutate: handleToggleFavorite, isPending } = useMutation({
    mutationFn: () => toggleWorkFavorite(workId),
    mutationKey: ['toggle-favorite-work', workId],

    onMutate() {
      setIsFavorite((prev) => !prev)
    },

    onError() {
      setIsFavorite((prev) => !prev)
      toast.error('Erro ao favoritar obra')
    },
  })

  return (
    <Button
      disabled={isPending}
      className="text-muted-foreground"
      size="icon"
      variant="ghost"
      onClick={() => handleToggleFavorite()}
    >
      <Heart
        size="20"
        className={clsx('', {
          'fill-foreground text-foreground': isFavorite,
          '': !isFavorite,
        })}
      />
    </Button>
  )
}
