"use client"

import { useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Users, Brain, Activity, TrendingUp, TrendingDown } from "lucide-react"

export default function OverviewDashboard({ data }) {
  const stats = useMemo(() => {
    const total = data.length
    const avgIMC = data.reduce((sum, s) => sum + s.IMC, 0) / total
    const avgIntelligence = data.reduce((sum, s) => sum + s.rezultat_test_inteligență, 0) / total

    const imcCategories = {
      subponderal: data.filter((s) => s.categorie_IMC === "subponderal").length,
      normal: data.filter((s) => s.categorie_IMC === "normal").length,
      supraponderal: data.filter((s) => s.categorie_IMC === "supraponderal").length,
      obez: data.filter((s) => s.categorie_IMC === "obez").length,
    }

    const intelligenceLevels = {
      scăzut: data.filter((s) => s.nivel_inteligență === "scăzut").length,
      mediu: data.filter((s) => s.nivel_inteligență === "mediu").length,
      "peste medie": data.filter((s) => s.nivel_inteligență === "peste medie").length,
      "foarte bun": data.filter((s) => s.nivel_inteligență === "foarte bun").length,
    }

    const withSports = data.filter((s) => s.practică_sport_extrascolar).length
    const sportsPercentage = (withSports / total) * 100

    // Calculate correlation coefficient
    const meanIMC = avgIMC
    const meanIntel = avgIntelligence

    let numerator = 0
    let denomIMC = 0
    let denomIntel = 0

    data.forEach((student) => {
      const imcDiff = student.IMC - meanIMC
      const intelDiff = student.rezultat_test_inteligență - meanIntel
      numerator += imcDiff * intelDiff
      denomIMC += imcDiff * imcDiff
      denomIntel += intelDiff * intelDiff
    })

    const correlation = numerator / Math.sqrt(denomIMC * denomIntel)

    return {
      total,
      avgIMC,
      avgIntelligence,
      imcCategories,
      intelligenceLevels,
      sportsPercentage,
      correlation,
    }
  }, [data])

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Elevi</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">Participanți în studiu</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">IMC Mediu</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.avgIMC.toFixed(1)}</div>
            <p className="text-xs text-muted-foreground">kg/m²</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Scor Mediu Inteligență</CardTitle>
            <Brain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.avgIntelligence.toFixed(1)}</div>
            <p className="text-xs text-muted-foreground">din 60 puncte</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Corelația IMC-Inteligență</CardTitle>
            {stats.correlation < 0 ? (
              <TrendingDown className="h-4 w-4 text-red-500" />
            ) : (
              <TrendingUp className="h-4 w-4 text-green-500" />
            )}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.correlation.toFixed(3)}</div>
            <p className="text-xs text-muted-foreground">
              {Math.abs(stats.correlation) > 0.3 ? "Corelație moderată" : "Corelație slabă"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Distribution Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Distribuția Categoriilor IMC</CardTitle>
            <CardDescription>Numărul de elevi pe fiecare categorie</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(stats.imcCategories).map(([category, count]) => (
              <div key={category} className="space-y-2">
                <div className="flex justify-between">
                  <span className="capitalize">{category}</span>
                  <span className="font-medium">{count} elevi</span>
                </div>
                <Progress value={(count / stats.total) * 100} className="h-2" />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Nivelurile de Inteligență</CardTitle>
            <CardDescription>Distribuția performanțelor cognitive</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(stats.intelligenceLevels).map(([level, count]) => (
              <div key={level} className="space-y-2">
                <div className="flex justify-between">
                  <span className="capitalize">{level}</span>
                  <span className="font-medium">{count} elevi</span>
                </div>
                <Progress value={(count / stats.total) * 100} className="h-2" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Sports Participation */}
      <Card>
        <CardHeader>
          <CardTitle>Participarea la Sport Extrașcolar</CardTitle>
          <CardDescription>Impactul activității fizice asupra performanțelor</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <span>Elevi care practică sport</span>
            <Badge variant="secondary">{stats.sportsPercentage.toFixed(1)}%</Badge>
          </div>
          <Progress value={stats.sportsPercentage} className="h-3" />
          <p className="text-sm text-muted-foreground mt-2">
            {data.filter((s) => s.practică_sport_extrascolar).length} din {stats.total} elevi practică sport extrașcolar
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
