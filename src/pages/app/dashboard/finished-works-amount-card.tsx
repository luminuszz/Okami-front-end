import { useQuery } from '@tanstack/react-query'
import { Check } from 'lucide-react'

import { GetUserDetailsType } from '@/api/get-user-details'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export function FinishedWorksAmountCard() {
  const { data: totalWorksFinished, isLoading } = useQuery({
    queryKey: ['user-details'],
    select: (data: GetUserDetailsType) => data.finishedWorksCount,
  })

  if (isLoading) {
    return <Skeleton className="h-max-[140px] w-full rounded-lg" />
  }

  return (
    <Card className="w-full">
      <CardHeader className="flex-row items-center justify-between gap-4 space-y-0">
        <CardTitle className="text-base font-semibold">
          Obras finalizadas
        </CardTitle>
        <Check className="size-5 text-emerald-600 dark:text-emerald-500" />
      </CardHeader>

      <CardContent className="space-y-1">
        <span className="text-2xl font-bold">{totalWorksFinished}</span>
        <p className="text-xs text-muted-foreground">
          Total de obras finalizadas
        </p>
      </CardContent>
    </Card>
  )
}
