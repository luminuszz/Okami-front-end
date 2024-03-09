import {} from '@radix-ui/react-dropdown-menu'
import { useQuery } from '@tanstack/react-query'
import { some } from 'lodash'
import { Bell } from 'lucide-react'
import { Link } from 'react-router-dom'

import { getRecentNotifications } from '@/api/get-recent-notifications'
import { parseDistanceByDate } from '@/lib/utils'

import { Button } from './ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'

function NotificationIndicator() {
  return (
    <span className="absolute right-0 top-0 size-2 rounded-full bg-muted-foreground"></span>
  )
}
interface NotificationItemProps {
  content?: {
    imageUrl: string
    message: string
    nextChapter: number
    name: string
    createdAt: string
  }
}

function NotificationItem({ content }: NotificationItemProps) {
  const formattedUpdateAt = parseDistanceByDate(content?.createdAt ?? '')

  return (
    <div className="flex max-w-2xl flex-1 flex-col gap-2  p-2">
      <p className="break-words text-sm text-muted-foreground">
        Obra atualizada: {content?.name}!
      </p>
      <span className="text-xs text-muted-foreground">{formattedUpdateAt}</span>

      <div className="flex justify-end">
        <Link
          to={{
            pathname: '/works',
            search: `name=${content?.name}&status=`,
          }}
        >
          Ir para obra
        </Link>
      </div>
    </div>
  )
}

export function Notification() {
  const { data: notifications } = useQuery({
    queryKey: ['recent-notifications'],
    queryFn: getRecentNotifications,
    select: (data) => data?.slice(0, 5),
  })

  const hasNewNotifications = some(notifications, { readAt: null })

  function markAsRead() {
    // eslint-disable-next-line no-console
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          size="icon"
          variant="link"
          className="relative flex justify-center gap-2"
        >
          <Bell className="size-6 text-muted-foreground" />
          {hasNewNotifications && <NotificationIndicator />}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent>
        <DropdownMenuLabel className="flex flex-col gap-2">
          <strong className="text-sm">Notificações</strong>
          <span className="text-xs text-muted-foreground">{`Você tem ${notifications?.length ?? 0} novas mensagens`}</span>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        {notifications?.map((item) => (
          <DropdownMenuItem key={item.id} onClick={markAsRead}>
            <NotificationItem
              content={{ ...item.content, createdAt: item.createdAt }}
            />
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
