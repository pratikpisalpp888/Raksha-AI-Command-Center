import { motion } from "framer-motion"
import { MapPin, Radio, RefreshCw, Layers } from "lucide-react"
import { useEffect, useState, useCallback } from "react"
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import { getHeatmapData } from "../../services/api"

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

const severityColors = {
  critical: "#FF2D55",
  high: "#FF6B2B",
  medium: "#FFD60A",
  resolved: "#00E676",
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
  const [loading, setLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const [mapCenter, setMapCenter] = useState<[number, number]>(DEFAULT_CENTER)
  const [mapZoom, setMapZoom] = useState(DEFAULT_ZOOM)

  const fetchMarkers = useCallback(async () => {
    try {
      const data = await getHeatmapData()
      setEmergencies(data || [])
      setLastUpdated(new Date())
      
      // If there's a new critical emergency, fly to it!
      if (data && data.length > 0) {
        const latest = data[0]
        if (latest.lat && latest.lng) {
            setMapCenter([latest.lat, latest.lng])
            setMapZoom(14) // Tactical zoom in
        }
      }
    } catch (err) {
      console.warn("[TacticalMap] Failed to fetch heatmap data")
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

          {emergencies.map((emer) => (
            <Marker
              key={emer.case_id}
              position={[emer.lat, emer.lng]}
              icon={createPulseIcon(severityColors[emer.priority as keyof typeof severityColors] || "#FF9933")}
            >
              <Popup>
                <div className="p-2 min-w-[120px]">
                  <p className="text-[10px] font-black text-[#FF6B00] mb-1 tracking-widest uppercase">SIGNAL DETECTED</p>
                  <p className="text-sm font-bold text-white mb-1 uppercase tracking-tight">{emer.intent}</p>
                  <div className="h-px w-full bg-white/10 my-2" />
                  <p className="text-[9px] text-[#7B8FA8] font-bold uppercase tracking-widest flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: severityColors[emer.priority as keyof typeof severityColors] }} />
                    PRIORITY: {emer.priority}
                  </p>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {/* Legend */}
      <motion.div 
        initial={{ x: 20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="absolute bottom-5 right-5 z-[500] bg-[#030810]/90 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-2xl border-t-white/10"
      >
        <p className="text-[10px] font-black text-[#7B8FA8] mb-3 tracking-[0.3em] uppercase opacity-60">Threat Levels</p>
        <div className="flex flex-col gap-3">
          {Object.entries(severityColors).map(([level, color]) => (
            <div key={level} className="flex items-center gap-3 group/item cursor-pointer">
              <div className="relative">
                <div className="w-2.5 h-2.5 rounded-full shadow-[0_0_8px_rgba(0,0,0,0.5)] transition-transform group-hover/item:scale-125" style={{ backgroundColor: color }} />
                <div className="absolute inset-0 rounded-full blur-[4px] opacity-40 animate-pulse" style={{ backgroundColor: color }} />
              </div>
              <span className="text-[10px] text-white font-bold uppercase tracking-[0.2em] group-hover/item:text-[#FF9933] transition-colors">{level}</span>
            </div>
          ))}
        </div>
      </motion.div>

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
