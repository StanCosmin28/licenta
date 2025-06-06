"use client"

import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts"

export default function ScatterPlotChart({ data }) {
  const scatterData = data.map((student) => ({
    x: student.IMC,
    y: student.rezultat_test_inteligență,
    name: student.id,
    sex: student.sex,
    categorie: student.categorie_IMC,
    sport: student.practică_sport_extrascolar,
  }))

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-white dark:bg-gray-800 p-3 border rounded-lg shadow-lg">
          <p className="font-medium">{`Elev: ${data.name}`}</p>
          <p className="text-blue-600">{`IMC: ${data.x}`}</p>
          <p className="text-green-600">{`Scor Inteligență: ${data.y}`}</p>
          <p className="text-gray-600">{`Gen: ${data.sex}`}</p>
          <p className="text-gray-600">{`Categorie IMC: ${data.categorie}`}</p>
          <p className="text-gray-600">{`Sport: ${data.sport ? "Da" : "Nu"}`}</p>
        </div>
      )
    }
    return null
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

          {/* Reference lines for normal BMI range */}
          <ReferenceLine x={18.5} stroke="#fbbf24" strokeDasharray="5 5" />
          <ReferenceLine x={25} stroke="#fbbf24" strokeDasharray="5 5" />

          <Scatter
            name="Băieți cu sport"
            data={scatterData.filter((d) => d.sex === "băiat" && d.sport)}
            fill="#3b82f6"
            fillOpacity={0.8}
          />
          <Scatter
            name="Băieți fără sport"
            data={scatterData.filter((d) => d.sex === "băiat" && !d.sport)}
            fill="#3b82f6"
            fillOpacity={0.4}
          />
          <Scatter
            name="Fete cu sport"
            data={scatterData.filter((d) => d.sex === "fată" && d.sport)}
            fill="#ec4899"
            fillOpacity={0.8}
          />
          <Scatter
            name="Fete fără sport"
            data={scatterData.filter((d) => d.sex === "fată" && !d.sport)}
            fill="#ec4899"
            fillOpacity={0.4}
          />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  )
}
