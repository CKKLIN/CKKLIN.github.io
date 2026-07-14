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
