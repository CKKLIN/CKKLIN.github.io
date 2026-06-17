<template>
  <!-- 1. 给 .body 添加 @mouseleave 事件，鼠标离开时隐藏或重置黑球 -->
  <div class="body" @mousemove="onMouseMove" @mouseleave="onMouseLeave">
    <div class="text-layer front-layer">
      <div ref="textRef" class="text1">我是MUERZHI，外号彭于晏</div>
    </div>
    <div ref="backLayerRef" class="text-layer back-layer">
      <div class="text2">欢迎来到MUERZHI的领域</div>
    </div>
    <div class="cursor"></div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const MAX_TILT = 50
const PERSPECTIVE = 1000

const textRef = ref(null)
const backLayerRef = ref(null)

function onMouseMove(e) {
  const page = e.currentTarget
  // 2. 获取容器相对于视口的位置和尺寸
  const rect = page.getBoundingClientRect()
  
  // 3. 计算鼠标相对于 .body 容器的坐标
  let px = e.clientX - rect.left
  let py = e.clientY - rect.top
  
  // 4. 边界限制：确保坐标在 0 到 容器宽高 之间
  px = Math.max(0, Math.min(px, rect.width))
  py = Math.max(0, Math.min(py, rect.height))

  // 更新 CSS 变量（现在使用的是相对于容器的坐标）
  page.style.setProperty('--mx', px + 'px')
  page.style.setProperty('--my', py + 'px')

  // 处理背景层遮罩
  const backEl = backLayerRef.value
  if (backEl) {
    const br = backEl.getBoundingClientRect()
    const rx = px + rect.left - br.left // 遮罩仍需要相对于 backEl 的坐标
    const ry = py + rect.top - br.top
    backEl.style.clipPath = `circle(50px at ${rx}px ${ry}px)`
  }

  // 处理前景层 3D 倾斜
  const el = textRef.value
  if (!el) return
  const textRect = el.getBoundingClientRect()
  const cx = textRect.left + textRect.width / 2
  const cy = textRect.top + textRect.height / 2
  // 使用原始的 clientX/Y 计算倾斜角度，保持 3D 效果不受容器边界影响
  const dx = e.clientX - cx
  const dy = e.clientY - cy
  const tiltX = -(dy / window.innerHeight) * MAX_TILT
  const tiltY = (dx / window.innerWidth) * MAX_TILT
  el.style.transform = `perspective(${PERSPECTIVE}px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`
}

// 5. 鼠标离开组件时，将黑球移出视野或隐藏
function onMouseLeave() {
  const page = textRef.value?.parentElement?.parentElement // 获取 .body 元素
  if (page) {
    page.style.setProperty('--mx', '-200px')
    page.style.setProperty('--my', '-200px')
  }
}
</script>

<style scoped>
.body {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  font-size: 55px;
  font-family: 'ZiHun144Hao-LangYuanTi-2';
  overflow: hidden;
  cursor: none;
  position: relative;
  background-color: rgba(227, 227, 227, 0);
}

.text-layer {
  position: absolute;
  inset: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}

.front-layer {
  z-index: 1;
}

.back-layer {
  z-index: 3;
  color: #a84a4a;
  clip-path: circle(0px at -200px -200px);
}

.cursor {
  /* 6. 关键：将 fixed 改为 absolute，让它相对于 .body 定位 */
  position: absolute; 
  width: 100px;
  aspect-ratio: 1 / 1;
  background: #000;
  border-radius: 50%;
  pointer-events: none;
  transform: translate(-50%, -50%);
  left: var(--mx, -200px);
  top: var(--my, -200px);
  z-index: 2;
}

.text1 {
  font-size: 84px;
  display: inline-block;
  transition: transform 0.1s ease-out;
}
.text2 {
  font-size: 104px;
  display: inline-block;
  transition: transform 0.1s ease-out;
}
</style>