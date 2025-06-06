"use client"

import { useMemo } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { Student } from "../page"

interface IntelligencePercentageByBMIProps {
  data: Student[]
}

const INTELLIGENCE_COLORS = {
  Scăzut: "#ef4444",
  Mediu: "#f97316",
  "Peste Medie": "#eab308",
  "Foarte Bun": "#22c55e",
}

export default function IntelligencePercentageByBMI({ data }: IntelligencePercentageByBMIProps) {
  const chartData = useMemo(() => {
    const categories = ["subponderal", "normal", "supraponderal", "obez"]

    return categories
      .map((category) => {
        const categoryStudents = data.filter((s) => s.categorie_IMC === category)
        const total = categoryStudents.length

        if (total === 0) return null

        const levels = {
          scăzut: categoryStudents.filter((s) => s.nivel_inteligență === "scăzut").length,
          mediu: categoryStudents.filter((s) => s.nivel_inteligență === "mediu").length,
          "peste medie": categoryStudents.filter((s) => s.nivel_inteligență === "peste medie").length,
          "foarte bun": categoryStudents.filter((s) => s.nivel_inteligență === "foarte bun").length,
        }

        return {
          category: category.charAt(0).toUpperCase() + category.slice(1),
          Scăzut: Number(((levels.scăzut / total) * 100).toFixed(1)),
          Mediu: Number(((levels.mediu / total) * 100).toFixed(1)),
          "Peste Medie": Number(((levels["peste medie"] / total) * 100).toFixed(1)),
          "Foarte Bun": Number(((levels["foarte bun"] / total) * 100).toFixed(1)),
          total,
          counts: levels,
        }
      })
      .filter(Boolean)
  }, [data])

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = chartData.find((d) => d.category === label)
      return (
        <div className="bg-white dark:bg-gray-800 p-3 border rounded-lg shadow-lg">
          <p className="font-medium">{`Categorie IMC: ${label}`}</p>
          <p className="text-gray-600">{`Total elevi: ${data?.total}`}</p>
          {payload.map((entry: any, index: number) => {
            const count = data?.counts[entry.dataKey.toLowerCase().replace(" ", " ") as keyof typeof data.counts] || 0
            return (
              <p key={index} style={{ color: entry.color }}>
                {`${entry.dataKey}: ${entry.value}% (${count} elevi)`}
              </p>
            )
          })}
        </div>
      )
    }
    return null
  }

  return (
    <div className="space-y-6">
      {/* Percentage Bar Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Procentaje Niveluri de Inteligență pe Categorii IMC</CardTitle>
          <CardDescription>
            Distribuția procentuală a nivelurilor de inteligență în fiecare categorie IMC
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="w-full h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" />
                <YAxis label={{ value: "Procentaj (%)", angle: -90, position: "insideLeft" }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar dataKey="Scăzut" stackId="a" fill={INTELLIGENCE_COLORS.Scăzut} />
                <Bar dataKey="Mediu" stackId="a" fill={INTELLIGENCE_COLORS.Mediu} />
                <Bar dataKey="Peste Medie" stackId="a" fill={INTELLIGENCE_COLORS["Peste Medie"]} />
                <Bar dataKey="Foarte Bun" stackId="a" fill={INTELLIGENCE_COLORS["Foarte Bun"]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {chartData.map((item) => (
          <Card key={item.category}>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">{item.category}</CardTitle>
              <CardDescription>{item.total} elevi</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-green-600">Foarte Bun:</span>
                  <span className="font-medium">{item["Foarte Bun"]}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-yellow-600">Peste Medie:</span>
                  <span className="font-medium">{item["Peste Medie"]}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-orange-600">Mediu:</span>
                  <span className="font-medium">{item["Mediu"]}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-red-600">Scăzut:</span>
                  <span className="font-medium">{item["Scăzut"]}%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Performance Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Analiza Performanțelor</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium mb-2">Categorii cu performanțe ridicate (Foarte Bun + Peste Medie):</h4>
                <div className="space-y-1">
                  {chartData
                    .map((item) => ({
                      ...item,
                      highPerformance: item["Foarte Bun"] + item["Peste Medie"],
                    }))
                    .sort((a, b) => b.highPerformance - a.highPerformance)
                    .map((item) => (
                      <div key={item.category} className="flex justify-between text-sm">
                        <span>{item.category}:</span>
                        <span className="font-medium text-green-600">{item.highPerformance.toFixed(1)}%</span>
                      </div>
                    ))}
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Categorii cu performanțe scăzute (Scăzut + Mediu):</h4>
                <div className="space-y-1">
                  {chartData
                    .map((item) => ({
                      ...item,
                      lowPerformance: item["Scăzut"] + item["Mediu"],
                    }))
                    .sort((a, b) => b.lowPerformance - a.lowPerformance)
                    .map((item) => (
                      <div key={item.category} className="flex justify-between text-sm">
                        <span>{item.category}:</span>
                        <span className="font-medium text-red-600">{item.lowPerformance.toFixed(1)}%</span>
                      </div>
                    ))}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t">
              <h4 className="font-medium mb-2">Observații:</h4>
              <div className="space-y-1 text-sm text-muted-foreground">
                {chartData.length > 0 && (
                  <>
                    <p>
                      • Categoria cu cel mai mare procent de performanțe ridicate:{" "}
                      <strong>
                        {
                          chartData
                            .map((item) => ({
                              ...item,
                              highPerformance: item["Foarte Bun"] + item["Peste Medie"],
                            }))
                            .reduce((max, item) => (item.highPerformance > max.highPerformance ? item : max)).category
                        }
                      </strong>
                    </p>
                    <p>
                      • Categoria cu cel mai mic procent de performanțe ridicate:{" "}
                      <strong>
                        {
                          chartData
                            .map((item) => ({
                              ...item,
                              highPerformance: item["Foarte Bun"] + item["Peste Medie"],
                            }))
                            .reduce((min, item) => (item.highPerformance < min.highPerformance ? item : min)).category
                        }
                      </strong>
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
