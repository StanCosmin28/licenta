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
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const COLORS = ["#10b981", "#ef4444"]

export default function SportsByBMICategory({ data }) {
  const chartData = useMemo(() => {
    const categories = ["subponderal", "normal", "supraponderal", "obez"]

    return categories
      .map((category) => {
        const categoryStudents = data.filter((s) => s.categorie_IMC === category)
        const withSports = categoryStudents.filter((s) => s.practică_sport_extrascolar).length
        const withoutSports = categoryStudents.length - withSports
        const total = categoryStudents.length

        const sportsPercentage = total > 0 ? ((withSports / total) * 100).toFixed(1) : "0"

        return {
          category: category.charAt(0).toUpperCase() + category.slice(1),
          "Cu Sport": withSports,
          "Fără Sport": withoutSports,
          total,
          sportsPercentage: Number(sportsPercentage),
        }
      })
      .filter((item) => item.total > 0)
  }, [data])

  const pieData = useMemo(() => {
    const totalWithSports = data.filter((s) => s.practică_sport_extrascolar).length
    const totalWithoutSports = data.length - totalWithSports

    return [
      { name: "Cu Sport", value: totalWithSports, color: COLORS[0] },
      { name: "Fără Sport", value: totalWithoutSports, color: COLORS[1] },
    ]
  }, [data])

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = chartData.find((d) => d.category === label)
      return (
        <div className="bg-white dark:bg-gray-800 p-3 border rounded-lg shadow-lg">
          <p className="font-medium">{`Categorie IMC: ${label}`}</p>
          <p className="text-gray-600">{`Total elevi: ${data?.total}`}</p>
          <p className="text-green-600">{`Procent cu sport: ${data?.sportsPercentage}%`}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }}>
              {`${entry.dataKey}: ${entry.value} elevi`}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  const PieTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      const total = pieData.reduce((sum, item) => sum + item.value, 0)
      const percentage = ((data.value / total) * 100).toFixed(1)
      return (
        <div className="bg-white dark:bg-gray-800 p-3 border rounded-lg shadow-lg">
          <p className="font-medium">{data.name}</p>
          <p className="text-blue-600">{`Numărul: ${data.value} elevi`}</p>
          <p className="text-green-600">{`Procentaj: ${percentage}%`}</p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="space-y-6">
      {/* Bar Chart by BMI Category */}
      <Card>
        <CardHeader>
          <CardTitle>Participarea la Sport pe Categorii IMC</CardTitle>
          <CardDescription>Distribuția elevilor care practică sport extrașcolar</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="w-full h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar dataKey="Cu Sport" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Fără Sport" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Overall Distribution Pie Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Distribuția Generală Sport</CardTitle>
            <CardDescription>Proporția totală de elevi care practică sport</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="w-full h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ percentage }) => `${percentage.toFixed(1)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<PieTooltip />} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Statistics Cards */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Statistici pe Categorii</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {chartData.map((item) => (
                  <div key={item.category} className="flex justify-between items-center">
                    <span className="font-medium">{item.category}:</span>
                    <div className="text-right">
                      <div className="font-bold">{item.sportsPercentage}%</div>
                      <div className="text-sm text-muted-foreground">
                        {item["Cu Sport"]}/{item.total} elevi
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Observații</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                {chartData.length > 0 && (
                  <>
                    <p>
                      <strong>Cea mai activă categorie:</strong>{" "}
                      {
                        chartData.reduce((max, item) => (item.sportsPercentage > max.sportsPercentage ? item : max))
                          .category
                      }{" "}
                      (
                      {
                        chartData.reduce((max, item) => (item.sportsPercentage > max.sportsPercentage ? item : max))
                          .sportsPercentage
                      }
                      %)
                    </p>
                    <p>
                      <strong>Cea mai puțin activă categorie:</strong>{" "}
                      {
                        chartData.reduce((min, item) => (item.sportsPercentage < min.sportsPercentage ? item : min))
                          .category
                      }{" "}
                      (
                      {
                        chartData.reduce((min, item) => (item.sportsPercentage < min.sportsPercentage ? item : min))
                          .sportsPercentage
                      }
                      %)
                    </p>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
