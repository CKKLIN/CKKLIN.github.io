import { supabase } from '@/lib/supabase'
import { loadMainjing } from '@/utils/dataLoader'

export type QuestionCategory = 'vue' | 'uniapp' | 'react' | '微信小程序'

export interface Question {
  id: number
  title: string
  content: string
  category: string
  createTime: number
}

const tableMap: Record<string, string> = {
  vue: 'vue_questions',
  uniapp: 'uniapp_questions',
  react: 'react_questions',
  '微信小程序': 'wxapp_questions',
}

export async function getQuestionListAPI(category: QuestionCategory = 'vue'): Promise<Question[]> {
  const table = tableMap[category] || 'vue_questions'
  try {
    const { data, error } = await supabase.from(table).select('*').order('id')
    if (!error && data) {
      return data.map(q => ({
        id: q.id, title: q.title, content: q.content,
        category, createTime: q.create_time,
      }))
    }
  } catch {}
  // 回退静态 JSON
  const m = await loadMainjing()
  const fallbackMap: Record<string, any[]> = {
    vue: m.vueList, uniapp: m.uniappList, react: m.reactList, '微信小程序': m.wxAppList,
  }
  return (fallbackMap[category] || []).map((q: any) => ({ ...q, category, createTime: q.createTime }))
}

export async function getQuestionByIdAPI(id: number, category: string = 'vue'): Promise<Question | null> {
  const table = tableMap[category] || 'vue_questions'
  try {
    const { data, error } = await supabase.from(table).select('*').eq('id', id).single()
    if (!error && data) {
      return { id: data.id, title: data.title, content: data.content, category, createTime: data.create_time }
    }
  } catch {}
  const m = await loadMainjing()
  const fallbackMap: Record<string, any[]> = {
    vue: m.vueList, uniapp: m.uniappList, react: m.reactList, '微信小程序': m.wxAppList,
  }
  const found = (fallbackMap[category] || []).find((q: any) => q.id === id)
  return found ? { ...found, category, createTime: found.createTime } : null
}
