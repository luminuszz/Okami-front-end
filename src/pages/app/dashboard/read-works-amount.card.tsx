import { useQuery } from '@tanstack/react-query'
import { BookCheck } from 'lucide-react'

import { fetchWorksWithFilter } from '@/api/fetch-for-works-with-filter'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function ReadWorksAmountCard() {
  const { data: totalWorksRead } = useQuery({
    queryKey: ['works', 'read'],
    queryFn: () => fetchWorksWithFilter('read'),
    select: (works) => works.length,
  })

  return (
    <Card className="w-full">
      <CardHeader className="flex-row items-center justify-between gap-4 space-y-0">
        <CardTitle className="text-base font-semibold">Obras lidas</CardTitle>
        <BookCheck className="size-5 text-cyan-500" />
      </CardHeader>

      <CardContent className="space-y-1">
        <span className="text-2xl font-bold">{totalWorksRead}</span>
        <p className="text-xs text-muted-foreground">Total de obras lidas</p>
      </CardContent>
    </Card>
  )
}