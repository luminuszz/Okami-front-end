import { Cell, Legend, Pie, PieChart, ResponsiveContainer } from 'recharts'
import colors from 'tailwindcss/colors'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

const data = [
  { name: 'Obras lidas', value: 50, color: colors.cyan[600] },
  { name: 'Obras não lidas', value: 20, color: colors.yellow[600] },
  { name: 'Obras finalizadas', value: 10, color: colors.emerald[600] },
]

const RADIAN = Math.PI / 180

type LabelProps = {
  cx: number
  cy: number
  midAngle: number
  innerRadius: number
  outerRadius: number
  percent: number
  index: number
}

const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
}: LabelProps) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5
  const x = cx + radius * Math.cos(-midAngle * RADIAN)
  const y = cy + radius * Math.sin(-midAngle * RADIAN)

  return (
    <text
      className="text-sm font-semibold"
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? 'start' : 'end'}
      dominantBaseline="central"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  )
}

export function WorksInfoChart() {
  return (
    <Card className="col-span-5">
      <CardHeader className="flex  flex-row items-center justify-between pb-8">
        <div className="space-y-1">
          <CardTitle className="text-base font-medium">
            Dados Analíticos
          </CardTitle>
          <CardDescription>Dados dos seu banco de obras</CardDescription>
        </div>
      </CardHeader>

      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <PieChart style={{ fontSize: 12 }}>
            <Legend
              iconSize={10}
              layout="vertical"
              verticalAlign="top"
              align="left"
            />
            <Pie
              dataKey="value"
              labelLine={false}
              data={data}
              outerRadius={200}
              label={renderCustomizedLabel}
            >
              {data.map((data) => (
                <Cell key={data.name} fill={data.color} name={data.name} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
