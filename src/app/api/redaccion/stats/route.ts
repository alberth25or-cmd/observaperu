import { NextResponse } from 'next/server'
import { getSupabaseClient } from '@/lib/supabase'

export async function GET() {
  const sb = getSupabaseClient()

  const [pending, approved, rejected, published] = await Promise.all([
    sb.from('articulos').select('id', { count: 'exact', head: true }).eq('estado', 'pending'),
    sb.from('articulos').select('id', { count: 'exact', head: true }).eq('estado', 'approved'),
    sb.from('articulos').select('id', { count: 'exact', head: true }).eq('estado', 'rejected'),
    sb.from('articulos').select('id', { count: 'exact', head: true })
      .eq('estado', 'published')
      .gte('publicado_en', new Date().toISOString().split('T')[0]),
  ])

  return NextResponse.json({
    pending: pending.count ?? 0,
    approved: approved.count ?? 0,
    rejected: rejected.count ?? 0,
    published_hoy: published.count ?? 0,
  })
}
