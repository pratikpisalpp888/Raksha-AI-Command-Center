"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  ChevronLeft,
  ChevronRight,
  Download,
  ArrowUpDown,
  Phone,
  CheckCircle2,
  Clock,
  AlertTriangle,
} from "lucide-react"

const casesData = [
  {
    id: "RKS-2847",
    timestamp: "2024-05-04 23:45:12",
    caller: "+91 98XXX XXXX1",
    language: "Hindi",
    intent: "Domestic Violence",
    emotion: "Distressed",
    responseTime: "6.2s",
    status: "Resolved",
    district: "Koramangala",
    aiConfidence: 96,
  },
  {
    id: "RKS-2846",
    timestamp: "2024-05-04 23:32:08",
    caller: "+91 87XXX XXXX5",
    language: "Kannada",
    intent: "Harassment",
    emotion: "Anxious",
    responseTime: "4.8s",
    status: "Escalated",
    district: "Indiranagar",
    aiConfidence: 89,
  },
  {
    id: "RKS-2845",
    timestamp: "2024-05-04 23:18:45",
    caller: "+91 99XXX XXXX2",
    language: "English",
    intent: "Medical Emergency",
    emotion: "Critical",
    responseTime: "3.1s",
    status: "Resolved",
    district: "Whitefield",
    aiConfidence: 98,
  },
  {
    id: "RKS-2844",
    timestamp: "2024-05-04 23:05:33",
    caller: "+91 70XXX XXXX8",
    language: "Hindi",
    intent: "Stalking",
    emotion: "Anxious",
    responseTime: "5.5s",
    status: "In Progress",
    district: "JP Nagar",
    aiConfidence: 92,
  },
  {
    id: "RKS-2843",
    timestamp: "2024-05-04 22:52:17",
    caller: "+91 88XXX XXXX3",
    language: "Tamil",
    intent: "General Inquiry",
    emotion: "Calm",
    responseTime: "8.2s",
    status: "Resolved",
    district: "Electronic City",
    aiConfidence: 94,
  },
  {
    id: "RKS-2842",
    timestamp: "2024-05-04 22:41:09",
    caller: "+91 91XXX XXXX7",
    language: "Kannada",
    intent: "Domestic Violence",
    emotion: "Distressed",
    responseTime: "4.1s",
    status: "Resolved",
    district: "Marathahalli",
    aiConfidence: 97,
  },
  {
    id: "RKS-2841",
    timestamp: "2024-05-04 22:28:55",
    caller: "+91 77XXX XXXX4",
    language: "Hindi",
    intent: "Harassment",
    emotion: "Anxious",
    responseTime: "7.3s",
    status: "Resolved",
    district: "HSR Layout",
    aiConfidence: 91,
  },
  {
    id: "RKS-2840",
    timestamp: "2024-05-04 22:15:42",
    caller: "+91 85XXX XXXX9",
    language: "English",
    intent: "False Alarm",
    emotion: "Calm",
    responseTime: "12.1s",
    status: "Closed",
    district: "BTM Layout",
    aiConfidence: 88,
  },
]

const getStatusStyle = (status: string) => {
  switch (status) {
    case "Resolved":
      return "bg-[var(--success)]/20 text-[var(--success)] border-[var(--success)]/30"
    case "Escalated":
      return "bg-[var(--danger)]/20 text-[var(--danger)] border-[var(--danger)]/30"
    case "In Progress":
      return "bg-[var(--saffron)]/20 text-[var(--saffron)] border-[var(--saffron)]/30"
    case "Closed":
      return "bg-muted text-muted-foreground border-border"
    default:
      return "bg-muted text-muted-foreground border-border"
  }
}

const getEmotionStyle = (emotion: string) => {
  switch (emotion) {
    case "Calm":
      return "text-[var(--success)]"
    case "Anxious":
      return "text-[var(--warning)]"
    case "Distressed":
      return "text-[var(--saffron)]"
    case "Critical":
      return "text-[var(--danger)]"
    default:
      return "text-muted-foreground"
  }
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case "Resolved":
      return <CheckCircle2 className="w-3 h-3" />
    case "Escalated":
      return <AlertTriangle className="w-3 h-3" />
    case "In Progress":
      return <Clock className="w-3 h-3" />
    default:
      return null
  }
}

export function CasesTable() {
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 8
  const totalPages = Math.ceil(casesData.length / itemsPerPage)

  const paginatedData = casesData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  return (
    <Card className="bg-[var(--glass)] backdrop-blur-xl border-[var(--glass-border)]">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <CardTitle className="text-lg font-semibold text-foreground">
          Recent Cases
        </CardTitle>
        <Button
          variant="outline"
          size="sm"
          className="border-[var(--saffron)]/30 text-[var(--saffron)] hover:bg-[var(--saffron)]/10"
        >
          <Download className="w-4 h-4 mr-2" />
          Export
        </Button>
      </CardHeader>
      <CardContent>
        <div className="rounded-lg border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-secondary/50 hover:bg-secondary/50">
                <TableHead className="text-foreground font-semibold">
                  <div className="flex items-center gap-1 cursor-pointer hover:text-[var(--saffron)]">
                    Case ID <ArrowUpDown className="w-3 h-3" />
                  </div>
                </TableHead>
                <TableHead className="text-foreground font-semibold">
                  <div className="flex items-center gap-1 cursor-pointer hover:text-[var(--saffron)]">
                    Timestamp <ArrowUpDown className="w-3 h-3" />
                  </div>
                </TableHead>
                <TableHead className="text-foreground font-semibold">Caller</TableHead>
                <TableHead className="text-foreground font-semibold">Language</TableHead>
                <TableHead className="text-foreground font-semibold">Intent</TableHead>
                <TableHead className="text-foreground font-semibold">Emotion</TableHead>
                <TableHead className="text-foreground font-semibold">
                  <div className="flex items-center gap-1 cursor-pointer hover:text-[var(--saffron)]">
                    Response <ArrowUpDown className="w-3 h-3" />
                  </div>
                </TableHead>
                <TableHead className="text-foreground font-semibold">District</TableHead>
                <TableHead className="text-foreground font-semibold">AI %</TableHead>
                <TableHead className="text-foreground font-semibold">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.map((caseItem) => (
                <TableRow
                  key={caseItem.id}
                  className="hover:bg-secondary/30 transition-colors"
                >
                  <TableCell className="font-mono text-sm text-[var(--saffron)]">
                    {caseItem.id}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {caseItem.timestamp}
                  </TableCell>
                  <TableCell className="text-sm">
                    <div className="flex items-center gap-1.5">
                      <Phone className="w-3 h-3 text-muted-foreground" />
                      {caseItem.caller}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">{caseItem.language}</TableCell>
                  <TableCell className="text-sm">{caseItem.intent}</TableCell>
                  <TableCell className={`text-sm font-medium ${getEmotionStyle(caseItem.emotion)}`}>
                    {caseItem.emotion}
                  </TableCell>
                  <TableCell className="text-sm font-mono">
                    {caseItem.responseTime}
                  </TableCell>
                  <TableCell className="text-sm">{caseItem.district}</TableCell>
                  <TableCell>
                    <div
                      className={`text-sm font-medium ${
                        caseItem.aiConfidence >= 95
                          ? "text-[var(--success)]"
                          : caseItem.aiConfidence >= 90
                          ? "text-[var(--saffron)]"
                          : "text-[var(--warning)]"
                      }`}
                    >
                      {caseItem.aiConfidence}%
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={`${getStatusStyle(caseItem.status)} flex items-center gap-1 w-fit`}
                    >
                      {getStatusIcon(caseItem.status)}
                      {caseItem.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-4">
          <p className="text-sm text-muted-foreground">
            Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
            {Math.min(currentPage * itemsPerPage, casesData.length)} of{" "}
            {casesData.length} cases
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="border-border"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentPage(page)}
                className={
                  currentPage === page
                    ? "bg-[var(--saffron)] text-[var(--primary-foreground)]"
                    : "border-border"
                }
              >
                {page}
              </Button>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="border-border"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
