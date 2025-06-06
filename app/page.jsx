"use client"

import { useState, useMemo, useEffect } from "react"
import { Moon, Sun, Download, Filter, BarChart3, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import studentsData from "../data/students.json"
import Sidebar from "./components/Sidebar"
import OverviewDashboard from "./components/OverviewDashboard"
import ScatterPlotChart from "./components/ScatterPlotChart"
import BarChartComparison from "./components/BarChartComparison"
import PieChartDistribution from "./components/PieChartDistribution"
import LineChartEvolution from "./components/LineChartEvolution"
import GroupedBarChart from "./components/GroupedBarChart"
import BoxPlotChart from "./components/BoxPlotChart"
import RadarChart from "./components/RadarChart"
import HeatmapChart from "./components/HeatmapChart"
import StackedBarChart from "./components/StackedBarChart"
import AreaChart from "./components/AreaChart"
import BubbleChart from "./components/BubbleChart"
import InsightsPanel from "./components/InsightsPanel"
// New charts
import GenderDistribution from "./components/GenderDistribution"
import BMICategoryDistribution from "./components/BMICategoryDistribution"
import BMIRavenCorrelation from "./components/BMIRavenCorrelation"
import SportsByBMICategory from "./components/SportsByBMICategory"
import IntelligenceByClass from "./components/IntelligenceByClass"
import BMIByAge from "./components/BMIByAge"
import IntelligencePercentageByBMI from "./components/IntelligencePercentageByBMI"
import BMIBySex from "./components/BMIBySex"
import SportsByIntelligence from "./components/SportsByIntelligence"
import RavenScoresByBMI from "./components/RavenScoresByBMI"
import WHOComparison from "./components/WHOComparison"

const chartComponents = {
  overview: OverviewDashboard,
  scatter: ScatterPlotChart,
  bar: BarChartComparison,
  pie: PieChartDistribution,
  line: LineChartEvolution,
  grouped: GroupedBarChart,
  box: BoxPlotChart,
  radar: RadarChart,
  heatmap: HeatmapChart,
  stacked: StackedBarChart,
  area: AreaChart,
  bubble: BubbleChart,
  // New charts
  genderDist: GenderDistribution,
  bmiCategoryDist: BMICategoryDistribution,
  bmiRavenCorr: BMIRavenCorrelation,
  sportsByBMI: SportsByBMICategory,
  intelligenceByClass: IntelligenceByClass,
  bmiByAge: BMIByAge,
  intelligencePercentByBMI: IntelligencePercentageByBMI,
  bmiBySex: BMIBySex,
  sportsByIntelligence: SportsByIntelligence,
  ravenByBMI: RavenScoresByBMI,
  whoComparison: WHOComparison,
}

export default function Dashboard() {
  const [darkMode, setDarkMode] = useState(false)
  const [activeChart, setActiveChart] = useState("overview")
  const [filters, setFilters] = useState({
    sex: "all",
    clasa: "all",
    vârsta: "all",
    sport: "all",
  })

  // Apply dark mode to document
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [darkMode])

  const students = studentsData

  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      if (filters.sex !== "all" && student.sex !== filters.sex) return false
      if (filters.clasa !== "all" && student.clasa !== filters.clasa) return false
      if (filters.vârsta !== "all" && student.vârsta.toString() !== filters.vârsta) return false
      if (filters.sport !== "all") {
        const sportValue = filters.sport === "true"
        if (student.practică_sport_extrascolar !== sportValue) return false
      }
      return true
    })
  }, [students, filters])

  const ActiveChartComponent = chartComponents[activeChart]

  const exportChart = () => {
    // Implementation for chart export
    console.log("Exporting chart...")
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? "dark" : ""}`}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 transition-colors duration-300">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white transition-colors duration-300">
                  Analiza Corelației IMC - Inteligență
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 transition-colors duration-300">
                  Studiu asupra elevilor de gimnaziu (60 participanți)
                </p>
              </div>

              <div className="flex items-center gap-4">
                {/* Filters */}
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                  <Select value={filters.sex} onValueChange={(value) => setFilters({ ...filters, sex: value })}>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Gen" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Toate</SelectItem>
                      <SelectItem value="băiat">Băieți</SelectItem>
                      <SelectItem value="fată">Fete</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={filters.clasa} onValueChange={(value) => setFilters({ ...filters, clasa: value })}>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Clasa" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Toate</SelectItem>
                      <SelectItem value="a V-a">Clasa V</SelectItem>
                      <SelectItem value="a VI-a">Clasa VI</SelectItem>
                      <SelectItem value="a VII-a">Clasa VII</SelectItem>
                      <SelectItem value="a VIII-a">Clasa VIII</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={filters.sport} onValueChange={(value) => setFilters({ ...filters, sport: value })}>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Sport" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Toate</SelectItem>
                      <SelectItem value="true">Cu sport</SelectItem>
                      <SelectItem value="false">Fără sport</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator orientation="vertical" className="h-6" />

                <Button variant="outline" size="sm" onClick={exportChart}>
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setDarkMode(!darkMode)}
                  className="transition-colors duration-300"
                >
                  {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            {/* Filter Summary */}
            <div className="flex items-center gap-2 mt-3">
              <span className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-300">
                Filtre active:
              </span>
              <Badge variant="secondary" className="transition-colors duration-300">
                <Users className="h-3 w-3 mr-1" />
                {filteredStudents.length} elevi
              </Badge>
              {filters.sex !== "all" && <Badge variant="outline">{filters.sex === "băiat" ? "Băieți" : "Fete"}</Badge>}
              {filters.clasa !== "all" && <Badge variant="outline">{filters.clasa}</Badge>}
              {filters.sport !== "all" && (
                <Badge variant="outline">{filters.sport === "true" ? "Cu sport" : "Fără sport"}</Badge>
              )}
            </div>
          </div>
        </header>

        <div className="flex">
          {/* Sidebar */}
          <Sidebar activeChart={activeChart} setActiveChart={setActiveChart} />

          {/* Main Content */}
          <main className="flex-1 p-6">
            <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
              {/* Chart Area */}
              <div className="xl:col-span-3">
                <Card className="h-full transition-colors duration-300">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 transition-colors duration-300">
                      <BarChart3 className="h-5 w-5" />
                      {activeChart === "overview" && "Prezentare Generală"}
                      {activeChart === "scatter" && "Corelația IMC vs Inteligență"}
                      {activeChart === "bar" && "Comparația Scorurilor pe Categorii IMC"}
                      {activeChart === "pie" && "Distribuția Categoriilor IMC"}
                      {activeChart === "line" && "Evoluția pe Vârstă și Clasă"}
                      {activeChart === "grouped" && "Comparația pe Gen și Categorii IMC"}
                      {activeChart === "box" && "Distribuția Scorurilor pe Categorii"}
                      {activeChart === "radar" && "Profilul Competențelor"}
                      {activeChart === "heatmap" && "Matricea de Corelații"}
                      {activeChart === "stacked" && "Niveluri de Inteligență pe Categorii IMC"}
                      {activeChart === "area" && "Tendințele pe Clasă"}
                      {activeChart === "bubble" && "IMC vs Inteligență (Bubble Chart)"}
                      {activeChart === "genderDist" && "Distribuția pe Gen (50-50)"}
                      {activeChart === "bmiCategoryDist" && "Distribuția Categoriilor IMC"}
                      {activeChart === "bmiRavenCorr" && "Corelația IMC - Test Raven"}
                      {activeChart === "sportsByBMI" && "Sport Extrașcolar pe Categorii IMC"}
                      {activeChart === "intelligenceByClass" && "Niveluri Inteligență pe Clase"}
                      {activeChart === "bmiByAge" && "Variația IMC pe Vârste"}
                      {activeChart === "intelligencePercentByBMI" && "Procente Inteligență pe IMC"}
                      {activeChart === "bmiBySex" && "Distribuția IMC pe Gen"}
                      {activeChart === "sportsByIntelligence" && "Sport pe Niveluri Inteligență"}
                      {activeChart === "ravenByBMI" && "Scoruri Raven pe Categorii IMC"}
                      {activeChart === "whoComparison" && "Comparație cu Standardele OMS"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ActiveChartComponent data={filteredStudents} />
                  </CardContent>
                </Card>
              </div>

              {/* Insights Panel */}
              <div className="xl:col-span-1">
                <InsightsPanel data={filteredStudents} />
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
