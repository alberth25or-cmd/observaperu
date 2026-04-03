import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseClient } from '@/lib/supabase'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const sb = getSupabaseClient()
  const { id } = await params
  const { data, error } = await sb.from('articulos').select('*').eq('id', id).single()

  if (error || !data) return NextResponse.json({ error: 'Artículo no encontrado' }, { status: 404 })

  return NextResponse.json({
    ...data,
    verificacion: data.verificacion_json
      ? (() => { try { return JSON.parse(data.verificacion_json) } catch { return null } })()
      : null,
  })
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const sb = getSupabaseClient()
  const { id } = await params
  const body = await req.json()
  const update: Record<string, string> = {}
  if (body.titulo) update.titulo = body.titulo
  if (body.contenido !== undefined) update.contenido = body.contenido
  if (body.excerpt) update.excerpt = String(body.excerpt).slice(0, 150)

  const { error } = await sb.from('articulos').update(update).eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true, id })
}
