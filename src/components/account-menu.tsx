import { ChevronDown, LogOut, User } from 'lucide-react'
import { useQuery } from 'react-query'

import { getUserDetails } from '@/services/okami-api/okami'

import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Button } from './ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'

export function AccountMenu() {
  const { data: user } = useQuery({
    queryFn: getUserDetails,
    queryKey: getUserDetails.name,
  })

  const initialName = user?.name?.substring(0, 2).toLocaleUpperCase()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="flex select-none items-center gap-2"
        >
          <Avatar className="h-8 w-8">
            {user?.avatarImageUrl ? (
              <AvatarImage className="size-8" src={user.avatarImageUrl} />
            ) : (
              <AvatarFallback>{initialName}</AvatarFallback>
            )}
          </Avatar>
          {user?.name}
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="flex flex-col">
          <span>{user?.name}</span>
          <span className="text-xs font-normal text-muted-foreground">
            {user?.email}
          </span>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuItem className="cursor-pointer">
          <User className="mr-2 size-4" />
          <span>Perfil</span>
        </DropdownMenuItem>

        <DropdownMenuItem className="cursor-pointer text-rose-500 dark:text-rose-400">
          <LogOut className="mr-2 size-4" />
          <span>Sair</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
