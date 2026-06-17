<template>
    <div class="container" @touchstart="onTouchStart" @touchmove="onTouchMove" @touchend="onTouchEnd">
        <div class="top">
            <img src='https://sky-lkc.oss-cn-beijing.aliyuncs.com/icon/back.svg' class="back" @click="goBack()">
            <div class="title">{{ item?.id }}.&ensp;{{ item?.title }}</div>
        </div>
        <div class="body">
            <div class="meta">
                <span class="tag">{{ categoryTag }}</span>
                <span class="time">{{ formattedTime }}</span>
                <span class="fav-btn" @click="toggleFav">
                    <img src='https://sky-lkc.oss-cn-beijing.aliyuncs.com/icon/collected.svg' v-if="isFav">
                    <img src='https://sky-lkc.oss-cn-beijing.aliyuncs.com/icon/collect.svg' v-else>
                </span>
            </div>
            <div class="content" v-html="item?.content"></div>
        </div>
        <div class="toast" v-if="toastMsg">{{ toastMsg }}</div>
    </div>
</template>

<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'
import { vueList, uniappList } from '@/assets/linshi/data/h5/mainjing'
import { fetchUsers, updateUser } from '@/api/userApi'
import { computed, ref, onMounted } from 'vue'

const router = useRouter()
const route = useRoute()
const props = defineProps({
    id: [String, Number]
})

const category = computed(() => (route.query.category as string) || 'vue')
const categoryTag = computed(() => category.value === 'uniapp' ? 'UniApp' : 'Vue')
const dataList = computed(() => category.value === 'uniapp' ? uniappList : vueList)

// 假设你的用户类型长这样
interface User {
  id: number;
  name: string;
  password: string;
  level: number;
  role: number;
  avatar: string;
  collectList?: { id: number; collect: string; }[]; // 注意这里可能有可选属性
}

// 明确告诉 TypeScript，这个 ref 的值可以是 User 对象，也可以是 null
const currentUser = ref<User | null>(null); 

const loadUser = async () => {
    const userId = localStorage.getItem('userId')
    if (!userId) return
    const users = await fetchUsers()
    currentUser.value = users.find(u => u.id === Number(userId)) || null
    isFav.value = getCollectIds().includes(Number(props.id))
}

const currentIndex = computed(() => {
    return dataList.value.findIndex(v => v.id === Number(props.id))
})
const item = computed(() => {
    return dataList.value[currentIndex.value]
})

const formattedTime = computed(() => {
    if (!item.value) return ''
    const d = new Date(item.value.createTime)
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
})

const goBack = () => {
    router.back()
}

const getCollectIds = () => {
    if (!currentUser.value?.collectList) return []
    const collectKey = category.value === 'uniapp' ? 2 : 1
    const vueCollect = currentUser.value.collectList.find(c => c.id === collectKey)
    if (!vueCollect) return []
    return vueCollect.collect.split(',').map(Number).filter(Boolean)
}

const isFav = ref(false)

const toastMsg = ref('')
let toastTimer: number | null | undefined = null
const showToast = (msg: string) => {
    toastMsg.value = msg
    clearTimeout(toastTimer || 0);
    toastTimer = setTimeout(() => { toastMsg.value = '' }, 2000)
}

const toggleFav = async () => {
    if (!currentUser.value) {
        showToast('请先登录')
        return
    }
    const ids = getCollectIds()
    const id = Number(props.id)
    const idx = ids.indexOf(id)
    if (idx > -1) {
        ids.splice(idx, 1)
        isFav.value = false
    } else {
        ids.push(id)
        isFav.value = true
    }
    const collectStr = ids.join(',')
    const collectKey = category.value === 'uniapp' ? 2 : 1
    if (!currentUser.value.collectList) {
        currentUser.value.collectList = [{ id: collectKey, collect: collectStr }]
    } else {
        const targetCollect = currentUser.value.collectList.find(c => c.id === collectKey)
        if (targetCollect) targetCollect.collect = collectStr
        else currentUser.value.collectList.push({ id: collectKey, collect: collectStr })
    }
    await updateUser(currentUser.value)
}

onMounted(loadUser)

const navigateTo = (index: number) => {
    if (index < 0 || index >= dataList.value.length) return
    router.replace({ path: `/mianjingContenth5/${dataList.value[index].id}`, query: { category: category.value } })
}

let touchStartX = 0
let touchStartY = 0
const swiping = ref(false)

const onTouchStart = (e: TouchEvent) => {
    // 1. 增加安全检查，防止无触摸点时报错
    if (e.touches.length === 0) return;

    // 2. 必须使用 [0] 获取第一个触摸点，再读取 clientX/Y
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;

    swiping.value = true;
};
const onTouchMove = () => {
    // prevent default only during active swipe
}
// 使用原生 TouchEvent 类型，它已经包含了 changedTouches、clientX、clientY 等所有标准属性
const onTouchEnd = (e: TouchEvent) => {
    if (!swiping.value) return;

    swiping.value = false;

    // 安全检查：防止在某些极端情况下（如多点触控取消）导致数组为空报错
    if (e.changedTouches.length === 0) return;

    const touch = e.changedTouches[0];
    const touchEndX = touch.clientX;
    const touchEndY = touch.clientY;

    const diffX = touchEndX - touchStartX;
    const diffY = touchEndY - touchStartY;

    // 判断是否为水平滑动且超过阈值
    if (Math.abs(diffX) > 60 && Math.abs(diffX) > Math.abs(diffY)) {
        if (diffX < 0) {
            // 向左滑 -> 下一个
            navigateTo(currentIndex.value + 1);
        } else {
            // 向右滑 -> 上一个
            navigateTo(currentIndex.value - 1);
        }
    }
};
</script>

<style scoped>
.title {
    width: 70%;
    text-align: center;
    /* background-color: yellow; */
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    overflow: hidden;
}

.container {
    width: 100%;
    height: 100%;
}

.top {
    width: 100%;
    height: 7%;
    background: var(--color-h5-top);
    /* background-color: var(--color-h5Top); */
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    padding: var(--padding-ssm);
}

.body {
    width: 100%;
    height: 93%;
    overflow-y: auto;
    padding: 16px;
    box-sizing: border-box;
}

.back {
    width: 35px;
    aspect-ratio: 1/1;
    position: absolute;
    left: 8px;
}

.meta {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 16px;
}

.fav-btn {
    margin-left: auto;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 34px;
    height: 34px;
    border-radius: 50%;
    background: rgba(0, 0, 0, 0.04);
    color: #ccc;
    transition: all 0.3s ease;
    cursor: pointer;

    img {
        width: 100%;
        height: 100%;
    }
}

.fav-btn:active {
    transform: scale(0.9);
}

.fav-btn.active {
    color: #ff4757;
    background: rgba(255, 71, 87, 0.1);
}

.tag {
    background: rgba(154, 205, 50, 0.2);
    color: yellowgreen;
    font-size: 12px;
    font-weight: 600;
    padding: 3px 10px;
    border-radius: 20px;
}

.time {
    font-size: 13px;
    color: #999;
}

.content {
    font-size: 15px;
    color: #333;
    line-height: 1.8;
}

.content :deep(p) {
    margin-bottom: 12px;
}

.content :deep(strong) {
    color: #2d2d2d;
}

.content :deep(h3) {
    font-size: 17px;
    font-weight: 700;
    color: #1a1a1a;
    margin: 20px 0 10px;
}

.content :deep(pre) {
    background: #1e1e2e;
    border-radius: 10px;
    padding: 16px;
    margin: 12px 0;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
}

.content :deep(pre)::-webkit-scrollbar {
    height: 4px;
}

.content :deep(pre)::-webkit-scrollbar-track {
    background: transparent;
}

.content :deep(pre)::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.15);
    border-radius: 2px;
}

.content :deep(pre code) {
    display: block;
    background: none;
    color: #cdd6f4;
    padding: 0;
    border-radius: 0;
    font-size: 13px;
    font-family: 'Menlo', 'Consolas', 'Monaco', monospace;
    white-space: pre;
    line-height: 1.7;
    letter-spacing: 0.3px;
}

.content :deep(code) {
    background: #eef1f6;
    color: #c7254e;
    padding: 2px 7px;
    border-radius: 5px;
    font-size: 13px;
    font-family: 'Menlo', 'Consolas', 'Monaco', monospace;
    font-weight: 500;
    letter-spacing: 0.3px;
}

.content :deep(ul),
.content :deep(ol) {
    padding-left: 20px;
    margin-bottom: 12px;
}

.content :deep(li) {
    margin-bottom: 6px;
}

.toast {
    position: fixed;
    bottom: 20%;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(0, 0, 0, 0.7);
    color: #fff;
    padding: 10px 24px;
    border-radius: 20px;
    font-size: 14px;
    z-index: 9999;
    animation: toastIn 0.3s ease;
}

@keyframes toastIn {
    from { opacity: 0; transform: translateX(-50%) translateY(10px); }
    to { opacity: 1; transform: translateX(-50%) translateY(0); }
}
</style>