"use client"

import { useMemo } from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Student } from "../page"

interface WHOComparisonProps {
  data: Student[]
}

// WHO BMI standards (official classification for adults, adapted for adolescents)
const WHO_STANDARDS = {
  // Using WHO standard ranges - these apply generally but may vary slightly by age
  general: {
    severeThinness: 16.0,
    moderateThinness: [16.0, 17.0],
    mildThinness: [17.0, 18.5],
    normal: [18.5, 25.0],
    preObese: [25.0, 30.0],
    obeseClass1: [30.0, 35.0],
    obeseClass2: [35.0, 40.0],
    obeseClass3: 40.0,
  },
  // Age-specific adjustments for adolescents (approximate values)
  boys: {
    11: { underweight: 17.0, normal: [17.0, 23.0], overweight: 23.0, obese: 28.0 },
    12: { underweight: 17.5, normal: [17.5, 24.0], overweight: 24.0, obese: 29.0 },
    13: { underweight: 18.0, normal: [18.0, 24.5], overweight: 24.5, obese: 29.5 },
    14: { underweight: 18.5, normal: [18.5, 25.0], overweight: 25.0, obese: 30.0 },
    15: { underweight: 18.5, normal: [18.5, 25.0], overweight: 25.0, obese: 30.0 },
  },
  girls: {
    11: { underweight: 17.0, normal: [17.0, 23.5], overweight: 23.5, obese: 28.5 },
    12: { underweight: 17.5, normal: [17.5, 24.0], overweight: 24.0, obese: 29.0 },
    13: { underweight: 18.0, normal: [18.0, 24.5], overweight: 24.5, obese: 29.5 },
    14: { underweight: 18.5, normal: [18.5, 25.0], overweight: 25.0, obese: 30.0 },
    15: { underweight: 18.5, normal: [18.5, 25.0], overweight: 25.0, obese: 30.0 },
  },
}

export default function WHOComparison({ data }: WHOComparisonProps) {
  const { comparisonData, deviationAnalysis, categoryComparison } = useMemo(() => {
    const ages = [11, 12, 13, 14, 15]

    const comparisonData = ages.map((age) => {
      const ageStudents = data.filter((s) => s.vârsta === age)
      const boys = ageStudents.filter((s) => s.sex === "băiat")
      const girls = ageStudents.filter((s) => s.sex === "fată")

      const avgIMCBoys = boys.length > 0 ? boys.reduce((sum, s) => sum + s.IMC, 0) / boys.length : 0
      const avgIMCGirls = girls.length > 0 ? girls.reduce((sum, s) => sum + s.IMC, 0) / girls.length : 0

      const whoBoysNormal = WHO_STANDARDS.boys[age as keyof typeof WHO_STANDARDS.boys]?.normal[1] || 0
      const whoGirlsNormal = WHO_STANDARDS.girls[age as keyof typeof WHO_STANDARDS.girls]?.normal[1] || 0

      return {
        age,
        "Băieți - Studiu": Number(avgIMCBoys.toFixed(1)),
        "Fete - Studiu": Number(avgIMCGirls.toFixed(1)),
        "Băieți - OMS (Normal Max)": whoBoysNormal,
        "Fete - OMS (Normal Max)": whoGirlsNormal,
        countBoys: boys.length,
        countGirls: girls.length,
      }
    })

    // Deviation analysis
    const deviationAnalysis = data
      .map((student) => {
        const age = student.vârsta as keyof typeof WHO_STANDARDS.boys
        const gender = student.sex === "băiat" ? "boys" : "girls"
        const whoStandards = WHO_STANDARDS[gender][age]

        if (!whoStandards) return null

        let category = "normal"
        if (student.IMC < whoStandards.underweight) category = "underweight"
        else if (student.IMC > whoStandards.obese) category = "obese"
        else if (student.IMC > whoStandards.overweight) category = "overweight"

        const deviation = student.IMC - whoStandards.normal[1]

        return {
          id: student.id,
          age: student.vârsta,
          sex: student.sex,
          imc: student.IMC,
          studyCategory: student.categorie_IMC,
          whoCategory: category,
          deviation: Number(deviation.toFixed(1)),
          intelligence: student.rezultat_test_inteligență,
        }
      })
      .filter(Boolean)

    // Category comparison
    const categoryComparison = {
      matching: deviationAnalysis.filter((s) => {
        const studyMap: { [key: string]: string } = {
          subponderal: "underweight",
          normal: "normal",
          supraponderal: "overweight",
          obez: "obese",
        }
        return studyMap[s?.studyCategory || ""] === s?.whoCategory
      }).length,
      total: deviationAnalysis.length,
    }

    return { comparisonData, deviationAnalysis, categoryComparison }
  }, [data])

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = comparisonData.find((d) => d.age === label)
      return (
        <div className="bg-white dark:bg-gray-800 p-3 border rounded-lg shadow-lg">
          <p className="font-medium">{`Vârsta: ${label} ani`}</p>
          <p className="text-gray-600">{`Băieți: ${data?.countBoys} elevi, Fete: ${data?.countGirls} elevi`}</p>
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

  const matchingPercentage =
    categoryComparison.total > 0 ? ((categoryComparison.matching / categoryComparison.total) * 100).toFixed(1) : "0"

  return (
    <div className="space-y-6">
      {/* Comparison Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Concordanță cu OMS</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{matchingPercentage}%</div>
            <p className="text-sm text-muted-foreground">
              {categoryComparison.matching}/{categoryComparison.total} elevi
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Deviații Pozitive</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{deviationAnalysis.filter((s) => (s?.deviation || 0) > 0).length}</div>
            <p className="text-sm text-muted-foreground">elevi peste standardele OMS</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Deviații Negative</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{deviationAnalysis.filter((s) => (s?.deviation || 0) < 0).length}</div>
            <p className="text-sm text-muted-foreground">elevi sub standardele OMS</p>
          </CardContent>
        </Card>
      </div>

      {/* Line Chart Comparison */}
      <Card>
        <CardHeader>
          <CardTitle>Comparația IMC: Studiul Nostru vs Standardele OMS</CardTitle>
          <CardDescription>
            Evoluția IMC-ului mediu pe vârste comparativ cu limitele superioare normale OMS
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="w-full h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={comparisonData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="age" label={{ value: "Vârsta (ani)", position: "insideBottom", offset: -10 }} />
                <YAxis label={{ value: "IMC (kg/m²)", angle: -90, position: "insideLeft" }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line type="monotone" dataKey="Băieți - Studiu" stroke="#3b82f6" strokeWidth={3} dot={{ r: 6 }} />
                <Line type="monotone" dataKey="Fete - Studiu" stroke="#ec4899" strokeWidth={3} dot={{ r: 6 }} />
                <Line
                  type="monotone"
                  dataKey="Băieți - OMS (Normal Max)"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                />
                <Line
                  type="monotone"
                  dataKey="Fete - OMS (Normal Max)"
                  stroke="#ec4899"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Deviation Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Analiza Deviațiilor față de Standardele OMS</CardTitle>
          <CardDescription>Distribuția deviațiilor IMC față de limitele normale OMS</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-3">Deviații Semnificative ({">"}2 kg/m²)</h4>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {deviationAnalysis
                  .filter((s) => Math.abs(s?.deviation || 0) > 2)
                  .sort((a, b) => Math.abs(b?.deviation || 0) - Math.abs(a?.deviation || 0))
                  .slice(0, 10)
                  .map((student) => (
                    <div
                      key={student?.id}
                      className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-800 rounded"
                    >
                      <div>
                        <span className="font-medium">Elev {student?.id}</span>
                        <span className="text-sm text-muted-foreground ml-2">
                          ({student?.age} ani, {student?.sex})
                        </span>
                      </div>
                      <Badge variant={(student?.deviation || 0) > 0 ? "destructive" : "secondary"}>
                        {(student?.deviation || 0) > 0 ? "+" : ""}
                        {student?.deviation} kg/m²
                      </Badge>
                    </div>
                  ))}
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-3">Statistici pe Categorii</h4>
              <div className="space-y-3">
                {["subponderal", "normal", "supraponderal", "obez"].map((category) => {
                  const categoryStudents = deviationAnalysis.filter((s) => s?.studyCategory === category)
                  const avgDeviation =
                    categoryStudents.length > 0
                      ? (
                          categoryStudents.reduce((sum, s) => sum + (s?.deviation || 0), 0) / categoryStudents.length
                        ).toFixed(1)
                      : "0"

                  return (
                    <div key={category} className="flex justify-between items-center">
                      <span className="capitalize">{category}:</span>
                      <div className="text-right">
                        <div className="font-medium">{avgDeviation} kg/m²</div>
                        <div className="text-sm text-muted-foreground">{categoryStudents.length} elevi</div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* WHO Standards Reference */}
      <Card>
        <CardHeader>
          <CardTitle>Referințe Standardele OMS</CardTitle>
          <CardDescription>Clasificarea oficială OMS pentru IMC</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Official WHO Classification */}
            <div>
              <h4 className="font-medium mb-3">Clasificarea Oficială OMS (Adulți)</h4>
              <div className="space-y-2 text-sm">
                <div className="grid grid-cols-3 gap-4 font-medium border-b pb-2">
                  <span>Categorie</span>
                  <span>IMC (kg/m²)</span>
                  <span>Risc pentru sănătate</span>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <span className="text-red-600">Subponderal (Subțirime severă)</span>
                  <span>{"<"} 16.0</span>
                  <span className="text-red-600">Ridicat</span>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <span className="text-orange-600">Subponderal (Subțirime moderată)</span>
                  <span>16.0–17.0</span>
                  <span className="text-orange-600">Moderat</span>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <span className="text-yellow-600">Subponderal (Subțirime ușoară)</span>
                  <span>17.0–18.5</span>
                  <span className="text-yellow-600">Scăzut</span>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <span className="text-green-600">Interval normal</span>
                  <span>18.5–25.0</span>
                  <span className="text-green-600">Minim</span>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <span className="text-orange-600">Supraponderal (Pre-obez)</span>
                  <span>25.0–30.0</span>
                  <span className="text-orange-600">Crescut</span>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <span className="text-red-600">Obez (Clasa I)</span>
                  <span>30.0–35.0</span>
                  <span className="text-red-600">Moderat</span>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <span className="text-red-600">Obez (Clasa II)</span>
                  <span>35.0–40.0</span>
                  <span className="text-red-600">Sever</span>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <span className="text-red-600">Obez (Clasa III)</span>
                  <span>≥ 40.0</span>
                  <span className="text-red-600">Foarte sever</span>
                </div>
              </div>
            </div>

            {/* Age-specific values for adolescents */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-3">Băieți (Valori Adaptate pentru Adolescenți)</h4>
                <div className="space-y-2 text-sm">
                  {Object.entries(WHO_STANDARDS.boys).map(([age, standards]) => (
                    <div key={age} className="grid grid-cols-5 gap-2">
                      <span className="font-medium">{age} ani:</span>
                      <span className="text-yellow-600">
                        {"<"}
                        {standards.underweight}
                      </span>
                      <span className="text-green-600">
                        {standards.normal[0]}-{standards.normal[1]}
                      </span>
                      <span className="text-orange-600">
                        {standards.normal[1]}-{standards.obese}
                      </span>
                      <span className="text-red-600">
                        {">"}
                        {standards.obese}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-3">Fete (Valori Adaptate pentru Adolescenți)</h4>
                <div className="space-y-2 text-sm">
                  {Object.entries(WHO_STANDARDS.girls).map(([age, standards]) => (
                    <div key={age} className="grid grid-cols-5 gap-2">
                      <span className="font-medium">{age} ani:</span>
                      <span className="text-yellow-600">
                        {"<"}
                        {standards.underweight}
                      </span>
                      <span className="text-green-600">
                        {standards.normal[0]}-{standards.normal[1]}
                      </span>
                      <span className="text-orange-600">
                        {standards.normal[1]}-{standards.obese}
                      </span>
                      <span className="text-red-600">
                        {">"}
                        {standards.obese}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t">
              <div className="flex items-center gap-4 text-sm flex-wrap">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 bg-yellow-500 rounded"></span>
                  <span>Subponderal</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 bg-green-500 rounded"></span>
                  <span>Normal</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 bg-orange-500 rounded"></span>
                  <span>Supraponderal</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 bg-red-500 rounded"></span>
                  <span>Obez</span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                * Valorile pentru adolescenți sunt adaptate din standardele OMS pentru adulți
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
