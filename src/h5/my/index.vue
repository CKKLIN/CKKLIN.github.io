<template>
    <div class="my-page">
        <div class="header">
            <div class="avatar-wrap">
                <div class="avatar">
                    <img :src="userAvatar" alt="avatar">
                </div>
                <div v-if="isLoggedIn" class="level">
                    <span class="level-num">LV{{ userInfo.level }}&ensp;</span>
                    <span class="level-text">{{ currentLevelName }}</span>
                </div>
            </div>
            <div class="nickname" v-if="isLoggedIn">{{ nickname }}</div>
            <div class="nickname guest" v-else @click="goLogin">点击登录</div>
        </div>
        <div class="section">
            <div class="section-title">我的收藏</div>
            <div v-if="favList.length" class="fav-list">
                <div class="fav-item" v-for="item in favList" :key="item.id" @click="goDetail(item.id)">
                    <span class="fav-index">{{ item.id }}</span>
                    <span class="fav-title">{{ item.title }}</span>
                    <span class="fav-remove" @click.stop="removeFav(item.id)">
                        <img src='https://sky-lkc.oss-cn-beijing.aliyuncs.com/icon/collected.svg'>
                    </span>
                </div>
            </div>
            <div v-else class="empty">
                <span>还没有收藏内容哦~</span>
            </div>
        </div>
        <button v-if="isLoggedIn" class="logout-btn" @click="handleLogout">退出登录</button>
    </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { vueList } from '@/assets/linshi/data/h5/mainjing'
import { useTokenStore } from '@/stores/token'
import { fetchUsers, updateUser } from '@/api/userApi'
import { ref, computed, onMounted } from 'vue'

const router = useRouter()
const tokenStore = useTokenStore()
const favList = ref([])
const currentUser = ref(null)

const userAvatar = computed(() => {
    const avatar = currentUser.value?.avatar
    return avatar && avatar !== 'default' ? avatar : 'https://sky-lkc.oss-cn-beijing.aliyuncs.com/pictures/avatar.png'
})

const isLoggedIn = computed(() => !!tokenStore.token)
const nickname = computed(() => {
    const stored = localStorage.getItem('username')
    return stored || '用户'
})

const userInfo = computed(() => {
    return currentUser.value || { level: 1 }
})

const levelList = [
    { id: 1, level: '咸鱼干' },
    { id: 2, level: '翻个面' },
    { id: 3, level: '撒点盐' },
    { id: 4, level: '下锅煎' },
    { id: 5, level: '真香警告' },
]
const currentLevelName = computed(() => {
    const lv = Math.min(userInfo.value.level, levelList.length)
    const item = levelList.find(item => item.id === lv)
    return item ? item.level : '咸鱼干'
})

const getUserCollectIds = () => {
    if (!currentUser.value?.collectList) return []
    const vueCollect = currentUser.value.collectList.find(c => c.id === 1)
    if (!vueCollect) return []
    return vueCollect.collect.split(',').map(Number).filter(Boolean)
}

const syncToServer = async () => {
    if (!currentUser.value) return
    await updateUser(currentUser.value)
}

const loadFavs = async () => {
    const userId = localStorage.getItem('userId')
    if (!userId) return
    const users = await fetchUsers()
    currentUser.value = users.find(u => u.id === Number(userId)) || null
    const ids = getUserCollectIds()
    favList.value = vueList.filter(v => ids.includes(v.id))
}

const removeFav = async (id) => {
    const ids = getUserCollectIds()
    const idx = ids.indexOf(id)
    if (idx > -1) {
        ids.splice(idx, 1)
        const collectStr = ids.join(',')
        if (!currentUser.value.collectList) {
            currentUser.value.collectList = [{ id: 1, collect: collectStr }]
        } else {
            const vueCollect = currentUser.value.collectList.find(c => c.id === 1)
            if (vueCollect) vueCollect.collect = collectStr
            else currentUser.value.collectList.push({ id: 1, collect: collectStr })
        }
        await syncToServer()
        favList.value = favList.value.filter(v => v.id !== id)
    }
}

const goDetail = (id) => {
    router.push(`/mianjingContenth5/${id}`)
}

const goLogin = () => {
    router.push('/loginh5')
}

const handleLogout = () => {
    tokenStore.removeToken()
    localStorage.removeItem('username')
    localStorage.removeItem('userId')
    router.push('/loginh5')
}

onMounted(loadFavs)
</script>

<style scoped>
.my-page {
    width: 100%;
    height: 100%;
    padding: 24px 16px;
    box-sizing: border-box;
    overflow-y: auto;
    font-family: "ZiHun144Hao-LangYuanTi-2";
}

.header {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 28px;
}

.avatar-wrap {
    position: relative;
    margin-bottom: 18px;
}

.avatar {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    overflow: hidden;
    /* background: rgba(154, 205, 50, 0.15); */
    border: 3px solid rgba(255, 255, 255, 0.6);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.level {
    position: absolute;
    bottom: -4px;
    left: 50%;
    transform: translateX(-50%);
    background: linear-gradient(135deg, #f0c040, #e8a010);
    border-radius: 12px;
    padding: 3px 10px;
    font-size: 11px;
    line-height: 1.2;
    color: #fff;
    white-space: nowrap;
    box-shadow: 0 2px 8px rgba(232, 160, 16, 0.3);
}

.nickname {
    font-size: 20px;
    font-weight: 700;
    color: #333;
}

.nickname.guest {
    font-size: 16px;
    font-weight: 500;
    color: yellowgreen;
    cursor: pointer;
    padding: 6px 20px;
    border-radius: 20px;
    background: rgba(248, 248, 248, 0.466);
    transition: all 0.2s ease;
    box-shadow: var(--color-card-shadow-one);
}

.nickname.guest:active {
    transform: scale(0.95);
    background: rgba(154, 205, 50, 0.2);
    /* box-shadow:var(--color-card-shadow-one); */
}

.section {
    background: rgba(255, 255, 255, 0.55);
    backdrop-filter: blur(14px) saturate(160%);
    -webkit-backdrop-filter: blur(14px) saturate(160%);
    border: 1px solid rgba(255, 255, 255, 0.5);
    border-radius: 20px;
    padding: 16px;

    box-shadow: var(--color-card-shadow);
}

.section-title {
    font-size: 17px;
    font-weight: 700;
    color: #333;
    margin-bottom: 14px;
    padding-left: 4px;
}

.fav-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.fav-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 14px;
    border-radius: 14px;
    background: rgba(255, 255, 255, 0.6);
    border: 1px solid rgba(255, 255, 255, 0.5);
    box-shadow: var(--color-card-shadow-one);
    transition: transform 0.2s ease;
}

.fav-item:active {
    transform: scale(0.97);
}

.fav-index {
    flex-shrink: 0;
    width: 26px;
    height: 26px;
    border-radius: 50%;
    background: rgba(154, 205, 50, 0.2);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    font-weight: 600;
    color: yellowgreen;
}

.fav-title {
    flex: 1;
    font-size: 14px;
    color: #333;
    line-height: 1.4;
}

.fav-remove {
    flex-shrink: 0;
    width: 24px;
    height: 24px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
}

.fav-remove img {
    width: 18px;
    height: 18px;
}

.empty {
    text-align: center;
    padding: 32px 0;
    color: #bbb;
    font-size: 14px;
}

.logout-btn {
    display: block;
    width: 100%;
    margin-top: 24px;
    padding: 14px;
    border: none;
    border-radius: 16px;
    background: rgba(255, 70, 70, 0.08);
    color: #ff4d4f;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
}

.logout-btn:active {
    transform: scale(0.97);
    background: rgba(255, 70, 70, 0.15);
}
</style>
