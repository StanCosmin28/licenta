import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Analiza Corelației IMC - Inteligență | Dashboard Interactiv",
  description:
    "Dashboard interactiv pentru analiza corelației dintre Indicele de Masă Corporală și inteligența elevilor de gimnaziu. Studiu pe 60 de participanți cu 12+ vizualizări de date.",
  keywords: "IMC, inteligență, elevi, gimnaziu, corelație, dashboard, analiză date",
    generator: 'v0.dev'
}

export default function RootLayout({ children }) {
  return (
    <html lang="ro">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
