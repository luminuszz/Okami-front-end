import { useQuery } from '@tanstack/react-query'
import { Info } from 'lucide-react'

import { fetchWorksWithFilter } from '@/api/fetch-for-works-with-filter'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export function UnreadWorksAmountCard() {
  const filter = 'unread'

  const { data: totalWorksUnread, isLoading } = useQuery({
    queryKey: ['works', filter],
    queryFn: () => fetchWorksWithFilter({ status: filter }),
    select: (works) => works.length,
  })

  if (isLoading) {
    return <Skeleton className="h-max-[140px] w-full rounded-lg" />
  }

  return (
    <Card className="w-full">
      <CardHeader className="flex-row items-center justify-between gap-4 space-y-0">
        <CardTitle className="text-base font-semibold">
          Obras não lidas
        </CardTitle>
        <Info className="size-5  text-yellow-600 dark:text-yellow-500" />
      </CardHeader>

      <CardContent className="space-y-1">
        <span className="text-2xl font-bold">{totalWorksUnread}</span>
        <p className="text-xs text-muted-foreground">
          Total de obras não lidas
        </p>
      </CardContent>
    </Card>
  )
}
