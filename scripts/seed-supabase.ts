/**
 * Supabase 种子脚本 — 从现有 TS/JSON 数据文件导入 Supabase
 * 使用: npx tsx scripts/seed-supabase.ts
 */
import { createClient } from '@supabase/supabase-js'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const DATA_DIR = path.resolve(__dirname, '..', 'src/assets/linshi/data')

const supabase = createClient(
  'https://oawiptpyeraxngweqrhl.supabase.co',
  process.env.SUPABASE_SERVICE_KEY || 'sb_publishable_hNOTdGLGC8BjkncgMswEYA_vE42I3Dg'
)

// JSON 数据
const commentsData = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'comments.json'), 'utf-8'))
const usersData = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'users.json'), 'utf-8'))
const resourcesData = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'resources.json'), 'utf-8'))

// TS 数据
async function loadTsData() {
  const m = await import(pathToFileURL(path.join(DATA_DIR, 'h5/mainjing.ts')).href)
  const d = await import(pathToFileURL(path.join(DATA_DIR, 'data.ts')).href)
  return {
    vueList: m.vueList, uniappList: m.uniappList,
    reactList: m.reactList || [], wxAppList: m.wxAppList || [], electronList: m.electronList || [],
    bookList: d.bookList, bookList3: d.bookList3,
  }
}

async function seed() {
  const { vueList, uniappList, reactList, wxAppList, electronList, bookList, bookList3 } = await loadTsData()
  console.log(`📦 Vue ${vueList.length} + UniApp ${uniappList.length} + React ${reactList.length} + 微信小程序 ${wxAppList.length} + Electron ${electronList.length} + 书单 ${bookList.length}`)

  const inserts: [string, any][] = []

  // Vue 面经
  for (const q of vueList) inserts.push(['vue_questions', { id: q.id, title: q.title, content: q.content, create_time: q.createTime }])
  for (const q of uniappList) inserts.push(['uniapp_questions', { id: q.id, title: q.title, content: q.content, create_time: q.createTime }])
  for (const q of reactList) inserts.push(['react_questions', { id: q.id, title: q.title, content: q.content, create_time: q.createTime }])
  for (const q of wxAppList) inserts.push(['wxapp_questions', { id: q.id, title: q.title, content: q.content, create_time: q.createTime }])
  for (const q of electronList) inserts.push(['electron_questions', { id: q.id, title: q.title, content: q.content, create_time: q.createTime }])

  // 书单
  for (const b of bookList) {
    const featured = bookList3.find((f: any) => f.id === b.id)
    inserts.push(['books', { id: typeof b.id === 'string' ? 30 : b.id, name: b.name, author: b.author, introduction: b.introduction, cover: b.cover, back_color: featured?.backColor || null }])
  }

  // 资源
  for (const h of resourcesData.headers) inserts.push(['resource_headers', { name: h.name, color: h.color, label: h.label }])
  for (const c of resourcesData.cards) inserts.push(['resource_cards', { label: c.label, name: c.name, description: c.desc || '', content: c.content || '', icon: c.icon || '', url: c.url || null, versions: c.versions || null, copy_text: c.copyText || null }])

  // 评论
  for (const c of commentsData) inserts.push(['comments', { id: c.id, image_url: c.imageUrl, name: c.name, comment: c.comment, good: c.good ? 1 : 0, create_time: c.createTime }])

  // 用户
  for (const u of usersData) inserts.push(['users', { id: u.id, name: u.name, password: u.password, level: u.level, role: u.role, avatar: u.avatar || 'default', collect_list: u.collectList || null }])

  // 批量插入 (Supabase 默认 batch size 有限，逐条 upsert)
  let count = 0
  for (const [table, data] of inserts) {
    const { error } = await supabase.from(table).upsert(data).select()
    if (error) {
      console.warn(`  ⚠️ ${table} id=${data.id}: ${error.message}`)
    } else {
      count++
    }
  }
  console.log(`\n🎉 完成! ${count}/${inserts.length} 条`)
}

seed().catch(err => { console.error('❌', err); process.exit(1) })
