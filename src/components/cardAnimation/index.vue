<template>
  <div class="book-page" ref="pageRef">
    <div class="fixed-center" ref="fixedCenterRef">
      <div class="cards-container" ref="containerRef">
        <div class="book-card" v-for="(item, index) in items" :key="index" :ref="(el) => setCardRef(el, index)">
          <div class="card-inner" :ref="(el) => setInnerRef(el, index)">
            <div class="card-front">
              <slot name="front" :item="item" :index="index">
                <div class="card-cover">
                  <img :src="item.cover" :alt="item.title" />
                </div>
                <div class="card-info">
                  <h3 class="card-title">{{ item.title }}</h3>
                  <p class="card-author">{{ item.author }}</p>
                </div>
              </slot>
            </div>
            <div class="card-back" :style="{ background: item.backColor || '#ffffff' }">
              <slot name="back" :item="item" :index="index">
                <h3 class="card-title">{{ item.title }}</h3>
                <p class="card-author">{{ item.author }}</p>
                <p class="card-desc">{{ item.desc }}</p>
              </slot>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="cover-box" ref="coverRef">
      <slot name="cover"></slot>
    </div>
    <div class="scroll-spacer" ref="scrollSpacerRef"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface CardItem {
  title: string
  cover?: string
  author?: string
  desc?: string
  backColor?: string
  [key: string]: any
}

const props = withDefaults(defineProps<{
  items: CardItem[]
  scroller?: HTMLElement | null
  // ==================== 动画控制参数 ====================
  triggerStart?: string     // ScrollTrigger 触发起始位置，如 'top center' 'top 80%'
  triggerEnd?: string       // ScrollTrigger 触发结束位置，如 'bottom bottom'
  scrollHeight?: string     // 滚动占位高度，决定动画总滚动距离，如 '500vh'
  convergeSpeed?: number    // 收拢速度（0~1），值越大收拢越快，默认 0.35
  stickyTop?: string        // 卡片容器 sticky 定位的 top 值，如 '0' '30%'
  containerHeight?: string  // 卡片容器高度，如 '100vh' '500px' 'auto'
  verticalAlign?: string    // 卡片容器垂直对齐方式，如 'center' 'flex-start'
  paddingTop?: string       // 卡片容器顶部内边距
  cardWidth?: number        // 单张卡片宽度（px）
  cardGap?: number          // 卡片间距（px）
  cardScaleW?: number       // 翻转后卡片宽度倍数，如 1.5
  cardScaleH?: number       // 翻转后卡片高度倍数，如 1.5
  coverHeight?: number      // 遮挡层高度（px）
  coverColor?: string       // 遮挡层背景色
}>(), {
  triggerStart: 'top top',          // ScrollTrigger 触发起始位置，如 'top top' 'top center'
  triggerEnd: 'bottom bottom',  // ScrollTrigger 触发结束位置，如 'bottom bottom'
  scrollHeight: '1000vh',        // 滚动占位高度，决定动画总滚动距离，如 '500vh'
  convergeSpeed: 0.15,            // 收拢速度（0~1），值越大收拢越快
  stickyTop: '0',               // 卡片容器 sticky 定位的 top 值，如 '0' '30%'
  containerHeight: '100vh',     // 卡片容器高度
  verticalAlign: 'center',      // 卡片容器垂直对齐方式，如 'center' 'flex-start'
  paddingTop: '0',              // 卡片容器顶部内边距距
  cardWidth: 240,               // 单张卡片宽度（px）
  cardGap: 40,                  // 卡片间距（px）
  cardScaleW: 1.3,              // 翻转后卡片宽度倍数
  cardScaleH: 1.3,              // 翻转后卡片高度倍数
  coverHeight: 300,             // 遮挡层高度（px）
  coverColor: '#99cd325e',        // 遮挡层背景色
})


const pageRef = ref<HTMLElement | null>(null)       // 组件根元素
const fixedCenterRef = ref<HTMLElement | null>(null) // 卡片可视区域（sticky）
const coverRef = ref<HTMLElement | null>(null)      // 遮挡层
const containerRef = ref<HTMLElement | null>(null)   // 卡片容器
const scrollSpacerRef = ref<HTMLElement | null>(null) // 滚动占位元素
const cardRefs = ref<(HTMLElement | null)[]>([])     // 卡片元素列表
const innerRefs = ref<(HTMLElement | null)[]>([])    // 卡片翻转层列表

const setCardRef = (el: unknown, index: number) => {
  cardRefs.value[index] = el as HTMLElement | null
}

const setInnerRef = (el: unknown, index: number) => {
  innerRefs.value[index] = el as HTMLElement | null
}

// 每张卡片相对于中心的水平偏移索引
const offsets = computed(() => {
  const n = props.items.length
  return Array.from({ length: n }, (_, i) => i - (n - 1) / 2)
})

const cardStep = 200  // 卡片堆叠时的水平间距（px）

// 堆叠状态下每张卡片的位置和旋转
const stackState = computed(() =>
  offsets.value.map((offset, i) => ({
    x: -offset * cardStep + (i - (props.items.length - 1) / 2) * 50,
    y: (i - (props.items.length - 1) / 2) * -40,
    rotate: -10 + i * (20 / Math.max(props.items.length - 1, 1)),
  }))
)

// ==================== 动画阶段阈值（0~1 的进度比例）====================
// P1 由 convergeSpeed 控制，后续阶段按比例自动调整
const P1 = props.convergeSpeed   // 阶段1结束：卡片收拢到位（由 prop 控制）
const HIDE_AT = P1 * 1.09        // 阶段2结束：卡片完全隐藏（保持比例 0.38/0.35）

let P3 = 0.72         // 阶段3开始：卡片重新出现
let P3A = 0.75        // 阶段4开始：卡片下落弹跳
let P4 = 0.93         // 阶段5开始：卡片翻转并排

const D = 10  // GSAP timeline 总时长系数

let ctx: gsap.Context | null = null  // GSAP 上下文，用于清理
let stopWatch: (() => void) | null = null

// 空闲状态下卡片微弹动画
function createBounceTweens(cards: HTMLElement[]): gsap.core.Tween[] {
  return cards.map((card, i) =>
    gsap.to(card, {
      y: `+=${3 + i}`,
      duration: 0.5 + i * 0.1,
      yoyo: true,
      repeat: -1,
      ease: 'sine.inOut',
    })
  )
}

function killBounceTweens(tweens: gsap.core.Tween[], cards: HTMLElement[]) {
  tweens.forEach(t => t.kill())
  tweens.length = 0
  cards.forEach(c => gsap.set(c, { y: 0 }))
}

const initAnimations = () => {
  const page = pageRef.value
  const trigger = scrollSpacerRef.value
  const cover = coverRef.value
  const container = containerRef.value
  const fixedCenter = fixedCenterRef.value
  if (!page || !trigger || !container || !fixedCenter) return

  const cards = cardRefs.value.filter(Boolean) as HTMLElement[]
  const inners = innerRefs.value.filter(Boolean) as HTMLElement[]
  if (cards.length === 0) return

  // 确定滚动容器和可视区域高度
  const scrollerEl = props.scroller || window
  const compH = scrollerEl instanceof Window ? window.innerHeight : scrollerEl.clientHeight

  const stacks = stackState.value

  // 根据遮挡层位置动态调整阶段3~5的触发时机
  const targetCoverTop = compH * 2 / 3 - props.coverHeight
  const phase2StartTop = compH * 0.5
  const phase2EndTop = -compH * 1.1
  if (targetCoverTop < phase2StartTop && targetCoverTop > phase2EndTop) {
    const fraction = (phase2StartTop - targetCoverTop) / (phase2StartTop - phase2EndTop)
    P3 = P1 + fraction * (1 - P1)
  }
  const scale = (1 - P3) / (1 - 0.72)
  P3A = P3 + 0.03 * scale
  P4 = P3 + (0.93 - 0.72) * scale

  ctx = gsap.context(() => {
    // 设置卡片层级（最前面的卡片最后渲染）
    cards.forEach((card, i) => {
      gsap.set(card, { zIndex: cards.length - i })
    })

    const bounceTweens = createBounceTweens(cards)

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: fixedCenter,
        endTrigger: page,
        scroller: scrollerEl,
        start: props.triggerStart,
        end: props.triggerEnd,
        scrub: true,
        onUpdate: (self) => {
          const p = self.progress
          if (!cover || cards.length === 0) return

          if (p <= 0) {
            if (bounceTweens.length === 0) {
              cards.forEach(c => gsap.set(c, { y: 0 }))
              bounceTweens.push(...createBounceTweens(cards))
            }
          } else if (bounceTweens.length > 0) {
            killBounceTweens(bounceTweens, cards)
          }

          if (p >= HIDE_AT && p < P3) {
            // 卡片完全隐藏阶段，保持透明
            cards.forEach(c => { c.style.opacity = '0' })
          } else if (p < HIDE_AT) {
            // 遮罩覆盖渐变消失
            const coverTop = cover.getBoundingClientRect().top
            const coverBottom = coverTop + props.coverHeight
            cards.forEach(c => {
              const cardTop = c.getBoundingClientRect().top
              const cardBottom = c.getBoundingClientRect().bottom
              const cardH = cardBottom - cardTop
              const overlap = Math.max(0, Math.min(coverBottom, cardBottom) - Math.max(coverTop, cardTop))
              const ratio = overlap / cardH
              if (ratio <= 0.5) {
                c.style.opacity = '1'
              } else {
                c.style.opacity = String(Math.max(0, 1 - (ratio - 0.5) * 2))
              }
            })
          } else if (p < P3A) {
            const t = (p - P3) / (P3A - P3)
            cards.forEach(c => { c.style.opacity = String(Math.min(t * 4, 1)) })
          } else {
            cards.forEach(c => { c.style.opacity = '1' })
          }
        },
      },
    })

    // 阶段 1：收拢（进度 0 → P1），卡片只水平移动和旋转，不下移
    cards.forEach((card, i) => {
      tl.to(card, {
        x: stacks[i].x,
        y: stacks[i].y,
        rotation: stacks[i].rotate,
        duration: P1 * D,
        ease: 'power2.inOut',
      }, 0)
    })

    // 阶段 2：卡片保持不动（P1 → HIDE_AT）
    cards.forEach((card, i) => {
      tl.to(card, {
        y: stacks[i].y,
        duration: (HIDE_AT - P1) * D,
        ease: 'power2.inOut',
      }, P1 * D)
    })

    // 阶段 3：卡片缩小重新出现在视口顶部（P3 → P3A）
    tl.set(container, { scale: 0.3, immediateRender: false }, P3 * D)
    cards.forEach((card, i) => {
      tl.set(card, {
        x: stacks[i].x,
        y: -compH * 0.4 + stacks[i].y,
        rotateX: 40,
        immediateRender: false,
      }, P3 * D)
    })

    // 阶段 4：卡片落到视口底部再弹回居中（P3A → P4）
    const bounceDur = (P4 - P3A) * D
    const dropDur = bounceDur * 0.4     // 下落到底部
    const bounceUpDur = bounceDur * 0.6  // 弹回居中
    const bounceStart = P3A * D
    const bottomY = compH * 0.35  // 视口底部位置（相对于居中偏移）

    tl.to(container, {
      scale: 1,
      duration: dropDur,
      ease: 'power1.in',
    }, bounceStart)

    cards.forEach((card, i) => {
      // 从顶部下落到视口底部
      tl.to(card, {
        x: stacks[i].x,
        y: bottomY + stacks[i].y,
        rotateX: 0,
        duration: dropDur,
        ease: 'power2.in',
      }, bounceStart)

      // 从底部弹回到居中
      tl.to(card, {
        x: 0,
        y: 0,
        rotation: 0,
        duration: bounceUpDur,
        ease: 'power3.out',
      }, bounceStart + dropDur)
    })

    // 阶段 5：卡片翻转背面 + 水平展开排列（P4 → 1.0）
    const off = offsets.value
    cards.forEach((card, i) => {
      tl.set(card, { boxShadow: 'none', border: 'none' }, P4 * D)
      tl.to(card, {
        x: off[i] * 100,
        y: 0,
        rotation: 0,
        width: props.cardWidth * props.cardScaleW,
        height: cards[0].offsetHeight * props.cardScaleH,
        duration: (1 - P4) * D,
        ease: 'power2.inOut',
      }, P4 * D)

      if (inners[i]) {
        tl.to(inners[i], {
          rotateY: 180,
          duration: (1 - P4) * D,
          ease: 'power2.inOut',
        }, P4 * D)
      }
    })
  }, page)
}

onMounted(() => {
  if (props.items.length) {
    requestAnimationFrame(initAnimations)
  } else {
    stopWatch = watch(() => props.items.length, (len) => {
      if (len > 0) {
        stopWatch?.()
        stopWatch = null
        // 等一帧让 DOM 渲染完 v-for 再初始化
        requestAnimationFrame(initAnimations)
      }
    })
  }
})

onUnmounted(() => {
  stopWatch?.()
  ctx?.revert() // 清理所有 GSAP 动画和 ScrollTrigger
})
</script>

<style scoped>
.book-page {
  position: relative;
}

.fixed-center {
  position: sticky;
  top: v-bind(stickyTop);
  width: 100%;
  height: v-bind(containerHeight);
  display: flex;
  align-items: v-bind(verticalAlign);
  justify-content: center;
  padding-top: v-bind(paddingTop);
  pointer-events: none;
  z-index: 1;
  overflow: hidden;
}

.cards-container {
  display: flex;
  gap: v-bind(cardGap + 'px');
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 1;
  perspective: 1000px;
}

.book-card {
  width: v-bind(cardWidth + 'px');
  background: transparent;
  /* border: var(--color-card-border); */
  border-radius: var(--border-radius-card);
  box-shadow: var(--color-card-shadow);
  cursor: pointer;
  will-change: transform, opacity;
  position: relative;
}

.book-card:hover {
  box-shadow: 4px 8px 20px rgba(0, 0, 0, 0.2);
}

.card-inner {
  width: 100%;
  height: 100%;
  position: relative;
  transform-style: preserve-3d;
}

.card-front {
  position: relative;
  overflow: hidden;
  border-radius: var(--border-radius-card);
  backface-visibility: hidden;
  background: rgb(224, 224, 224);
}

.card-cover {
  width: 100%;
  height: 200px;
  overflow: hidden;
}

.card-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.book-card:hover .card-cover img {
  transform: scale(1.05);
}

.card-info {
  padding: var(--padding-card);
}

.card-title {
  margin: 0 0 6px;
  font-size: 16px;
  color: var(--color-white);
  font-weight: 600;
}

.card-author {
  margin: 0;
  font-size: 13px;
  color: var(--color-ar-text);
}

.card-back {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #ffffff;
  border-radius: var(--border-radius-card);
  backface-visibility: hidden;
  transform: rotateY(180deg) translateZ(1px);
  padding: var(--padding-card);
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: center;
  color: #fff;
}

.card-back .card-title {
  font-size: 18px;
  margin-bottom: 8px;
}

.card-back .card-author {
  font-size: 14px;
  color: #aaa;
  margin-bottom: 16px;
}

.card-desc {
  font-size: 13px;
  color: #ccc;
  line-height: 1.6;
}

.cover-box {
  position: relative;
  width: 100%;
  min-height: v-bind(coverHeight + 'px');
  background: v-bind(coverColor);
  z-index: 2;
  pointer-events: auto;
}

.scroll-spacer {
  height: v-bind(scrollHeight);
}
</style>
