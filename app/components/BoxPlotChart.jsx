"use client"

import { useMemo } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ErrorBar } from "recharts"

export default function BoxPlotChart({ data }) {
  const boxPlotData = useMemo(() => {
    return ["subponderal", "normal", "supraponderal", "obez"]
      .map((category) => {
        const categoryStudents = data.filter((s) => s.categorie_IMC === category)
        const scores = categoryStudents.map((s) => s.rezultat_test_inteligență).sort((a, b) => a - b)

        if (scores.length === 0) {
          return {
            category: category.charAt(0).toUpperCase() + category.slice(1),
            median: 0,
            q1: 0,
            q3: 0,
            min: 0,
            max: 0,
            mean: 0,
            count: 0,
          }
        }

        const q1Index = Math.floor(scores.length * 0.25)
        const medianIndex = Math.floor(scores.length * 0.5)
        const q3Index = Math.floor(scores.length * 0.75)

        const q1 = scores[q1Index]
        const median = scores[medianIndex]
        const q3 = scores[q3Index]
        const min = scores[0]
        const max = scores[scores.length - 1]
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
      .filter((item) => item.count > 0)
  }, [data])

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = boxPlotData.find((d) => d.category === label)
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

  return (
    <div className="w-full h-96">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={boxPlotData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="category" />
          <YAxis domain={[0, 60]} label={{ value: "Scor Inteligență", angle: -90, position: "insideLeft" }} />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="median" fill="#8884d8" radius={[4, 4, 0, 0]}>
            <ErrorBar dataKey="lowerError" width={4} stroke="#666" />
            <ErrorBar dataKey="upperError" width={4} stroke="#666" />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
