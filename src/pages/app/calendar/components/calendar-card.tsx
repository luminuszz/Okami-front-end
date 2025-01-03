import { isToday } from 'date-fns'
import { ChevronDown } from 'lucide-react'
import { Link } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

export interface CalendarCardProps {
  date: {
    dayOfWeek: string
    currentDay: string
    id: string
    originalDate: Date
  }

  works: Array<{
    name: string
    imageUrl: string
    id: string
    nextChapter: number | null
    chapter: number
    status: string
    category: string
  }>
}

export function CalendarCard({ date, works }: CalendarCardProps) {
  const highlightDate = isToday(date.originalDate)

  return (
    <Card
      className=" flex h-full max-h-[400px] w-full flex-1  rounded-lg"
      key={date.id}
    >
      <div className=" flex w-full max-w-[120px] flex-col items-center justify-center space-y-2 border-r-2 p-4">
        <span
          className={`text-md font-medium ${highlightDate ? 'text-primary' : 'text-muted-foreground'}`}
        >
          {date.dayOfWeek}
        </span>
        <strong
          className={`text-4xl font-medium ${highlightDate ? 'text-primary' : 'text-muted-foreground'}`}
        >
          {date.currentDay}
        </strong>
      </div>

      <CardContent className="flex flex-1 flex-col gap-4  p-4">
        {works.map((work) => (
          <div className="flex items-center gap-4 " key={work.id}>
            <div className="size-[120px]">
              <img
                className="size-full rounded bg-cover"
                src={work.imageUrl ?? '/okami-logo.png'}
                alt={work.name}
              />
            </div>
            <section className="flex flex-col items-start gap-2">
              <strong className="text-sm text-foreground">{work.name}</strong>
              <Link
                to=""
                className={`text-sm ${work.status === 'UNREAD' ? 'text-emerald-500' : 'text-muted-foreground'}`}
              >
                {`${work.status === 'UNREAD' ? 'Novo' : 'Ultimo'} ${work.category === 'ANIME' ? 'Episódio' : 'Capitulo'} ${work.nextChapter ?? work.chapter}`}
              </Link>
            </section>
          </div>
        ))}
      </CardContent>

      <footer className="flex items-center justify-end p-4">
        <Button variant="secondary">
          Ações
          <ChevronDown className="ml-1 text-sm" />
        </Button>
      </footer>
    </Card>
  )
}
