"use client"

import { useState } from "react"
import { Header } from "@/components/reports/header"
import { KPICards } from "@/components/reports/kpi-cards"
import { CallVolumeChart } from "@/components/reports/call-volume-chart"
import { EmotionBreakdownChart } from "@/components/reports/emotion-breakdown-chart"
import { IntentBreakdownChart } from "@/components/reports/intent-breakdown-chart"
import { ResponseTimeChart } from "@/components/reports/response-time-chart"
import { LanguageUsageChart } from "@/components/reports/language-usage-chart"
import { InsightsSection } from "@/components/reports/insights-section"
import { CasesTable } from "@/components/reports/cases-table"

export default function ReportsPage() {
  const [dateRange, setDateRange] = useState("7days")

  return (
    <div className="min-h-screen bg-background">
      {/* Background gradient effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[var(--saffron)]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-[var(--saffron)]/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-6 space-y-6">
        <Header dateRange={dateRange} setDateRange={setDateRange} />
        
        <KPICards />
        
        {/* Main Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-3">
            <CallVolumeChart />
          </div>
          <div className="lg:col-span-2">
            <EmotionBreakdownChart />
          </div>
        </div>

        {/* Second Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <IntentBreakdownChart />
          <ResponseTimeChart />
          <LanguageUsageChart />
        </div>

        <InsightsSection />

        <CasesTable />
      </div>
    </div>
  )
}
