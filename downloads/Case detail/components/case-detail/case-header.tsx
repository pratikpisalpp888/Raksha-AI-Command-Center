"use client"

import { ArrowLeft, Download, Printer, Share2, MoreHorizontal } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface CaseHeaderProps {
  caseId: string
  status: "dispatched" | "resolved" | "pending" | "in-progress"
}

const statusConfig = {
  dispatched: { 
    label: "DISPATCHED", 
    className: "bg-info/15 text-info border-info/30 shadow-[0_0_12px_rgba(96,165,250,0.15)]" 
  },
  resolved: { 
    label: "RESOLVED", 
    className: "bg-success/15 text-success border-success/30 shadow-[0_0_12px_rgba(74,222,128,0.15)]" 
  },
  pending: { 
    label: "PENDING", 
    className: "bg-warning/15 text-warning border-warning/30" 
  },
  "in-progress": { 
    label: "IN PROGRESS", 
    className: "bg-saffron/15 text-saffron border-saffron/30 shadow-[0_0_12px_rgba(251,146,60,0.15)]" 
  },
}

export function CaseHeader({ caseId, status }: CaseHeaderProps) {
  const statusInfo = statusConfig[status]

  return (
    <header className="border-b border-border/50 bg-surface-elevated/50 backdrop-blur-xl sticky top-0 z-50">
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        {/* Back Link */}
        <Link
          href="/"
          className="flex items-center gap-2 text-saffron hover:text-saffron-light transition-all duration-200 font-medium group"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          <span className="text-sm">Back to Dashboard</span>
        </Link>

        {/* Case ID */}
        <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground text-sm">CASE</span>
            <span className="font-mono text-base font-semibold tracking-wider text-foreground bg-secondary/50 px-3 py-1 rounded-md border border-border/50">
              {caseId}
            </span>
          </div>
          <Badge
            variant="outline"
            className={`px-3 py-1 font-semibold text-xs tracking-wider ${statusInfo.className}`}
          >
            {statusInfo.label}
          </Badge>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-muted-foreground hover:text-foreground hover:bg-secondary/50 h-9 px-3"
          >
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-muted-foreground hover:text-foreground hover:bg-secondary/50 h-9 px-3"
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-muted-foreground hover:text-foreground hover:bg-secondary/50 h-9 px-3"
          >
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-muted-foreground hover:text-foreground hover:bg-secondary/50 h-9 w-9"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-card border-border">
              <DropdownMenuItem>Escalate Case</DropdownMenuItem>
              <DropdownMenuItem>Assign to Officer</DropdownMenuItem>
              <DropdownMenuItem>View Audit Log</DropdownMenuItem>
              <DropdownMenuItem className="text-critical">Close Case</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
