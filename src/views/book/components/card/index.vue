<template>
    <div class="book-list-wrapper" @mouseenter="showBtns = true" @mouseleave="showBtns = false">
        <Transition name="btn-fade">
            <button class="scroll-btn left" v-show="showBtns && canScrollLeft" @click="scroll(-1)">
                <svg viewBox="0 0 24 24" width="16" height="16"><path d="M15 19l-7-7 7-7" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </button>
        </Transition>
        <div class="book-list" ref="listRef" @scroll="onScroll"
            @mousedown.prevent="onDragStart"
            @mousemove="onDragMove"
            @mouseup="onDragEnd"
            @mouseleave="onDragEnd"
            @touchstart="onTouchStart"
            @touchmove="onTouchMove"
            @touchend="onDragEnd">
            <div class="card" v-for="book in books" :key="book.id">
                <div class="card-cover">
                    <img :src=book.cover :alt="book.name" />
                </div>
                <div class="card-info">
                    <h3 class="card-title">{{ book.name }}</h3>
                    <p class="card-author">{{ book.author }}</p>
                </div>
            </div>
        </div>
        <Transition name="btn-fade">
            <button class="scroll-btn right" v-show="showBtns && canScrollRight" @click="scroll(1)">
                <svg viewBox="0 0 24 24" width="16" height="16"><path d="M9 5l7 7-7 7" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </button>
        </Transition>
    </div>
</template>

<script setup lang="ts">
import { ref, onUnmounted, onMounted } from 'vue'
import { loadBooks } from '@/utils/dataLoader'

interface Book {
    id: number | string
    name: string
    author: string
    introduction: string
    cover?: string
}

const books = ref<Book[]>([])
onMounted(async () => {
    const data = await loadBooks()
    books.value = data.bookList
})
const listRef = ref<HTMLElement>()
const canScrollLeft = ref(false)
const canScrollRight = ref(true)
const showBtns = ref(false)

let scrollAnimId: number | null = null
let targetScrollLeft = 0

// 拖拽相关
let isDragging = false
let dragStartX = 0
let dragStartLeft = 0
let lastMoveX = 0
let lastMoveTime = 0
let velocity = 0

function stopAnim() {
    if (scrollAnimId) {
        cancelAnimationFrame(scrollAnimId)
        scrollAnimId = null
    }
}

function onDragStart(e: MouseEvent) {
    stopAnim()
    isDragging = true
    dragStartX = e.clientX
    dragStartLeft = listRef.value!.scrollLeft
    lastMoveX = e.clientX
    lastMoveTime = Date.now()
    velocity = 0
}

function onDragMove(e: MouseEvent) {
    if (!isDragging) return
    const el = listRef.value!
    const dx = e.clientX - dragStartX
    el.scrollLeft = dragStartLeft - dx
    const now = Date.now()
    const dt = now - lastMoveTime
    if (dt > 0) velocity = (lastMoveX - e.clientX) / dt
    lastMoveX = e.clientX
    lastMoveTime = now
}

function onDragEnd() {
    if (!isDragging) return
    isDragging = false
    const el = listRef.value!
    if (!el) return
    const max = el.scrollWidth - el.clientWidth
    targetScrollLeft = Math.max(0, Math.min(el.scrollLeft + velocity * 200, max))
    scrollAnimId = requestAnimationFrame(animateScroll)
}

function onTouchStart(e: TouchEvent) {
    stopAnim()
    isDragging = true
    dragStartX = e.touches[0].clientX
    dragStartLeft = listRef.value!.scrollLeft
    lastMoveX = e.touches[0].clientX
    lastMoveTime = Date.now()
    velocity = 0
}

function onTouchMove(e: TouchEvent) {
    if (!isDragging) return
    const el = listRef.value!
    const dx = e.touches[0].clientX - dragStartX
    el.scrollLeft = dragStartLeft - dx
    const now = Date.now()
    const dt = now - lastMoveTime
    if (dt > 0) velocity = (lastMoveX - e.touches[0].clientX) / dt
    lastMoveX = e.touches[0].clientX
    lastMoveTime = now
}

function onScroll() {
    const el = listRef.value!
    canScrollLeft.value = el.scrollLeft > 0
    canScrollRight.value = el.scrollLeft < el.scrollWidth - el.clientWidth - 1
}

function animateScroll() {
    const el = listRef.value
    if (!el) return
    const diff = targetScrollLeft - el.scrollLeft
    if (Math.abs(diff) < 0.5) {
        el.scrollLeft = targetScrollLeft
        scrollAnimId = null
        return
    }
    el.scrollLeft += diff * 0.15
    scrollAnimId = requestAnimationFrame(animateScroll)
}

function scroll(dir: number) {
    const el = listRef.value
    if (!el) return
    stopAnim()
    targetScrollLeft = el.scrollLeft + dir * 400
    const max = el.scrollWidth - el.clientWidth
    targetScrollLeft = Math.max(0, Math.min(targetScrollLeft, max))
    scrollAnimId = requestAnimationFrame(animateScroll)
}

onUnmounted(() => {
    if (scrollAnimId) cancelAnimationFrame(scrollAnimId)
})
</script>

<style scoped>
.book-list-wrapper {
    position: relative;
    width: 100%;
}

.book-list {
    display: grid;
    grid-template-rows: repeat(2, auto);
    grid-auto-flow: column;
    grid-auto-columns: 9vw;
    gap: 20px;
    overflow-x: auto;
    scrollbar-width: none;
    padding: 4px 8px;
    cursor: grab;
    user-select: none;
}

.book-list:active {
    cursor: grabbing;
}

.book-list::-webkit-scrollbar {
    display: none;
}

.card {
    min-width: 120px;
    position: relative;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
    cursor: pointer;
    display: flex;
    flex-direction: column;
    font-family: "ZiHun144Hao-LangYuanTi-2";
}

.card:hover {
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.card-cover {
    width: 100%;
    aspect-ratio: 3.6 / 3.6;
    overflow: hidden;
    background: #f5f5f5;
}

.card-cover img {
    width: 100%;
    height: 100%;
    background-size: 100% 100%;
    background-position: center center;
    background-repeat: no-repeat;
    transition: transform 0.3s;
}

.card:hover .card-cover img {
    transform: scale(1.05);
}

.card-info {
    padding: 4px;
    background-color: rgb(160, 160, 160);
}

.card-title {
    margin: 0 0 6px;
    font-size: 16px;
    font-weight: 600;
    color: #fff;
    line-height: 1;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.card-author {
    font-size: 13px;
    color: #000000;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.scroll-btn {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    z-index: 1;
    width: 36px;
    height: 36px;
    border: none;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.9);
    backdrop-filter: blur(4px);
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.15);
    cursor: pointer;
    color: #555;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.2s, color 0.2s, box-shadow 0.2s;
}

.scroll-btn:hover {
    background: #fff;
    color: #333;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
}

.scroll-btn:active {
    transform: translateY(-50%) scale(0.92);
}

.scroll-btn.left {
    left: 4px;
}

.scroll-btn.right {
    right: 4px;
}

.btn-fade-enter-active,
.btn-fade-leave-active {
    transition: opacity 0.25s ease;
}

.btn-fade-enter-from,
.btn-fade-leave-to {
    opacity: 0;
}
</style>
