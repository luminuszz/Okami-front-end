import { useMutation, useQuery } from '@tanstack/react-query'
import { filter, map } from 'lodash'
import { Bell } from 'lucide-react'
import { Link } from 'react-router-dom'

import { getRecentNotifications } from '@/api/get-recent-notifications'
import { markNotificationAsRead } from '@/api/mark-notification-as-read'
import { NotificationType } from '@/api/schemas'
import { parseDistanceByDate, useUpdateQueryCache } from '@/utils/helpers.ts'

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
    workId?: string
  }
}

function NotificationItem({ content }: NotificationItemProps) {
  const formattedUpdateAt = parseDistanceByDate(content.createdAt)

  const isChapter = content.message.normalize('NFC').includes('Capítulo')

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
          <span className="fon text-xs font-medium text-muted-foreground">
            {`${isChapter ? 'Capitulo' : 'Episodio'} ${content.nextChapter}`}
          </span>

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

export function NotificationTab() {
  const queryNotificationsKey = ['recent-notifications']

  const { updateCache: updateNotificationCacheList } = useUpdateQueryCache<
    NotificationType[]
  >(queryNotificationsKey)

  const { mutate: markAsRead } = useMutation({
    mutationKey: ['mark-notification-as-read'],
    mutationFn: markNotificationAsRead,

    onMutate(notificationId) {
      return updateNotificationCacheList((cache) =>
        map(cache, (item) =>
          item.id === notificationId
            ? { ...item, readAt: new Date().toISOString() }
            : item,
        ),
      )
    },

    onError(_, __, oldCache) {
      updateNotificationCacheList(oldCache)
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
