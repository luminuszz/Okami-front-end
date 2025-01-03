import { useAtom, useAtomValue } from 'jotai'
import { groupBy } from 'lodash'

import { useCalendarControllerFetchUserCalendar } from '@/api/generated/okami'
import { formattedCurrentWeekDaysAtom, todayAtom } from '@/app/store/calendar'
import { Calendar } from '@/components/ui/calendar'
import { Card, CardContent } from '@/components/ui/card'

import { CalendarCard } from './components/calendar-card'

export function CalendarPage() {
  const [today, setToday] = useAtom(todayAtom)

  const week = useAtomValue(formattedCurrentWeekDaysAtom)

  const { data: calendar } = useCalendarControllerFetchUserCalendar()

  const parsedCalendarRows = groupBy(calendar?.rows, 'dayOfWeek')

  return (
    <main className="flex w-full gap-4">
      <aside>
        <Card>
          <CardContent>
            <Calendar
              mode="single"
              selected={today}
              onSelect={(date) => {
                if (date) setToday(date)
              }}
            />
          </CardContent>
        </Card>
      </aside>

      <section className="item flex w-full flex-1 flex-col gap-4">
        {week.map((date) => {
          const currentDayWorks =
            parsedCalendarRows?.[date.dayOfWeekNumber - 1] ?? []

          return (
            <CalendarCard
              date={date}
              key={date.id}
              works={currentDayWorks.map((item) => ({
                imageUrl: item.Work.imageUrl ?? '',
                name: item.Work.name,
                id: item.id,
                category: item.Work.category,
                chapter: item.Work.chapter,
                nextChapter: item.Work.nextChapter,
                status: item.Work.status,
              }))}
            />
          )
        })}
      </section>
    </main>
  )
}
