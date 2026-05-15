import { motion } from "framer-motion"
import { MapPin, Radio, RefreshCw, Shield } from "lucide-react"
import { useEffect, useState, useCallback } from "react"
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import { getHeatmapData, getUnits } from "../../services/api"

// Fix for default marker icons in Leaflet + React
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png"
import markerIcon from "leaflet/dist/images/marker-icon.png"
import markerShadow from "leaflet/dist/images/marker-shadow.png"

delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
})

// Navi Mumbai Center
const DEFAULT_CENTER: [number, number] = [12.9716, 77.5946] // Central Bengaluru
const DEFAULT_ZOOM = 12

const emotionColors = {
  panic: "#FF0000",      // Vibrant Red
  distressed: "#FF6600",   // Strong Orange
  concerned: "#FFCC00",   // Amber
  calm: "#00FF88",        // Neon Green
  unknown: "#7B8FA8",
}

const priorityColors = {
  critical: "#FF0000",
  high: "#FF6600",
  medium: "#FFCC00",
  low: "#00FF88",
}

const unitColors = {
  police: "#2979FF",
  women_helpline: "#E040FB",
  ambulance: "#FF5252",
}

// Custom pulse icon for active emergencies
const createPulseIcon = (color: string) => {
  return L.divIcon({
    className: "custom-pulse-icon",
    html: `
      <div class="pulse-wrapper">
        <div class="pulse-dot" style="background-color: ${color}; box-shadow: 0 0 15px ${color};"></div>
        <div class="pulse-ring" style="border-color: ${color};"></div>
      </div>
    `,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  })
}

// Icon for Police Stations / Units
const createStationIcon = (color: string) => {
  return L.divIcon({
    className: "custom-station-icon",
    html: `
      <div style="
        width: 22px; 
        height: 22px; 
        background-color: ${color}; 
        border-radius: 6px; 
        border: 2px solid white;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 0 15px ${color};
      ">
        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
      </div>
    `,
    iconSize: [22, 22],
    iconAnchor: [11, 11],
  })
}

// Component to handle map centering
function ChangeView({ center, zoom }: { center: [number, number], zoom: number }) {
  const map = useMap()
  useEffect(() => {
    map.setView(center, zoom)
  }, [center, zoom, map])
  return null
}

export function TacticalMap() {
  const [emergencies, setEmergencies] = useState<any[]>([])
  const [units, setUnits] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [mapCenter, setMapCenter] = useState<[number, number]>(DEFAULT_CENTER)
  const [mapZoom, setMapZoom] = useState(DEFAULT_ZOOM)

  const fetchMarkers = useCallback(async () => {
    try {
      setLoading(true)
      const [heatmap, unitsData] = await Promise.all([
        getHeatmapData(),
        getUnits()
      ])
      
      setEmergencies(heatmap || [])
      setUnits(unitsData || [])
      
      // Auto-focus on the latest case if it's new
      if (heatmap && heatmap.length > 0) {
        const latest = heatmap[0]
        if (latest.lat && latest.lng) {
            setMapCenter([latest.lat, latest.lng])
            setMapZoom(14) 
        }
      }
    } catch (err) {
      console.warn("[TacticalMap] Failed to fetch map data")
    } finally {
      setLoading(false)
    }
  }, [])

  const handleRecenter = () => {
    if (emergencies.length > 0 && emergencies[0].lat) {
        setMapCenter([emergencies[0].lat, emergencies[0].lng])
        setMapZoom(14)
    } else {
        setMapCenter(DEFAULT_CENTER)
        setMapZoom(DEFAULT_ZOOM)
    }
  }

  useEffect(() => {
    fetchMarkers()
    const handleNewEmergency = () => fetchMarkers()
    window.addEventListener('raksha-emergency', handleNewEmergency)
    return () => window.removeEventListener('raksha-emergency', handleNewEmergency)
  }, [fetchMarkers])

  return (
    <motion.div
      className="cyber-card h-[520px] flex flex-col overflow-hidden relative border border-white/5 shadow-2xl group"
      initial={{ x: 60, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ delay: 0.6, duration: 0.5 }}
    >
      {/* Tactical Grid Overlay */}
      <div className="absolute inset-0 opacity-[0.05] pointer-events-none z-[400]" 
           style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '30px 30px' }} />

      {/* Radar Sweep Effect */}
      <div className="radar-sweep z-[401]" />

      {/* Header Overlay */}
      <div className="absolute top-5 left-5 right-5 z-[500] pointer-events-none">
        <div className="flex items-center justify-between">
          <motion.div 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="bg-[#030810]/90 backdrop-blur-xl border border-white/10 rounded-2xl px-5 py-3 flex items-center gap-4 pointer-events-auto shadow-2xl border-t-white/20"
          >
            <div className="relative">
              <Radio size={18} className="text-[#FF2D55] animate-pulse" />
              <div className="absolute inset-0 bg-[#FF2D55] blur-md opacity-20 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-[11px] font-black tracking-[0.3em] text-white leading-tight uppercase neon-text-orange">
                  TACTICAL SURVEILLANCE
                </h3>
                <span className="bg-[#FF2D55]/10 text-[#FF2D55] text-[8px] font-black px-1.5 py-0.5 rounded border border-[#FF2D55]/20 animate-pulse">LIVE FEED</span>
              </div>
              <p className="text-[9px] text-[#7B8FA8] tracking-[0.4em] font-bold uppercase opacity-60 mt-0.5">
                ACTIVE MONITORING • ALL SECTORS
              </p>
            </div>
          </motion.div>

          <div className="flex gap-2 pointer-events-auto">
             <button 
              onClick={handleRecenter}
              title="Recenter on latest case"
              className="p-3 rounded-xl bg-[#030810]/90 backdrop-blur-xl border border-white/10 text-[#7B8FA8] hover:text-[#00E676] hover:border-[#00E676]/30 transition-all shadow-lg active:scale-95 flex items-center gap-2"
            >
              <MapPin size={16} />
              <span className="text-[10px] font-bold uppercase tracking-widest hidden sm:inline">Recenter</span>
            </button>
             <button 
              onClick={fetchMarkers}
              className="p-3 rounded-xl bg-[#030810]/90 backdrop-blur-xl border border-white/10 text-[#7B8FA8] hover:text-[#FF9933] hover:border-[#FF9933]/30 transition-all shadow-lg active:scale-95"
            >
              <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            </button>
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div className="flex-1 w-full h-full relative z-[10]">
        <MapContainer 
          center={mapCenter} 
          zoom={mapZoom} 
          style={{ height: "100%", width: "100%" }}
          zoomControl={false}
        >
          {/* TileLayer with custom class for dark mode filters */}
          <TileLayer
            className="map-tiles-dark"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          <ChangeView center={mapCenter} zoom={mapZoom} />

          {/* Support Units (Police Stations) */}
          {units.map((unit) => (
            <Marker
              key={unit.id}
              position={[unit.lat, unit.lng]}
              icon={createStationIcon(unitColors[unit.type as keyof typeof unitColors] || "#2979FF")}
            >
              <Popup>
                <div className="p-2 min-w-[140px]">
                  <p className="text-[10px] font-black text-[#2979FF] mb-1 tracking-widest uppercase font-mono">SUPPORT UNIT</p>
                  <p className="text-sm font-bold text-white mb-1 uppercase tracking-tight">{unit.name}</p>
                  <div className="h-px w-full bg-white/10 my-2" />
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] text-[#7B8FA8] font-bold uppercase tracking-widest">STATUS:</span>
                    <span className={`text-[9px] font-bold uppercase ${unit.is_available ? 'text-[#00E676]' : 'text-[#FF2D55]'}`}>
                      {unit.is_available ? 'Available' : 'On Mission'}
                    </span>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}

          {/* Active Emergencies */}
          {emergencies.map((emer) => {
            const markerColor = (emer.priority?.toLowerCase() === "critical")
              ? priorityColors.critical 
              : (emotionColors[emer.emotion as keyof typeof emotionColors] || priorityColors[emer.priority as keyof typeof priorityColors] || "#FF9933");

            return (
              <Marker
                key={emer.case_id}
                position={[emer.lat, emer.lng]}
                icon={createPulseIcon(markerColor)}
              >
                <Popup>
                  <div className="p-2 min-w-[140px]">
                    <div className="flex justify-between items-start mb-1">
                      <p className="text-[10px] font-black text-[#FF6B00] tracking-widest uppercase">SIGNAL DETECTED</p>
                      <p className="text-[9px] font-mono text-[#7B8FA8] opacity-80">{emer.case_id}</p>
                    </div>
                    <p className="text-sm font-bold text-white mb-1 uppercase tracking-tight">{emer.intent}</p>
                    <div className="h-px w-full bg-white/10 my-2" />
                    <p className="text-[9px] text-[#7B8FA8] font-bold uppercase tracking-widest flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: markerColor }} />
                      STATUS: {emer.priority?.toUpperCase()} / {emer.emotion?.toUpperCase()}
                    </p>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>

      {/* Legends Overlay */}
      <div className="absolute bottom-5 left-5 right-5 z-[500] pointer-events-none flex justify-between items-end">
        <motion.div 
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="bg-[#030810]/90 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-2xl pointer-events-auto"
        >
          <p className="text-[10px] font-black text-[#7B8FA8] mb-3 tracking-[0.2em] uppercase opacity-60">Threat Levels</p>
          <div className="flex gap-4">
            {Object.entries(priorityColors).map(([level, color]) => (
              <div key={level} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color, boxShadow: `0 0 10px ${color}` }} />
                <span className="text-[9px] text-white font-black uppercase">{level}</span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div 
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="bg-[#030810]/90 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-2xl pointer-events-auto"
        >
          <p className="text-[10px] font-black text-[#7B8FA8] mb-3 tracking-[0.2em] uppercase opacity-60">Field Assets</p>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-lg bg-[#2979FF] flex items-center justify-center shadow-[0_0_15px_#2979FF]">
              <Shield size={10} className="text-white" />
            </div>
            <span className="text-[10px] text-white font-bold uppercase">Police Unit</span>
          </div>
        </motion.div>
      </div>

      <style>{`
        .map-tiles-dark {
          filter: grayscale(0.85) contrast(1.2) invert(0.92) hue-rotate(185deg) brightness(0.8);
        }
        .pulse-wrapper {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 20px;
          height: 20px;
        }
        .pulse-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          border: 2px solid white;
          z-index: 2;
        }
        .pulse-ring {
          position: absolute;
          width: 100%;
          height: 100%;
          border: 2px solid;
          border-radius: 50%;
          animation: map-ring-pulse 1.5s ease-out infinite;
          opacity: 0;
          z-index: 1;
        }
        @keyframes map-ring-pulse {
          0% { transform: scale(0.5); opacity: 0.8; }
          100% { transform: scale(2.5); opacity: 0; }
        }
        .leaflet-container {
          background: #030810 !important;
        }
        .leaflet-popup-content-wrapper {
          background: rgba(3, 8, 16, 0.95) !important;
          backdrop-filter: blur(10px);
          color: white !important;
          border: 1px solid rgba(255,107,0,0.3);
          border-radius: 12px !important;
        }
        .leaflet-popup-tip {
          background: #030810 !important;
        }
      `}</style>
    </motion.div>
  )
}
