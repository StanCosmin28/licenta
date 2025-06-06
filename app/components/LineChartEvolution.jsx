"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"

export default function LineChartEvolution({ data }) {
  const chartData = [11, 12, 13, 14, 15].map((age) => {
    const ageStudents = data.filter((s) => s.vârsta === age)
    const avgScore =
      ageStudents.length > 0
        ? ageStudents.reduce((sum, s) => sum + s.rezultat_test_inteligență, 0) / ageStudents.length
        : 0

    const avgIMC = ageStudents.length > 0 ? ageStudents.reduce((sum, s) => sum + s.IMC, 0) / ageStudents.length : 0

    const boys = ageStudents.filter((s) => s.sex === "băiat")
    const girls = ageStudents.filter((s) => s.sex === "fată")

    const avgScoreBoys =
      boys.length > 0 ? boys.reduce((sum, s) => sum + s.rezultat_test_inteligență, 0) / boys.length : 0

    const avgScoreGirls =
      girls.length > 0 ? girls.reduce((sum, s) => sum + s.rezultat_test_inteligență, 0) / girls.length : 0

    return {
      age: `${age} ani`,
      "Scor General": Number(avgScore.toFixed(1)),
      "IMC Mediu": Number(avgIMC.toFixed(1)),
      Băieți: Number(avgScoreBoys.toFixed(1)),
      Fete: Number(avgScoreGirls.toFixed(1)),
      count: ageStudents.length,
    }
  })

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = chartData.find((d) => d.age === label)
      return (
        <div className="bg-white dark:bg-gray-800 p-3 border rounded-lg shadow-lg">
          <p className="font-medium">{`Vârsta: ${label}`}</p>
          <p className="text-gray-600">{`Numărul de elevi: ${data?.count}`}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }}>
              {`${entry.dataKey}: ${entry.value}${entry.dataKey === "IMC Mediu" ? " kg/m²" : " puncte"}`}
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
        <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="age" />
          <YAxis
            yAxisId="left"
            domain={[0, 60]}
            label={{ value: "Scor Inteligență", angle: -90, position: "insideLeft" }}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            domain={[15, 35]}
            label={{ value: "IMC (kg/m²)", angle: 90, position: "insideRight" }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Line yAxisId="left" type="monotone" dataKey="Scor General" stroke="#8884d8" strokeWidth={3} dot={{ r: 6 }} />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="Băieți"
            stroke="#3b82f6"
            strokeWidth={2}
            strokeDasharray="5 5"
          />
          <Line yAxisId="left" type="monotone" dataKey="Fete" stroke="#ec4899" strokeWidth={2} strokeDasharray="5 5" />
          <Line yAxisId="right" type="monotone" dataKey="IMC Mediu" stroke="#10b981" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
