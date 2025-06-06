"use client"

import { useMemo } from "react"

export default function HeatmapChart({ data }) {
  const correlationMatrix = useMemo(() => {
    const variables = [
      { key: "IMC", label: "IMC" },
      { key: "rezultat_test_inteligență", label: "Inteligență" },
      { key: "vârsta", label: "Vârstă" },
      { key: "sport_numeric", label: "Sport" },
    ]

    // Convert boolean sport to numeric
    const processedData = data.map((student) => ({
      ...student,
      sport_numeric: student.practică_sport_extrascolar ? 1 : 0,
    }))

    const matrix = variables.map((varA) =>
      variables.map((varB) => {
        if (varA.key === varB.key) return 1

        const valuesA = processedData.map((d) => d[varA.key])
        const valuesB = processedData.map((d) => d[varB.key])

        const meanA = valuesA.reduce((sum, val) => sum + val, 0) / valuesA.length
        const meanB = valuesB.reduce((sum, val) => sum + val, 0) / valuesB.length

        let numerator = 0
        let denomA = 0
        let denomB = 0

        for (let i = 0; i < valuesA.length; i++) {
          const diffA = valuesA[i] - meanA
          const diffB = valuesB[i] - meanB
          numerator += diffA * diffB
          denomA += diffA * diffA
          denomB += diffB * diffB
        }

        const correlation = numerator / Math.sqrt(denomA * denomB)
        return isNaN(correlation) ? 0 : correlation
      }),
    )

    return { variables, matrix }
  }, [data])

  const getColor = (value) => {
    const intensity = Math.abs(value)
    if (value > 0) {
      return `rgba(34, 197, 94, ${intensity})` // Green for positive correlation
    } else {
      return `rgba(239, 68, 68, ${intensity})` // Red for negative correlation
    }
  }

  return (
    <div className="w-full h-96 flex items-center justify-center">
      <div className="grid grid-cols-4 gap-1 p-4">
        {/* Header row */}
        <div></div>
        {correlationMatrix.variables.map((variable, index) => (
          <div key={index} className="text-center text-sm font-medium p-2">
            {variable.label}
          </div>
        ))}

        {/* Matrix rows */}
        {correlationMatrix.variables.map((rowVar, rowIndex) => (
          <div key={rowIndex} className="contents">
            <div className="text-sm font-medium p-2 text-right">{rowVar.label}</div>
            {correlationMatrix.matrix[rowIndex].map((value, colIndex) => (
              <div
                key={colIndex}
                className="w-16 h-16 flex items-center justify-center text-xs font-bold text-white rounded border"
                style={{ backgroundColor: getColor(value) }}
                title={`${rowVar.label} vs ${correlationMatrix.variables[colIndex].label}: ${value.toFixed(3)}`}
              >
                {value.toFixed(2)}
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="ml-8 space-y-2">
        <div className="text-sm font-medium">Corelația</div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-red-500 rounded"></div>
          <span className="text-xs">Negativă</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-green-500 rounded"></div>
          <span className="text-xs">Pozitivă</span>
        </div>
        <div className="text-xs text-gray-600 mt-2">
          Valorile apropiate de ±1 indică
          <br />
          corelații puternice
        </div>
      </div>
    </div>
  )
}
