# 数据库查询缓存机制

## 概述

为博客项目中所有从 Supabase 数据库获取数据的查询添加内存级缓存机制，减少重复网络请求，提升页面切换体验。

## 现状

- `dataLoader.ts` 已对静态 JSON 回退数据做了简单的 `Map` 缓存
- Supabase 查询完全没有缓存，每次进入页面都重新请求
- 多组件同时挂载（如 book 页）可能触发重复查询

## 改动范围

### 新增文件

- `src/utils/cache.ts` — 通用缓存工具

### 修改文件

| 文件 | 缓存函数 | 失效触发 |
|---|---|---|
| `src/api/bookApi.ts` | `getBookListAPI`, `getFeaturedBooksAPI` | — |
| `src/api/questionApi.ts` | `getQuestionListAPI`, `getQuestionByIdAPI` | — |
| `src/api/resourceApi.ts` | `getResourceHeadersAPI`, `getResourceCardsAPI` | — |
| `src/api/comment.ts` | `getCommentListAPI` | `addCommentAPI`, `updateCommentAPI` |

**零组件文件修改。**

## 核心设计

### 缓存工具 `withCache`

```
┌─────────────────────────────────────────────┐
│  Caller A        Caller B        Caller C    │
│  getBookList()   getBookList()   getBookList()│
│       │              │              │        │
│       └──────┬───────┘              │        │
│              │ 同时调用              │        │
│       ┌──────▼───────┐              │        │
│       │  withCache   │              │        │
│       │  books key   │◄──── 命中缓存 ┘        │
│       └──────┬───────┘                        │
│              │ 只发起 1 次请求                 │
│       ┌──────▼───────┐                        │
│       │  Supabase    │                        │
│       │  / dataLoader│                        │
│       └──────────────┘                        │
└─────────────────────────────────────────────┘
```

- **内存级缓存**：`Map<string, { data?, promise? }>`
- **防并发**：首次请求期间，后续同 key 调用等待同一 Promise
- **错误重试**：请求失败自动删除缓存项，下次调用重新请求
- **参数化 key**：支持函数式 key 构建（如 `questions-${category}`）
- **写失效**：评论写入操作主动调用 `invalidateCache('comments')`

### 接口设计

```typescript
// 包装查询函数
export const getBookListAPI = withCache('books', async () => { ... })

// 带参数的查询函数
export const getQuestionListAPI = withCache(
  (category) => `questions-${category}`,
  async (category) => { ... },
)

// 写入后手动失效
invalidateCache('comments')
```

## 缓存策略

| 维度 | 选择 |
|---|---|
| 层级 | 内存缓存（`Map`） |
| 有效期 | 会话内（页面刷新前一直有效） |
| 失效 | 评论增/改后手动清除 comment 缓存 |
| 并发 | 首次请求期间自动排队等待 |

## 不纳入缓存的范围

- `login.ts` / `page.ts` — Axios 请求（登录、页面计数为一次性操作）
- `userApi.ts` — 用户数据（用户未选择此文件）
- `dataLoader.ts` — 已有自己的缓存，保持不变
