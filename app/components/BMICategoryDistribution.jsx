"use client"

import { useMemo } from "react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const COLORS = {
  subponderal: "#fbbf24",
  normal: "#10b981",
  supraponderal: "#f97316",
  obez: "#ef4444",
}

export default function BMICategoryDistribution({ data }) {
  const chartData = useMemo(() => {
    const categories = ["subponderal", "normal", "supraponderal", "obez"]
    const total = data.length

    return categories
      .map((category) => {
        const count = data.filter((s) => s.categorie_IMC === category).length
        const percentage = total > 0 ? ((count / total) * 100).toFixed(1) : "0"

        return {
          category: category.charAt(0).toUpperCase() + category.slice(1),
          count,
          percentage: Number(percentage),
          color: COLORS[category],
        }
      })
      .filter((item) => item.count > 0)
  }, [data])

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-white dark:bg-gray-800 p-3 border rounded-lg shadow-lg">
          <p className="font-medium">{`Categorie: ${label || data.category}`}</p>
          <p className="text-blue-600">{`Numărul: ${data.count || payload[0].value} elevi`}</p>
          <p className="text-green-600">{`Procentaj: ${data.percentage || payload[0].payload.percentage}%`}</p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="space-y-6">
      {/* Bar Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Distribuția pe Categorii IMC - Bar Chart</CardTitle>
          <CardDescription>Numărul de elevi pe fiecare categorie</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="w-full h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Pie Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Distribuția pe Categorii IMC - Pie Chart</CardTitle>
          <CardDescription>Proporția fiecărei categorii</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="w-full h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ percentage }) => `${percentage.toFixed(1)}%`}
                  outerRadius={120}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Summary Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {chartData.map((item) => (
          <Card key={item.category}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">{item.category}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{item.count}</div>
              <p className="text-sm text-muted-foreground">{item.percentage}% din total</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
