"use client"

import { useMemo } from "react"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const COLORS = {
  băiat: "#3b82f6",
  fată: "#ec4899",
}

export default function GenderDistribution({ data }) {
  const genderData = useMemo(() => {
    const boys = data.filter((s) => s.sex === "băiat").length
    const girls = data.filter((s) => s.sex === "fată").length
    const total = data.length

    return [
      {
        name: "Băieți",
        value: boys,
        percentage: total > 0 ? ((boys / total) * 100).toFixed(1) : "0",
        color: COLORS.băiat,
      },
      {
        name: "Fete",
        value: girls,
        percentage: total > 0 ? ((girls / total) * 100).toFixed(1) : "0",
        color: COLORS.fată,
      },
    ]
  }, [data])

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-white dark:bg-gray-800 p-3 border rounded-lg shadow-lg">
          <p className="font-medium">{data.name}</p>
          <p className="text-blue-600">{`Numărul: ${data.value} elevi`}</p>
          <p className="text-green-600">{`Procentaj: ${data.percentage}%`}</p>
        </div>
      )
    }
    return null
  }

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    const RADIAN = Math.PI / 180
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5
    const x = cx + radius * Math.cos(-midAngle * RADIAN)
    const y = cy + radius * Math.sin(-midAngle * RADIAN)

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        fontSize={14}
        fontWeight="bold"
      >
        {`${(percent * 100).toFixed(1)}%`}
      </text>
    )
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        {genderData.map((item) => (
          <Card key={item.name}>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">{item.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{item.value}</div>
              <Badge variant="secondary" className="mt-1">
                {item.percentage}%
              </Badge>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="w-full h-80">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={genderData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomizedLabel}
              outerRadius={120}
              fill="#8884d8"
              dataKey="value"
            >
              {genderData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Analiza Distribuției pe Gen</CardTitle>
          <CardDescription>Echilibrul de gen în eșantion</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            {Math.abs(genderData[0].value - genderData[1].value) <= 2
              ? "✅ Distribuția este echilibrată (diferența ≤ 2 elevi)"
              : "⚠️ Distribuția nu este perfect echilibrată"}
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Diferența: {Math.abs(genderData[0].value - genderData[1].value)} elevi
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
