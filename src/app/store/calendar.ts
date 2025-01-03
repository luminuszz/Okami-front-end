import {
  eachDayOfInterval,
  endOfWeek,
  format,
  getDay,
  startOfWeek,
} from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { atom } from 'jotai'

import { capitalizeFirstLetter } from '@/utils/helpers'

export const todayAtom = atom(new Date())

export const currentWeekDaysAtom = atom((get) => {
  const currentDate = get(todayAtom)

  const startDateOnWeek = startOfWeek(currentDate, { locale: ptBR })
  const endDateOnWeek = endOfWeek(currentDate, { locale: ptBR })

  return eachDayOfInterval({
    start: startDateOnWeek,
    end: endDateOnWeek,
  })
})

export const formattedCurrentWeekDaysAtom = atom((get) => {
  return get(currentWeekDaysAtom).map((date) => ({
    dayOfWeekNumber: getDay(date),
    currentDay: format(date, 'dd', { locale: ptBR }),
    dayOfWeek: capitalizeFirstLetter(format(date, 'EE', { locale: ptBR })),
    id: date.toISOString(),
    originalDate: date,
  }))
})
