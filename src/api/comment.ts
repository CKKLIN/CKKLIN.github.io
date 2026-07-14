import { supabase } from '@/lib/supabase'
import { loadComments } from '@/utils/dataLoader'
import { withCache, invalidateCache } from '@/utils/cache'

export interface Comment {
  id: number
  imageUrl: string
  name: string
  comment: string
  good: boolean
  createTime: string
}

function normalize(c: any): Comment {
  return {
    id: c.id,
    imageUrl: c.image_url,
    name: c.name,
    comment: c.comment,
    good: c.good === 1 || c.good === true,
    createTime: c.create_time,
  }
}

export const getCommentListAPI = withCache('comments', async () => {
  try {
    const { data, error } = await supabase.from('comments').select('*').order('id')
    if (!error && data) return data.map(normalize)
  } catch {}
  const fallback = await loadComments()
  return fallback.map((c: any) => ({ ...c, good: !!c.good }))
})

export async function addCommentAPI(comment: {
  imageUrl: string; name: string; comment: string; good: boolean; createTime: string
}): Promise<{ success: boolean; msg?: string; comment?: Comment }> {
  try {
    const { data, error } = await supabase.from('comments').insert({
      image_url: comment.imageUrl, name: comment.name,
      comment: comment.comment, good: comment.good ? 1 : 0,
      create_time: comment.createTime,
    }).select().single()
    if (!error && data) {
      invalidateCache('comments')
      return { success: true, comment: normalize(data) }
    }
    return { success: false, msg: error?.message }
  } catch {
    return { success: false, msg: '网络异常' }
  }
}

export async function updateCommentAPI(comment: {
  id: number; [key: string]: any
}): Promise<{ success: boolean; msg?: string }> {
  try {
    const update: any = {}
    if (comment.imageUrl !== undefined) update.image_url = comment.imageUrl
    if (comment.name !== undefined) update.name = comment.name
    if (comment.comment !== undefined) update.comment = comment.comment
    if (comment.good !== undefined) update.good = comment.good ? 1 : 0
    if (comment.createTime !== undefined) update.create_time = comment.createTime
    const { error } = await supabase.from('comments').update(update).eq('id', comment.id)
    if (!error) {
      invalidateCache('comments')
      return { success: true }
    }
    return { success: false, msg: error?.message }
  } catch {
    return { success: false, msg: '网络异常' }
  }
}
