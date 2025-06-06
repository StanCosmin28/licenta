"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"

export default function GroupedBarChart({ data }) {
  const chartData = ["subponderal", "normal", "supraponderal", "obez"].map((category) => {
    const categoryStudents = data.filter((s) => s.categorie_IMC === category)

    const boys = categoryStudents.filter((s) => s.sex === "băiat")
    const girls = categoryStudents.filter((s) => s.sex === "fată")

    const avgScoreBoys =
      boys.length > 0 ? boys.reduce((sum, s) => sum + s.rezultat_test_inteligență, 0) / boys.length : 0

    const avgScoreGirls =
      girls.length > 0 ? girls.reduce((sum, s) => sum + s.rezultat_test_inteligență, 0) / girls.length : 0

    return {
      category: category.charAt(0).toUpperCase() + category.slice(1),
      Băieți: Number(avgScoreBoys.toFixed(1)),
      Fete: Number(avgScoreGirls.toFixed(1)),
      countBoys: boys.length,
      countGirls: girls.length,
    }
  })

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = chartData.find((d) => d.category === label)
      return (
        <div className="bg-white dark:bg-gray-800 p-3 border rounded-lg shadow-lg">
          <p className="font-medium">{`Categorie IMC: ${label}`}</p>
          <p className="text-blue-600">{`Băieți: ${data?.countBoys} elevi`}</p>
          <p className="text-pink-600">{`Fete: ${data?.countGirls} elevi`}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }}>
              {`Scor mediu ${entry.dataKey}: ${entry.value} puncte`}
            </p>
          ))}
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
          <YAxis domain={[0, 60]} label={{ value: "Scor Inteligență", angle: -90, position: "insideLeft" }} />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Bar dataKey="Băieți" fill="#3b82f6" radius={[4, 4, 0, 0]} />
          <Bar dataKey="Fete" fill="#ec4899" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
