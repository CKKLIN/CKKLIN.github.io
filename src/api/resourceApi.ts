import { supabase } from '@/lib/supabase'
import { loadResources } from '@/utils/dataLoader'
import { withCache } from '@/utils/cache'

export interface ResourceHeader { id: number; name: string; color: string; label: number }
export interface ResourceCard {
  id: number; label: number; name: string; description: string; content: string
  icon: string; url?: string; versions?: any; copyText?: string
}

export const getResourceHeadersAPI = withCache('resource-headers', async () => {
  try {
    const { data, error } = await supabase.from('resource_headers').select('*').order('id')
    if (!error && data) return data
  } catch {}
  const r = await loadResources()
  return r.headers
})

export const getResourceCardsAPI = withCache(
  (label?: number) => `resource-cards-${label ?? 'all'}`,
  async (label?: number) => {
    try {
      let query = supabase.from('resource_cards').select('*').order('id')
      if (label !== undefined) query = query.eq('label', label)
      const { data, error } = await query
      if (!error && data) {
        return data.map(c => ({ ...c, copyText: c.copy_text }))
      }
    } catch {}
    const r = await loadResources()
    const cards = label !== undefined ? r.cards.filter((c: any) => c.label === label) : r.cards
    return cards.map((c: any) => ({ ...c, copyText: c.copyText }))
  },
)

export async function getResourcesAPI() {
  try {
    const [headers, cards] = await Promise.all([
      getResourceHeadersAPI(),
      getResourceCardsAPI(),
    ])
    return { headers, cards }
  } catch {
    return loadResources()
  }
}
