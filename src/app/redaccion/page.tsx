'use client'
import { useState, useEffect, useRef, useCallback } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

const API = '/api/redaccion'

type Verificacion = {
  nivel_riesgo?: string
  observaciones?: (string | { frase?: string; problema?: string })[]
  sugerencias?: string[]
}

type ArticuloCard = {
  id: number
  titulo: string
  slug: string
  categoria: string
  keyword: string
  excerpt: string
  tipo: string
  tiempo_lectura: number
  requiere_revision_extendida: boolean
  verificacion: Verificacion | null
  estado: string
  creado_en: string
}

type ArticuloDetalle = ArticuloCard & { contenido: string }
type Stats = { pending: number; approved: number; rejected: number; published_hoy: number }

const CAT_BADGE: Record<string, string> = {
  perfiles: 'bg-blue-100 text-blue-800',
  debates: 'bg-purple-100 text-purple-700',
  noticias: 'bg-green-100 text-green-700',
  analisis: 'bg-orange-50 text-orange-800',
  faq: 'bg-yellow-100 text-yellow-800',
}
const RISK_CLASS: Record<string, string> = {
  bajo: 'bg-green-100 text-green-700',
  medio: 'bg-yellow-100 text-yellow-800',
  alto: 'bg-red-100 text-red-800',
}
const ESTADO_CLASS: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  approved: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-700',
  published: 'bg-blue-100 text-blue-700',
}
const ESTADO_LABEL: Record<string, string> = {
  pending: 'Pendiente', approved: 'Aprobado', rejected: 'Rechazado', published: 'Publicado',
}

export default function RedaccionPage() {
  const [articulos, setArticulos] = useState<ArticuloCard[]>([])
  const [stats, setStats] = useState<Stats>({ pending: 0, approved: 0, rejected: 0, published_hoy: 0 })
  const [filtroEstado, setFiltroEstadoState] = useState('pending')
  const [filtroCat, setFiltroCat] = useState('')
  const [modal, setModal] = useState<ArticuloDetalle | null>(null)
  const [loadingModal, setLoadingModal] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [editTitulo, setEditTitulo] = useState('')
  const [editContenido, setEditContenido] = useState('')
  const [guardando, setGuardando] = useState(false)
  const [showCrear, setShowCrear] = useState(false)
  const [crearForm, setCrearForm] = useState({ titulo: '', categoria: 'noticias', keyword: '', excerpt: '', contenido: '' })
  const [creando, setCreando] = useState(false)
  const [toast, setToast] = useState<{ msg: string; type: string } | null>(null)
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const showToast = (msg: string, type = 'success', dur = 2500) => {
    if (toastTimer.current) clearTimeout(toastTimer.current)
    setToast({ msg, type })
    toastTimer.current = setTimeout(() => setToast(null), dur)
  }

  const loadStats = async () => {
    try {
      const d = await fetch(`${API}/stats`).then(r => r.json())
      setStats(d)
    } catch { /* silencioso */ }
  }

  const loadAll = useCallback(async (estado?: string) => {
    const est = estado ?? filtroEstado
    try {
      const d = await fetch(`${API}/queue?estado=${est}`).then(r => r.json())
      setArticulos(Array.isArray(d) ? d : [])
    } catch {
      showToast('No se pudo conectar con la API', 'error')
      setArticulos([])
    }
    loadStats()
  }, [filtroEstado])

  useEffect(() => { loadAll() }, [])

  const setFiltroEstado = (est: string) => {
    setFiltroEstadoState(est)
    loadAll(est)
  }

  const filtered = filtroCat ? articulos.filter(a => a.categoria === filtroCat) : articulos

  const openModal = async (id: number) => {
    setModal(null)
    setLoadingModal(true)
    setEditMode(false)
    try {
      const a = await fetch(`${API}/queue/${id}`).then(r => r.json())
      setModal(a)
      setEditTitulo(a.titulo)
      setEditContenido(a.contenido)
    } catch { /* error silencioso */ }
    setLoadingModal(false)
  }

  const closeModal = () => { setModal(null); setEditMode(false) }

  const accion = async (id: number, tipo: 'approve' | 'reject') => {
    try {
      const d = await fetch(`${API}/queue/${id}/${tipo}`, { method: 'POST' }).then(r => r.json())
      if (d.ok) {
        showToast(tipo === 'approve' ? 'Artículo aprobado' : 'Artículo rechazado', tipo === 'approve' ? 'success' : 'error')
        await loadAll()
      }
    } catch { showToast('Error al procesar la acción', 'error') }
  }

  const accionModal = async (id: number, tipo: 'approve' | 'reject') => {
    await accion(id, tipo)
    closeModal()
  }

  const guardarEdicion = async () => {
    if (!modal) return
    if (!editTitulo.trim()) { showToast('El título no puede estar vacío', 'error'); return }
    setGuardando(true)
    try {
      const d = await fetch(`${API}/queue/${modal.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ titulo: editTitulo.trim(), contenido: editContenido }),
      }).then(r => r.json())
      if (d.ok) {
        showToast('Cambios guardados', 'success')
        setModal(prev => prev ? { ...prev, titulo: editTitulo.trim(), contenido: editContenido } : null)
        setArticulos(prev => prev.map(a => a.id === modal.id ? { ...a, titulo: editTitulo.trim() } : a))
        setEditMode(false)
      } else { showToast('Error al guardar', 'error') }
    } catch { showToast('No se pudo conectar con la API', 'error') }
    setGuardando(false)
  }

  const crearArticulo = async () => {
    if (!crearForm.titulo.trim()) { showToast('El título es obligatorio', 'error'); return }
    if (!crearForm.contenido.trim()) { showToast('El contenido es obligatorio', 'error'); return }
    setCreando(true)
    try {
      const d = await fetch(`${API}/queue`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(crearForm),
      }).then(r => r.json())
      if (d.ok) {
        showToast(`Artículo añadido a la cola (id=${d.id})`, 'success', 3500)
        setShowCrear(false)
        setCrearForm({ titulo: '', categoria: 'noticias', keyword: '', excerpt: '', contenido: '' })
        setFiltroEstado('pending')
      } else { showToast(d.error || 'Error al crear el artículo', 'error') }
    } catch { showToast('No se pudo conectar con la API', 'error') }
    setCreando(false)
  }

  const toastColor = { success: '#15803d', error: '#b91c1c', info: '#475569' }

  return (
    <div className="min-h-screen" style={{ background: '#f1f5fb', fontFamily: "'Segoe UI', system-ui, sans-serif" }}>

      {/* HEADER */}
      <header className="text-white shadow-lg" style={{ background: '#0b1b3b' }}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-400 rounded-full flex items-center justify-center text-sm font-bold">O</div>
            <div>
              <div className="font-bold text-lg leading-tight">Observa Perú</div>
              <div className="text-blue-300 text-xs">Cola de Revisión Editorial</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => setShowCrear(true)}
              className="bg-blue-500 hover:bg-blue-400 text-white text-sm font-medium px-4 py-2 rounded-lg transition cursor-pointer">
              + Nuevo artículo
            </button>
            <button onClick={() => showToast('Para publicar: ejecuta  python run.py --publish-approved  en la terminal', 'info', 5000)}
              className="bg-green-500 hover:bg-green-400 text-white text-sm font-medium px-4 py-2 rounded-lg transition cursor-pointer">
              Publicar aprobados
            </button>
            <button onClick={() => loadAll()}
              className="text-white text-sm px-4 py-2 rounded-lg transition cursor-pointer" style={{ background: 'rgba(255,255,255,0.1)' }}>
              Actualizar
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-5">
        {/* STATS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { val: stats.pending, label: 'Pendientes', color: '#ca8a04' },
            { val: stats.approved, label: 'Aprobados', color: '#16a34a' },
            { val: stats.rejected, label: 'Rechazados', color: '#ef4444' },
            { val: stats.published_hoy, label: 'Publicados hoy', color: '#2563eb' },
          ].map(({ val, label, color }) => (
            <div key={label} className="bg-white rounded-xl p-4 shadow-sm text-center">
              <div className="text-3xl font-bold" style={{ color }}>{val}</div>
              <div className="text-xs text-slate-500 mt-1">{label}</div>
            </div>
          ))}
        </div>

        {/* FILTROS */}
        <div className="flex flex-wrap gap-2 mb-5">
          <div className="flex bg-white rounded-xl shadow-sm p-1 gap-1">
            {['pending', 'approved', 'rejected', 'all'].map(est => (
              <button key={est} onClick={() => setFiltroEstado(est)}
                className="px-4 py-1.5 rounded-lg text-sm font-medium transition cursor-pointer"
                style={filtroEstado === est ? { background: '#1e293b', color: 'white' } : { color: '#64748b' }}>
                {est === 'pending' ? 'Pendientes' : est === 'approved' ? 'Aprobados' : est === 'rejected' ? 'Rechazados' : 'Todos'}
              </button>
            ))}
          </div>
          <div className="flex bg-white rounded-xl shadow-sm p-1 gap-1 flex-wrap">
            {[['', 'Todas'], ['perfiles', 'Perfiles'], ['debates', 'Debates'], ['noticias', 'Noticias'], ['analisis', 'Análisis'], ['faq', 'FAQ']].map(([val, label]) => (
              <button key={val} onClick={() => setFiltroCat(val)}
                className="px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer"
                style={filtroCat === val ? { background: '#1e293b', color: 'white' } : { color: '#64748b' }}>
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* CONTADOR */}
        <div className="text-sm text-slate-400 mb-4">
          {filtered.length} artículo{filtered.length !== 1 ? 's' : ''}
        </div>

        {/* GRID CARDS */}
        {filtered.length === 0 ? (
          <div className="text-center py-20 text-slate-400">
            <div className="text-5xl mb-3">📭</div>
            <div className="text-lg font-medium">No hay artículos en esta vista</div>
            <div className="text-sm mt-1">Cambia el filtro o genera nuevos artículos</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map(a => {
              const nivel = a.verificacion?.nivel_riesgo || ''
              return (
                <div key={a.id}
                  onClick={() => openModal(a.id)}
                  className="bg-white rounded-2xl shadow-sm overflow-hidden cursor-pointer border border-transparent hover:border-blue-200 transition"
                  style={{ transition: 'box-shadow .15s, transform .15s' }}>
                  <div className="px-5 pt-5 pb-3">
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${CAT_BADGE[a.categoria] || 'bg-slate-100 text-slate-600'}`}>{a.categoria}</span>
                      {nivel && <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${RISK_CLASS[nivel] || 'bg-slate-100 text-slate-600'}`}>riesgo {nivel}</span>}
                      {a.requiere_revision_extendida && <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-orange-100 text-orange-700">revisión ext.</span>}
                      {filtroEstado === 'all' && <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${ESTADO_CLASS[a.estado] || 'bg-slate-100 text-slate-600'}`}>{ESTADO_LABEL[a.estado] || a.estado}</span>}
                    </div>
                    <h3 className="font-semibold text-slate-800 text-sm leading-snug mb-2 line-clamp-2">{a.titulo}</h3>
                    <p className="text-slate-500 text-xs leading-relaxed line-clamp-3">{a.excerpt}</p>
                  </div>
                  <div className="px-5 pb-2 text-xs text-slate-400 flex gap-3">
                    <span>{a.tiempo_lectura || '?'} min lectura</span>
                    <span className="truncate max-w-[200px]">{a.keyword}</span>
                  </div>
                  <div className="px-5 pb-5 pt-2 flex gap-2 border-t border-slate-100 mt-2">
                    {a.estado === 'pending' ? (
                      <>
                        <button onClick={e => { e.stopPropagation(); accion(a.id, 'approve') }}
                          className="flex-1 bg-green-500 hover:bg-green-600 text-white text-sm font-medium py-2 rounded-lg transition cursor-pointer">Aprobar</button>
                        <button onClick={e => { e.stopPropagation(); accion(a.id, 'reject') }}
                          className="flex-1 bg-red-400 hover:bg-red-500 text-white text-sm font-medium py-2 rounded-lg transition cursor-pointer">Rechazar</button>
                      </>
                    ) : (
                      <div className="text-sm text-slate-400 italic">
                        {a.estado === 'approved' ? '✓ Aprobado' : a.estado === 'rejected' ? '✗ Rechazado' : a.estado}
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* MODAL ARTÍCULO */}
      {(modal || loadingModal) && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center p-4 overflow-y-auto"
          onClick={e => { if (e.target === e.currentTarget) closeModal() }}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full my-8 overflow-hidden">
            <div className="text-white px-6 py-4 flex items-start justify-between gap-4" style={{ background: '#0b1b3b' }}>
              <div className="flex-1 min-w-0">
                {modal && (
                  <div className="flex gap-2 mb-2 flex-wrap">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${CAT_BADGE[modal.categoria] || 'bg-slate-100 text-slate-600'}`}>{modal.categoria}</span>
                    {modal.verificacion?.nivel_riesgo && (
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${RISK_CLASS[modal.verificacion.nivel_riesgo] || ''}`}>riesgo {modal.verificacion.nivel_riesgo}</span>
                    )}
                    {modal.requiere_revision_extendida && <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-orange-100 text-orange-700">revisión ext.</span>}
                  </div>
                )}
                <h2 className="text-lg font-bold leading-tight">{modal ? (editMode ? editTitulo : modal.titulo) : 'Cargando...'}</h2>
                {modal && <div className="text-blue-300 text-sm mt-1">{modal.keyword} · {modal.tiempo_lectura || '?'} min lectura · {modal.tipo}</div>}
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {modal && (
                  <button onClick={() => setEditMode(e => !e)}
                    className="text-white text-sm px-3 py-1.5 rounded-lg transition cursor-pointer" style={{ background: 'rgba(255,255,255,0.15)' }}>
                    {editMode ? '👁️ Vista previa' : '✏️ Editar'}
                  </button>
                )}
                <button onClick={closeModal} className="text-white/70 hover:text-white text-2xl leading-none cursor-pointer">✕</button>
              </div>
            </div>

            {/* Verificación */}
            {modal?.verificacion?.observaciones && modal.verificacion.observaciones.length > 0 && (
              <div className="border-b px-6 py-3 bg-slate-50">
                <div className="text-xs font-semibold text-slate-500 uppercase mb-2">Observaciones del verificador</div>
                <ul className="space-y-1 text-sm text-slate-700">
                  {modal.verificacion.observaciones.map((o, i) => (
                    <li key={i} className="flex gap-2 items-start">
                      <span className="text-orange-400 mt-0.5 shrink-0">⚠</span>
                      <div>
                        {typeof o !== 'string' && o.frase && <div className="text-slate-500 text-xs italic mb-0.5">&quot;{o.frase}&quot;</div>}
                        <div>{typeof o === 'string' ? o : o.problema}</div>
                      </div>
                    </li>
                  ))}
                  {modal.verificacion.sugerencias && modal.verificacion.sugerencias.length > 0 && (
                    <li className="mt-3 pt-3 border-t border-slate-200">
                      <div className="text-xs font-semibold text-slate-500 uppercase mb-2">Sugerencias</div>
                      <ul className="space-y-1">
                        {modal.verificacion.sugerencias.map((s, i) => (
                          <li key={i} className="flex gap-2 text-xs text-slate-600"><span className="text-blue-400 shrink-0">→</span><span>{s}</span></li>
                        ))}
                      </ul>
                    </li>
                  )}
                </ul>
              </div>
            )}

            {/* Contenido / Editor */}
            {loadingModal && !modal ? (
              <div className="px-6 py-10 text-center text-slate-400">Cargando contenido...</div>
            ) : modal && !editMode ? (
              <div className="px-6 py-5 overflow-y-auto max-h-[60vh] text-slate-800 text-sm leading-relaxed prose max-w-none">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {(modal.contenido || '').replace(/<!--[\s\S]*?-->/g, '').trim()}
                </ReactMarkdown>
              </div>
            ) : modal && editMode ? (
              <div className="flex flex-col overflow-hidden max-h-[60vh]">
                <div className="px-6 pt-4 pb-2 border-b bg-slate-50">
                  <label className="text-xs font-semibold text-slate-500 uppercase block mb-1">Título</label>
                  <textarea value={editTitulo} onChange={e => setEditTitulo(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-400 text-base font-bold resize-none"
                    rows={2} />
                </div>
                <div className="px-6 pt-3 pb-4 flex-1 flex flex-col overflow-hidden">
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-semibold text-slate-500 uppercase">Contenido (Markdown)</label>
                    <span className="text-xs text-slate-400">{editContenido.trim().split(/\s+/).filter(Boolean).length.toLocaleString()} palabras</span>
                  </div>
                  <textarea value={editContenido} onChange={e => setEditContenido(e.target.value)}
                    className="flex-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-400 overflow-y-auto font-mono text-xs leading-relaxed"
                    style={{ minHeight: '320px' }} />
                </div>
              </div>
            ) : null}

            {/* Footer modal */}
            {modal && (
              <div className="border-t px-6 py-4 flex items-center justify-between bg-slate-50">
                <div className="text-xs text-slate-400">/noticias/{modal.slug}</div>
                <div className="flex gap-3 items-center">
                  {editMode && (
                    <button onClick={guardarEdicion} disabled={guardando}
                      className="px-5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 font-medium text-sm transition cursor-pointer disabled:opacity-50">
                      {guardando ? 'Guardando...' : 'Guardar cambios'}
                    </button>
                  )}
                  {modal.estado === 'pending' && (
                    <>
                      <button onClick={() => accionModal(modal.id, 'reject')}
                        className="px-5 py-2 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 font-medium text-sm transition cursor-pointer">Rechazar</button>
                      <button onClick={() => accionModal(modal.id, 'approve')}
                        className="px-5 py-2 rounded-lg bg-green-500 text-white hover:bg-green-600 font-medium text-sm transition cursor-pointer">Aprobar</button>
                    </>
                  )}
                  {modal.estado === 'approved' && (
                    <>
                      <span className="text-green-600 font-medium text-sm">✓ Aprobado</span>
                      <button onClick={() => accionModal(modal.id, 'reject')}
                        className="px-5 py-2 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 font-medium text-sm transition cursor-pointer">Rechazar</button>
                    </>
                  )}
                  {modal.estado === 'rejected' && (
                    <>
                      <span className="text-red-500 font-medium text-sm">✗ Rechazado</span>
                      <button onClick={() => accionModal(modal.id, 'approve')}
                        className="px-5 py-2 rounded-lg bg-green-500 text-white hover:bg-green-600 font-medium text-sm transition cursor-pointer">Aprobar</button>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL CREAR */}
      {showCrear && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center p-4 overflow-y-auto"
          onClick={e => { if (e.target === e.currentTarget) setShowCrear(false) }}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full my-8 overflow-hidden">
            <div className="text-white px-6 py-4 flex items-center justify-between" style={{ background: '#0b1b3b' }}>
              <div>
                <div className="font-bold text-lg">Nuevo artículo</div>
                <div className="text-blue-300 text-sm">Se añadirá a la cola como &quot;Pendiente&quot;</div>
              </div>
              <button onClick={() => setShowCrear(false)} className="text-white/70 hover:text-white text-2xl leading-none cursor-pointer">✕</button>
            </div>
            <div className="px-6 py-5 space-y-4 overflow-y-auto max-h-[75vh]">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Título <span className="text-red-400">*</span></label>
                <input type="text" value={crearForm.titulo} onChange={e => setCrearForm(f => ({ ...f, titulo: e.target.value }))}
                  placeholder="Ej: Keiko Fujimori propone plan económico para 2026"
                  className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Categoría</label>
                  <select value={crearForm.categoria} onChange={e => setCrearForm(f => ({ ...f, categoria: e.target.value }))}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm bg-white">
                    {['noticias', 'perfiles', 'debates', 'analisis', 'faq'].map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Keyword SEO</label>
                  <input type="text" value={crearForm.keyword} onChange={e => setCrearForm(f => ({ ...f, keyword: e.target.value }))}
                    placeholder="Ej: Keiko Fujimori propuestas 2026"
                    className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Resumen / Excerpt <span className="text-slate-400 font-normal">(máx. 150 caracteres)</span></label>
                <input type="text" value={crearForm.excerpt} onChange={e => setCrearForm(f => ({ ...f, excerpt: e.target.value.slice(0, 150) }))}
                  maxLength={150} placeholder="Breve descripción del artículo para la vista previa"
                  className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm" />
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-slate-500 uppercase">Contenido en Markdown <span className="text-red-400">*</span></label>
                  <span className="text-xs text-slate-400">{crearForm.contenido.trim().split(/\s+/).filter(Boolean).length.toLocaleString()} palabras</span>
                </div>
                <textarea value={crearForm.contenido} onChange={e => setCrearForm(f => ({ ...f, contenido: e.target.value }))}
                  rows={18} placeholder="## Título del artículo&#10;&#10;Escribe el contenido aquí en formato Markdown..."
                  className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm font-mono leading-relaxed" />
                <div className="mt-1.5 text-xs text-slate-400">Usa **negrita**, *cursiva*, ## encabezados, - listas.</div>
              </div>
            </div>
            <div className="border-t px-6 py-4 flex items-center justify-between bg-slate-50">
              <button onClick={() => setShowCrear(false)}
                className="px-5 py-2 rounded-lg text-slate-500 hover:bg-slate-100 text-sm transition cursor-pointer">Cancelar</button>
              <button onClick={crearArticulo} disabled={creando}
                className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 font-medium text-sm transition cursor-pointer disabled:opacity-50">
                {creando ? 'Guardando...' : 'Añadir a la cola'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TOAST */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-[9999] text-white text-sm px-5 py-3 rounded-xl shadow-xl"
          style={{ background: toastColor[toast.type as keyof typeof toastColor] || '#475569' }}>
          {toast.msg}
        </div>
      )}
    </div>
  )
}
