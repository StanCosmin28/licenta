"use client"

import {
  AreaChart as RechartsAreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"

export default function AreaChart({ data }) {
  const chartData = ["a V-a", "a VI-a", "a VII-a", "a VIII-a"].map((grade) => {
    const gradeStudents = data.filter((s) => s.clasa === grade)

    const levels = {
      scăzut: gradeStudents.filter((s) => s.nivel_inteligență === "scăzut").length,
      mediu: gradeStudents.filter((s) => s.nivel_inteligență === "mediu").length,
      "peste medie": gradeStudents.filter((s) => s.nivel_inteligență === "peste medie").length,
      "foarte bun": gradeStudents.filter((s) => s.nivel_inteligență === "foarte bun").length,
    }

    const avgScore =
      gradeStudents.length > 0
        ? gradeStudents.reduce((sum, s) => sum + s.rezultat_test_inteligență, 0) / gradeStudents.length
        : 0

    return {
      grade: grade.replace("a ", "").replace("-a", ""),
      Scăzut: levels["scăzut"],
      Mediu: levels["mediu"],
      "Peste Medie": levels["peste medie"],
      "Foarte Bun": levels["foarte bun"],
      "Scor Mediu": Number(avgScore.toFixed(1)),
      total: gradeStudents.length,
    }
  })

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = chartData.find((d) => d.grade === label)
      return (
        <div className="bg-white dark:bg-gray-800 p-3 border rounded-lg shadow-lg">
          <p className="font-medium">{`Clasa: ${label}`}</p>
          <p className="text-gray-600">{`Total elevi: ${data?.total}`}</p>
          <p className="text-blue-600">{`Scor mediu: ${data?.["Scor Mediu"]} puncte`}</p>
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

  return (
    <div className="w-full h-96">
      <ResponsiveContainer width="100%" height="100%">
        <RechartsAreaChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="grade" />
          <YAxis label={{ value: "Numărul de elevi", angle: -90, position: "insideLeft" }} />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Area type="monotone" dataKey="Foarte Bun" stackId="1" stroke="#22c55e" fill="#22c55e" fillOpacity={0.8} />
          <Area type="monotone" dataKey="Peste Medie" stackId="1" stroke="#eab308" fill="#eab308" fillOpacity={0.8} />
          <Area type="monotone" dataKey="Mediu" stackId="1" stroke="#f97316" fill="#f97316" fillOpacity={0.8} />
          <Area type="monotone" dataKey="Scăzut" stackId="1" stroke="#ef4444" fill="#ef4444" fillOpacity={0.8} />
        </RechartsAreaChart>
      </ResponsiveContainer>
    </div>
  )
}
