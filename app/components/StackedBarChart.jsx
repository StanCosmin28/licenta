"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"

export default function StackedBarChart({ data }) {
  const chartData = ["subponderal", "normal", "supraponderal", "obez"]
    .map((category) => {
      const categoryStudents = data.filter((s) => s.categorie_IMC === category)

      const levels = {
        scăzut: categoryStudents.filter((s) => s.nivel_inteligență === "scăzut").length,
        mediu: categoryStudents.filter((s) => s.nivel_inteligență === "mediu").length,
        "peste medie": categoryStudents.filter((s) => s.nivel_inteligență === "peste medie").length,
        "foarte bun": categoryStudents.filter((s) => s.nivel_inteligență === "foarte bun").length,
      }

      return {
        category: category.charAt(0).toUpperCase() + category.slice(1),
        Scăzut: levels["scăzut"],
        Mediu: levels["mediu"],
        "Peste Medie": levels["peste medie"],
        "Foarte Bun": levels["foarte bun"],
        total: categoryStudents.length,
      }
    })
    .filter((item) => item.total > 0)

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = chartData.find((d) => d.category === label)
      const total = data?.total || 0

      return (
        <div className="bg-white dark:bg-gray-800 p-3 border rounded-lg shadow-lg">
          <p className="font-medium">{`Categorie IMC: ${label}`}</p>
          <p className="text-gray-600">{`Total elevi: ${total}`}</p>
          {payload.map((entry, index) => {
            const percentage = total > 0 ? ((entry.value / total) * 100).toFixed(1) : "0"
            return (
              <p key={index} style={{ color: entry.color }}>
                {`${entry.dataKey}: ${entry.value} elevi (${percentage}%)`}
              </p>
            )
          })}
        </div>
      )
    }
    return null
  }

  return (
    <div className="w-full h-96">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="category" />
          <YAxis label={{ value: "Numărul de elevi", angle: -90, position: "insideLeft" }} />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Bar dataKey="Scăzut" stackId="a" fill="#ef4444" />
          <Bar dataKey="Mediu" stackId="a" fill="#f97316" />
          <Bar dataKey="Peste Medie" stackId="a" fill="#eab308" />
          <Bar dataKey="Foarte Bun" stackId="a" fill="#22c55e" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
