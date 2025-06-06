"use client"

import { useMemo } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { Student } from "../page"

interface BMIBySexProps {
  data: Student[]
}

const BMI_COLORS = {
  subponderal: "#fbbf24",
  normal: "#10b981",
  supraponderal: "#f97316",
  obez: "#ef4444",
}

export default function BMIBySex({ data }: BMIBySexProps) {
  const chartData = useMemo(() => {
    const categories = ["subponderal", "normal", "supraponderal", "obez"]

    return categories
      .map((category) => {
        const categoryStudents = data.filter((s) => s.categorie_IMC === category)

        const boys = categoryStudents.filter((s) => s.sex === "băiat").length
        const girls = categoryStudents.filter((s) => s.sex === "fată").length
        const total = categoryStudents.length

        const boysPercentage = total > 0 ? ((boys / total) * 100).toFixed(1) : "0"
        const girlsPercentage = total > 0 ? ((girls / total) * 100).toFixed(1) : "0"

        return {
          category: category.charAt(0).toUpperCase() + category.slice(1),
          Băieți: boys,
          Fete: girls,
          total,
          boysPercentage: Number(boysPercentage),
          girlsPercentage: Number(girlsPercentage),
        }
      })
      .filter((item) => item.total > 0)
  }, [data])

  const genderStats = useMemo(() => {
    const boys = data.filter((s) => s.sex === "băiat")
    const girls = data.filter((s) => s.sex === "fată")

    const boysIMC = boys.map((s) => s.IMC)
    const girlsIMC = girls.map((s) => s.IMC)

    const avgIMCBoys = boys.length > 0 ? boys.reduce((sum, s) => sum + s.IMC, 0) / boys.length : 0
    const avgIMCGirls = girls.length > 0 ? girls.reduce((sum, s) => sum + s.IMC, 0) / girls.length : 0

    return {
      boys: {
        count: boys.length,
        avgIMC: avgIMCBoys.toFixed(1),
        minIMC: boys.length > 0 ? Math.min(...boysIMC).toFixed(1) : "0",
        maxIMC: boys.length > 0 ? Math.max(...boysIMC).toFixed(1) : "0",
      },
      girls: {
        count: girls.length,
        avgIMC: avgIMCGirls.toFixed(1),
        minIMC: girls.length > 0 ? Math.min(...girlsIMC).toFixed(1) : "0",
        maxIMC: girls.length > 0 ? Math.max(...girlsIMC).toFixed(1) : "0",
      },
      difference: (avgIMCBoys - avgIMCGirls).toFixed(1),
    }
  }, [data])

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = chartData.find((d) => d.category === label)
      return (
        <div className="bg-white dark:bg-gray-800 p-3 border rounded-lg shadow-lg">
          <p className="font-medium">{`Categorie IMC: ${label}`}</p>
          <p className="text-gray-600">{`Total elevi: ${data?.total}`}</p>
          {payload.map((entry: any, index: number) => (
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
    <div className="space-y-6">
      {/* Gender Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
              Băieți
            </CardTitle>
            <CardDescription>{genderStats.boys.count} elevi</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-2xl font-bold">{genderStats.boys.avgIMC} kg/m²</div>
              <p className="text-sm text-muted-foreground">IMC mediu</p>
              <div className="text-sm">
                <div className="flex justify-between">
                  <span>Minim:</span>
                  <span className="font-medium">{genderStats.boys.minIMC} kg/m²</span>
                </div>
                <div className="flex justify-between">
                  <span>Maxim:</span>
                  <span className="font-medium">{genderStats.boys.maxIMC} kg/m²</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="w-3 h-3 bg-pink-500 rounded-full"></span>
              Fete
            </CardTitle>
            <CardDescription>{genderStats.girls.count} elevi</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-2xl font-bold">{genderStats.girls.avgIMC} kg/m²</div>
              <p className="text-sm text-muted-foreground">IMC mediu</p>
              <div className="text-sm">
                <div className="flex justify-between">
                  <span>Minim:</span>
                  <span className="font-medium">{genderStats.girls.minIMC} kg/m²</span>
                </div>
                <div className="flex justify-between">
                  <span>Maxim:</span>
                  <span className="font-medium">{genderStats.girls.maxIMC} kg/m²</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bar Chart - Distribution by Gender and BMI Category */}
      <Card>
        <CardHeader>
          <CardTitle>Distribuția Categoriilor IMC pe Gen</CardTitle>
          <CardDescription>Numărul de elevi pe fiecare categorie IMC, împărțit pe gen</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="w-full h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar dataKey="Băieți" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Fete" fill="#ec4899" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Percentage Distribution */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {chartData.map((item) => (
          <Card key={item.category}>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">{item.category}</CardTitle>
              <CardDescription>{item.total} elevi total</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-blue-600">Băieți:</span>
                  <div className="text-right">
                    <div className="font-bold">{item.Băieți}</div>
                    <div className="text-sm text-muted-foreground">{item.boysPercentage}%</div>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-pink-600">Fete:</span>
                  <div className="text-right">
                    <div className="font-bold">{item.Fete}</div>
                    <div className="text-sm text-muted-foreground">{item.girlsPercentage}%</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Analiza Diferențelor de Gen</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium mb-2">Diferența IMC mediu:</h4>
                <div className="text-2xl font-bold">{Math.abs(Number(genderStats.difference))} kg/m²</div>
                <p className="text-sm text-muted-foreground">
                  {Number(genderStats.difference) > 0
                    ? "Băieții au IMC mai mare"
                    : Number(genderStats.difference) < 0
                      ? "Fetele au IMC mai mare"
                      : "IMC similar între genuri"}
                </p>
              </div>

              <div>
                <h4 className="font-medium mb-2">Categorii predominante:</h4>
                <div className="space-y-1 text-sm">
                  {chartData.map((item) => {
                    const predominantGender =
                      item.Băieți > item.Fete ? "Băieți" : item.Fete > item.Băieți ? "Fete" : "Echilibrat"
                    return (
                      <div key={item.category} className="flex justify-between">
                        <span>{item.category}:</span>
                        <span className="font-medium">{predominantGender}</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t">
              <h4 className="font-medium mb-2">Observații:</h4>
              <div className="space-y-1 text-sm text-muted-foreground">
                <p>
                  • Diferența de IMC între genuri este{" "}
                  {Math.abs(Number(genderStats.difference)) < 1 ? "mică" : "semnificativă"}(
                  {Math.abs(Number(genderStats.difference))} kg/m²)
                </p>
                <p>
                  • Distribuția pe categorii IMC{" "}
                  {chartData.every((item) => Math.abs(item.Băieți - item.Fete) <= 1) ? "este echilibrată" : "variază"}{" "}
                  între genuri
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
