import commentsData from '@/assets/linshi/data/comments.json'

export function getCommentListAPI() {
  return Promise.resolve(commentsData)
}

export function addCommentAPI(_comment: { imageUrl: string; name: string; comment: string; good: boolean; createTime: string }) {
  console.warn('addCommentAPI 仅在本地开发环境可用')
  return Promise.resolve({ success: false, msg: '静态部署不支持添加评论' })
}

export function updateCommentAPI(_comment: { id: number; [key: string]: any }) {
  console.warn('updateCommentAPI 仅在本地开发环境可用')
  return Promise.resolve({ success: false, msg: '静态部署不支持更新评论' })
}
