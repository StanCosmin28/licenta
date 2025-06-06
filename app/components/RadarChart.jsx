"use client"

import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts"

export default function RadarChartComponent({ data }) {
  const radarData = ["subponderal", "normal", "supraponderal", "obez"]
    .map((category) => {
      const categoryStudents = data.filter((s) => s.categorie_IMC === category)

      if (categoryStudents.length === 0) return null

      const avgScore =
        categoryStudents.reduce((sum, s) => sum + s.rezultat_test_inteligență, 0) / categoryStudents.length
      const avgIMC = categoryStudents.reduce((sum, s) => sum + s.IMC, 0) / categoryStudents.length
      const avgAge = categoryStudents.reduce((sum, s) => sum + s.vârsta, 0) / categoryStudents.length
      const sportsPercentage =
        (categoryStudents.filter((s) => s.practică_sport_extrascolar).length / categoryStudents.length) * 100

      return {
        category: category.charAt(0).toUpperCase() + category.slice(1),
        "Scor Inteligență": Number(((avgScore / 60) * 100).toFixed(1)),
        "IMC Normalizat": Number((((avgIMC - 15) / (35 - 15)) * 100).toFixed(1)),
        "Vârsta Normalizată": Number((((avgAge - 11) / (15 - 11)) * 100).toFixed(1)),
        "Sport (%)": Number(sportsPercentage.toFixed(1)),
        count: categoryStudents.length,
      }
    })
    .filter(Boolean)

  const metrics = [
    { subject: "Scor Inteligență", fullMark: 100 },
    { subject: "IMC Normalizat", fullMark: 100 },
    { subject: "Vârsta Normalizată", fullMark: 100 },
    { subject: "Sport (%)", fullMark: 100 },
  ]

  const colors = ["#8884d8", "#82ca9d", "#ffc658", "#ff7300"]

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 border rounded-lg shadow-lg">
          <p className="font-medium">{`Metrica: ${label}`}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }}>
              {`${entry.payload.category}: ${entry.value}%`}
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
        <RadarChart data={metrics} margin={{ top: 20, right: 80, bottom: 20, left: 80 }}>
          <PolarGrid />
          <PolarAngleAxis dataKey="subject" />
          <PolarRadiusAxis angle={90} domain={[0, 100]} />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          {radarData.map((categoryData, index) => (
            <Radar
              key={categoryData?.category}
              name={categoryData?.category}
              dataKey={categoryData?.category}
              stroke={colors[index]}
              fill={colors[index]}
              fillOpacity={0.1}
              strokeWidth={2}
              data={metrics.map((metric) => ({
                ...metric,
                [categoryData?.category || ""]: categoryData?.[metric.subject] || 0,
              }))}
            />
          ))}
        </RadarChart>
      </ResponsiveContainer>
    </div>
  )
}
