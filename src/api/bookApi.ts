import { supabase } from '@/lib/supabase'
import { loadBooks, getBookCovers as getBookCoversFallback } from '@/utils/dataLoader'
import { withCache } from '@/utils/cache'

export interface Book {
  id: number
  name: string
  author: string
  introduction: string
  cover: string
  backColor?: string
}

function normalize(b: any): Book {
  return { ...b, backColor: b.back_color, back_color: undefined }
}

export const getBookListAPI = withCache('books', async () => {
  try {
    const { data, error } = await supabase.from('books').select('*').order('id')
    if (!error && data) return data.map(normalize)
  } catch {}
  const { bookList } = await loadBooks()
  return bookList
})

export const getFeaturedBooksAPI = withCache('books-featured', async () => {
  try {
    const { data, error } = await supabase.from('books').select('*').not('back_color', 'is', null).order('id')
    if (!error && data) return data.map(normalize)
  } catch {}
  const { bookList3 } = await loadBooks()
  return bookList3
})

export async function getBookCoversAPI(count: number = 30): Promise<string[]> {
  try {
    const books = await getBookListAPI()
    const covers = books.map((b) => b.cover)
    if (count <= covers.length) return covers.slice(0, count)
    return Array.from({ length: count }, (_, i) => covers[i % covers.length])
  } catch {
    return getBookCoversFallback(count)
  }
}
