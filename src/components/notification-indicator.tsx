import {} from '@radix-ui/react-dropdown-menu'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { filter } from 'lodash'
import { Bell } from 'lucide-react'
import { Link } from 'react-router-dom'

import { getRecentNotifications } from '@/api/get-recent-notifications'
import { markNotificationAsRead } from '@/api/mark-notification-as-read'
import { NotificationType } from '@/api/schemas'
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
    <span className="absolute right-0 top-0 size-2 rounded-full bg-primary"></span>
  )
}
interface NotificationItemProps {
  content: {
    imageUrl: string
    message: string
    nextChapter: number
    name: string
    createdAt: string
    readAt: string | null
  }
}

function NotificationItem({ content }: NotificationItemProps) {
  const formattedUpdateAt = parseDistanceByDate(content.createdAt)

  return (
    <aside className="w-full max-w-[400px] p-2">
      <div className="flex  gap-2 ">
        {!content.readAt && (
          <div className="relative flex">
            <span className="absolute size-2 animate-ping rounded-full bg-primary opacity-75" />
            <span className="size-2 rounded-full bg-primary" />
          </div>
        )}

        <div className="flex flex-col gap-2">
          <p className="break-words text-sm text-muted-foreground">
            Obra atualizada: {content?.name}!
          </p>

          <span className="text-xs text-muted-foreground">
            {formattedUpdateAt}
          </span>
        </div>
      </div>

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
    </aside>
  )
}

interface UpdateNotificationCache {
  notificationId: string
  readAt: string | null
}

export function Notification() {
  const queryClient = useQueryClient()

  const queryNotificationsKey = ['recent-notifications']

  function updateNotificationCacheStatus({
    notificationId,
    readAt,
  }: UpdateNotificationCache) {
    queryClient.setQueryData<NotificationType[]>(
      queryNotificationsKey,
      (cache) => {
        if (!cache) return []

        return cache.map((item) =>
          item.id === notificationId ? { ...item, readAt } : item,
        )
      },
    )
  }

  const { mutate: markAsRead } = useMutation({
    mutationKey: ['mark-notification-as-read'],
    mutationFn: markNotificationAsRead,

    onMutate(notificationId) {
      updateNotificationCacheStatus({
        notificationId,
        readAt: new Date().toISOString(),
      })
    },

    onError(_, notificationId) {
      updateNotificationCacheStatus({
        notificationId,
        readAt: null,
      })
    },
  })

  const { data: notifications } = useQuery({
    queryKey: queryNotificationsKey,
    queryFn: getRecentNotifications,
    select: (data) => data?.slice(0, 5),
  })

  const hasNotifications = !!notifications?.length

  const unreadNotificationsCount = filter(notifications, {
    readAt: null,
  }).length

  const hasNewNotifications = !!unreadNotificationsCount

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

      <DropdownMenuContent className="mr-2 w-[300px] sm:w-full">
        <DropdownMenuLabel className="flex flex-col gap-2">
          <strong className="text-sm">Notificações</strong>
          {hasNotifications && (
            <span className="text-xs text-muted-foreground">{`Você tem ${unreadNotificationsCount} novas mensagens`}</span>
          )}
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        {!hasNotifications && (
          <DropdownMenuItem>
            <p className="text-muted-foreground">Nenhuma notificação</p>
          </DropdownMenuItem>
        )}

        {notifications?.map((item) => (
          <DropdownMenuItem
            key={item.id}
            onClick={() => {
              if (!item.readAt) {
                markAsRead(item.id)
              }
            }}
          >
            <NotificationItem
              content={{
                ...item.content,
                createdAt: item.createdAt,
                readAt: item.readAt,
              }}
            />
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
