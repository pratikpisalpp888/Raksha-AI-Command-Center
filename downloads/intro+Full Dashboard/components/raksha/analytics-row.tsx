"use client"

import { motion } from "framer-motion"
import { PieChart, Pie, Cell, ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, RadarChart, PolarGrid, PolarAngleAxis, Radar } from "recharts"
import { TrendingUp, Activity, Brain, Globe, Zap } from "lucide-react"

// Emotion Intelligence Data
const emotionData = [
  { emotion: "Fear", value: 35, color: "#FF2D55" },
  { emotion: "Anxiety", value: 28, color: "#FF6B2B" },
  { emotion: "Distress", value: 22, color: "#FFD60A" },
  { emotion: "Calm", value: 15, color: "#00E676" },
]

// Incident Command Data (Donut)
const incidentData = [
  { name: "Domestic Violence", value: 85, color: "#FF2D55" },
  { name: "Sexual Harassment", value: 45, color: "#FF6B2B" },
  { name: "Stalking", value: 38, color: "#FFD60A" },
  { name: "Dowry Harassment", value: 32, color: "#FF9933" },
  { name: "Child Abuse", value: 28, color: "#2979FF" },
  { name: "Other", value: 19, color: "#3D5068" },
]

// Language Matrix Data
const languageData = [
  { language: "Hindi", percentage: 42, gradient: "from-[#FF6B00] to-[#FF9933]" },
  { language: "Kannada", percentage: 28, gradient: "from-[#2979FF] to-[#1565C0]" },
  { language: "Hinglish", percentage: 15, gradient: "from-white/80 to-white/40" },
  { language: "English", percentage: 10, gradient: "from-[#00E676] to-[#138808]" },
  { language: "Other", percentage: 5, gradient: "from-[#7B8FA8] to-[#3D5068]" },
]

// Response Time Trend Data (hourly)
const responseTimeTrend = [
  { time: "00:00", avgTime: 4.2, calls: 12 },
  { time: "04:00", avgTime: 3.8, calls: 8 },
  { time: "08:00", avgTime: 5.1, calls: 24 },
  { time: "12:00", avgTime: 4.5, calls: 35 },
  { time: "16:00", avgTime: 5.8, calls: 42 },
  { time: "20:00", avgTime: 6.2, calls: 38 },
  { time: "23:00", avgTime: 4.9, calls: 28 },
]

// AI Performance Radar
const aiPerformanceData = [
  { subject: "Accuracy", A: 92, fullMark: 100 },
  { subject: "Speed", A: 88, fullMark: 100 },
  { subject: "Emotion Detection", A: 95, fullMark: 100 },
  { subject: "Language", A: 90, fullMark: 100 },
  { subject: "Escalation", A: 87, fullMark: 100 },
  { subject: "Resolution", A: 85, fullMark: 100 },
]

// Custom tooltip for charts
const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number; name: string }>; label?: string }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[rgba(3,8,16,0.95)] border border-[rgba(255,107,0,0.3)] rounded-lg p-2 text-xs">
        <p className="text-[#FF9933] font-medium">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} className="text-[#F5F0FF]">
            {entry.name}: {entry.value}
          </p>
        ))}
      </div>
    )
  }
  return null
}

export function AnalyticsRow() {
  return (
    <motion.div
      className="grid grid-cols-4 gap-5 px-6 pb-6"
      initial={{ y: 40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.7, duration: 0.5 }}
    >
      {/* Emotion Intelligence Card */}
      <div className="glass-card h-[320px] flex flex-col overflow-hidden">
        <div 
          className="h-[3px] w-full flex-shrink-0"
          style={{ background: "linear-gradient(90deg, #FF2D55, #FF6B2B, #FFD60A, #00E676)" }}
        />
        <div className="p-4 border-b border-[rgba(255,107,0,0.15)] flex items-center gap-2 flex-shrink-0">
          <Brain size={16} className="text-[#FF6B2B]" />
          <h3 className="text-xs font-semibold tracking-wide text-[#F5F0FF] uppercase">
            Emotion Intelligence
          </h3>
        </div>
        
        <div className="flex-1 p-4 space-y-3 overflow-hidden">
          {emotionData.map((item, index) => (
            <motion.div
              key={item.emotion}
              className="space-y-1.5"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1 + index * 0.1 }}
            >
              <div className="flex justify-between text-xs">
                <span className="text-[#F5F0FF] font-medium">{item.emotion}</span>
                <span className="text-[#7B8FA8] font-mono">{item.value}%</span>
              </div>
              <div className="h-2.5 rounded-full bg-[rgba(255,107,0,0.08)] overflow-hidden relative">
                <motion.div
                  className="h-full rounded-full relative overflow-hidden"
                  style={{ backgroundColor: item.color }}
                  initial={{ width: 0 }}
                  animate={{ width: `${item.value}%` }}
                  transition={{ delay: 1.2 + index * 0.1, duration: 0.8 }}
                >
                  {/* Shimmer effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                    animate={{ x: ["-100%", "200%"] }}
                    transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
                  />
                </motion.div>
              </div>
            </motion.div>
          ))}

          {/* Alert box */}
          <motion.div
            className="mt-3 p-3 rounded-lg border border-[#FF2D55] bg-[rgba(255,45,85,0.08)]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
          >
            <div className="flex items-center gap-2">
              <motion.div
                className="w-2 h-2 rounded-full bg-[#FF2D55]"
                animate={{ scale: [1, 1.3, 1], opacity: [1, 0.6, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              />
              <p className="text-[10px] text-[#FF2D55] font-medium">
                35% PANIC LEVEL - AI escalation recommended
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Incident Command Donut */}
      <div className="glass-card h-[320px] flex flex-col overflow-hidden">
        <div 
          className="h-[3px] w-full flex-shrink-0"
          style={{ background: "linear-gradient(90deg, #FF9933, #FF2D55)" }}
        />
        <div className="p-4 border-b border-[rgba(255,107,0,0.15)] flex items-center gap-2 flex-shrink-0">
          <Zap size={16} className="text-[#FF9933]" />
          <h3 className="text-xs font-semibold tracking-wide text-[#F5F0FF] uppercase">
            Incident Command
          </h3>
        </div>
        
        <div className="flex-1 flex items-center justify-center relative p-2">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={incidentData}
                cx="50%"
                cy="50%"
                innerRadius="55%"
                outerRadius="85%"
                paddingAngle={2}
                dataKey="value"
                animationBegin={1000}
                animationDuration={1500}
              >
                {incidentData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.color}
                    stroke="rgba(3,8,16,0.5)"
                    strokeWidth={1}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          
          {/* Center text */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
            <motion.span
              className="text-3xl font-black text-[#FF9933] block"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 2, ease: "backOut" }}
            >
              247
            </motion.span>
            <p className="text-[9px] text-[#7B8FA8] uppercase tracking-wider">Total Cases</p>
          </div>
        </div>

        {/* Legend */}
        <div className="p-3 border-t border-[rgba(255,107,0,0.15)] flex-shrink-0">
          <div className="grid grid-cols-3 gap-1">
            {incidentData.slice(0, 6).map((item) => (
              <span key={item.name} className="flex items-center gap-1 text-[8px] text-[#7B8FA8]">
                <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                <span className="truncate">{item.name.split(" ")[0]}</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Response Time Trend Chart */}
      <div className="glass-card h-[320px] flex flex-col overflow-hidden">
        <div 
          className="h-[3px] w-full flex-shrink-0"
          style={{ background: "linear-gradient(90deg, #2979FF, #00E676)" }}
        />
        <div className="p-4 border-b border-[rgba(255,107,0,0.15)] flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2">
            <Activity size={16} className="text-[#2979FF]" />
            <h3 className="text-xs font-semibold tracking-wide text-[#F5F0FF] uppercase">
              Response Trend
            </h3>
          </div>
          <div className="flex items-center gap-1 text-[10px] text-[#00E676]">
            <TrendingUp size={12} />
            <span>+12%</span>
          </div>
        </div>
        
        <div className="flex-1 p-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={responseTimeTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorCalls" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2979FF" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#2979FF" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorTime" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#FF9933" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#FF9933" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis 
                dataKey="time" 
                tick={{ fill: '#7B8FA8', fontSize: 9 }} 
                axisLine={{ stroke: 'rgba(255,107,0,0.15)' }}
                tickLine={false}
              />
              <YAxis 
                tick={{ fill: '#7B8FA8', fontSize: 9 }} 
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area 
                type="monotone" 
                dataKey="calls" 
                stroke="#2979FF" 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#colorCalls)" 
                name="Calls"
              />
              <Area 
                type="monotone" 
                dataKey="avgTime" 
                stroke="#FF9933" 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#colorTime)" 
                name="Avg Response (min)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="px-4 pb-3 flex justify-center gap-4 text-[9px] flex-shrink-0">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-0.5 bg-[#2979FF] rounded" />
            <span className="text-[#7B8FA8]">Calls</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-0.5 bg-[#FF9933] rounded" />
            <span className="text-[#7B8FA8]">Avg Time</span>
          </span>
        </div>
      </div>

      {/* AI Performance Radar */}
      <div className="glass-card h-[320px] flex flex-col overflow-hidden">
        <div 
          className="h-[3px] w-full flex-shrink-0"
          style={{ background: "linear-gradient(90deg, #FF6B00, #2979FF, #00E676)" }}
        />
        <div className="p-4 border-b border-[rgba(255,107,0,0.15)] flex items-center gap-2 flex-shrink-0">
          <Globe size={16} className="text-[#00E676]" />
          <h3 className="text-xs font-semibold tracking-wide text-[#F5F0FF] uppercase">
            AI Performance
          </h3>
        </div>
        
        <div className="flex-1 p-2">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={aiPerformanceData}>
              <PolarGrid 
                stroke="rgba(255,107,0,0.15)" 
                strokeDasharray="3 3"
              />
              <PolarAngleAxis 
                dataKey="subject" 
                tick={{ fill: '#7B8FA8', fontSize: 8 }}
              />
              <Radar
                name="Performance"
                dataKey="A"
                stroke="#FF9933"
                fill="#FF9933"
                fillOpacity={0.25}
                strokeWidth={2}
                animationBegin={1200}
                animationDuration={1500}
              />
              <Tooltip content={<CustomTooltip />} />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Performance score */}
        <div className="px-4 pb-3 flex items-center justify-center gap-2 flex-shrink-0">
          <span className="text-[10px] text-[#7B8FA8]">Overall Score:</span>
          <span className="text-sm font-bold text-[#00E676]">89.5%</span>
          <motion.span
            className="text-[10px] text-[#00E676]"
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            OPTIMAL
          </motion.span>
        </div>
      </div>
    </motion.div>
  )
}
