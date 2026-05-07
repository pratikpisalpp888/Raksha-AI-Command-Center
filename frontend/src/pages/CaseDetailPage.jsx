import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { MapContainer, TileLayer, Marker } from "react-leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import { getCase, updateCaseStatus, resolveCase, updateCase } from '../services/api'
import { motion } from 'framer-motion'
import { ArrowLeft, Phone, Clock, Activity, CheckCircle, AlertTriangle, Send } from 'lucide-react'

const EMOTION_COLOR = {
  panic: '#FF2D55', distressed: '#FF9933', concerned: '#FFD600', calm: '#00E676'
}
const PRIORITY_COLOR = {
  critical: '#FF2D55', high: '#FF9933', medium: '#FFD600', low: '#00E676'
}

function StatusBadge({ status }) {
  const colors = {
    new: '#7B8FA8', ai_processing: '#2979FF', dispatched: '#00E676',
    resolved: '#00E676', human_escalated: '#FF2D55', pending_verification: '#FF9933'
  }
  return (
    <span style={{
      background: `${colors[status] || '#7B8FA8'}22`,
      border: `1px solid ${colors[status] || '#7B8FA8'}55`,
      color: colors[status] || '#7B8FA8',
      padding: '4px 12px', borderRadius: 20, fontSize: 11, fontWeight: 700,
      letterSpacing: '0.05em', textTransform: 'uppercase'
    }}>
      {status?.replace(/_/g, ' ')}
    </span>
  )
}

export default function CaseDetailPage() {
  const { caseId } = useParams()
  const navigate = useNavigate()
  const [caseData, setCaseData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [actionLoading, setActionLoading] = useState(false)

  useEffect(() => {
    if (!caseId) return
    setLoading(true)
    getCase(caseId)
      .then(data => { setCaseData(data); setLoading(false) })
      .catch(err => { setError(err.message); setLoading(false) })
  }, [caseId])

  async function handleDispatch() {
    if (!caseData) return
    setActionLoading(true)
    try {
      const updated = await updateCaseStatus(caseData.id, 'dispatched', 'Manually dispatched from dashboard')
      setCaseData(updated)
    } catch (err) { console.error(err) }
    finally { setActionLoading(false) }
  }

  async function handleResolve() {
    if (!caseData) return
    setActionLoading(true)
    try {
      const updated = await resolveCase(caseData.id)
      setCaseData(updated)
    } catch (err) { console.error(err) }
    finally { setActionLoading(false) }
  }

  async function handleUpdateField(field, value) {
    if (!caseData) return
    try {
      const updated = await updateCase(caseData.id, { [field]: value })
      setCaseData(updated)
      alert(`${field.replace('_', ' ').toUpperCase()} updated successfully`)
    } catch (err) { console.error(err) }
  }

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#030810', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 1.5, repeat: Infinity }}
        style={{ color: '#FF9933', fontSize: 16, fontFamily: 'monospace' }}>
        Loading case {caseId}...
      </motion.div>
    </div>
  )

  if (error) return (
    <div style={{ minHeight: '100vh', background: '#030810', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
      <AlertTriangle size={40} color="#FF2D55" />
      <p style={{ color: '#FF2D55', fontWeight: 700, fontSize: 16 }}>Case not found or backend offline</p>
      <p style={{ color: '#7B8FA8', fontSize: 13 }}>{error}</p>
      <button onClick={() => navigate('/dashboard')} style={{
        background: 'rgba(255,107,0,0.1)', border: '1px solid rgba(255,107,0,0.3)',
        color: '#FF9933', padding: '10px 24px', borderRadius: 10, cursor: 'pointer', fontSize: 13
      }}>← Back to Dashboard</button>
    </div>
  )

  const emotion = caseData?.emotion_level || 'calm'
  const priority = caseData?.priority || 'medium'
  const emotionColor = EMOTION_COLOR[emotion] || '#7B8FA8'
  const priorityColor = PRIORITY_COLOR[priority] || '#7B8FA8'

  return (
    <div style={{ minHeight: '100vh', background: '#030810', color: '#F5F0FF' }}>
      {/* Page Header */}
      <div style={{
        background: 'rgba(3,8,16,0.97)', borderBottom: '1px solid rgba(255,107,0,0.15)',
        padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <button onClick={() => navigate(-1)} style={{
            background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 10, padding: '8px 12px', color: '#7B8FA8', cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 6, fontSize: 13
          }}>
            <ArrowLeft size={16} /> Back
          </button>
          <div>
            <h2 style={{ margin: 0, fontSize: 18, fontWeight: 900, fontFamily: 'monospace', color: '#FF9933' }}>
              {caseData?.id}
            </h2>
            <p style={{ margin: 0, fontSize: 10, color: '#7B8FA8', letterSpacing: '0.2em' }}>CASE DETAIL</p>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <StatusBadge status={caseData?.status} />
          {caseData?.status !== 'resolved' && (
            <>
              <button onClick={handleDispatch} disabled={actionLoading} style={{
                background: 'rgba(41,121,255,0.15)', border: '1px solid rgba(41,121,255,0.4)',
                color: '#2979FF', padding: '8px 18px', borderRadius: 10, cursor: 'pointer',
                fontSize: 13, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6
              }}>
                <Send size={14} /> Dispatch
              </button>
              <button onClick={handleResolve} disabled={actionLoading} style={{
                background: 'rgba(0,230,118,0.15)', border: '1px solid rgba(0,230,118,0.4)',
                color: '#00E676', padding: '8px 18px', borderRadius: 10, cursor: 'pointer',
                fontSize: 13, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6
              }}>
                <CheckCircle size={14} /> Resolve
              </button>
            </>
          )}
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '28px 24px', display: 'grid', gridTemplateColumns: '1fr 360px', gap: 24 }}>
        {/* Left Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

          {/* Overview Card */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            style={{ background: 'rgba(4,14,30,0.9)', border: `1px solid ${emotionColor}33`, borderRadius: 16, padding: 24 }}>
            <h3 style={{ margin: '0 0 16px', fontSize: 13, color: '#7B8FA8', letterSpacing: '0.15em' }}>📋 CASE OVERVIEW</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 20 }}>
              <div>
                <p style={{ margin: '0 0 4px', fontSize: 10, color: '#7B8FA8', letterSpacing: '0.1em' }}>EMOTION LEVEL</p>
                <p style={{ margin: 0, fontSize: 20, fontWeight: 900, color: emotionColor }}>{emotion.toUpperCase()}</p>
              </div>
              <div>
                <p style={{ margin: '0 0 4px', fontSize: 10, color: '#7B8FA8', letterSpacing: '0.1em' }}>PRIORITY</p>
                <p style={{ margin: 0, fontSize: 20, fontWeight: 900, color: priorityColor }}>{priority.toUpperCase()}</p>
              </div>
              <div>
                <p style={{ margin: '0 0 4px', fontSize: 10, color: '#7B8FA8', letterSpacing: '0.1em' }}>INTENT</p>
                <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: '#F5F0FF' }}>{caseData?.intent_type || '—'}</p>
              </div>
            </div>
          </motion.div>

          {/* Transcript */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            style={{ background: 'rgba(4,14,30,0.9)', border: '1px solid rgba(255,107,0,0.12)', borderRadius: 16, padding: 24 }}>
            <h3 style={{ margin: '0 0 16px', fontSize: 13, color: '#7B8FA8', letterSpacing: '0.15em' }}>🎤 CALL TRANSCRIPT</h3>
            <p style={{ margin: 0, color: '#B0BEC5', fontSize: 14, lineHeight: 1.8, fontStyle: 'italic', whiteSpace: 'pre-wrap' }}>
              "{caseData?.raw_transcript || 'No transcript available'}"
            </p>
            
            <div style={{ marginTop: 24, padding: '16px', background: 'rgba(255,107,0,0.06)', border: '1px solid rgba(255,107,0,0.15)', borderRadius: 12 }}>
              <p style={{ margin: '0 0 12px', fontSize: 10, color: '#FF9933', letterSpacing: '0.1em', fontWeight: 700 }}>🤖 AI SUGGESTED SUMMARY (EDITABLE)</p>
              <textarea 
                value={caseData?.ai_summary || ''}
                onChange={(e) => setCaseData({...caseData, ai_summary: e.target.value})}
                style={{
                  width: '100%',
                  background: 'rgba(0,0,0,0.3)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 8,
                  padding: 12,
                  color: '#F5F0FF',
                  fontSize: 13,
                  lineHeight: 1.6,
                  minHeight: 80,
                  outline: 'none'
                }}
                placeholder="AI is generating summary..."
              />
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 10 }}>
                <button 
                  onClick={() => handleUpdateField('ai_summary', caseData.ai_summary)}
                  className="px-3 py-1.5 rounded bg-[#FF9933]/20 border border-[#FF9933]/40 text-[#FF9933] text-[10px] font-bold hover:bg-[#FF9933]/30 transition-all"
                >
                  SAVE CORRECTION
                </button>
              </div>
            </div>
          </motion.div>

          {/* Location */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            style={{ background: 'rgba(4,14,30,0.9)', border: '1px solid rgba(255,107,0,0.12)', borderRadius: 16, padding: 24 }}>
            <h3 style={{ margin: '0 0 16px', fontSize: 13, color: '#7B8FA8', letterSpacing: '0.15em' }}>📍 LOCATION DETAILS</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div>
                <p style={{ margin: '0 0 4px', fontSize: 10, color: '#7B8FA8' }}>EXTRACTED AREA</p>
                <p style={{ margin: 0, color: '#F5F0FF', fontSize: 14, fontWeight: 600 }}>
                  {caseData?.location_area || caseData?.location_raw || 'Not extracted'}
                </p>
              </div>
              <div>
                <p style={{ margin: '0 0 4px', fontSize: 10, color: '#7B8FA8' }}>CITY / STATE</p>
                <p style={{ margin: 0, color: '#F5F0FF', fontSize: 14, fontWeight: 600 }}>
                  {caseData?.location_city || '—'}, {caseData?.location_state || 'Karnataka'}
                </p>
              </div>
              {caseData?.location_lat && (
                <div>
                  <p style={{ margin: '0 0 4px', fontSize: 10, color: '#7B8FA8' }}>COORDINATES</p>
                  <p style={{ margin: 0, color: '#FF9933', fontSize: 13, fontFamily: 'monospace' }}>
                    {caseData.location_lat.toFixed(4)}°N, {caseData.location_lng.toFixed(4)}°E
                  </p>
                </div>
              )}
              <div>
                <p style={{ margin: '0 0 4px', fontSize: 10, color: '#7B8FA8' }}>CONFIDENCE</p>
                <p style={{ margin: 0, color: '#00E676', fontSize: 14, fontWeight: 700 }}>
                  {Math.round((caseData?.location_confidence || 0) * 100)}%
                </p>
              </div>
            </div>

            {/* Map Preview */}
            {caseData?.location_lat && (
              <div style={{ marginTop: 20, borderRadius: 12, overflow: 'hidden', border: '1px solid rgba(255,107,0,0.2)', height: 200 }} className="invert-[0.9] hue-rotate-[180deg] contrast-[1.2] grayscale-[0.8]">
                <MapContainer 
                  center={[caseData.location_lat, caseData.location_lng]} 
                  zoom={15} 
                  style={{ height: "100%", width: "100%" }}
                  zoomControl={false}
                >
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  <Marker position={[caseData.location_lat, caseData.location_lng]} />
                </MapContainer>
              </div>
            )}
          </motion.div>
        </div>

        {/* Right Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Caller Info */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
            style={{ background: 'rgba(4,14,30,0.9)', border: '1px solid rgba(255,107,0,0.12)', borderRadius: 16, padding: 20 }}>
            <h3 style={{ margin: '0 0 14px', fontSize: 13, color: '#7B8FA8', letterSpacing: '0.15em' }}>📞 CALLER INFO</h3>
            {[
              { icon: <Phone size={13} />, label: 'Phone', value: caseData?.caller_phone },
              { icon: <Activity size={13} />, label: 'Language', value: caseData?.language_detected?.toUpperCase() },
              { icon: <Clock size={13} />, label: 'Received', value: caseData?.created_at ? new Date(caseData.created_at).toLocaleString('en-IN') : '—' },
              { icon: <CheckCircle size={13} />, label: 'Confirmed', value: caseData?.caller_confirmed ? '✅ Yes' : caseData?.caller_confirmed === false ? '❌ No' : '⏳ Pending' },
              { icon: <Send size={13} />, label: 'SMS Sent', value: caseData?.sms_sent ? '✅ Yes' : '❌ No' },
            ].map(item => (
              <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                <span style={{ color: '#7B8FA8', fontSize: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
                  {item.icon} {item.label}
                </span>
                <span style={{ color: '#F5F0FF', fontSize: 12, fontWeight: 600 }}>{item.value || '—'}</span>
              </div>
            ))}
          </motion.div>

          {/* Dispatch Status */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}
            style={{ background: 'rgba(4,14,30,0.9)', border: '1px solid rgba(255,107,0,0.12)', borderRadius: 16, padding: 20 }}>
            <h3 style={{ margin: '0 0 14px', fontSize: 13, color: '#7B8FA8', letterSpacing: '0.15em' }}>🚔 DISPATCH STATUS</h3>
            {[
              { label: 'Help Dispatched', value: caseData?.help_dispatched ? '✅ Yes' : '❌ No' },
              { label: 'Dispatched At', value: caseData?.dispatched_at ? new Date(caseData.dispatched_at).toLocaleTimeString('en-IN') : '—' },
              { label: 'Escalated to Human', value: caseData?.escalated_to_human ? '✅ Yes' : '❌ No' },
              { label: 'Resolved At', value: caseData?.resolved_at ? new Date(caseData.resolved_at).toLocaleString('en-IN') : '—' },
            ].map(item => (
              <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                <span style={{ color: '#7B8FA8', fontSize: 12 }}>{item.label}</span>
                <span style={{ color: '#F5F0FF', fontSize: 12, fontWeight: 600 }}>{item.value}</span>
              </div>
            ))}
          </motion.div>

          {/* Notes */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
            style={{ background: 'rgba(4,14,30,0.9)', border: '1px solid rgba(255,107,0,0.12)', borderRadius: 16, padding: 20 }}>
            <h3 style={{ margin: '0 0 14px', fontSize: 13, color: '#7B8FA8', letterSpacing: '0.15em' }}>📝 AGENT NOTES</h3>
            <textarea 
              value={caseData?.notes || ''}
              onChange={(e) => setCaseData({...caseData, notes: e.target.value})}
              style={{
                width: '100%',
                background: 'rgba(0,0,0,0.3)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 8,
                padding: 12,
                color: '#F5F0FF',
                fontSize: 13,
                lineHeight: 1.6,
                minHeight: 100,
                outline: 'none'
              }}
              placeholder="Add incident notes here..."
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 10 }}>
              <button 
                onClick={() => handleUpdateField('notes', caseData.notes)}
                className="px-3 py-1.5 rounded bg-[#2979FF]/20 border border-[#2979FF]/40 text-[#2979FF] text-[10px] font-bold hover:bg-[#2979FF]/30 transition-all"
              >
                UPDATE NOTES
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
