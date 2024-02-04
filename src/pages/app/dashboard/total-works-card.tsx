import { useQuery } from '@tanstack/react-query'
import { Book } from 'lucide-react'

import { GetUserDetailsType } from '@/api/get-user-details'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function TotalWorksCard() {
  const { data: totalWorks } = useQuery({
    queryKey: ['user-details'],
    select: (data: GetUserDetailsType) => data.readingWorksCount,
  })
  return (
    <Card className="w-full ">
      <CardHeader className="flex-row items-center justify-between gap-4 space-y-0">
        <CardTitle className="text-base font-semibold">
          Total de Obras
        </CardTitle>
        <Book className="size-5 text-muted-foreground" />
      </CardHeader>

      <CardContent className="space-y-1">
        <span className="text-2xl font-bold">{totalWorks}</span>
        <p className="text-xs text-muted-foreground">
          Total de obras sincronizadas
        </p>
      </CardContent>
    </Card>
  )
}