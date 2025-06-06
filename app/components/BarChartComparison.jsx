"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"

export default function BarChartComparison({ data }) {
  const chartData = ["subponderal", "normal", "supraponderal", "obez"].map((category) => {
    const categoryStudents = data.filter((s) => s.categorie_IMC === category)
    const avgScore =
      categoryStudents.length > 0
        ? categoryStudents.reduce((sum, s) => sum + s.rezultat_test_inteligență, 0) / categoryStudents.length
        : 0

    const withSports = categoryStudents.filter((s) => s.practică_sport_extrascolar)
    const withoutSports = categoryStudents.filter((s) => !s.practică_sport_extrascolar)

    const avgWithSports =
      withSports.length > 0
        ? withSports.reduce((sum, s) => sum + s.rezultat_test_inteligență, 0) / withSports.length
        : 0

    const avgWithoutSports =
      withoutSports.length > 0
        ? withoutSports.reduce((sum, s) => sum + s.rezultat_test_inteligență, 0) / withoutSports.length
        : 0

    return {
      category: category.charAt(0).toUpperCase() + category.slice(1),
      "Scor General": Number(avgScore.toFixed(1)),
      "Cu Sport": Number(avgWithSports.toFixed(1)),
      "Fără Sport": Number(avgWithoutSports.toFixed(1)),
      count: categoryStudents.length,
    }
  })

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = chartData.find((d) => d.category === label)
      return (
        <div className="bg-white dark:bg-gray-800 p-3 border rounded-lg shadow-lg">
          <p className="font-medium">{`Categorie: ${label}`}</p>
          <p className="text-gray-600">{`Numărul de elevi: ${data?.count}`}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }}>
              {`${entry.dataKey}: ${entry.value} puncte`}
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
          <Bar dataKey="Scor General" fill="#8884d8" radius={[4, 4, 0, 0]} />
          <Bar dataKey="Cu Sport" fill="#82ca9d" radius={[4, 4, 0, 0]} />
          <Bar dataKey="Fără Sport" fill="#ffc658" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
