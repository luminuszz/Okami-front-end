import { useQuery } from '@tanstack/react-query'
import { ChevronDown, LogOut, User } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import { getUserDetails } from '@/api/get-user-details'
import { LocalStorageKeys } from '@/lib/utils'

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
import { Skeleton } from './ui/skeleton'

export function AccountMenu() {
  const navigate = useNavigate()
  const { data: user, isLoading } = useQuery({
    queryFn: getUserDetails,
    queryKey: ['user-details'],
  })

  const initialName = user?.name?.substring(0, 2).toLocaleUpperCase()

  function handleLogout() {
    localStorage.removeItem(LocalStorageKeys.token)
    navigate('/auth/sign-in')
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="flex select-none items-center gap-2"
        >
          {isLoading ? (
            <>
              <Skeleton className="size-8 rounded-full" />
              <div className="flex flex-col gap-1">
                <Skeleton className="h-2 w-20 rounded-s" />
                <Skeleton className="h-2 w-20 rounded-s" />
              </div>
            </>
          ) : (
            <>
              <Avatar className="h-8 w-8">
                {user?.avatarImageUrl ? (
                  <AvatarImage className="size-8" src={user.avatarImageUrl} />
                ) : (
                  <AvatarFallback>{initialName}</AvatarFallback>
                )}
              </Avatar>
              {user?.name}
              <ChevronDown className="h-4 w-4" />
            </>
          )}
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

        <DropdownMenuItem
          className="cursor-pointer text-rose-500 dark:text-rose-400"
          onClick={handleLogout}
        >
          <LogOut className="mr-2 size-4" />
          <span>Sair</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
