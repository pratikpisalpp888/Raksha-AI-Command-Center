import { motion } from "framer-motion"
import { MapPin, Radio, RefreshCw, Layers, Shield } from "lucide-react"
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
const DEFAULT_CENTER: [number, number] = [19.0330, 73.0297]
const DEFAULT_ZOOM = 12

const emotionColors = {
  panic: "#FF2D55",
  distressed: "#FF6B2B",
  concerned: "#FFD60A",
  calm: "#00E676",
  unknown: "#7B8FA8",
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
      <div style="
        width: 14px; 
        height: 14px; 
        background-color: ${color}; 
        border-radius: 50%; 
        border: 2px solid white;
        box-shadow: 0 0 10px ${color};
        animation: map-pulse 1.5s infinite;
      "></div>
    `,
    iconSize: [14, 14],
    iconAnchor: [7, 7],
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
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const [mapCenter, setMapCenter] = useState<[number, number]>(DEFAULT_CENTER)
  const [mapZoom, setMapZoom] = useState(DEFAULT_ZOOM)

  const fetchMarkers = useCallback(async () => {
    try {
      const [heatmap, unitsData] = await Promise.all([
        getHeatmapData(),
        getUnits()
      ])
      
      setEmergencies(heatmap || [])
      setUnits(unitsData || [])
      setLastUpdated(new Date())
      
      // If there's a new critical emergency, fly to it!
      if (heatmap && heatmap.length > 0) {
        const latest = heatmap[0]
        if (latest.lat && latest.lng) {
            setMapCenter([latest.lat, latest.lng])
            setMapZoom(14) // Tactical zoom in
        }
      }
    } catch (err) {
      console.warn("[TacticalMap] Failed to fetch map data")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchMarkers()
    
    // Listen for real-time emergency events
    const handleNewEmergency = () => {
        fetchMarkers()
    }
    
    window.addEventListener('raksha-emergency', handleNewEmergency)
    
    return () => {
      window.removeEventListener('raksha-emergency', handleNewEmergency)
    }
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

      {/* Header */}
      <div className="absolute top-5 left-5 right-5 z-[500] pointer-events-none">
        <div className="flex items-center justify-between">
          <motion.div 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="bg-[#030810]/90 backdrop-blur-xl border border-white/10 rounded-2xl px-5 py-3 flex items-center gap-4 pointer-events-auto shadow-[0_8px_32px_rgba(0,0,0,0.5)] border-t-white/20"
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
                NAVI MUMBAI • CORE SECTOR 04
              </p>
            </div>
          </motion.div>

          <div className="flex gap-2 pointer-events-auto">
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
      <div className="flex-1 w-full h-full grayscale-[0.85] contrast-[1.2] invert-[0.92] hue-rotate-[185deg] brightness-[0.8]">
        <MapContainer 
          center={mapCenter} 
          zoom={mapZoom} 
          style={{ height: "100%", width: "100%" }}
          zoomControl={false}
        >
          {/* Dark Mode Tiles */}
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          <ChangeView center={mapCenter} zoom={mapZoom} />

          {/* Unit Markers (Police Stations) */}
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

          {/* Emergency Markers */}
          {emergencies.map((emer) => (
            <Marker
              key={emer.case_id}
              position={[emer.lat, emer.lng]}
              icon={createPulseIcon(emotionColors[emer.emotion as keyof typeof emotionColors] || "#FF9933")}
            >
              <Popup>
                <div className="p-2 min-w-[120px]">
                  <p className="text-[10px] font-black text-[#FF6B00] mb-1 tracking-widest uppercase">SIGNAL DETECTED</p>
                  <p className="text-sm font-bold text-white mb-1 uppercase tracking-tight">{emer.intent}</p>
                  <div className="h-px w-full bg-white/10 my-2" />
                  <p className="text-[9px] text-[#7B8FA8] font-bold uppercase tracking-widest flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: emotionColors[emer.emotion as keyof typeof emotionColors] }} />
                    EMOTION: {emer.emotion}
                  </p>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {/* Legend */}
      <div className="absolute bottom-5 left-5 right-5 z-[500] pointer-events-none flex justify-between items-end">
        {/* Left Legend: Emotions */}
        <motion.div 
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="bg-[#030810]/90 backdrop-blur-xl border border-white/10 rounded-2xl p-3 shadow-2xl border-t-white/10 pointer-events-auto"
        >
          <p className="text-[8px] font-black text-[#7B8FA8] mb-2 tracking-[0.2em] uppercase opacity-60">Emergency Emotions</p>
          <div className="flex gap-3">
            {Object.entries(emotionColors).slice(0, 4).map(([level, color]) => (
              <div key={level} className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
                <span className="text-[8px] text-white/70 font-bold uppercase">{level}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Right Legend: Units */}
        <motion.div 
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="bg-[#030810]/90 backdrop-blur-xl border border-white/10 rounded-2xl p-3 shadow-2xl border-t-white/10 pointer-events-auto"
        >
          <p className="text-[8px] font-black text-[#7B8FA8] mb-2 tracking-[0.2em] uppercase opacity-60">Support Units</p>
          <div className="flex gap-4">
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded bg-[#2979FF] flex items-center justify-center">
                <Shield size={6} className="text-white" />
              </div>
              <span className="text-[8px] text-white font-bold uppercase">Police Station</span>
            </div>
          </div>
        </motion.div>
      </div>

      <style>{`
        @keyframes map-pulse {
          0% { box-shadow: 0 0 0 0px rgba(255, 255, 255, 0.7); }
          70% { box-shadow: 0 0 0 10px rgba(255, 255, 255, 0); }
          100% { box-shadow: 0 0 0 0px rgba(255, 255, 255, 0); }
        }
        .leaflet-container {
          background: #030810 !important;
        }
        .leaflet-popup-content-wrapper {
          background: #030810 !important;
          color: white !important;
          border: 1px solid rgba(255,107,0,0.3);
        }
        .leaflet-popup-tip {
          background: #030810 !important;
        }
      `}</style>
    </motion.div>
  )
}
