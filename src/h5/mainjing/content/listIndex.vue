<template>
    <div class="container">
        <div class="top">
            <img src='https://sky-lkc.oss-cn-beijing.aliyuncs.com/icon/back.svg' class="back" @click="goBack()">
            <div class="title">{{ categoryTitle }}面试常问</div>
        </div>
        <div class="body" ref="bodyRef">
            <div class="search-box">
                <a-input-search
                    v-model:value="keyword"
                    placeholder="搜点什么？别光看，敲键盘呀~"
                    allow-clear
                    class="search"
                />
            </div>
            <div
                class="list-item"
                v-for="item in filterList"
                :key="item.id"
                @click="lookContent(item.id)"
            >
                <span class="list-index">{{item.id}}</span>
                <span class="list-title">{{ item.title }}</span>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'
import { vueList, uniappList } from '@/assets/linshi/data/h5/mainjing'
import { ref, computed, onMounted, onActivated, onBeforeUnmount, nextTick } from 'vue'

const router = useRouter()
const route = useRoute()
const keyword = ref('')
const bodyRef = ref<HTMLElement | null>(null)

const category = computed(() => (route.query.category as string) || 'vue')
const categoryTitle = computed(() => category.value === 'uniapp' ? 'UniApp' : 'Vue')
const dataList = computed(() => category.value === 'uniapp' ? uniappList : vueList)

const scrollKey = computed(() => `mianjingList_${category.value}_scrollTop`)

const saveScroll = () => {
    if (bodyRef.value) {
        sessionStorage.setItem(scrollKey.value, String(bodyRef.value.scrollTop))
    }
}
const restoreScroll = () => {
    const saved = sessionStorage.getItem(scrollKey.value)
nextTick(() => {
    // 先判断 bodyRef.value 是否有值
    if (bodyRef.value) {
        bodyRef.value.scrollTop = Number(saved);
    }
});
}

onMounted(restoreScroll)
onActivated(restoreScroll)
onBeforeUnmount(saveScroll)

const filterList = computed(() => {
    if (!keyword.value) return dataList.value
    return dataList.value.filter(item =>
        item.title.toLowerCase().includes(keyword.value.toLowerCase())
    )
})

const goBack=()=>{
      router.push('/mianJingh5')
}
const lookContent=(id: number)=>{
    saveScroll()
    router.push({ path: `/mianjingContenth5/${id}`, query: { category: category.value } })
}
</script>
<style scoped>
.container{
    width: 100%;
    height: 100%;
    font-family: "ZiHun144Hao-LangYuanTi-2";
}
.top{
    width: 100%;
    height: 7%;
    background: var(--color-h5-top);
    display: flex;
    flex-direction: row;
    align-items:center;
    justify-content:center;
    padding: var(--padding-ssm);
}
.body{
    width: 100%;
    height: 93%;
    overflow-y: auto;
    padding: 12px;
    box-sizing: border-box;
}
.back{
    width: 35px;
    aspect-ratio: 1/1;
    position: absolute;
    left: 8px;
}
.list-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 14px 16px;
    margin-bottom: 12px;
    border-radius: 16px;
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.65), rgba(255, 255, 255, 0.35));
    backdrop-filter: blur(14px) saturate(160%);
    -webkit-backdrop-filter: blur(14px) saturate(160%);
    border: 1px solid rgba(255, 255, 255, 0.5);
    box-shadow:var(--color-card-shadow-one);
    transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.list-item:active {
    transform: scale(0.97);
    box-shadow:
        0 1px 2px rgba(255, 255, 255, 0.4) inset,
        0 2px 6px rgba(0, 0, 0, 0.08);
}
.list-index {
    flex-shrink: 0;
    width: 28px;
    height: 28px;
    border-radius: 50%;
    background: rgba(134, 134, 134, 0.15);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 13px;
    font-weight: 600;
    color: #555;
}
.list-title {
    font-size: 15px;
    color: #333;
    line-height: 1.4;
}
.search-box {
    margin-bottom: 16px;
    border-radius: 28px;
    background: rgba(255, 255, 255, 0.733);
    backdrop-filter: blur(14px) saturate(160%);
    -webkit-backdrop-filter: blur(14px) saturate(160%);
    border: 1px solid rgba(255, 255, 255, 0.6);
    box-shadow:
        0 1px 2px rgba(255, 255, 255, 0.7) inset,
        0 4px 16px rgba(0, 0, 0, 0.06);
    overflow: hidden;
    transition: all 0.3s ease;
}
.search-box:focus-within {
    border-color: rgba(206, 206, 205, 0.986);
    box-shadow:
        0 1px 2px rgba(255, 255, 255, 0.5) inset,
        0 4px 24px rgba(154, 205, 50, 0.18);
}
.search {
    display: flex !important;
    width: 100% !important;
}
.search :deep(.ant-input-wrapper),
.search :deep(.ant-input-group) {
    display: flex !important;
    width: 100% !important;
    table-layout: auto !important;
}
.search :deep(.ant-input-affix-wrapper) {
    flex: 1;
    min-width: 0;
    background: transparent !important;
    border: none !important;
    border-radius: 0;
    padding: 10px 8px 10px 18px;
    box-shadow: none !important;
    display: flex !important;
}
.search :deep(.ant-input-affix-wrapper:hover),
.search :deep(.ant-input-affix-wrapper-focused) {
    border-color: transparent !important;
    box-shadow: none !important;
}
.search :deep(.ant-input) {
    background: transparent;
    font-size: 14px;
    color: #333;
}
.search :deep(.ant-input::placeholder) {
    color: #b0b0b0;
}
.search :deep(.ant-input-clear-icon) {
    color: #bbb;
    font-size: 14px;
}
.search :deep(.ant-input-clear-icon:hover) {
    color: #999;
}
.search :deep(.ant-input-group-addon) {
    display: flex !important;
    background: transparent !important;
    border: none !important;
    padding: 0 !important;
    width: auto !important;
}
.search :deep(.ant-input-search-button) {
    border: none !important;
    border-radius: 0 28px 28px 0 !important;
    background: linear-gradient(135deg, #99cd328a, #6fbf1ad5) !important;
    color: #fff;
    height: auto !important;
    min-height: 46px;
    padding: 0 22px;
    font-size: 15px;
    font-weight: 600;
    transition: all 0.25s ease;
    flex-shrink: 0;
    display: inline-flex !important;
    align-items: center !important;
    justify-content: center !important;
}
.search :deep(.ant-input-search-button:hover) {
    background: linear-gradient(135deg, #a8e035, #7ccf20) !important;
    transform: translateY(-1px);
}
.search :deep(.ant-input-search-button:active) {
    transform: translateY(0);
    background: linear-gradient(135deg, #8ec02d, #62b015) !important;
}
</style>