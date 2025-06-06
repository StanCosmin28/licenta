"use client"

import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts"

export default function BubbleChart({ data }) {
  const bubbleData = data.map((student) => ({
    x: student.IMC,
    y: student.rezultat_test_inteligență,
    z: student.vârsta * 3, // Size multiplier for visibility
    name: student.id,
    sex: student.sex,
    age: student.vârsta,
    categorie: student.categorie_IMC,
    sport: student.practică_sport_extrascolar,
  }))

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-white dark:bg-gray-800 p-3 border rounded-lg shadow-lg">
          <p className="font-medium">{`Elev: ${data.name}`}</p>
          <p className="text-blue-600">{`IMC: ${data.x} kg/m²`}</p>
          <p className="text-green-600">{`Scor Inteligență: ${data.y} puncte`}</p>
          <p className="text-purple-600">{`Vârsta: ${data.age} ani`}</p>
          <p className="text-gray-600">{`Gen: ${data.sex}`}</p>
          <p className="text-gray-600">{`Categorie IMC: ${data.categorie}`}</p>
          <p className="text-gray-600">{`Sport: ${data.sport ? "Da" : "Nu"}`}</p>
        </div>
      )
    }
    return null
  }

  const getColor = (student) => {
    if (student.sex === "băiat") {
      return student.sport ? "#3b82f6" : "#93c5fd"
    } else {
      return student.sport ? "#ec4899" : "#f9a8d4"
    }
  }

  return (
    <div className="w-full h-96">
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
            name="Inteligență"
            domain={[0, 60]}
            label={{ value: "Scor Inteligență", angle: -90, position: "insideLeft" }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Scatter name="Elevi" data={bubbleData} fill="#8884d8">
            {bubbleData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getColor(entry)} />
            ))}
          </Scatter>
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  )
}
