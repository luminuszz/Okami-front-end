import { DialogTitle } from '@radix-ui/react-dialog'
import { useQueryClient } from '@tanstack/react-query'

import { GetUserDetailsType } from '@/api/get-user-details'

import { Avatar, AvatarImage } from './ui/avatar'
import { DialogContent, DialogHeader } from './ui/dialog'

export function ProfileDialog() {
  const queryClient = useQueryClient()

  const userDetails = queryClient.getQueryData<GetUserDetailsType>([
    'user-details',
  ])

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Perfil</DialogTitle>
      </DialogHeader>
      <div className="flex flex-col items-center justify-center gap-2">
        <Avatar className="size-[200px]">
          <AvatarImage src={userDetails?.avatarImageUrl} />
        </Avatar>

        <span className="text-sm font-bold">{userDetails?.name}</span>
        <span className="text-sm text-muted-foreground">
          {userDetails?.email}
        </span>
      </div>
    </DialogContent>
  )
}
