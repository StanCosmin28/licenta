"use client"

import { useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingDown, TrendingUp, AlertTriangle, CheckCircle, Users, Activity } from "lucide-react"

export default function InsightsPanel({ data }) {
  const insights = useMemo(() => {
    // Calculate key insights
    const normalIMC = data.filter((s) => s.categorie_IMC === "normal")
    const extremeIMC = data.filter(
      (s) => s.categorie_IMC === "subponderal" || s.categorie_IMC === "supraponderal" || s.categorie_IMC === "obez",
    )

    const avgNormalScore =
      normalIMC.length > 0 ? normalIMC.reduce((sum, s) => sum + s.rezultat_test_inteligență, 0) / normalIMC.length : 0

    const avgExtremeScore =
      extremeIMC.length > 0
        ? extremeIMC.reduce((sum, s) => sum + s.rezultat_test_inteligență, 0) / extremeIMC.length
        : 0

    // Gender differences
    const boys = data.filter((s) => s.sex === "băiat")
    const girls = data.filter((s) => s.sex === "fată")

    const avgBoyScore =
      boys.length > 0 ? boys.reduce((sum, s) => sum + s.rezultat_test_inteligență, 0) / boys.length : 0

    const avgGirlScore =
      girls.length > 0 ? girls.reduce((sum, s) => sum + s.rezultat_test_inteligență, 0) / girls.length : 0

    // Sports impact
    const withSports = data.filter((s) => s.practică_sport_extrascolar)
    const withoutSports = data.filter((s) => !s.practică_sport_extrascolar)

    const avgSportsScore =
      withSports.length > 0
        ? withSports.reduce((sum, s) => sum + s.rezultat_test_inteligență, 0) / withSports.length
        : 0

    const avgNoSportsScore =
      withoutSports.length > 0
        ? withoutSports.reduce((sum, s) => sum + s.rezultat_test_inteligență, 0) / withoutSports.length
        : 0

    // Age trends
    const ageGroups = [11, 12, 13, 14, 15]
      .map((age) => {
        const ageStudents = data.filter((s) => s.vârsta === age)
        const avgScore =
          ageStudents.length > 0
            ? ageStudents.reduce((sum, s) => sum + s.rezultat_test_inteligență, 0) / ageStudents.length
            : 0
        return { age, avgScore, count: ageStudents.length }
      })
      .filter((group) => group.count > 0)

    // Correlation calculation
    const meanIMC = data.reduce((sum, s) => sum + s.IMC, 0) / data.length
    const meanIntel = data.reduce((sum, s) => sum + s.rezultat_test_inteligență, 0) / data.length

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
      normalVsExtreme: {
        normal: avgNormalScore,
        extreme: avgExtremeScore,
        difference: avgNormalScore - avgExtremeScore,
        isSignificant: Math.abs(avgNormalScore - avgExtremeScore) > 5,
      },
      genderDifference: {
        boys: avgBoyScore,
        girls: avgGirlScore,
        difference: avgGirlScore - avgBoyScore,
        isSignificant: Math.abs(avgGirlScore - avgBoyScore) > 3,
      },
      sportsImpact: {
        withSports: avgSportsScore,
        withoutSports: avgNoSportsScore,
        difference: avgSportsScore - avgNoSportsScore,
        isSignificant: Math.abs(avgSportsScore - avgNoSportsScore) > 5,
      },
      correlation,
      ageGroups,
      totalStudents: data.length,
    }
  }, [data])

  return (
    <div className="space-y-4">
      {/* Hypothesis Validation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {insights.normalVsExtreme.isSignificant ? (
              <CheckCircle className="h-5 w-5 text-green-500" />
            ) : (
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
            )}
            Validarea Ipotezei
          </CardTitle>
          <CardDescription>IMC normal vs IMC extrem</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>IMC Normal:</span>
              <Badge variant="secondary">{insights.normalVsExtreme.normal.toFixed(1)} puncte</Badge>
            </div>
            <div className="flex justify-between">
              <span>IMC Extrem:</span>
              <Badge variant="secondary">{insights.normalVsExtreme.extreme.toFixed(1)} puncte</Badge>
            </div>
            <div className="flex justify-between">
              <span>Diferența:</span>
              <Badge variant={insights.normalVsExtreme.difference > 0 ? "default" : "destructive"}>
                {insights.normalVsExtreme.difference > 0 ? "+" : ""}
                {insights.normalVsExtreme.difference.toFixed(1)} puncte
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              {insights.normalVsExtreme.isSignificant
                ? "✅ Ipoteza este confirmată - diferență significativă detectată"
                : "⚠️ Diferența nu este suficient de mare pentru a confirma ipoteza"}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Correlation Insight */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {insights.correlation < -0.3 ? (
              <TrendingDown className="h-5 w-5 text-red-500" />
            ) : insights.correlation > 0.3 ? (
              <TrendingUp className="h-5 w-5 text-green-500" />
            ) : (
              <Activity className="h-5 w-5 text-yellow-500" />
            )}
            Corelația IMC-Inteligență
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold mb-2">{insights.correlation.toFixed(3)}</div>
          <p className="text-sm text-muted-foreground">
            {Math.abs(insights.correlation) > 0.5
              ? "Corelație puternică"
              : Math.abs(insights.correlation) > 0.3
                ? "Corelație moderată"
                : "Corelație slabă"}
            {insights.correlation < 0 ? " negativă" : " pozitivă"}
          </p>
        </CardContent>
      </Card>

      {/* Gender Differences */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Diferențe pe Gen
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>Băieți:</span>
              <Badge variant="outline">{insights.genderDifference.boys.toFixed(1)} puncte</Badge>
            </div>
            <div className="flex justify-between">
              <span>Fete:</span>
              <Badge variant="outline">{insights.genderDifference.girls.toFixed(1)} puncte</Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              {insights.genderDifference.isSignificant
                ? `${insights.genderDifference.difference > 0 ? "Fetele" : "Băieții"} au performanțe mai bune cu ${Math.abs(insights.genderDifference.difference).toFixed(1)} puncte`
                : "Nu există diferențe semnificative între genuri"}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Sports Impact */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Impactul Sportului
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>Cu sport:</span>
              <Badge variant="default">{insights.sportsImpact.withSports.toFixed(1)} puncte</Badge>
            </div>
            <div className="flex justify-between">
              <span>Fără sport:</span>
              <Badge variant="secondary">{insights.sportsImpact.withoutSports.toFixed(1)} puncte</Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              {insights.sportsImpact.isSignificant
                ? `Sportul îmbunătățește performanțele cu ${insights.sportsImpact.difference.toFixed(1)} puncte`
                : "Impactul sportului nu este semnificativ statistic"}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Key Statistics */}
      <Card>
        <CardHeader>
          <CardTitle>Statistici Cheie</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Total elevi analizați:</span>
              <Badge>{insights.totalStudents}</Badge>
            </div>
            <div className="flex justify-between">
              <span>Cea mai mare diferență:</span>
              <Badge variant="outline">
                {Math.max(
                  Math.abs(insights.normalVsExtreme.difference),
                  Math.abs(insights.genderDifference.difference),
                  Math.abs(insights.sportsImpact.difference),
                ).toFixed(1)}{" "}
                puncte
              </Badge>
            </div>
            <div className="flex justify-between">
              <span>Factorul cu cel mai mare impact:</span>
              <Badge variant="outline">
                {Math.abs(insights.sportsImpact.difference) > Math.abs(insights.genderDifference.difference)
                  ? "Sport"
                  : "Gen"}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Methodology */}
      <Card>
        <CardHeader>
          <CardTitle>Metodologie</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-xs text-muted-foreground space-y-1">
            <p>• Corelația Pearson pentru relații liniare</p>
            <p>• Diferențe semnificative: &gt;3 puncte (gen), &gt;5 puncte (IMC/sport)</p>
            <p>• Categorii IMC conform standardelor OMS</p>
            <p>• Test inteligență: scală 0-60 puncte</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
