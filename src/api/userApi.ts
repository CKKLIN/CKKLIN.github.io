import usersData from '@/assets/linshi/data/users.json'

export function fetchUsers() {
    return Promise.resolve(usersData)
}

export function registerUser(_data: { name: string; password: string; level: number; role: number; collectList: any[] }) {
    console.warn('registerUser 仅在本地开发环境可用')
    return Promise.resolve({ success: false, msg: '静态部署不支持注册' })
}

export function updateUser(_data: any) {
    console.warn('updateUser 仅在本地开发环境可用')
    return Promise.resolve({ success: false, msg: '静态部署不支持更新' })
}
