"use client"

import {
  BarChart3,
  ScatterChartIcon as Scatter,
  PieChart,
  TrendingUp,
  BarChart2,
  Activity,
  Radar,
  Grid3X3,
  Layers,
  AreaChart,
  Circle,
  Users,
  Target,
  Zap,
  BookOpen,
  Calendar,
  Percent,
  UserCheck,
  Trophy,
  TrendingDown,
  Globe,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

const chartSections = [
  {
    title: "Prezentare Generală",
    items: [{ id: "overview", label: "Dashboard Principal", icon: BarChart3 }],
  },
  {
    title: "Analize Principale",
    items: [
      { id: "scatter", label: "Scatter Plot", icon: Scatter },
      { id: "bar", label: "Bar Chart", icon: BarChart2 },
      { id: "pie", label: "Pie Chart", icon: PieChart },
      { id: "line", label: "Line Chart", icon: TrendingUp },
      { id: "grouped", label: "Grouped Bar", icon: BarChart3 },
      { id: "box", label: "Box Plot", icon: Activity },
      { id: "radar", label: "Radar Chart", icon: Radar },
      { id: "heatmap", label: "Heatmap", icon: Grid3X3 },
      { id: "stacked", label: "Stacked Bar", icon: Layers },
      { id: "area", label: "Area Chart", icon: AreaChart },
      { id: "bubble", label: "Bubble Chart", icon: Circle },
    ],
  },
  {
    title: "Analize Noi",
    items: [
      { id: "genderDist", label: "Distribuția pe Gen", icon: Users },
      { id: "bmiCategoryDist", label: "Categorii IMC", icon: Target },
      { id: "bmiRavenCorr", label: "Corelația IMC-Raven", icon: Zap },
      { id: "sportsByBMI", label: "Sport pe IMC", icon: Activity },
      { id: "intelligenceByClass", label: "Inteligență pe Clase", icon: BookOpen },
      { id: "bmiByAge", label: "IMC pe Vârste", icon: Calendar },
      { id: "intelligencePercentByBMI", label: "% Inteligență/IMC", icon: Percent },
      { id: "bmiBySex", label: "IMC pe Gen", icon: UserCheck },
      { id: "sportsByIntelligence", label: "Sport/Inteligență", icon: Trophy },
      { id: "ravenByBMI", label: "Raven pe IMC", icon: TrendingDown },
    ],
  },
  {
    title: "Comparații OMS",
    items: [{ id: "whoComparison", label: "Standarde OMS", icon: Globe }],
  },
]

export default function Sidebar({ activeChart, setActiveChart }) {
  return (
    <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 h-screen overflow-y-auto transition-colors duration-300">
      <div className="p-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 transition-colors duration-300">
          Vizualizări
        </h2>

        <div className="space-y-6">
          {chartSections.map((section) => (
            <div key={section.title}>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2 transition-colors duration-300">
                {section.title}
              </h3>
              <div className="space-y-1">
                {section.items.map((item) => {
                  const Icon = item.icon
                  return (
                    <Button
                      key={item.id}
                      variant={activeChart === item.id ? "default" : "ghost"}
                      className="w-full justify-start text-sm transition-all duration-200 hover:scale-105"
                      onClick={() => setActiveChart(item.id)}
                    >
                      <Icon className="h-4 w-4 mr-3" />
                      {item.label}
                    </Button>
                  )
                })}
              </div>
              {section.title !== "Comparații OMS" && <Separator className="mt-4" />}
            </div>
          ))}
        </div>

        <Card className="mt-6 p-4 transition-colors duration-300">
          <h3 className="font-medium text-sm text-gray-900 dark:text-white mb-2 transition-colors duration-300">
            Ipoteza de Cercetare
          </h3>
          <p className="text-xs text-gray-600 dark:text-gray-400 transition-colors duration-300">
            "Elevii cu IMC normal au rezultate mai bune la testele de inteligență comparativ cu cei cu IMC extrem
            (subponderal/supraponderal/obez)."
          </p>
        </Card>
      </div>
    </aside>
  )
}
