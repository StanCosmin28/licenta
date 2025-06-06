"use client"

import { useMemo } from "react"
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function BMIRavenCorrelation({ data }) {
  const { scatterData, correlation, stats } = useMemo(() => {
    const scatterData = data.map((student) => ({
      x: student.IMC,
      y: student.rezultat_test_inteligență,
      name: student.id,
      sex: student.sex,
      categorie: student.categorie_IMC,
      sport: student.practică_sport_extrascolar,
    }))

    // Calculate correlation
    const meanIMC = data.reduce((sum, s) => sum + s.IMC, 0) / data.length
    const meanRaven = data.reduce((sum, s) => sum + s.rezultat_test_inteligență, 0) / data.length

    let numerator = 0
    let denomIMC = 0
    let denomRaven = 0

    data.forEach((student) => {
      const imcDiff = student.IMC - meanIMC
      const ravenDiff = student.rezultat_test_inteligență - meanRaven
      numerator += imcDiff * ravenDiff
      denomIMC += imcDiff * imcDiff
      denomRaven += ravenDiff * ravenDiff
    })

    const correlation = numerator / Math.sqrt(denomIMC * denomRaven)

    const stats = {
      meanIMC: meanIMC.toFixed(1),
      meanRaven: meanRaven.toFixed(1),
      minIMC: Math.min(...data.map((s) => s.IMC)).toFixed(1),
      maxIMC: Math.max(...data.map((s) => s.IMC)).toFixed(1),
      minRaven: Math.min(...data.map((s) => s.rezultat_test_inteligență)),
      maxRaven: Math.max(...data.map((s) => s.rezultat_test_inteligență)),
    }

    return { scatterData, correlation, stats }
  }, [data])

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-white dark:bg-gray-800 p-3 border rounded-lg shadow-lg">
          <p className="font-medium">{`Elev: ${data.name}`}</p>
          <p className="text-blue-600">{`IMC: ${data.x} kg/m²`}</p>
          <p className="text-green-600">{`Test Raven: ${data.y} puncte`}</p>
          <p className="text-gray-600">{`Gen: ${data.sex}`}</p>
          <p className="text-gray-600">{`Categorie IMC: ${data.categorie}`}</p>
          <p className="text-gray-600">{`Sport: ${data.sport ? "Da" : "Nu"}`}</p>
        </div>
      )
    }
    return null
  }

  const getCorrelationStrength = (corr) => {
    const abs = Math.abs(corr)
    if (abs >= 0.7) return "puternică"
    if (abs >= 0.5) return "moderată"
    if (abs >= 0.3) return "slabă"
    return "foarte slabă"
  }

  const getCorrelationColor = (corr) => {
    const abs = Math.abs(corr)
    if (abs >= 0.7) return "destructive"
    if (abs >= 0.5) return "default"
    if (abs >= 0.3) return "secondary"
    return "outline"
  }

  return (
    <div className="space-y-6">
      {/* Correlation Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Coeficient de Corelație</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{correlation.toFixed(3)}</div>
            <Badge variant={getCorrelationColor(correlation)} className="mt-2">
              Corelație {getCorrelationStrength(correlation)} {correlation < 0 ? "negativă" : "pozitivă"}
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">IMC Mediu</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.meanIMC}</div>
            <p className="text-sm text-muted-foreground">
              Interval: {stats.minIMC} - {stats.maxIMC} kg/m²
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Scor Raven Mediu</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.meanRaven}</div>
            <p className="text-sm text-muted-foreground">
              Interval: {stats.minRaven} - {stats.maxRaven} puncte
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Scatter Plot */}
      <Card>
        <CardHeader>
          <CardTitle>Corelația IMC - Test Raven</CardTitle>
          <CardDescription>
            Relația dintre Indicele de Masă Corporală și performanța la testul de inteligență Raven
          </CardDescription>
        </CardHeader>
        <CardContent>
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
                  name="Test Raven"
                  domain={[0, 60]}
                  label={{ value: "Scor Test Raven", angle: -90, position: "insideLeft" }}
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
        </CardContent>
      </Card>

      {/* Interpretation */}
      <Card>
        <CardHeader>
          <CardTitle>Interpretarea Corelației</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <p>
              <strong>Coeficientul de corelație Pearson:</strong> {correlation.toFixed(3)}
            </p>
            <p>
              <strong>Interpretare:</strong> Există o corelație {getCorrelationStrength(correlation)}{" "}
              {correlation < 0 ? "negativă" : "pozitivă"}
              între IMC și performanța la testul Raven.
            </p>
            {correlation < -0.3 && (
              <p className="text-red-600">
                ⚠️ Corelația negativă sugerează că IMC-ul mai mare este asociat cu scoruri mai mici la testul de
                inteligență.
              </p>
            )}
            {Math.abs(correlation) < 0.3 && (
              <p className="text-yellow-600">
                ℹ️ Corelația slabă indică o relație limitată între IMC și inteligență în acest eșantion.
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
