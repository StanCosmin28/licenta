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
  ErrorBar,
  ScatterChart,
  Scatter,
} from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Student } from "../page"

interface RavenScoresByBMIProps {
  data: Student[]
}

export default function RavenScoresByBMI({ data }: RavenScoresByBMIProps) {
  const { boxPlotData, scatterData, stats } = useMemo(() => {
    const categories = ["subponderal", "normal", "supraponderal", "obez"]

    const boxPlotData = categories
      .map((category) => {
        const categoryStudents = data.filter((s) => s.categorie_IMC === category)
        const scores = categoryStudents.map((s) => s.rezultat_test_inteligență).sort((a, b) => a - b)

        if (scores.length === 0) {
          return null
        }

        const q1Index = Math.floor(scores.length * 0.25)
        const medianIndex = Math.floor(scores.length * 0.5)
        const q3Index = Math.floor(scores.length * 0.75)

        const q1 = scores[q1Index] || 0
        const median = scores[medianIndex] || 0
        const q3 = scores[q3Index] || 0
        const min = scores[0] || 0
        const max = scores[scores.length - 1] || 0
        const mean = scores.reduce((sum, score) => sum + score, 0) / scores.length

        return {
          category: category.charAt(0).toUpperCase() + category.slice(1),
          median: Number(median.toFixed(1)),
          q1: Number(q1.toFixed(1)),
          q3: Number(q3.toFixed(1)),
          min: Number(min.toFixed(1)),
          max: Number(max.toFixed(1)),
          mean: Number(mean.toFixed(1)),
          count: scores.length,
          lowerError: median - q1,
          upperError: q3 - median,
        }
      })
      .filter(Boolean)

    const scatterData = data.map((student) => ({
      x: student.IMC,
      y: student.rezultat_test_inteligență,
      name: student.id,
      category: student.categorie_IMC,
      sex: student.sex,
    }))

    const stats = {
      totalStudents: data.length,
      avgScore: (data.reduce((sum, s) => sum + s.rezultat_test_inteligență, 0) / data.length).toFixed(1),
      minScore: Math.min(...data.map((s) => s.rezultat_test_inteligență)),
      maxScore: Math.max(...data.map((s) => s.rezultat_test_inteligență)),
    }

    return { boxPlotData, scatterData, stats }
  }, [data])

  const BoxPlotTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = boxPlotData.find((d) => d?.category === label)
      return (
        <div className="bg-white dark:bg-gray-800 p-3 border rounded-lg shadow-lg">
          <p className="font-medium">{`Categorie: ${label}`}</p>
          <p className="text-gray-600">{`Numărul de elevi: ${data?.count}`}</p>
          <p className="text-blue-600">{`Mediana: ${data?.median} puncte`}</p>
          <p className="text-green-600">{`Media: ${data?.mean} puncte`}</p>
          <p className="text-orange-600">{`Q1: ${data?.q1} puncte`}</p>
          <p className="text-orange-600">{`Q3: ${data?.q3} puncte`}</p>
          <p className="text-red-600">{`Min: ${data?.min} puncte`}</p>
          <p className="text-red-600">{`Max: ${data?.max} puncte`}</p>
        </div>
      )
    }
    return null
  }

  const ScatterTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-white dark:bg-gray-800 p-3 border rounded-lg shadow-lg">
          <p className="font-medium">{`Elev: ${data.name}`}</p>
          <p className="text-blue-600">{`IMC: ${data.x} kg/m²`}</p>
          <p className="text-green-600">{`Scor Raven: ${data.y} puncte`}</p>
          <p className="text-gray-600">{`Categorie: ${data.category}`}</p>
          <p className="text-gray-600">{`Gen: ${data.sex}`}</p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="space-y-6">
      {/* Statistics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total Elevi</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalStudents}</div>
            <p className="text-sm text-muted-foreground">participanți</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Scor Mediu</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.avgScore}</div>
            <p className="text-sm text-muted-foreground">puncte</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Scor Minim</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.minScore}</div>
            <p className="text-sm text-muted-foreground">puncte</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Scor Maxim</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.maxScore}</div>
            <p className="text-sm text-muted-foreground">puncte</p>
          </CardContent>
        </Card>
      </div>

      {/* Box Plot Style Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Distribuția Scorurilor Raven pe Categorii IMC</CardTitle>
          <CardDescription>Mediana, cuartile și valorile extreme pentru fiecare categorie IMC</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="w-full h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={boxPlotData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" />
                <YAxis domain={[0, 60]} label={{ value: "Scor Test Raven", angle: -90, position: "insideLeft" }} />
                <Tooltip content={<BoxPlotTooltip />} />
                <Bar dataKey="median" fill="#8884d8" radius={[4, 4, 0, 0]}>
                  <ErrorBar dataKey="lowerError" width={4} stroke="#666" />
                  <ErrorBar dataKey="upperError" width={4} stroke="#666" />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Scatter Plot */}
      <Card>
        <CardHeader>
          <CardTitle>Distribuția Individuală - IMC vs Scor Raven</CardTitle>
          <CardDescription>Valorile individuale pentru fiecare elev</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="w-full h-80">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  type="number"
                  dataKey="x"
                  name="IMC"
                  domain={["dataMin - 2", "dataMax + 2"]}
                  label={{ value: "IMC (kg/m²)", position: "insideBottom", offset: -10 }}
                />
                <YAxis
                  type="number"
                  dataKey="y"
                  name="Scor Raven"
                  domain={[0, 60]}
                  label={{ value: "Scor Test Raven", angle: -90, position: "insideLeft" }}
                />
                <Tooltip content={<ScatterTooltip />} />
                <Scatter
                  name="Băieți"
                  data={scatterData.filter((d) => d.sex === "băiat")}
                  fill="#3b82f6"
                  fillOpacity={0.7}
                />
                <Scatter
                  name="Fete"
                  data={scatterData.filter((d) => d.sex === "fată")}
                  fill="#ec4899"
                  fillOpacity={0.7}
                />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Statistics by Category */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {boxPlotData.map((item) => (
          <Card key={item?.category}>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">{item?.category}</CardTitle>
              <CardDescription>{item?.count} elevi</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Media:</span>
                  <Badge variant="default">{item?.mean} puncte</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Mediana:</span>
                  <Badge variant="secondary">{item?.median} puncte</Badge>
                </div>
                <div className="text-sm space-y-1">
                  <div className="flex justify-between">
                    <span>Q1:</span>
                    <span className="font-medium">{item?.q1}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Q3:</span>
                    <span className="font-medium">{item?.q3}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Min-Max:</span>
                    <span className="font-medium">
                      {item?.min}-{item?.max}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Performance Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Analiza Performanțelor pe Categorii</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium mb-2">Categoria cu cea mai bună performanță:</h4>
                <div className="text-xl font-bold text-green-600">
                  {boxPlotData.reduce((max, item) => ((item?.mean || 0) > (max?.mean || 0) ? item : max))?.category}
                </div>
                <p className="text-sm text-muted-foreground">
                  Media: {boxPlotData.reduce((max, item) => ((item?.mean || 0) > (max?.mean || 0) ? item : max))?.mean}{" "}
                  puncte
                </p>
              </div>

              <div>
                <h4 className="font-medium mb-2">Categoria cu cea mai slabă performanță:</h4>
                <div className="text-xl font-bold text-red-600">
                  {
                    boxPlotData.reduce((min, item) =>
                      (item?.mean || Number.POSITIVE_INFINITY) < (min?.mean || Number.POSITIVE_INFINITY) ? item : min,
                    )?.category
                  }
                </div>
                <p className="text-sm text-muted-foreground">
                  Media:{" "}
                  {
                    boxPlotData.reduce((min, item) =>
                      (item?.mean || Number.POSITIVE_INFINITY) < (min?.mean || Number.POSITIVE_INFINITY) ? item : min,
                    )?.mean
                  }{" "}
                  puncte
                </p>
              </div>
            </div>

            <div className="pt-4 border-t">
              <h4 className="font-medium mb-2">Observații:</h4>
              <div className="space-y-1 text-sm text-muted-foreground">
                <p>
                  • Diferența maximă între categorii:{" "}
                  {boxPlotData.length > 0
                    ? (
                        Math.max(...boxPlotData.map((item) => item?.mean || 0)) -
                        Math.min(...boxPlotData.map((item) => item?.mean || Number.POSITIVE_INFINITY))
                      ).toFixed(1)
                    : "0"}{" "}
                  puncte
                </p>
                <p>
                  • Variabilitatea cea mai mare în categoria:{" "}
                  {
                    boxPlotData.reduce((max, item) =>
                      (item?.max || 0) - (item?.min || 0) > (max?.max || 0) - (max?.min || 0) ? item : max,
                    )?.category
                  }
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
