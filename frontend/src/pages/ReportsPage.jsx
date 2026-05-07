"use client"

import { useState } from "react"
import Header from "../components/shared/Header"
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
      <Header />
      
      <div className="relative z-10 container mx-auto px-4 py-6 space-y-6">
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
