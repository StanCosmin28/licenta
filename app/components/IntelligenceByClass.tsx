"use client"

import { useMemo } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { Student } from "../page"

interface IntelligenceByClassProps {
  data: Student[]
}

const INTELLIGENCE_COLORS = {
  scăzut: "#ef4444",
  mediu: "#f97316",
  "peste medie": "#eab308",
  "foarte bun": "#22c55e",
}

export default function IntelligenceByClass({ data }: IntelligenceByClassProps) {
  const chartData = useMemo(() => {
    const classes = ["a V-a", "a VI-a", "a VII-a", "a VIII-a"]

    return classes
      .map((className) => {
        const classStudents = data.filter((s) => s.clasa === className)

        const levels = {
          scăzut: classStudents.filter((s) => s.nivel_inteligență === "scăzut").length,
          mediu: classStudents.filter((s) => s.nivel_inteligență === "mediu").length,
          "peste medie": classStudents.filter((s) => s.nivel_inteligență === "peste medie").length,
          "foarte bun": classStudents.filter((s) => s.nivel_inteligență === "foarte bun").length,
        }

        const avgScore =
          classStudents.length > 0
            ? classStudents.reduce((sum, s) => sum + s.rezultat_test_inteligență, 0) / classStudents.length
            : 0

        return {
          class: className.replace("a ", "").replace("-a", ""),
          fullClass: className,
          Scăzut: levels.scăzut,
          Mediu: levels.mediu,
          "Peste Medie": levels["peste medie"],
          "Foarte Bun": levels["foarte bun"],
          avgScore: Number(avgScore.toFixed(1)),
          total: classStudents.length,
        }
      })
      .filter((item) => item.total > 0)
  }, [data])

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = chartData.find((d) => d.class === label)
      return (
        <div className="bg-white dark:bg-gray-800 p-3 border rounded-lg shadow-lg">
          <p className="font-medium">{`Clasa: ${data?.fullClass}`}</p>
          <p className="text-gray-600">{`Total elevi: ${data?.total}`}</p>
          <p className="text-blue-600">{`Scor mediu: ${data?.avgScore} puncte`}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }}>
              {`${entry.dataKey}: ${entry.value} elevi`}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  return (
    <div className="space-y-6">
      {/* Stacked Bar Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Distribuția Nivelurilor de Inteligență pe Clase</CardTitle>
          <CardDescription>Numărul de elevi pe fiecare nivel de inteligență</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="w-full h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="class" />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar dataKey="Scăzut" stackId="a" fill={INTELLIGENCE_COLORS.scăzut} />
                <Bar dataKey="Mediu" stackId="a" fill={INTELLIGENCE_COLORS.mediu} />
                <Bar dataKey="Peste Medie" stackId="a" fill={INTELLIGENCE_COLORS["peste medie"]} />
                <Bar dataKey="Foarte Bun" stackId="a" fill={INTELLIGENCE_COLORS["foarte bun"]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Average Scores by Class */}
      <Card>
        <CardHeader>
          <CardTitle>Scoruri Medii pe Clase</CardTitle>
          <CardDescription>Performanța medie la testul de inteligență</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="class" />
                <YAxis domain={[0, 60]} />
                <Tooltip
                  formatter={(value, name) => [`${value} puncte`, "Scor Mediu"]}
                  labelFormatter={(label) => `Clasa: ${chartData.find((d) => d.class === label)?.fullClass}`}
                />
                <Bar dataKey="avgScore" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {chartData.map((item) => (
          <Card key={item.class}>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">{item.fullClass}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="text-2xl font-bold">{item.avgScore}</div>
                <p className="text-sm text-muted-foreground">puncte (medie)</p>
                <div className="text-sm">
                  <div className="flex justify-between">
                    <span>Total elevi:</span>
                    <span className="font-medium">{item.total}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Foarte bun:</span>
                    <span className="font-medium text-green-600">{item["Foarte Bun"]}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Peste medie:</span>
                    <span className="font-medium text-yellow-600">{item["Peste Medie"]}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Analiza Tendințelor</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            {chartData.length > 1 && (
              <>
                <p>
                  <strong>Clasa cu cel mai mare scor mediu:</strong>{" "}
                  {chartData.reduce((max, item) => (item.avgScore > max.avgScore ? item : max)).fullClass} (
                  {chartData.reduce((max, item) => (item.avgScore > max.avgScore ? item : max)).avgScore} puncte)
                </p>
                <p>
                  <strong>Clasa cu cel mai mic scor mediu:</strong>{" "}
                  {chartData.reduce((min, item) => (item.avgScore < min.avgScore ? item : min)).fullClass} (
                  {chartData.reduce((min, item) => (item.avgScore < min.avgScore ? item : min)).avgScore} puncte)
                </p>
                <p>
                  <strong>Diferența maximă:</strong>{" "}
                  {(
                    Math.max(...chartData.map((item) => item.avgScore)) -
                    Math.min(...chartData.map((item) => item.avgScore))
                  ).toFixed(1)}{" "}
                  puncte
                </p>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
