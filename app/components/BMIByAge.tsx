"use client"

import { useMemo } from "react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ScatterChart,
  Scatter,
} from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { Student } from "../page"

interface BMIByAgeProps {
  data: Student[]
}

export default function BMIByAge({ data }: BMIByAgeProps) {
  const { lineData, scatterData, stats } = useMemo(() => {
    const ages = [11, 12, 13, 14, 15]

    const lineData = ages
      .map((age) => {
        const ageStudents = data.filter((s) => s.vârsta === age)

        const boys = ageStudents.filter((s) => s.sex === "băiat")
        const girls = ageStudents.filter((s) => s.sex === "fată")

        const avgIMC = ageStudents.length > 0 ? ageStudents.reduce((sum, s) => sum + s.IMC, 0) / ageStudents.length : 0

        const avgIMCBoys = boys.length > 0 ? boys.reduce((sum, s) => sum + s.IMC, 0) / boys.length : 0

        const avgIMCGirls = girls.length > 0 ? girls.reduce((sum, s) => sum + s.IMC, 0) / girls.length : 0

        return {
          age,
          "IMC General": Number(avgIMC.toFixed(1)),
          "IMC Băieți": Number(avgIMCBoys.toFixed(1)),
          "IMC Fete": Number(avgIMCGirls.toFixed(1)),
          count: ageStudents.length,
          countBoys: boys.length,
          countGirls: girls.length,
        }
      })
      .filter((item) => item.count > 0)

    const scatterData = data.map((student) => ({
      x: student.vârsta,
      y: student.IMC,
      name: student.id,
      sex: student.sex,
      categorie: student.categorie_IMC,
    }))

    const stats = {
      minIMC: Math.min(...data.map((s) => s.IMC)).toFixed(1),
      maxIMC: Math.max(...data.map((s) => s.IMC)).toFixed(1),
      avgIMC: (data.reduce((sum, s) => sum + s.IMC, 0) / data.length).toFixed(1),
    }

    return { lineData, scatterData, stats }
  }, [data])

  const LineTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = lineData.find((d) => d.age === label)
      return (
        <div className="bg-white dark:bg-gray-800 p-3 border rounded-lg shadow-lg">
          <p className="font-medium">{`Vârsta: ${label} ani`}</p>
          <p className="text-gray-600">{`Total elevi: ${data?.count} (B: ${data?.countBoys}, F: ${data?.countGirls})`}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }}>
              {`${entry.dataKey}: ${entry.value} kg/m²`}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  const ScatterTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-white dark:bg-gray-800 p-3 border rounded-lg shadow-lg">
          <p className="font-medium">{`Elev: ${data.name}`}</p>
          <p className="text-blue-600">{`Vârsta: ${data.x} ani`}</p>
          <p className="text-green-600">{`IMC: ${data.y} kg/m²`}</p>
          <p className="text-gray-600">{`Gen: ${data.sex}`}</p>
          <p className="text-gray-600">{`Categorie: ${data.categorie}`}</p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">IMC Minim</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.minIMC}</div>
            <p className="text-sm text-muted-foreground">kg/m²</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">IMC Mediu</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.avgIMC}</div>
            <p className="text-sm text-muted-foreground">kg/m²</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">IMC Maxim</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.maxIMC}</div>
            <p className="text-sm text-muted-foreground">kg/m²</p>
          </CardContent>
        </Card>
      </div>

      {/* Line Chart - Average BMI by Age */}
      <Card>
        <CardHeader>
          <CardTitle>Variația IMC pe Vârste - Medii</CardTitle>
          <CardDescription>Evoluția IMC-ului mediu pe grupe de vârstă și gen</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="w-full h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lineData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="age" label={{ value: "Vârsta (ani)", position: "insideBottom", offset: -10 }} />
                <YAxis label={{ value: "IMC (kg/m²)", angle: -90, position: "insideLeft" }} />
                <Tooltip content={<LineTooltip />} />
                <Legend />
                <Line type="monotone" dataKey="IMC General" stroke="#8884d8" strokeWidth={3} dot={{ r: 6 }} />
                <Line type="monotone" dataKey="IMC Băieți" stroke="#3b82f6" strokeWidth={2} strokeDasharray="5 5" />
                <Line type="monotone" dataKey="IMC Fete" stroke="#ec4899" strokeWidth={2} strokeDasharray="5 5" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Scatter Plot - Individual Values */}
      <Card>
        <CardHeader>
          <CardTitle>Distribuția Individuală IMC pe Vârste</CardTitle>
          <CardDescription>Valorile individuale ale IMC-ului pentru fiecare elev</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="w-full h-80">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  type="number"
                  dataKey="x"
                  name="Vârsta"
                  domain={[10, 16]}
                  label={{ value: "Vârsta (ani)", position: "insideBottom", offset: -10 }}
                />
                <YAxis
                  type="number"
                  dataKey="y"
                  name="IMC"
                  domain={["dataMin - 2", "dataMax + 2"]}
                  label={{ value: "IMC (kg/m²)", angle: -90, position: "insideLeft" }}
                />
                <Tooltip content={<ScatterTooltip />} />
                <Scatter
                  name="Băieți"
                  data={scatterData.filter((d) => d.sex === "băiat")}
                  fill="#3b82f6"
                  fillOpacity={0.7}
                />
                <Scatter
                  name="Fete"
                  data={scatterData.filter((d) => d.sex === "fată")}
                  fill="#ec4899"
                  fillOpacity={0.7}
                />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Age Group Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Analiza pe Grupe de Vârstă</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {lineData.map((item) => (
                <div key={item.age} className="flex justify-between items-center">
                  <span className="font-medium">{item.age} ani:</span>
                  <div className="text-right">
                    <div className="font-bold">{item["IMC General"]} kg/m²</div>
                    <div className="text-sm text-muted-foreground">{item.count} elevi</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tendințe Observate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              {lineData.length > 1 && (
                <>
                  <p>
                    <strong>Vârsta cu IMC cel mai mic:</strong>{" "}
                    {lineData.reduce((min, item) => (item["IMC General"] < min["IMC General"] ? item : min)).age} ani (
                    {
                      lineData.reduce((min, item) => (item["IMC General"] < min["IMC General"] ? item : min))[
                        "IMC General"
                      ]
                    }{" "}
                    kg/m²)
                  </p>
                  <p>
                    <strong>Vârsta cu IMC cel mai mare:</strong>{" "}
                    {lineData.reduce((max, item) => (item["IMC General"] > max["IMC General"] ? item : max)).age} ani (
                    {
                      lineData.reduce((max, item) => (item["IMC General"] > max["IMC General"] ? item : max))[
                        "IMC General"
                      ]
                    }{" "}
                    kg/m²)
                  </p>
                  <p>
                    <strong>Variația totală:</strong>{" "}
                    {(
                      Math.max(...lineData.map((item) => item["IMC General"])) -
                      Math.min(...lineData.map((item) => item["IMC General"]))
                    ).toFixed(1)}{" "}
                    kg/m²
                  </p>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
