import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseClient } from '@/lib/supabase'

export async function GET(req: NextRequest) {
  const sb = getSupabaseClient()
  const estado = req.nextUrl.searchParams.get('estado') || 'pending'

  let query = sb.from('articulos').select(
    'id,titulo,slug,categoria,keyword,excerpt,tipo,tiempo_lectura,requiere_revision_extendida,verificacion_json,estado,creado_en'
  )
  if (estado !== 'all') query = query.eq('estado', estado)

  const { data, error } = await query.order('id', { ascending: false })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json(
    data.map(a => ({
      ...a,
      verificacion: a.verificacion_json
        ? (() => { try { return JSON.parse(a.verificacion_json) } catch { return null } })()
        : null,
    }))
  )
}

export async function POST(req: NextRequest) {
  const sb = getSupabaseClient()
  const body = await req.json()
  const { titulo, contenido, keyword, categoria, excerpt } = body

  if (!titulo?.trim()) return NextResponse.json({ error: 'El título es obligatorio' }, { status: 400 })

  const slugBase = titulo.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '').trim()
    .replace(/\s+/g, '-').slice(0, 100)

  const palabras = (contenido || '').split(/\s+/).filter(Boolean).length
  const tiempo_lectura = Math.max(1, Math.round(palabras / 200))

  let slug = slugBase
  let suffix = 1
  while (true) {
    const { data } = await sb.from('articulos').select('id').eq('slug', slug).maybeSingle()
    if (!data) break
    slug = `${slugBase}-${suffix++}`
  }

  const excerptFinal = (
    excerpt || (contenido?.length > 150 ? contenido.slice(0, 147) + '...' : contenido) || ''
  ).slice(0, 150)

  const { data, error } = await sb.from('articulos').insert({
    titulo: titulo.trim(), slug, contenido: contenido || '',
    keyword: keyword || '', categoria: categoria || 'noticias',
    excerpt: excerptFinal, tiempo_lectura, tipo: 'nuevo', estado: 'pending',
    verificacion_json: JSON.stringify({
      aprobado: false, nivel_riesgo: 'medio',
      observaciones: [{ frase: '', problema: 'Artículo creado manualmente — revisar antes de publicar' }],
      requiere_revision_urgente: false,
      sugerencias: ['Verificar datos y fuentes antes de aprobar'],
    }),
    requiere_revision_extendida: false,
  }).select('id,slug').single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true, id: data.id, slug: data.slug })
}
