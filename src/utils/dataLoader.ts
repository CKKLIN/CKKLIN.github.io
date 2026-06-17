/**
 * 数据懒加载工具 — 替代静态 import，将大数据文件从 bundle 中移除
 * 数据存放于 public/data/ 目录，运行时按需 fetch，自动缓存
 */

const cache = new Map<string, unknown>()

async function loadJSON<T>(filename: string): Promise<T> {
  if (cache.has(filename)) {
    return cache.get(filename) as T
  }
  const res = await fetch(`/data/${filename}`)
  if (!res.ok) throw new Error(`Failed to load /data/${filename}: ${res.status}`)
  const data = await res.json()
  cache.set(filename, data)
  return data as T
}

/** 面经题库 */
export interface MainjingData {
  vueList: any[]
  uniappList: any[]
  reactList: any[]
  wxAppList: any[]
}
export function loadMainjing() {
  return loadJSON<MainjingData>('mainjing.json')
}

/** 书籍数据 */
export interface BooksData {
  bookList12: any[]
  bookList3: any[]
  bookList: any[]
}
export function loadBooks() {
  return loadJSON<BooksData>('books.json')
}

/** 获取书籍封面 URL 列表 */
export async function getBookCovers(count?: number): Promise<string[]> {
  const { bookList } = await loadBooks()
  if (!bookList || bookList.length === 0) return []

  const covers = bookList.map(book => {
    const minuteTimestamp = Math.floor(Date.now() / 6000)
    return `${book.cover}?t=${minuteTimestamp}`
  })

  if (count === undefined) return covers

  return Array.from({ length: count }, (_, i) => covers[i % covers.length])
}

/** 资源页数据 */
export function loadResources() {
  return loadJSON<any>('resources.json')
}

/** 评论数据（mock） */
export function loadComments() {
  return loadJSON<any>('comments.json')
}

/** 用户数据（mock） */
export function loadUsers() {
  return loadJSON<any>('users.json')
}
