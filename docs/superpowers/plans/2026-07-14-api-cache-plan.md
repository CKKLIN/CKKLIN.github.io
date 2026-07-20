# API 缓存机制 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 为项目中针对 Supabase 数据库的只读查询添加内存级缓存

**Architecture:** 在 `src/utils/cache.ts` 中创建通用 `withCache` 包装函数 + `invalidateCache` 失效函数，然后在 4 个 API 文件中将导出函数用 `withCache` 包装。写操作（comment）在成功后清除对应缓存。

**Tech Stack:** TypeScript, Supabase

---

## 文件结构

| 操作 | 文件 | 职责 |
|---|---|---|
| 新增 | `src/utils/cache.ts` | `withCache` 和 `invalidateCache` 的定义 |
| 修改 | `src/api/bookApi.ts` | 将 `getBookListAPI`、`getFeaturedBooksAPI` 用 `withCache` 包装 |
| 修改 | `src/api/questionApi.ts` | 将带参数的 `getQuestionListAPI`、`getQuestionByIdAPI` 用 `withCache` 包装 |
| 修改 | `src/api/resourceApi.ts` | 将 `getResourceHeadersAPI`、`getResourceCardsAPI` 用 `withCache` 包装 |
| 修改 | `src/api/comment.ts` | 将 `getCommentListAPI` 用 `withCache` 包装 + 写函数中调用 `invalidateCache` |

### Task 1: 创建 `src/utils/cache.ts`

**Files:**
- Create: `src/utils/cache.ts`

**Interfaces:**
- Produces: `withCache<T, A>(key, fetcher)` — 包装一个异步函数，返回带内存缓存的版本
- Produces: `invalidateCache(key)` — 清除指定 key 的缓存

- [ ] **Step 1: 写入 `src/utils/cache.ts`**

```typescript
/**
 * 通用异步函数内存缓存工具
 * - 缓存命中时直接返回缓存数据
 * - 首次请求期间防并发（同 key 多个调用共享一个 Promise）
 * - 请求失败自动清除缓存项，下次调用重新请求
 */

const store = new Map<string, { data?: unknown; promise?: Promise<unknown> }>()

export function withCache<T, A extends unknown[]>(
  key: string | ((...args: A) => string),
  fetcher: (...args: A) => Promise<T>,
): (...args: A) => Promise<T> {
  return async (...args: A) => {
    const cacheKey = typeof key === 'function' ? key(...args) : key
    const entry = store.get(cacheKey)

    // 命中缓存 → 直接返回
    if (entry && 'data' in entry) {
      return entry.data as T
    }

    // 有其他并发请求正在进行 → 等待同一个 Promise
    if (entry?.promise) {
      return entry.promise as Promise<T>
    }

    // 没有缓存 → 发起请求
    const promise = fetcher(...args)
      .then((data) => {
        store.set(cacheKey, { data })
        return data
      })
      .catch((err) => {
        store.delete(cacheKey)
        throw err
      })

    store.set(cacheKey, { promise })
    return promise
  }
}

export function invalidateCache(key: string) {
  store.delete(key)
}
```

- [ ] **Step 2: 提交**

```bash
git add src/utils/cache.ts
git commit -m "feat: add withCache / invalidateCache utility for API caching"
```

---

### Task 2: 更新 `src/api/bookApi.ts`

**Files:**
- Modify: `src/api/bookApi.ts`

**Interfaces:**
- Consumes: `withCache(key, fetcher)` from `src/utils/cache.ts`
- Produces: `getBookListAPI()` — 返回 `Promise<Book[]>`，带缓存
- Produces: `getFeaturedBooksAPI()` — 返回 `Promise<Book[]>`，带缓存

- [ ] **Step 1: 在文件顶部添加 import**

```typescript
import { withCache } from '@/utils/cache'
```

放在现有的 `import { supabase } from '@/lib/supabase'` 之后。

- [ ] **Step 2: 将 `getBookListAPI` 改为使用 `withCache`**

替换原有函数定义。**注意：** 删除原来的 `export async function getBookListAPI` 声明，改为：

```typescript
export const getBookListAPI = withCache('books', async () => {
  try {
    const { data, error } = await supabase.from('books').select('*').order('id')
    if (!error && data) return data.map(normalize)
  } catch {}
  const { bookList } = await loadBooks()
  return bookList
})
```

- [ ] **Step 3: 将 `getFeaturedBooksAPI` 改为使用 `withCache`**

替换原有函数定义：

```typescript
export const getFeaturedBooksAPI = withCache('books-featured', async () => {
  try {
    const { data, error } = await supabase.from('books').select('*').not('back_color', 'is', null).order('id')
    if (!error && data) return data.map(normalize)
  } catch {}
  const { bookList3 } = await loadBooks()
  return bookList3
})
```

- [ ] **Step 4: 提交**

```bash
git add src/api/bookApi.ts
git commit -m "feat: add caching to getBookListAPI / getFeaturedBooksAPI"
```

---

### Task 3: 更新 `src/api/questionApi.ts`

**Files:**
- Modify: `src/api/questionApi.ts`

**Interfaces:**
- Consumes: `withCache(key, fetcher)` from `src/utils/cache.ts`
- Produces: `getQuestionListAPI(category)` — 返回 `Promise<Question[]>`，按 category 分别缓存
- Produces: `getQuestionByIdAPI(id, category)` — 返回 `Promise<Question | null>`，按 id+category 分别缓存

- [ ] **Step 1: 在文件顶部添加 import**

```typescript
import { withCache } from '@/utils/cache'
```

- [ ] **Step 2: 将 `getQuestionListAPI` 改为使用 `withCache`**

替换原有函数定义。使用函数式 key，将 category 编码进缓存 key：

```typescript
export const getQuestionListAPI = withCache(
  (category: QuestionCategory) => `questions-${category}`,
  async (category: QuestionCategory = 'vue') => {
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
    const m = await loadMainjing()
    const fallbackMap: Record<string, any[]> = {
      vue: m.vueList, uniapp: m.uniappList, react: m.reactList, '微信小程序': m.wxAppList,
    }
    return (fallbackMap[category] || []).map((q: any) => ({ ...q, category, createTime: q.createTime }))
  },
)
```

- [ ] **Step 3: 将 `getQuestionByIdAPI` 改为使用 `withCache`**

替换原有函数定义：

```typescript
export const getQuestionByIdAPI = withCache(
  (id: number, category: string) => `question-${category}-${id}`,
  async (id: number, category: string = 'vue') => {
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
  },
)
```

- [ ] **Step 4: 提交**

```bash
git add src/api/questionApi.ts
git commit -m "feat: add caching to getQuestionListAPI / getQuestionByIdAPI"
```

---

### Task 4: 更新 `src/api/resourceApi.ts`

**Files:**
- Modify: `src/api/resourceApi.ts`

**Interfaces:**
- Consumes: `withCache(key, fetcher)` from `src/utils/cache.ts`
- Produces: `getResourceHeadersAPI()` — 返回 `Promise<ResourceHeader[]>`，带缓存
- Produces: `getResourceCardsAPI(label?)` — 返回 `Promise<ResourceCard[]>`，按 label 分别缓存

- [ ] **Step 1: 在文件顶部添加 import**

```typescript
import { withCache } from '@/utils/cache'
```

- [ ] **Step 2: 将 `getResourceHeadersAPI` 改为使用 `withCache`**

替换原有函数定义：

```typescript
export const getResourceHeadersAPI = withCache('resource-headers', async () => {
  try {
    const { data, error } = await supabase.from('resource_headers').select('*').order('id')
    if (!error && data) return data
  } catch {}
  const r = await loadResources()
  return r.headers
})
```

- [ ] **Step 3: 将 `getResourceCardsAPI` 改为使用 `withCache`**

替换原有函数定义：

```typescript
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
```

> **注意：** `getResourcesAPI()` 内部调用上述两个已缓存函数，且已有 catch 回退逻辑（调用 `loadResources()`），不需要额外改动。

- [ ] **Step 4: 提交**

```bash
git add src/api/resourceApi.ts
git commit -m "feat: add caching to getResourceHeadersAPI / getResourceCardsAPI"
```

---

### Task 5: 更新 `src/api/comment.ts`（读缓存 + 写失效）

**Files:**
- Modify: `src/api/comment.ts`

**Interfaces:**
- Consumes: `withCache(key, fetcher)`, `invalidateCache(key)` from `src/utils/cache.ts`
- Produces: `getCommentListAPI()` — 返回 `Promise<Comment[]>`，带缓存
- Produces: `addCommentAPI(comment)` — 写入成功后清除 comments 缓存
- Produces: `updateCommentAPI(comment)` — 写入成功后清除 comments 缓存

- [ ] **Step 1: 在文件顶部添加 import**

```typescript
import { withCache, invalidateCache } from '@/utils/cache'
```

- [ ] **Step 2: 将 `getCommentListAPI` 改为使用 `withCache`**

替换原有函数定义：

```typescript
export const getCommentListAPI = withCache('comments', async () => {
  try {
    const { data, error } = await supabase.from('comments').select('*').order('id')
    if (!error && data) return data.map(normalize)
  } catch {}
  const fallback = await loadComments()
  return fallback.map((c: any) => ({ ...c, good: !!c.good }))
})
```

- [ ] **Step 3: 在 `addCommentAPI` 成功时清除缓存**

在 `addCommentAPI` 中找到成功返回点，在 `return` 之前添加 `invalidateCache('comments')`。

找到这段代码（约第 44-46 行）：

```typescript
    if (!error && data) return { success: true, comment: normalize(data) }
```

改为：

```typescript
    if (!error && data) {
      invalidateCache('comments')
      return { success: true, comment: normalize(data) }
    }
```

- [ ] **Step 4: 在 `updateCommentAPI` 成功时清除缓存**

在 `updateCommentAPI` 中找到成功返回点，在 `return` 之前添加 `invalidateCache('comments')`。

找到这段代码（约第 59-60 行）：

```typescript
    if (!error) return { success: true }
```

改为：

```typescript
    if (!error) {
      invalidateCache('comments')
      return { success: true }
    }
```

- [ ] **Step 5: 提交**

```bash
git add src/api/comment.ts
git commit -m "feat: add caching to getCommentListAPI with write invalidation"
```

---

## 验证方式

1. **启动开发服务器**：`npm run dev`
2. **打开浏览器**，进入 book 页 → 首次加载时观察 Network 面板是否有 Supabase 请求
3. **切换到其他页面再切回来** → 观察是否没有重复请求（缓存命中）
4. **在 note 页添加/编辑评论** → 切走再切回，确认评论列表已更新（缓存失效正常）
5. **构建检查**：`npm run build` 确保无类型错误
