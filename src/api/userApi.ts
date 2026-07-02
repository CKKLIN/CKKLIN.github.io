import { supabase } from '@/lib/supabase'
import { loadUsers } from '@/utils/dataLoader'

function normalize(u: any): any {
  return { ...u, collectList: u.collect_list, collect_list: undefined }
}

export async function fetchUsers() {
  try {
    const { data, error } = await supabase.from('users').select('*').order('id')
    if (!error && data) return data.map(normalize)
  } catch {}
  const fallback = await loadUsers()
  return Array.isArray(fallback) ? fallback : []
}

export async function registerUser(data: any) {
  try {
    const { data: result, error } = await supabase.from('users').insert({
      name: data.name, password: data.password,
      level: data.level || 1, role: data.role || 1,
      avatar: data.avatar || 'default',
      collect_list: data.collectList || null,
    }).select().single()
    if (!error && result) return { success: true, id: result.id, user: normalize(result) }
    return { success: false, msg: error?.message }
  } catch {
    return { success: false, msg: '网络异常' }
  }
}

export async function updateUser(data: any) {
  try {
    const update: any = {}
    if (data.name !== undefined) update.name = data.name
    if (data.password !== undefined) update.password = data.password
    if (data.level !== undefined) update.level = data.level
    if (data.role !== undefined) update.role = data.role
    if (data.avatar !== undefined) update.avatar = data.avatar
    if (data.collectList !== undefined) update.collect_list = data.collectList
    const { error } = await supabase.from('users').update(update).eq('id', data.id)
    if (!error) return { success: true }
    return { success: false, msg: error?.message }
  } catch {
    return { success: false, msg: '网络异常' }
  }
}
