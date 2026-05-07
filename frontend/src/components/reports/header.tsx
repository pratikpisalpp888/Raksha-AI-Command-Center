"use client"

import { FileText, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface HeaderProps {
  dateRange: string
  setDateRange: (value: string) => void
}

export function Header({ dateRange, setDateRange }: HeaderProps) {
  return (
    <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-border">
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-[var(--saffron)]/20 border border-[var(--saffron)]/30">
          <span className="text-xl">📈</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          REPORTS & ANALYTICS
        </h1>
      </div>

      <div className="flex items-center gap-3">
        <Select value={dateRange} onValueChange={setDateRange}>
          <SelectTrigger className="w-[140px] bg-secondary border-border">
            <SelectValue placeholder="Date Range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7days">Last 7 Days</SelectItem>
            <SelectItem value="30days">Last 30 Days</SelectItem>
            <SelectItem value="90days">Last 90 Days</SelectItem>
          </SelectContent>
        </Select>

        <Button
          className="bg-[var(--saffron)] hover:bg-[var(--saffron-dark)] text-[var(--primary-foreground)]"
        >
          <FileText className="w-4 h-4 mr-2" />
          Export PDF
        </Button>

        <Button
          className="bg-[var(--saffron)] hover:bg-[var(--saffron-dark)] text-[var(--primary-foreground)]"
        >
          <Download className="w-4 h-4 mr-2" />
          Export CSV
        </Button>
      </div>
    </header>
  )
}
