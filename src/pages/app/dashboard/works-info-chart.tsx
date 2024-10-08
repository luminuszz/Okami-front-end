import { useQuery } from '@tanstack/react-query'
import { BarChart, Loader2 } from 'lucide-react'
import { Cell, Legend, Pie, PieChart, ResponsiveContainer } from 'recharts'
import colors from 'tailwindcss/colors'

import { getUserAnalytics } from '@/api/get-user-analytics'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { useMediaQuery } from '@/utils/helpers.ts'

export function WorksInfoChart() {
  const { data: analytics, isLoading } = useQuery({
    queryKey: ['user-analytics'],
    queryFn: getUserAnalytics,
  })

  const isTablet = useMediaQuery('md')

  const data = [
    {
      name: 'Obras lidas',
      value: analytics?.totalOfWorksRead,
      color: colors.cyan[500],
    },
    {
      name: 'Obras não lidas',
      value: analytics?.totalOfWorksUnread,
      color: colors.amber[500],
    },
    {
      name: 'Obras finalizadas',
      value: analytics?.totalOfWorksFinished,
      color: colors.emerald[500],
    },
  ]

  const noHaveValues = Object.values(analytics ?? {}).every(
    (value) => value === 0,
  )

  return (
    <Card>
      <CardHeader className="flex  flex-row items-center justify-between pb-8">
        <div className="space-y-1">
          <CardTitle className="text-base font-medium">
            Dados Analíticos
          </CardTitle>
          <CardDescription>Dados dos seu banco de obras</CardDescription>
        </div>

        <div>
          <BarChart className="size-5 text-muted-foreground" />
        </div>
      </CardHeader>

      <CardContent>
        {isLoading && (
          <div className="flex items-center justify-center">
            <Loader2 className="size-30 animate-spin text-muted-foreground" />
          </div>
        )}

        {!noHaveValues ? (
          <>
            <ResponsiveContainer height={400} width="100%">
              <PieChart style={{ fontSize: 12 }}>
                <Pie
                  dataKey="value"
                  data={data}
                  cx="50%"
                  cy="50%"
                  outerRadius={isTablet ? 100 : 150}
                  innerRadius={isTablet ? 80 : 100}
                  strokeWidth={8}
                  labelLine={false}
                  label={({
                    cx,
                    cy,
                    midAngle,
                    innerRadius,
                    outerRadius,
                    index,
                  }) => {
                    const RADIAN = Math.PI / 180
                    const radius =
                      12 + innerRadius + (outerRadius - innerRadius)
                    const x = cx + radius * Math.cos(-midAngle * RADIAN)
                    const y = cy + radius * Math.sin(-midAngle * RADIAN)

                    const currentCell = data[index]

                    return isTablet ? null : (
                      <text
                        x={x}
                        y={y}
                        className="fill-muted-foreground text-xs"
                        textAnchor={x > cx ? 'start' : 'end'}
                        dominantBaseline="central"
                      >
                        {`${currentCell.name}: ${currentCell.value}`}
                      </text>
                    )
                  }}
                >
                  {data.map((data) => (
                    <Cell
                      key={data.name}
                      fill={data.color}
                      name={data.name}
                      className="stroke-background hover:opacity-80"
                    />
                  ))}
                </Pie>

                {isTablet && <Legend />}
              </PieChart>
            </ResponsiveContainer>
          </>
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <span className="text-muted-foreground">
              Não há dados para exibir
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
